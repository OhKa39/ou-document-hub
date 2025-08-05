package ohka39.oudocumenthub.backend.services.interfaces;

import java.util.List;
import java.util.UUID;

import ohka39.oudocumenthub.backend.payload.DTO.ChatRoomDTO;
import ohka39.oudocumenthub.backend.payload.DTO.MessageDTO;

public interface IChatService {

    UUID sendMessage(MessageDTO messageDto);

    void markMessageAsRead(UUID roomId, UUID userId, UUID messageId);

    long countUnreadMessages(UUID roomId, UUID userId);

    List<MessageDTO> searchMessages(String query, UUID roomId);

    List<ChatRoomDTO> getUserConversations(UUID userId);

    void sendTypingStatus(UUID roomId, UUID userId, boolean isTyping, String avatarLink);

    void updateUserPresence(UUID userId, boolean isOnline);

    List<MessageDTO> getMessagesByRoom(UUID roomId);
}
