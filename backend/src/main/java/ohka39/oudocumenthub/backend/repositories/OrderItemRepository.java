package ohka39.oudocumenthub.backend.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import ohka39.oudocumenthub.backend.enums.EOrderStatus;
import ohka39.oudocumenthub.backend.models.OrderItem;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {
    List<OrderItem> findByOrder_OrderId(UUID orderId);

    @Query("SELECT COALESCE(SUM(o.quantity), 0) FROM OrderItem o WHERE o.document.documentId = :documentId " +
            "AND o.status NOT IN :statuses")
    Integer findTotalOrderedQuantityByDocumentId(@Param("documentId") UUID documentId,
            @Param("statuses") EOrderStatus... statuses);
}
