package ohka39.oudocumenthub.backend.controllers;

import lombok.RequiredArgsConstructor;
import ohka39.oudocumenthub.backend.services.interfaces.IChatService;
import ohka39.oudocumenthub.backend.payload.DTO.ChatRoomDTO;
import ohka39.oudocumenthub.backend.payload.DTO.MessageDTO;
import ohka39.oudocumenthub.backend.payload.DTO.ReadMessageDTO;
import ohka39.oudocumenthub.backend.payload.DTO.TypingStatusDTO;
import ohka39.oudocumenthub.backend.payload.DTO.PresenceDTO;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final IChatService chatService;

    @MessageMapping("/chat/{roomId}/send")
    public void sendMessage(@DestinationVariable UUID roomId, MessageDTO messageDTO) {
        messageDTO.setRoomId(roomId);
        chatService.sendMessage(messageDTO);
    }

    @MessageMapping("/chat/{roomId}/read")
    public void markAsRead(@DestinationVariable UUID roomId, ReadMessageDTO readMessageDTO) {
        chatService.markMessageAsRead(roomId, readMessageDTO.getUserId(), readMessageDTO.getMessageId());
    }

    @MessageMapping("/chat/{roomId}/typing")
    public void sendTypingStatus(@DestinationVariable UUID roomId, TypingStatusDTO typingStatusDTO) {
        chatService.sendTypingStatus(roomId, typingStatusDTO.getUserId(), typingStatusDTO.isTyping(),
                typingStatusDTO.getAvatarLink());
    }

    @MessageMapping("/chat/presence")
    public void updatePresence(PresenceDTO presenceDTO) {
        chatService.updateUserPresence(presenceDTO.getUserId(), presenceDTO.isOnline());
    }

    @GetMapping("/api/v1/chat/{roomId}/unread/{userId}")
    public long getUnreadCount(@PathVariable UUID roomId, @PathVariable UUID userId) {
        return chatService.countUnreadMessages(roomId, userId);
    }

    @GetMapping("/api/v1/chat/{roomId}/search")
    public List<MessageDTO> searchMessages(@PathVariable UUID roomId, @RequestParam String query) {
        return chatService.searchMessages(query, roomId);
    }

    @GetMapping("/api/v1/chat-rooms/user/{userId}")
    public List<ChatRoomDTO> getUserConversations(@PathVariable UUID userId) {
        return chatService.getUserConversations(userId);
    }

    @GetMapping("/api/v1/messages/room/{roomId}")
    public List<MessageDTO> getMessagesByRoom(@PathVariable UUID roomId) {
        return chatService.getMessagesByRoom(roomId);
    }
}
