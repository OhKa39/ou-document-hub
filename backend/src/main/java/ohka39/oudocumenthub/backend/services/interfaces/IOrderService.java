package ohka39.oudocumenthub.backend.services.interfaces;

import java.util.List;
import java.util.UUID;
import ohka39.oudocumenthub.backend.payload.DTO.OrderDTO;

public interface IOrderService {
    List<OrderDTO> getOrderHistoryByUserId(UUID userId);

    OrderDTO getOrderDetailsById(UUID orderId, UUID userId);
}
