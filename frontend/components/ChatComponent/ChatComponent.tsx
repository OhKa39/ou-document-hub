'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { RefreshCcw, MessageCircle, X, Send, Paperclip, ImageIcon, Smile, Minus, Search } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useUserStore } from '@/components/providers/UserProvider';
import ServerFetch from '@/utils/ServerFetch';

interface Message {
  id: string;
  text: string;
  sender: string;
  createdAt: string;
  time: string;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  roomId: string;
}

interface TypingStatus {
  userId: string;
  isTyping: boolean;
}

interface Presence {
  userId: string;
  isOnline: boolean;
}

interface UnreadCount {
  unreadCounts: { [userId: string]: number };
}

export default function ChatComponent({ initialUserId }: { initialUserId: string }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<'assistant' | 'messages' | null>(null);
  const [receiveMessages, setReceiveMessages] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<{ [userId: string]: Message[] }>({});
  const [users, setUsers] = useState<User[]>([]);
  const [isTyping, setIsTyping] = useState<{ [userId: string]: any }>({});
  const [isConnected, setIsConnected] = useState(false);
  const [stompClient, setStompClient] = useState<any>(null);
  const { user: currentUser } = useUserStore((state) => state);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingDebounce = useRef<NodeJS.Timeout | null>(null);
  const syncAttempt = useRef<number>(0);
  const previousSelectedUser = useRef<string | null>(null);

  console.log('isTyping state: ', isTyping);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (messages[selectedUser!]?.length) {
      scrollToBottom();
    }
  }, [messages, selectedUser, scrollToBottom]);

  useEffect(() => {
    if (!currentUser?.userId) return;

    const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_URL}/chat-websocket`);
    const client = Stomp.over(socket);
    client.connect(
      {},
      () => {
        console.log('WebSocket connected for user:', currentUser.userId);
        setStompClient(client);
        setIsConnected(true);
        client.send(`/app/chat/presence`, {}, JSON.stringify({ userId: currentUser.userId, isOnline: true }));
        syncAttempt.current = 0;
        fetchChatRooms(client);
        subscribeToGlobalPresence(client);
      },
      (error: any) => {
        console.error('WebSocket connection failed:', error);
        setIsConnected(false);
      }
    );

    client.onStompError = (frame: any) => {
      console.error('STOMP Error:', frame);
      setIsConnected(false);
    };

    client.onWebSocketClose = () => {
      console.log('WebSocket closed, attempting reconnect...');
      setIsConnected(false);
      if (client && currentUser?.userId) {
        client.send(`/app/chat/presence`, {}, JSON.stringify({ userId: currentUser.userId, isOnline: false }));
      }
      setTimeout(() => {
        if (!client.connected && syncAttempt.current < 3) {
          syncAttempt.current++;
          client.activate();
          fetchChatRooms(client);
          if (client.connected) {
            client.send(`/app/chat/presence`, {}, JSON.stringify({ userId: currentUser.userId, isOnline: true }));
          }
        }
      }, 2000);
    };

    const handleBeforeUnload = () => {
      if (client && currentUser?.userId && client.connected) {
        client.send(`/app/chat/presence`, {}, JSON.stringify({ userId: currentUser.userId, isOnline: false }));
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (client && currentUser?.userId && client.connected) {
        client.send(`/app/chat/presence`, {}, JSON.stringify({ userId: currentUser.userId, isOnline: false }));
        client.disconnect();
      }
    };
  }, [currentUser?.userId]);

  useEffect(() => {
    if (isConnected && stompClient && users.length > 0 && stompClient.connected) {
      console.log(
        'Subscribing to rooms for users:',
        users.map((u) => u.roomId)
      );
      users.forEach((user) => {
        if (
          !stompClient.subscriptions ||
          !Object.keys(stompClient.subscriptions).includes(`/topic/room/${user.roomId}`)
        ) {
          subscribeToRoom(stompClient, user.roomId);
        }
      });
    }
  }, [isConnected, stompClient, users]);

  useEffect(() => {
    if (isChatOpen && previousSelectedUser.current && users.length > 0) {
      console.log('Chatbox reopened, restoring selected user:', previousSelectedUser.current);
      const user = users.find((u) => u.id === previousSelectedUser.current);
      if (user?.roomId) {
        console.log('Fetching messages for user:', user.id, 'in room:', user.roomId);
        setSelectedUser(user.id);
        fetchMessages(user.roomId, user.id);
      } else {
        console.warn('User not found in users list:', previousSelectedUser.current);
        setSelectedUser(null);
        previousSelectedUser.current = null;
      }
    }
  }, [isChatOpen, users]);

  const fetchChatRooms = async (client: any) => {
    try {
      const response = await ServerFetch(`/api/v1/chat-rooms/user/${currentUser?.userId}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch chat rooms');
      const chatRooms = await response.json();

      const userList: User[] = chatRooms.map((room: any) => ({
        id: room.otherUserId,
        name: `${room.firstName} ${room.lastName}`,
        avatar: room.avatarLink || '/placeholder.svg',
        lastMessage: room.lastMessageContent || '',
        time: room.lastMessageTime,
        unread: room.unreadCount || 0,
        online: room.online || false,
        roomId: room.roomId,
      }));

      console.log('Fetched chat rooms for user:', currentUser?.userId, userList);
      setUsers(userList);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    }
  };

  const subscribeToRoom = (client: any, roomId: string) => {
    if (
      !client ||
      !client.connected ||
      (client.subscriptions && Object.keys(client.subscriptions).includes(`/topic/room/${roomId}`))
    ) {
      console.log('Already subscribed or client not connected for room:', roomId);
      return;
    }

    client.subscribe(`/topic/room/${roomId}`, (message: any) => {
      console.log('Message received on room:', roomId, message.body);
      const messageDto = JSON.parse(message.body);
      const user = users.find((u) => u.roomId === roomId);
      if (!user) {
        console.warn('No user found for roomId:', roomId);
        return;
      }
      const userId = user.id;

      setMessages((prev) => {
        const existingMessages = prev[userId] || [];
        const tempMessageIndex = existingMessages.findIndex((msg) => msg.id.startsWith('temp-'));
        const messageExists = existingMessages.some((msg) => msg.id === messageDto.messageId);

        if (tempMessageIndex !== -1 && messageDto.senderId === currentUser?.userId) {
          const updatedMessages = [...existingMessages];
          updatedMessages[tempMessageIndex] = {
            id: messageDto.messageId,
            text: messageDto.content,
            sender: 'me',
            createdAt: messageDto.createdAt,
            time: new Date(messageDto.createdAt).toLocaleTimeString(),
          };
          console.log('Updated temp message for user:', userId, updatedMessages);
          return { ...prev, [userId]: updatedMessages };
        } else if (!messageExists) {
          const newMessages = [
            ...existingMessages,
            {
              id: messageDto.messageId,
              text: messageDto.content,
              sender: messageDto.senderId === currentUser?.userId ? 'me' : 'user',
              createdAt: messageDto.createdAt,
              time: new Date(messageDto.createdAt).toLocaleTimeString(),
            },
          ];

          setUsers((prev) =>
            prev.map((u) =>
              u.roomId === roomId
                ? { ...u, lastMessage: messageDto.content, time: new Date(messageDto.createdAt).toLocaleTimeString() }
                : u
            )
          );

          console.log('Added new message for user:', userId, newMessages);
          return { ...prev, [userId]: newMessages };
        }
        return prev;
      });
    });

    client.subscribe(`/topic/room/${roomId}/read`, (readMessage: any) => {
      console.log('Read update received on room:', roomId, readMessage.body);
      const readDto = JSON.parse(readMessage.body);
      const user = users.find((u) => u.roomId === roomId);
      if (!user) return;
    });

    client.subscribe(`/topic/room/${roomId}/typing`, (typingMessage: any) => {
      console.log('Typing status received on room:', roomId, typingMessage.body);
      const typingStatus = JSON.parse(typingMessage.body);

      setIsTyping((prev) => {
        const newTyping = {
          ...prev,
          [typingStatus.userId]: { isTyping: typingStatus.typing, avatarLink: typingStatus.avatarLink },
        };
        return newTyping;
      });

      if (typingStatus.typing) {
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(
          () => {
            setIsTyping((prev) => ({
              ...prev,
              [typingStatus.userId]: { isTyping: false, avatarLink: typingStatus.avatarLink },
            }));
          },
          1000 * 60 * 2
        );
      } else {
        setIsTyping((prev) => ({
          ...prev,
          [typingStatus.userId]: { isTyping: false, avatarLink: typingStatus.avatarLink },
        }));
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
      }
    });

    client.subscribe(`/topic/room/${roomId}/presence`, (presenceMessage: any) => {
      console.log('Presence update received on room:', roomId, presenceMessage.body);
      const presence: Presence = JSON.parse(presenceMessage.body);

      setUsers((prev) => {
        const updatedUsers = prev.map((u) => (u.id === presence.userId ? { ...u, online: presence.isOnline } : u));
        console.log('Updated users after room presence:', updatedUsers);
        return updatedUsers;
      });
    });

    client.subscribe(`/topic/room/${roomId}/unread`, (unreadMessage: any) => {
      console.log('Unread count update received on room:', roomId, unreadMessage.body);
      const unreadCount: UnreadCount = JSON.parse(unreadMessage.body);

      setUsers((prev) => {
        const updatedUsers = prev.map((u) => {
          if (u.roomId === roomId) {
            const newCount = unreadCount.unreadCounts[currentUser!.userId] || 0;
            return { ...u, unread: newCount };
          }
          return u;
        });
        console.log('Updated users with unread counts:', updatedUsers);
        return updatedUsers;
      });
    });
  };

  const subscribeToGlobalPresence = (client: any) => {
    if (
      !client ||
      !client.connected ||
      (client.subscriptions && Object.keys(client.subscriptions).includes('/topic/presence/all'))
    ) {
      console.log('Already subscribed to global presence');
      return;
    }

    client.subscribe('/topic/presence/all', (presenceMessage: any) => {
      console.log('Global presence update received:', presenceMessage.body);
      const presence: Presence = JSON.parse(presenceMessage.body);

      setUsers((prev) => {
        const updatedUsers = prev.map((u) => (u.id === presence.userId ? { ...u, online: presence.isOnline } : u));
        console.log('Updated users after global presence:', updatedUsers);
        return updatedUsers;
      });
    });
  };

  const fetchMessages = async (roomId: string, userId: string) => {
    try {
      const response = await fetch(`/api/v1/messages/room/${roomId}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`Failed to fetch messages: ${response.status} ${response.statusText}`);
      const data = await response.json();
      const fetchedMessages = data.map((msg: any) => ({
        id: msg.messageId,
        text: msg.content,
        sender: msg.senderId === currentUser?.userId ? 'me' : 'user',
        createdAt: msg.createdAt,
        time: new Date(msg.createdAt).toLocaleTimeString(),
      }));

      setMessages((prev) => {
        const sortedMessages = fetchedMessages.sort(
          (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        console.log('Fetched messages for user:', userId, sortedMessages);
        return { ...prev, [userId]: sortedMessages };
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleOpenChat = (type: 'assistant' | 'messages') => {
    setActiveChat(type);
    setIsChatOpen(true);
    setIsMinimized(false);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setActiveChat(null);
    previousSelectedUser.current = selectedUser;
    setSelectedUser(null);
    console.log('Chatbox closed, preserved selected user:', previousSelectedUser.current);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleSelectUser = (userId: string) => {
    if (!stompClient || !currentUser?.userId || !isConnected) return;

    handleInputFocus();
    if (selectedUser === userId) {
      return;
    }

    console.log('Selecting user:', userId);
    setSelectedUser(userId);
    const user = users.find((u) => u.id === userId);
    if (user?.roomId) {
      fetchMessages(user.roomId, userId);
      const userMessages = messages[userId] || [];
      const latestMessage = userMessages[userMessages.length - 1];
      if (latestMessage && userMessages.length > 0) {
        handleMarkAsRead(latestMessage.id, user.roomId);
      }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !stompClient || !currentUser?.userId || !selectedUser || !isConnected) return;

    const selectedUserData = users.find((user) => user.id === selectedUser);
    if (!selectedUserData) return;

    const messageDto = {
      senderId: currentUser.userId,
      recipientId: selectedUserData.id,
      roomId: selectedUserData.roomId || '00000000-0000-0000-0000-000000000000',
      content: newMessage,
    };

    const tempMessageId = `temp-${crypto.randomUUID()}`;
    setMessages((prev) => ({
      ...prev,
      [selectedUser]: [
        ...(prev[selectedUser] || []),
        {
          id: tempMessageId,
          text: newMessage,
          sender: 'me',
          createdAt: new Date().toISOString(),
          time: new Date().toLocaleTimeString(),
        },
      ],
    }));
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser ? { ...u, lastMessage: newMessage, time: new Date().toLocaleTimeString() } : u
      )
    );
    setNewMessage('');

    try {
      console.log('Sending message to room:', messageDto.roomId, 'with data:', messageDto);
      stompClient.send(`/app/chat/${messageDto.roomId}/send`, {}, JSON.stringify(messageDto));
      if (messageDto.roomId === '00000000-0000-0000-0000-000000000000') {
        await fetchChatRooms(stompClient);
        const newUser = users.find((u) => u.id === selectedUser);
        if (newUser) {
          setSelectedUser(newUser.id);
          fetchMessages(newUser.roomId, newUser.id);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => ({
        ...prev,
        [selectedUser]: prev[selectedUser].filter((msg) => msg.id !== tempMessageId),
      }));
    }
  };

  const handleMarkAsRead = (messageId: string, roomId: string) => {
    if (!stompClient || !currentUser?.userId || !isConnected) return;

    console.log('Marking message as read:', { messageId, roomId });
    stompClient.send(`/app/chat/${roomId}/read`, {}, JSON.stringify({ userId: currentUser.userId, messageId }));
  };

  const handleRefresh = (e: React.MouseEvent) => {
    if (selectedUser) {
      const selectedUserData = users.find((user) => user.id === selectedUser);
      if (selectedUserData?.roomId) {
        fetchMessages(selectedUserData.roomId, selectedUser);
      }
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (!stompClient || !selectedUser || !isConnected) return;

    const selectedUserData = users.find((user) => user.id === selectedUser);
    if (!selectedUserData?.roomId) return;

    if (typingDebounce.current) {
      clearTimeout(typingDebounce.current);
    }
    const isTypingNow = e.target.value.trim().length > 0;
    if (isTypingNow) {
      typingDebounce.current = setTimeout(() => {
        console.log('Sending typing status:', {
          userId: currentUser?.userId,
          isTyping: true,
          avatarLink: currentUser?.avatarLink,
        });
        stompClient.send(
          `/app/chat/${selectedUserData.roomId}/typing`,
          {},
          JSON.stringify({ userId: currentUser?.userId, isTyping: true, avatarLink: currentUser?.avatarLink })
        );
      }, 300);
    } else if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
      typingTimeout.current = null;
      console.log('Sending typing status:', { userId: currentUser?.userId, isTyping: false });
      stompClient.send(
        `/app/chat/${selectedUserData.roomId}/typing`,
        {},
        JSON.stringify({ userId: currentUser?.userId, isTyping: false, avatarLink: currentUser?.avatarLink })
      );
    }
  };

  const handleInputFocus = () => {
    if (!stompClient || !selectedUser || !currentUser?.userId || !isConnected) return;
    const selectedUserData = users.find((user) => user.id === selectedUser);
    if (!selectedUserData?.roomId) return;

    const userMessages = messages[selectedUser] || [];
    const latestMessage = userMessages[userMessages.length - 1];
    if (latestMessage && userMessages.length > 0) {
      handleMarkAsRead(latestMessage.id, selectedUserData.roomId);
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const formatMessageDate = (createdAt: string, isDropDown?: boolean) => {
    const date = new Date(createdAt);
    return isToday(date)
      ? date.toLocaleTimeString()
      : `${date.toLocaleDateString()} ${!isDropDown ? date.toLocaleTimeString() : ''}`;
  };

  const selectedUserData = selectedUser ? users.find((user) => user.id === selectedUser) : null;

  return (
    <>
      {!isChatOpen && (
        <div className="fixed bottom-[1.5rem] right-2 z-[99] w-[64px] rounded-2xl bg-blue-600 shadow-lg">
          <button
            className="flex w-full flex-col items-center justify-center gap-1 p-4 transition-colors duration-200 hover:bg-blue-700"
            onClick={() => handleOpenChat('assistant')}
          >
            <RefreshCcw className="h-6 w-6 text-white" />
            <span className="text-xs font-medium text-white">Trợ lý</span>
          </button>
          <div className="h-px w-full gap-1 bg-blue-500"></div>
          <button
            className="flex w-full flex-col items-center justify-center p-4 transition-colors duration-200 hover:bg-blue-700"
            onClick={() => handleOpenChat('messages')}
          >
            <MessageCircle className="h-6 w-6 text-white" />
            <span className="text-xs font-medium text-white">Tin mới</span>
          </button>
        </div>
      )}

      {isChatOpen && (
        <div
          className={`fixed bottom-[1.5rem] right-5 z-[100] flex h-[600px] w-[800px] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl transition-all duration-300`}
        >
          <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-blue-600 p-1">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-medium text-gray-700">Tin nhắn</h3>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-gray-500 hover:text-gray-700" onClick={handleRefresh}>
                <RefreshCcw className="h-5 w-5" />
              </button>
              <button className="text-gray-500 hover:text-gray-700" onClick={handleCloseChat}>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <div className="flex flex-1 overflow-hidden">
              <div className="flex w-1/3 flex-col border-r">
                <div className="border-b p-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <Input placeholder="Tìm kiếm..." className="py-1 pl-10 text-sm" />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className={`flex cursor-pointer items-center gap-3 border-b p-3 hover:bg-gray-50 ${selectedUser === user.id ? 'bg-gray-100' : ''}`}
                      onClick={() => handleSelectUser(user.id)}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <img
                            src={user.avatar || '/placeholder.svg'}
                            alt={user.name}
                            className="rounded-full object-cover"
                          />
                        </Avatar>
                        {user.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="truncate font-medium text-gray-900">{user.name}</h4>
                          <span className="text-xs text-gray-500">{formatMessageDate(user.time, true)}</span>
                        </div>
                        <p className="truncate text-sm text-gray-500">{user.lastMessage}</p>
                      </div>
                      {user.unread > 0 && (
                        <Badge className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 p-0">
                          {user.unread}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex w-2/3 flex-col">
                {selectedUser ? (
                  <>
                    <div className="flex items-center gap-3 border-b bg-gray-50 p-3">
                      <Avatar className="h-10 w-10">
                        <img
                          src={selectedUserData?.avatar || '/placeholder.svg'}
                          alt={selectedUserData?.name}
                          className="rounded-full object-cover"
                        />
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{selectedUserData?.name}</h4>
                        <p className="text-xs text-gray-500">
                          {selectedUserData?.online ? (
                            <span className="text-green-500">Đang hoạt động</span>
                          ) : (
                            <span>Không hoạt động</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto p-4">
                      {(messages[selectedUser] || []).map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                          {message.sender === 'user' && (
                            <Avatar className="mr-2 mt-1 h-8 w-8">
                              <img
                                src={selectedUserData?.avatar || '/placeholder.svg'}
                                alt={selectedUserData?.name}
                                className="rounded-full object-cover"
                              />
                            </Avatar>
                          )}
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              message.sender === 'me' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
                            } whitespace-pre-wrap break-words`}
                          >
                            <p className="text-sm">{message.text}</p>
                            <p className="mt-1 text-right text-xs opacity-70">{formatMessageDate(message.createdAt)}</p>
                          </div>
                        </div>
                      ))}
                      {/* Typing indicator */}
                      {Object.entries(isTyping).map(
                        ([id, userData]) =>
                          id === selectedUser &&
                          userData.isTyping && (
                            <div key={id} className="animate-fade-in flex items-center gap-2">
                              <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
                                <img
                                  src={userData.avatarLink || '/placeholder.svg'}
                                  alt={`avatar`}
                                  className="object-cover"
                                />
                              </div>

                              <div className="flex items-center gap-1 rounded-full bg-gray-200 px-3 py-2">
                                <span
                                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-600 opacity-60 transition-opacity duration-300"
                                  style={{ animationDelay: '0ms' }}
                                ></span>
                                <span
                                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-600 opacity-60 transition-opacity duration-300"
                                  style={{ animationDelay: '200ms' }}
                                ></span>
                                <span
                                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-600 opacity-60 transition-opacity duration-300"
                                  style={{ animationDelay: '400ms' }}
                                ></span>
                              </div>
                            </div>
                          )
                      )}{' '}
                      <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="border-t p-3">
                      <div className="flex items-center gap-2">
                        <button type="button" className="text-gray-500 hover:text-gray-700">
                          <Paperclip className="h-5 w-5" />
                        </button>
                        <button type="button" className="text-gray-500 hover:text-gray-700">
                          <ImageIcon className="h-5 w-5" />
                        </button>
                        <div className="relative flex-1">
                          <Input
                            placeholder="Nhập tin nhắn..."
                            className="rounded-full py-2 pr-10"
                            value={newMessage}
                            onChange={handleTyping}
                            onFocus={handleInputFocus}
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            <Smile className="h-5 w-5" />
                          </button>
                        </div>
                        <button
                          type="submit"
                          className="rounded-full bg-blue-600 p-2 text-white hover:bg-[#ff5252]"
                          disabled={!newMessage.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-gray-400">
                    <MessageCircle className="mb-4 h-16 w-16 text-gray-300" />
                    <p>Chọn một cuộc trò chuyện để bắt đầu</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
