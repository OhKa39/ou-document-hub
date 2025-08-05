package ohka39.oudocumenthub.backend.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ohka39.oudocumenthub.backend.models.User;
import ohka39.oudocumenthub.backend.payload.DTO.OrderDTO;
import ohka39.oudocumenthub.backend.services.interfaces.IOrderService;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    @Autowired
    private IOrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getOrderHistory(Authentication auth) {
        String id = !(auth.getPrincipal() instanceof DefaultOAuth2User)
                ? ((User) auth.getPrincipal()).getUserId().toString()
                : ((DefaultOAuth2User) auth.getPrincipal()).getName();

        List<OrderDTO> orders = orderService.getOrderHistoryByUserId(UUID.fromString(id));
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}/user/{userId}")
    public ResponseEntity<OrderDTO> getOrderDetails(@PathVariable UUID orderId, @PathVariable UUID userId) {
        OrderDTO order = orderService.getOrderDetailsById(orderId, userId);
        return ResponseEntity.ok(order);
    }
}
