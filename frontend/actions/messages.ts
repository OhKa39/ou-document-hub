'use server'

import ServerFetch from "@/utils/ServerFetch";

export const sendFirstMessage = async (content: string, senderId: string, recipientId: string) => {

if (!firstMessage.trim() || !stompClient) return;
    try {
      const userId = 'current-user-id'; // Replace with actual user ID from auth context
      const messageDto = {
        senderId: userId,
        recipientId: params.seller_id,
        content: firstMessage,
      };
      // Use a placeholder roomId (backend will generate the actual one)
      const placeholderRoomId = '00000000-0000-0000-0000-000000000000';
      // Subscribe to the response topic to get the roomId
      stompClient.subscribe(`/topic/room/${placeholderRoomId}`, (message) => {
        const roomId = JSON.parse(message.body);
        setSelectedRoomId(roomId);
        setIsChatOpen(true);
        setIsChatDialogOpen(false);
        setFirstMessage('');
      });
      // Send message
      stompClient.send(`/app/chat/${placeholderRoomId}/send`, {}, JSON.stringify(messageDto));
}
