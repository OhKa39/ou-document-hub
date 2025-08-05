import { useState } from 'react';
import Image from 'next/image';
import { ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/components/providers/UserProvider';
import CommentType from '@/types/CommentType';
import ReplyType from '@/types/ReplyType';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

export function CommentItem({
  documentId,
  comment,
  onLike,
  onReply,
}: {
  documentId: string;
  comment: CommentType;
  onLike: () => void;
  onReply?: (replyText: string) => void;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState(false);
  const { user } = useUserStore((state) => state);
  const userId = user?.userId;
  const queryClient = useQueryClient();

  // Fetch replies with infinite pagination
  const fetchReplies = async ({ pageParam = 0 }) => {
    const queryParams = new URLSearchParams({
      parentId: comment.id,
      page: pageParam.toString(),
      size: '5', // Default page size, adjustable
    });
    const response = await fetch(`/api/v1/comments/document/${documentId}/replies?${queryParams}`, {
      headers: { 'User-Id': userId! },
    });
    if (!response.ok) throw new Error('Failed to fetch replies');
    const data = await response.json();
    if (!data.content || !Array.isArray(data.content)) throw new Error('Invalid response format');
    return data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error: repliesError,
  } = useInfiniteQuery({
    queryKey: ['replies', comment.id],
    queryFn: fetchReplies,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length;
      return nextPage < lastPage.totalPages ? nextPage : undefined;
    },
    initialPageParam: 0, // Added to fix the TypeScript error
    enabled: showReplies && comment.replyCount > 0,
    staleTime: 5 * 60 * 1000,
  });

  // Combine all fetched replies with initial replies from comment
  const replies =
    data?.pages
      .flatMap((page) => page.content as ReplyType[])
      .filter((fr: ReplyType) => !comment.replies.some((r: ReplyType) => r.id === fr.id))
      .concat(comment.replies) ?? [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-4">
      <div className="flex items-start gap-3">
        <Image
          src={comment.user?.avatarLink || '/placeholder.svg'}
          alt={`${comment.user?.firstName} ${comment.user?.lastName}`}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{`${comment.user?.lastName} ${comment.user?.firstName}`}</span>
            {comment.user?.isVerified && (
              <Badge variant="outline" className="h-5 border-blue-200 bg-blue-50 px-1 py-0 text-xs text-blue-600">
                Verified Purchase
              </Badge>
            )}
          </div>
          <div className="mt-1 flex items-center">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`h-4 w-4 ${star <= comment.rating ? 'text-blue-500' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-xs text-gray-500">{formatDate(comment.date)}</span>
          </div>
        </div>
      </div>
      <div className="mt-3 text-gray-700">{comment.comment}</div>
      {comment.images?.length > 0 && (
        <div className="mt-3">
          <div className="flex flex-wrap gap-2">
            {comment.images.slice(0, 3).map((image, index) => (
              <div key={index} className="relative h-20 w-20 overflow-hidden rounded border">
                <Image
                  src={image || '/placeholder.svg'}
                  alt={`Review image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
            {comment.images.length > 3 && (
              <button className="flex h-20 w-20 items-center justify-center rounded bg-gray-100 text-sm font-medium text-gray-600">
                +{comment.images.length - 3} more
              </button>
            )}
          </div>
        </div>
      )}
      <div className="mt-3 flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'h-8 gap-1 text-gray-500 hover:bg-blue-50 hover:text-blue-500',
            comment.liked && 'bg-blue-50 text-blue-500'
          )}
          onClick={onLike}
          disabled={comment.liked}
        >
          <ThumbsUp className="h-4 w-4" />
          <span>Helpful ({comment.likes})</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-gray-500 hover:bg-blue-50 hover:text-blue-500"
          onClick={() => setShowReplyForm(!showReplyForm)}
        >
          Reply
        </Button>
      </div>
      {showReplyForm && (
        <div className="mt-3 border-l-2 border-gray-200 pl-6">
          <Textarea
            placeholder="Write your reply..."
            className="min-h-[80px]"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <div className="mt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowReplyForm(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => {
                if (replyText.trim() && onReply) {
                  onReply(replyText);
                  setShowReplyForm(false);
                  setReplyText('');
                  setShowReplies(true); // Automatically show replies after submission
                }
              }}
              disabled={!replyText.trim()}
            >
              Submit
            </Button>
          </div>
        </div>
      )}
      {comment.replyCount > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="mb-2 ml-6 flex items-center gap-1 text-sm font-medium text-blue-500 hover:text-blue-600"
          >
            {showReplies ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Hide replies
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                View {comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}
              </>
            )}
          </button>
          {showReplies && (
            <div className="border-l-2 border-gray-200 pl-6">
              {repliesError ? (
                <div className="p-4 text-red-500">Failed to load replies: {(repliesError as Error).message}</div>
              ) : (
                <>
                  {replies.map((reply: ReplyType) => (
                    <div key={reply.id} className="mt-3 first:mt-0">
                      <div className="flex items-start gap-2">
                        <Image
                          src={reply.user?.avatarLink || '/placeholder.svg'}
                          alt={`${reply.user?.lastName} ${reply.user?.firstName}`}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{`${reply.user?.lastName} ${reply.user?.firstName}`}</span>
                            {reply.user?.isSeller && (
                              <Badge className="h-5 bg-blue-500 px-1 py-0 text-xs text-white">Seller</Badge>
                            )}
                            <span className="text-xs text-gray-500">{formatDate(reply.date)}</span>
                          </div>
                          <div className="mt-1 text-sm text-gray-700">{reply.comment}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {hasNextPage && (
                    <div className="mt-4 flex justify-center">
                      <Button
                        variant="outline"
                        className="border-gray-300 text-gray-600 hover:bg-gray-50"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                      >
                        {isFetchingNextPage ? (
                          <div className="flex items-center justify-center">
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                            Loading...
                          </div>
                        ) : (
                          'Load More'
                        )}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
