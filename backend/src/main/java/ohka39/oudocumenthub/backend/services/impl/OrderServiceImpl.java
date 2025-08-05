package ohka39.oudocumenthub.backend.services.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ohka39.oudocumenthub.backend.models.Order;
import ohka39.oudocumenthub.backend.models.OrderItem;
import ohka39.oudocumenthub.backend.payload.DTO.OrderDTO;
import ohka39.oudocumenthub.backend.payload.DTO.OrderItemDTO;
import ohka39.oudocumenthub.backend.repositories.OrderItemRepository;
import ohka39.oudocumenthub.backend.repositories.OrderRepository;
import ohka39.oudocumenthub.backend.services.interfaces.IOrderService;

@Service
public class OrderServiceImpl implements IOrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Override
    public List<OrderDTO> getOrderHistoryByUserId(UUID userId) {
        List<Order> orders = orderRepository.findAll().stream()
                .filter(order -> order.getCreatedBy().getUserId().equals(userId))
                .collect(Collectors.toList());

        return orders.stream()
                .map(this::convertToOrderDTO)
                .collect(Collectors.toList());
    }

    @Override
    public OrderDTO getOrderDetailsById(UUID orderId, UUID userId) {
        Order order = orderRepository.findById(orderId)
                .filter(o -> o.getCreatedBy().getUserId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Order not found or user not authorized"));

        return convertToOrderDTO(order);
    }

    private OrderDTO convertToOrderDTO(Order order) {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setOrderId(order.getOrderId().toString());
        orderDTO.setOrderCode("ORD-" + order.getOrderId().toString().substring(0, 4).toUpperCase());
        orderDTO.setDate(order.getCreatedAt().toString());
        orderDTO.setPaymentMethod(order.getPaymentMethod().toString());

        // Calculate total
        BigDecimal total = order.getOrderItems().stream()
                .map(item -> item.getDocument().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        orderDTO.setTotal(total);

        // Convert order items
        List<OrderItemDTO> itemDTOs = order.getOrderItems().stream()
                .map(item -> new OrderItemDTO(
                        item.getDocument().getThumbnailUrl(),
                        item.getDocument().getName(),
                        item.getQuantity()))
                .collect(Collectors.toList());
        orderDTO.setItems(itemDTOs);

        return orderDTO;
    }
}
