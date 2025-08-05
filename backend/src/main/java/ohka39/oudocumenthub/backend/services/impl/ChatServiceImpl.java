package ohka39.oudocumenthub.backend.services.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ohka39.oudocumenthub.backend.models.ChatRoom;
import ohka39.oudocumenthub.backend.models.ChatRoomUser;
import ohka39.oudocumenthub.backend.models.Message;
import ohka39.oudocumenthub.backend.models.User;
import ohka39.oudocumenthub.backend.payload.DTO.MessageDTO;
import ohka39.oudocumenthub.backend.payload.DTO.PresenceDTO;
import ohka39.oudocumenthub.backend.payload.DTO.ReadMessageDTO;
import ohka39.oudocumenthub.backend.payload.DTO.TypingStatusDTO;
import ohka39.oudocumenthub.backend.payload.DTO.ChatRoomDTO;
import ohka39.oudocumenthub.backend.payload.DTO.UnreadCountDTO;
import ohka39.oudocumenthub.backend.repositories.ChatRoomRepository;
import ohka39.oudocumenthub.backend.repositories.ChatRoomUserRepository;
import ohka39.oudocumenthub.backend.repositories.MessageRepository;
import ohka39.oudocumenthub.backend.repositories.UserRepository;
import ohka39.oudocumenthub.backend.services.interfaces.IChatService;

import org.springframework.data.elasticsearch.client.elc.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.client.elc.NativeQueryBuilder;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.Map;
import java.time.LocalDateTime;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatServiceImpl implements IChatService {

    private final MessageRepository messageRepository;
    private final ChatRoomUserRepository chatRoomUserRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final ElasticsearchTemplate elasticsearchTemplate;

    @PersistenceContext
    private EntityManager entityManager;

    private static final UUID PLACEHOLDER_ROOM_ID = UUID.fromString("00000000-0000-0000-0000-000000000000");

    @Transactional
    public UUID sendMessage(MessageDTO messageDto) {
        if (messageDto.getSenderId() == null || messageDto.getRecipientId() == null) {
            throw new IllegalArgumentException("Sender ID and Recipient ID must not be null");
        }

        UUID roomId = messageDto.getRoomId();
        ChatRoom chatRoom;

        if (roomId == null || roomId.equals(PLACEHOLDER_ROOM_ID)) {
            User sender = userRepository.findById(messageDto.getSenderId())
                    .orElseThrow(() -> new RuntimeException("Sender not found"));
            User recipient = userRepository.findById(messageDto.getRecipientId())
                    .orElseThrow(() -> new RuntimeException("Recipient not found"));

            List<ChatRoomUser> senderRooms = chatRoomUserRepository.findByUserId(sender.getUserId());
            List<ChatRoomUser> recipientRooms = chatRoomUserRepository.findByUserId(recipient.getUserId());
            UUID existingRoomId = senderRooms.stream()
                    .filter(s -> recipientRooms.stream().anyMatch(r -> r.getRoomId().equals(s.getRoomId())))
                    .map(ChatRoomUser::getRoomId)
                    .findFirst()
                    .orElse(null);

            if (existingRoomId != null) {
                log.info("Found existing room: {}", existingRoomId);
                roomId = existingRoomId;
                chatRoom = chatRoomRepository.findById(roomId)
                        .orElseThrow(() -> new RuntimeException("Chat room not found"));
            } else {
                chatRoom = new ChatRoom();
                log.info("Saving new chat room");
                chatRoom = chatRoomRepository.saveAndFlush(chatRoom);
                roomId = chatRoom.getRoomId();
                log.info("Successfully saved and flushed new chat room with ID: {}", roomId);

                Optional<ChatRoom> savedChatRoom = chatRoomRepository.findById(roomId);
                if (!savedChatRoom.isPresent()) {
                    log.error("ChatRoom with ID {} was not found after saveAndFlush", roomId);
                    throw new RuntimeException("Failed to persist ChatRoom with ID: " + roomId);
                }

                ChatRoomUser senderRoomUser = new ChatRoomUser();
                senderRoomUser.setRoomId(roomId);
                senderRoomUser.setUserId(sender.getUserId());
                senderRoomUser.setChatRoom(chatRoom);
                senderRoomUser.setUser(sender);
                log.info("Saving sender ChatRoomUser for roomId: {}, userId: {}", roomId, sender.getUserId());
                chatRoomUserRepository.saveAndFlush(senderRoomUser);
                log.info("Successfully saved sender ChatRoomUser");

                ChatRoomUser recipientRoomUser = new ChatRoomUser();
                recipientRoomUser.setRoomId(roomId);
                recipientRoomUser.setUserId(recipient.getUserId());
                recipientRoomUser.setChatRoom(chatRoom);
                recipientRoomUser.setUser(recipient);
                log.info("Saving recipient ChatRoomUser for roomId: {}, userId: {}", roomId, recipient.getUserId());
                chatRoomUserRepository.saveAndFlush(recipientRoomUser);
                log.info("Successfully saved recipient ChatRoomUser");
            }
        } else {
            chatRoom = chatRoomRepository.findById(roomId)
                    .orElseThrow(() -> new RuntimeException("Chat room not found"));
        }

        Message message = new Message();
        message.setMessageId(UUID.randomUUID());
        message.setSender(new User() {
            {
                setUserId(messageDto.getSenderId());
            }
        });
        message.setRoom(chatRoom);
        message.setContent(messageDto.getContent());
        if (messageDto.getReplyId() != null) {
            Message replyMessage = messageRepository.findById(messageDto.getReplyId())
                    .orElseThrow(() -> new RuntimeException("Reply message not found: " + messageDto.getReplyId()));
            message.setReply(replyMessage);
        }

        message = messageRepository.saveAndFlush(message);
        log.info("Saved and flushed message: messageId={}, roomId={}, senderId={}",
                message.getMessageId(), roomId, messageDto.getSenderId());

        Optional<Message> savedMessage = messageRepository.findById(message.getMessageId());
        if (!savedMessage.isPresent()) {
            log.error("Message with ID {} was not found after saveAndFlush", message.getMessageId());
            throw new RuntimeException("Failed to persist message with ID: " + message.getMessageId());
        }

        // Set the sender's lastMessageRead to the message they just sent
        ChatRoomUser senderChatRoomUser = chatRoomUserRepository.findByRoomIdAndUserId(roomId, messageDto.getSenderId())
                .orElseThrow(() -> new RuntimeException(
                        "Sender ChatRoomUser not found: roomId=" + ", userId=" + messageDto.getSenderId()));
        senderChatRoomUser.setLastMessageRead(message);
        chatRoomUserRepository.saveAndFlush(senderChatRoomUser);
        log.info("Updated lastMessageRead for sender: userId={}, messageId={}", messageDto.getSenderId(),
                message.getMessageId());

        User sender = userRepository.findById(messageDto.getSenderId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        messageDto.setSenderName(sender.getUsername());
        messageDto.setMessageId(message.getMessageId());
        messageDto.setCreatedAt(message.getCreatedAt());
        messageDto.setRoomId(roomId);

        try {
            messagingTemplate.convertAndSend("/topic/room/" + roomId, messageDto);
            log.info("Successfully broadcasted message to room: {}", roomId);
        } catch (Exception e) {
            log.error("Failed to broadcast message to room {}: {}", roomId, e.getMessage());
        }

        // Broadcast updated unread counts to all users in the room
        broadcastUnreadCounts(roomId);

        return roomId;
    }

    @Transactional
    public void markMessageAsRead(UUID roomId, UUID userId, UUID messageId) {
        ChatRoomUser chatRoomUser = chatRoomUserRepository.findByRoomIdAndUserId(roomId, userId)
                .orElseThrow(
                        () -> new RuntimeException("ChatRoomUser not found: roomId=" + roomId + ", userId=" + userId));

        Optional<Message> messageOpt = messageRepository.findById(messageId);
        if (!messageOpt.isPresent()) {
            log.warn("Message not found for marking as read: messageId={}", messageId);
            return;
        }

        Message message = messageOpt.get();
        chatRoomUser.setLastMessageRead(message);
        chatRoomUserRepository.save(chatRoomUser);
        log.info("Updated lastMessageRead: userId={}, messageId={}", userId, messageId);

        try {
            messagingTemplate.convertAndSend("/topic/room/" + roomId + "/read",
                    new ReadMessageDTO() {
                        {
                            setUserId(userId);
                            setMessageId(messageId);
                        }
                    });
            log.info("Successfully broadcasted read status to room: {}", roomId);
        } catch (Exception e) {
            log.error("Failed to broadcast read status to room {}: {}", roomId, e.getMessage());
        }

        // Broadcast updated unread counts to all users in the room
        broadcastUnreadCounts(roomId);
    }

    public Map<UUID, Long> countUnreadMessagesForAll(UUID roomId) {
        List<ChatRoomUser> roomUsers = chatRoomUserRepository.findByRoomId(roomId);
        List<Message> messages = messageRepository.findByRoomRoomIdOrderByCreatedAtAsc(roomId);
        Map<UUID, Long> unreadCounts = new HashMap<>();

        for (ChatRoomUser roomUser : roomUsers) {
            UUID userId = roomUser.getUserId();
            Message lastRead = roomUser.getLastMessageRead();
            LocalDateTime lastReadTime = lastRead != null ? lastRead.getCreatedAt() : null;

            long unreadCount = messages.stream()
                    .filter(msg -> !msg.getSender().getUserId().equals(userId)) // Exclude own messages
                    .filter(msg -> lastReadTime == null || msg.getCreatedAt().isAfter(lastReadTime)) // After last read
                    .count();

            unreadCounts.put(userId, unreadCount);
            log.info("Unread count for roomId={}, userId={}: {}", roomId, userId, unreadCount);
        }

        return unreadCounts;
    }

    public void broadcastUnreadCounts(UUID roomId) {
        Map<UUID, Long> unreadCounts = countUnreadMessagesForAll(roomId);
        UnreadCountDTO unreadCountDTO = new UnreadCountDTO();
        unreadCountDTO.setUnreadCounts(unreadCounts);

        try {
            messagingTemplate.convertAndSend("/topic/room/" + roomId + "/unread", unreadCountDTO);
            log.info("Successfully broadcasted unread counts to room: {}", roomId);
        } catch (Exception e) {
            log.error("Failed to broadcast unread counts to room {}: {}", roomId, e.getMessage());
        }
    }

    public long countUnreadMessages(UUID roomId, UUID userId) {
        ChatRoomUser chatRoomUser = chatRoomUserRepository.findByRoomIdAndUserId(roomId, userId)
                .orElseThrow(
                        () -> new RuntimeException("ChatRoomUser not found: roomId=" + roomId + ", userId=" + userId));
        Message lastRead = chatRoomUser.getLastMessageRead();

        List<Message> messages = messageRepository.findByRoomRoomIdOrderByCreatedAtAsc(roomId);
        long unreadCount = 0;
        boolean countMessages = lastRead == null;

        for (Message msg : messages) {
            if (!countMessages && lastRead != null && msg.getMessageId().equals(lastRead.getMessageId())) {
                countMessages = true;
                log.info("Found last read message for userId={}, messageId={}", userId, lastRead.getMessageId());
                continue;
            }

            if (countMessages && !msg.getSender().getUserId().equals(userId)) {
                unreadCount++;
                log.info("Counting unread message for userId={}: messageId={}, senderId={}, createdAt={}",
                        userId, msg.getMessageId(), msg.getSender().getUserId(), msg.getCreatedAt());
            }
        }

        // If lastMessageRead is the latest message in the room, reset unread count to 0
        Message latestMessage = messages.stream()
                .max((m1, m2) -> m1.getCreatedAt().compareTo(m2.getCreatedAt()))
                .orElse(null);
        if (lastRead != null && latestMessage != null && lastRead.getMessageId().equals(latestMessage.getMessageId())) {
            unreadCount = 0;
            log.info(
                    "Reset unread count to 0 for userId={} as their lastMessageRead is the latest message: messageId={}",
                    userId, latestMessage.getMessageId());
        }

        log.info("Final unread count for roomId={}, userId={}: {}", roomId, userId, unreadCount);
        return unreadCount;
    }

    public List<MessageDTO> searchMessages(String query, UUID roomId) {
        NativeQuery searchQuery = new NativeQueryBuilder()
                .withQuery(q -> q.match(t -> t.field("content").query(query)))
                .withFilter(q -> q.term(t -> t.field("roomId").value(roomId.toString())))
                .build();

        return elasticsearchTemplate.search(searchQuery, MessageDTO.class)
                .stream()
                .map(hit -> hit.getContent())
                .collect(Collectors.toList());
    }

    public List<ChatRoomDTO> getUserConversations(UUID userId) {
        List<ChatRoomUser> chatRoomUsers = chatRoomUserRepository.findByUserId(userId);
        return chatRoomUsers.stream().map(chatRoomUser -> {
            ChatRoom chatRoom = chatRoomRepository.findById(chatRoomUser.getRoomId())
                    .orElseThrow(() -> new RuntimeException("Chat room not found: " + chatRoomUser.getRoomId()));

            ChatRoomUser firstParticipant = chatRoomUserRepository
                    .findByRoomIdAndUserId(chatRoomUser.getRoomId(), userId)
                    .orElseThrow(() -> new RuntimeException(
                            "Participant not found in chat room: " + chatRoomUser.getRoomId()));

            ChatRoomUser otherParticipant = chatRoomUserRepository
                    .findByRoomIdAndUserIdNot(chatRoomUser.getRoomId(), userId)
                    .orElseThrow(() -> new RuntimeException(
                            "Other participant not found in chat room: " + chatRoomUser.getRoomId()));

            User otherUser = userRepository.findById(otherParticipant.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found: " + otherParticipant.getUserId()));

            Message lastMessage = messageRepository.findTopByRoomRoomIdOrderByCreatedAtDesc(chatRoomUser.getRoomId())
                    .orElse(null);

            long unreadCount = countUnreadMessages(chatRoomUser.getRoomId(), userId);

            return new ChatRoomDTO(
                    chatRoom.getRoomId(),
                    otherUser.getUserId(),
                    otherUser.getFirstName(),
                    otherUser.getLastName(),
                    otherUser.getAvatarLink(),
                    lastMessage != null ? lastMessage.getContent() : "",
                    lastMessage != null ? lastMessage.getCreatedAt() : null,
                    unreadCount,
                    otherUser.isOnline());
        }).collect(Collectors.toList());
    }

    @Transactional
    public void sendTypingStatus(UUID roomId, UUID userId, boolean isTyping, String avatarLink) {
        log.info("Sending typing status: roomId={}, userId={}, isTyping={}", roomId, userId, isTyping);
        List<ChatRoomUser> roomUsers = chatRoomUserRepository.findByRoomId(roomId);
        roomUsers.forEach(roomUser -> {
            try {
                messagingTemplate.convertAndSend("/topic/room/" + roomId + "/typing",
                        new TypingStatusDTO() {
                            {
                                setUserId(userId);
                                setIsTyping(isTyping);
                                setAvatarLink(avatarLink);
                            }
                        });
                log.info("Successfully broadcasted typing status to room: {}", roomId);
            } catch (Exception e) {
                log.error("Failed to broadcast typing status to room {}: {}", roomId, e.getMessage());
            }
        });
    }

    @Transactional
    public void updateUserPresence(UUID userId, boolean isOnline) {
        log.info("Updating user presence: userId={}, isOnline={}", userId, isOnline);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        user.setOnline(isOnline);
        userRepository.saveAndFlush(user);
        log.info("Persisted user presence: userId={}, isOnline={}", userId, user.isOnline());

        PresenceDTO presenceDTO = new PresenceDTO();
        presenceDTO.setUserId(userId);
        presenceDTO.setIsOnline(isOnline);
        try {
            messagingTemplate.convertAndSend("/topic/presence/all", presenceDTO);
            log.info("Broadcasted global presence update: userId={}, isOnline={}", userId, isOnline);
        } catch (Exception e) {
            log.error("Failed to broadcast global presence update: {}", e.getMessage());
        }

        List<ChatRoomUser> chatRooms = chatRoomUserRepository.findByUserId(userId);
        chatRooms.forEach(chatRoomUser -> {
            try {
                messagingTemplate.convertAndSend(
                        "/topic/room/" + chatRoomUser.getRoomId() + "/presence",
                        presenceDTO);
                log.info("Broadcasted room presence update: roomId={}, userId={}, isOnline={}",
                        chatRoomUser.getRoomId(),
                        userId, isOnline);
            } catch (Exception e) {
                log.error("Failed to broadcast room presence update to room {}: {}", chatRoomUser.getRoomId(),
                        e.getMessage());
            }
        });
    }

    public List<MessageDTO> getMessagesByRoom(UUID roomId) {
        List<Message> messages = messageRepository.findByRoomRoomId(roomId);
        return messages.stream().map(msg -> new MessageDTO() {
            {
                setMessageId(msg.getMessageId());
                setSenderId(msg.getSender().getUserId());
                setRoomId(roomId);
                setContent(msg.getContent());
                setCreatedAt(msg.getCreatedAt());
            }
        }).collect(Collectors.toList());
    }
}
