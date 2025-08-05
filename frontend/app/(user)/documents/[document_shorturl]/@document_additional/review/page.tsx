'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import SockJS from 'sockjs-client';
import { Client, over } from 'stompjs';
import { useUserStore } from '@/components/providers/UserProvider';
import { CommentItem } from '@/components/(user)/Comments/CommentItem';
import { useParams } from 'next/navigation';
import { Stomp } from '@stomp/stompjs';
import { CommentForm } from '@/components/Forms/CommentForm';
import CommentType from '@/types/CommentType';
import ServerFetch from '@/utils/ServerFetch';

export default function CommentSection() {
  const params = useParams();
  const documentShortUrl = params.document_shorturl as string;
  const documentId = documentShortUrl.split('--')[1];
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const messageQueue = useRef<Set<string>>(new Set());
  const stompClientRef = useRef<any>(null);
  const subscriptionRef = useRef<string | null>(null);
  const { user, setShowLoginDialog } = useUserStore((state) => state);
  const userId = user?.userId;
  const queryClient = useQueryClient();

  // Fetch top-level comments
  const fetchComments = async ({ pageParam = 0 }) => {
    const queryParams = new URLSearchParams({
      page: pageParam.toString(),
      size: '10',
      sort: sortOrder,
      filter: activeTab,
    });
    const response = await ServerFetch(`/api/v1/comments/document/${documentId}?${queryParams}`, {
      headers: { 'User-Id': userId! },
    });
    if (!response.ok) throw new Error('Failed to fetch comments');
    const data = await response.json();
    if (!data.content || !Array.isArray(data.content)) throw new Error('Invalid response format');
    return data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error: queryError,
  } = useInfiniteQuery({
    queryKey: ['comments', documentId, activeTab, sortOrder],
    queryFn: fetchComments,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length;
      return nextPage < lastPage.totalPages ? nextPage : undefined;
    },
    initialPageParam: 0,
  });

  const comments = data?.pages.flatMap((page) => page.content) ?? [];
  const totalComments = data?.pages[0]?.totalElements ?? 0;

  // WebSocket connection
  useEffect(() => {
    const socket = new SockJS(`/comments`);
    const stompClient = Stomp.over(socket);
    stompClientRef.current = stompClient;

    stompClient.connect(
      {},
      (frame: any) => {
        console.log('WebSocket connected:', frame);
        if (subscriptionRef.current && stompClientRef.current) {
          stompClientRef.current.unsubscribe(subscriptionRef.current);
          console.log('Unsubscribed previous subscription:', subscriptionRef.current);
        }
        const subscription = stompClient.subscribe(`/topic/comments/${documentId}`, (message) => {
          try {
            const newComment: CommentType = JSON.parse(message.body);
            console.log('WebSocket message:', newComment);

            if (messageQueue.current.has(newComment.id)) {
              console.log('Duplicate WebSocket message skipped:', newComment.id);
              return;
            }
            messageQueue.current.add(newComment.id);
            setTimeout(() => messageQueue.current.delete(newComment.id), 1000);

            queryClient.setQueryData(['comments', documentId, activeTab, sortOrder], (oldData: any) => {
              if (!oldData) return oldData;
              const updatedPages = oldData.pages.map((page: any) => ({ ...page }));
              if (newComment.parentId) {
                updatedPages.forEach((page: any) => {
                  page.content = page.content.map((comment: CommentType) => {
                    if (comment.id === newComment.parentId) {
                      const replyExists = comment.replies.some((reply) => reply.id === newComment.id);
                      if (replyExists) {
                        console.log('Reply already exists, skipping:', newComment.id);
                        return comment;
                      }
                      return {
                        ...comment,
                        replyCount: comment?.replyCount + 1,
                        replies: [
                          ...comment.replies,
                          {
                            id: newComment.id,
                            user: newComment.user,
                            comment: newComment.comment,
                            date: newComment.date,
                          },
                        ],
                      };
                    }
                    return comment;
                  });
                });
              } else if (
                activeTab === 'all' ||
                (activeTab === '5star' && newComment.rating === 5) ||
                (activeTab === '4star' && newComment.rating === 4) ||
                (activeTab === '3star' && newComment.rating === 3) ||
                (activeTab === '2star' && newComment.rating === 2) ||
                (activeTab === '1star' && newComment.rating === 1) ||
                (activeTab === 'withPhotos' && newComment.images.length > 0)
              ) {
                const existingIndex = updatedPages[0].content.findIndex((c: CommentType) => c.id === newComment.id);
                if (existingIndex !== -1) {
                  updatedPages[0].content = updatedPages[0].content.map((c: CommentType, index: number) =>
                    index === existingIndex ? newComment : c
                  );
                } else {
                  updatedPages[0].content = [newComment, ...updatedPages[0].content];
                  updatedPages[0].totalElements += 1;
                }
              }
              return { ...oldData, pages: updatedPages };
            });
          } catch (error) {
            console.error('Error processing WebSocket message:', error);
            setError('Failed to process WebSocket message');
          }
        });
        subscriptionRef.current = subscription.id;
        console.log('Subscribed to WebSocket topic, subscription ID:', subscription.id);
      },
      (error: any) => {
        console.error('WebSocket connection error:', error);
        setError('WebSocket connection failed');
      }
    );

    return () => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        if (subscriptionRef.current) {
          stompClientRef.current.unsubscribe(subscriptionRef.current);
          console.log('Unsubscribed WebSocket subscription:', subscriptionRef.current);
          subscriptionRef.current = null;
        }
        stompClientRef.current.disconnect(() => {
          console.log('WebSocket disconnected');
          stompClientRef.current = null;
        });
      }
    };
  }, [documentId, userId, activeTab, queryClient]);

  const handleLike = async (commentId: string) => {
    try {
      await ServerFetch(`/api/v1/comments/${commentId}/like`, {
        method: 'POST',
        headers: { 'User-Id': userId! },
      });
    } catch (error) {
      console.error('Error liking comment:', error);
      setError('Failed to like comment');
    }
  };

  const handleReply = useCallback(
    async (documentId: string, parentId: string, replyText: string) => {
      try {
        const response = await ServerFetch(
          `/api/v1/comments/document/${documentId}/reply/${parentId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'User-Id': userId!,
            },
            body: JSON.stringify({ comment: replyText, rating: 0 }),
          },
          setShowLoginDialog
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to submit reply');
        }
      } catch (error: any) {
        console.error('Error submitting reply:', error);
        setError('Failed to submit reply');
      }
    },
    [userId]
  );

  const handleCommentSubmit = async (data: { rating: number; comment: string; images: File[] }) => {
    try {
      const formData = new FormData();
      formData.append(
        'comment',
        new Blob(
          [
            JSON.stringify({
              rating: data.rating,
              comment: data.comment,
            }),
          ],
          { type: 'application/json' }
        ),
        'comment.json'
      );
      data.images.forEach((image) => formData.append('images', image));

      const response = await ServerFetch(
        `/api/v1/comments/document/${documentId}`,
        {
          method: 'POST',
          headers: { 'User-Id': userId! },
          body: formData,
        },
        setShowLoginDialog
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit comment');
      }
    } catch (error: any) {
      console.error('Error submitting comment:', error);
      setError('Failed to submit comment');
    }
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortOrder === 'oldest') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortOrder === 'mostLiked') {
      return b.likes - a.likes;
    }
    return 0;
  });

  const totalReviews = totalComments;
  const averageRating = comments.reduce((acc, comment) => acc + comment.rating, 0) / (totalReviews || 1);
  const ratingCounts = {
    5: comments.filter((c) => c.rating === 5).length,
    4: comments.filter((c) => c.rating === 4).length,
    3: comments.filter((c) => c.rating === 3).length,
    2: comments.filter((c) => c.rating === 2).length,
    1: comments.filter((c) => c.rating === 1).length,
  };

  return (
    <div className="rounded-lg bg-white shadow">
      <CommentForm onSubmit={handleCommentSubmit} />
      {error || queryError ? <div className="p-4 text-red-500">{error || queryError?.message}</div> : null}
      <div className="border-b p-4">
        <div className="flex flex-col items-start gap-6 md:flex-row">
          <div className="text-center md:border-r md:pr-6">
            <div className="text-4xl font-bold text-blue-500">{averageRating.toFixed(1)}</div>
            <div className="mt-2 flex justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`h-5 w-5 ${star <= Math.round(averageRating) ? 'text-blue-500' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <div className="mt-1 text-sm text-gray-500">{totalReviews} reviews</div>
          </div>
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="mb-2 flex items-center gap-2">
                <div className="w-10 text-sm text-gray-600">{rating} star</div>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${(ratingCounts[rating as keyof typeof ratingCounts] / totalReviews) * 100}%` }}
                  ></div>
                </div>
                <div className="w-10 text-right text-sm text-gray-600">
                  {ratingCounts[rating as keyof typeof ratingCounts]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-b p-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 sm:grid-cols-7">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="5star">5★</TabsTrigger>
              <TabsTrigger value="4star">4★</TabsTrigger>
              <TabsTrigger value="3star">3★</TabsTrigger>
              <TabsTrigger value="2star">2★</TabsTrigger>
              <TabsTrigger value="1star">1★</TabsTrigger>
              <TabsTrigger value="withPhotos">With Photos</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <Select defaultValue="newest" onValueChange={setSortOrder}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="mostLiked">Most Helpful</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="divide-y">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : sortedComments.length > 0 ? (
          sortedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              documentId={documentId}
              comment={comment}
              onLike={() => handleLike(comment.id)}
              onReply={(replyText: string) => handleReply(documentId, comment.id, replyText)}
            />
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">No reviews match your current filter.</div>
        )}
      </div>
      {/* Load More Button */}
      {hasNextPage && (
        <div className="flex justify-center p-4">
          <Button
            variant="outline"
            className="w-full max-w-md border-gray-300 text-gray-600 hover:bg-gray-50"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <div className="flex items-center justify-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                Loading...
              </div>
            ) : (
              `Load More Reviews (${totalComments - sortedComments.length} remaining)`
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
