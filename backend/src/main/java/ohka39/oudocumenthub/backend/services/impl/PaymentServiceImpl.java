package ohka39.oudocumenthub.backend.services.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CachePut;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ohka39.oudocumenthub.backend.components.DistributedLock;
import ohka39.oudocumenthub.backend.enums.EOrderStatus;
import ohka39.oudocumenthub.backend.enums.EPaymentMethod;
import ohka39.oudocumenthub.backend.exceptions.EntityNotFoundException;
import ohka39.oudocumenthub.backend.exceptions.PaypalException;
import ohka39.oudocumenthub.backend.models.Cart;
import ohka39.oudocumenthub.backend.models.CartItem;
import ohka39.oudocumenthub.backend.models.Document;
import ohka39.oudocumenthub.backend.models.Order;
import ohka39.oudocumenthub.backend.models.OrderItem;
import ohka39.oudocumenthub.backend.models.PaperDocument;
import ohka39.oudocumenthub.backend.models.SellerInformation;
import ohka39.oudocumenthub.backend.models.User;
import ohka39.oudocumenthub.backend.payload.DTO.OrderDTO;
import ohka39.oudocumenthub.backend.payload.DTO.OrderItemDTO;
import ohka39.oudocumenthub.backend.payload.DTO.UserDTO;
import ohka39.oudocumenthub.backend.payload.ResponseWebClient.ExchangeRateDTO;
import ohka39.oudocumenthub.backend.payload.ResponseWebClient.ListPaypalSignUpSellerDTO;
import ohka39.oudocumenthub.backend.payload.ResponseWebClient.PaypalCaptureOrderDTO;
import ohka39.oudocumenthub.backend.payload.ResponseWebClient.PaypalExceptionDTO;
import ohka39.oudocumenthub.backend.payload.ResponseWebClient.PaypalCaptureOrderDTO.Capture;
import ohka39.oudocumenthub.backend.payload.ResponseWebClient.PaypalCaptureOrderDTO.ErrorDetail;
import ohka39.oudocumenthub.backend.payload.ResponseWebClient.PaypalCaptureOrderDTO.PurchaseUnit;
import ohka39.oudocumenthub.backend.payload.ResponseWebClient.PaypalOrderDTO;
import ohka39.oudocumenthub.backend.payload.ResponseWebClient.PaypalSellerSignUpDTO;
import ohka39.oudocumenthub.backend.payload.ResponseWebClient.PaypalTokenDTO;
import ohka39.oudocumenthub.backend.payload.ResponseWebClient.PaypalVaultTokenDTO;
import ohka39.oudocumenthub.backend.payload.mapper.UserMapper;
import ohka39.oudocumenthub.backend.repositories.CartRepository;
import ohka39.oudocumenthub.backend.repositories.OrderItemRepository;
import ohka39.oudocumenthub.backend.repositories.OrderRepository;
import ohka39.oudocumenthub.backend.repositories.SellerInformationRepository;
import ohka39.oudocumenthub.backend.repositories.UserRepository;
import ohka39.oudocumenthub.backend.services.interfaces.IPaymentService;
import ohka39.oudocumenthub.backend.utils.WebHookPaypalUtils;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements IPaymentService {
    @Qualifier("Paypal")
    private final WebClient paypalClient;

    @Qualifier("ExchangeRate")
    private final WebClient exchangeRateClient;

    private final DistributedLock distributedLock;

    @Value("${PAYPAL_CLIENTID}")
    private String clientId;

    @Value("${PAYPAL_SECRETID}")
    private String clientSecret;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Value("${PAYPAL_MERCHANT_ID}")
    private String paypalPartnerMerchantId;

    @Value("${PAYPAL_BN_CODE}")
    private String paypalBNCode;

    @Value("${EXCHANGE_RATE_TOKEN}")
    private String exchangeRateToken;

    private final UserRepository userRepository;
    private final SellerInformationRepository sellerInformationRepository;
    private final UserMapper userMapper;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    @Override
    public PaypalTokenDTO getPaypalAccessToken() {
        String basicAuth = Base64.getEncoder().encodeToString((clientId + ":" + clientSecret).getBytes());

        return paypalClient.post()
                .uri("/v1/oauth2/token")
                .header("Authorization", "Basic " + basicAuth)
                .header("Content-Type", "application/x-www-form-urlencoded")
                .header("PayPal-Partner-Attribution-Id", paypalBNCode)
                .bodyValue("grant_type=client_credentials")
                .retrieve()
                .bodyToMono(PaypalTokenDTO.class)
                .block();
    }

    @Override
    public ListPaypalSignUpSellerDTO getSignUpLinks(Authentication auth) {
        String accessToken = getPaypalAccessToken().getAccess_token();
        String trackingId = !(auth.getPrincipal() instanceof DefaultOAuth2User)
                ? ((User) auth.getPrincipal()).getUserId().toString()
                : ((DefaultOAuth2User) auth.getPrincipal()).getName();
        log.info("frontend url: {}", frontendUrl);

        String requestBody = """
                    {
                        "partner_config_override": {
                            "return_url": "%s/my-account/information",
                            "return_url_description": "the url to return the merchant after the paypal onboarding process.",
                            "show_add_credit_card": true
                        },
                        "tracking_id": "%s",
                        "operations": [{
                            "operation": "API_INTEGRATION",
                            "api_integration_preference": {
                                "rest_api_integration": {
                                    "integration_method": "PAYPAL",
                                    "integration_type": "THIRD_PARTY",
                                    "third_party_details": {
                                        "features": [
                                            "PAYMENT",
                                            "REFUND"
                                        ]
                                    }
                                }
                            }
                        }],
                        "products": [
                            "EXPRESS_CHECKOUT"
                        ],
                        "legal_consents": [{
                            "type": "SHARE_DATA_CONSENT",
                            "granted": true
                        }]
                    }
                """
                .formatted(frontendUrl, trackingId);

        return paypalClient.post()
                .uri("/v2/customer/partner-referrals")
                .header("Authorization", "Bearer " + accessToken)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(ListPaypalSignUpSellerDTO.class)
                .block();
    }

    @Override
    @CachePut(value = "users", key = "#userId")
    public UserDTO getUserSellerPaypal(String userId, String merchantId, String accountType) {
        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new EntityNotFoundException("user not found", 1000));

        String accessToken = getPaypalAccessToken().getAccess_token();
        String uri = "/v1/customer/partners/%s/merchant-integrations/%s".formatted(paypalPartnerMerchantId, merchantId);
        log.info("uri {}", uri);
        PaypalSellerSignUpDTO dto = paypalClient.get()
                .uri(uri)
                .header("Authorization", "Bearer " + accessToken)
                .header("Content-Type", "application/json")
                .retrieve()
                .bodyToMono(PaypalSellerSignUpDTO.class)
                .block();
        log.info("paypal information: {}", dto);

        if (dto.isPayments_receivable() && dto.isPrimary_email_confirmed() && !dto.getOauth_integrations().isEmpty()) {
            SellerInformation seller = SellerInformation.builder()
                    .accountType(accountType)
                    .isVerified(true)
                    .merchantId(merchantId)
                    .user(user)
                    .build();
            sellerInformationRepository.save(seller);
            user.setSellerInformation(seller);
            userRepository.flush();
        }
        return userMapper.toCurrentUserDTO(user);
    }

    @Override
    public PaypalVaultTokenDTO createVaultToken() {
        String accessToken = getPaypalAccessToken().getAccess_token();
        String requestBody = """
                {
                  "payment_source": {
                    "card": {}
                    }
                }
                """;
        return paypalClient.post()
                .uri("/v3/vault/setup-tokens")
                .header("Authorization", "Bearer " + accessToken)
                .header("PayPal-Auth-Assertion",
                        WebHookPaypalUtils.createAssertionId(clientId, paypalPartnerMerchantId))
                .header("PayPal-Partner-Attribution-Id", paypalBNCode)
                .header("PayPal-Request-Id", UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(PaypalVaultTokenDTO.class)
                .block();
    }

    @Override
    @Transactional
    public PaypalOrderDTO createOrders(String userId) {
        String lockKey = "order-create-lock:" + userId;
        String lockValue = UUID.randomUUID().toString();
        int maxAttempts = 5;
        int attempt = 0;
        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new EntityNotFoundException("user not found", 1000));

        while (attempt < maxAttempts) {
            if (distributedLock.acquireLock(lockKey, lockValue, 10)) {
                try {
                    // Fetch exchange rate for VND to USD conversion
                    ExchangeRateDTO exchangeRate = exchangeRateClient.get()
                            .uri("/v6/%s/pair/VND/USD".formatted(exchangeRateToken))
                            .retrieve()
                            .bodyToMono(ExchangeRateDTO.class)
                            .block();

                    String accessToken = getPaypalAccessToken().getAccess_token();
                    EOrderStatus[] excludedStatuses = { EOrderStatus.CANCELLED };
                    Cart cart = cartRepository.findById(UUID.fromString(userId))
                            .orElseThrow(() -> new EntityNotFoundException("Cart not found", 1008));
                    // Check if any product is sold out based on total ordered quantity
                    for (CartItem cartItem : cart.getCartItems()) {
                        Document document = cartItem.getDocument();
                        int requestedQuantity = cartItem.getQuantity();
                        Integer totalOrderedQuantity = orderItemRepository
                                .findTotalOrderedQuantityByDocumentId(document.getDocumentId(), excludedStatuses);
                        totalOrderedQuantity = (totalOrderedQuantity != null) ? totalOrderedQuantity : 0;
                        if (document instanceof PaperDocument) {

                            int availableStock = ((PaperDocument) document).getStock() - totalOrderedQuantity;

                            if (availableStock < requestedQuantity) {
                                throw new IllegalStateException(
                                        "Product '" + document.getName() + "' is sold out. Available stock: "
                                                + availableStock +
                                                ", Requested: " + requestedQuantity + ", Total ordered: "
                                                + totalOrderedQuantity);
                            }
                        }
                    }

                    // Create the Order entity (without customer details for PayPal)
                    Order order = new Order();
                    order.setStatus(EOrderStatus.PENDING);
                    order.setPaymentMethod(EPaymentMethod.DIGITAL_WALLET);
                    order.setCreatedBy(user);
                    order = orderRepository.save(order);
                    orderRepository.flush(); // Ensure the timestamp is written
                    // Create OrderItem entities
                    for (CartItem cartItem : cart.getCartItems()) {
                        OrderItem orderItem = new OrderItem();
                        orderItem.setDocument(cartItem.getDocument());

                        orderItem.setQuantity(cartItem.getQuantity());
                        orderItem.setStatus(EOrderStatus.PENDING);
                        orderItem.setOrder(order);
                        orderItemRepository.save(orderItem);
                    }

                    // Group cart items by seller (payee)
                    Map<UUID, List<CartItem>> itemsBySeller = cart.getCartItems().stream()
                            .collect(Collectors.groupingBy(
                                    item -> ((User) ((Document) item.getDocument()).getUser()).getUserId()));

                    // Use Jackson to dynamically build the purchase_units array
                    ObjectMapper mapper = new ObjectMapper();
                    ObjectNode requestBody = mapper.createObjectNode();
                    requestBody.put("intent", "CAPTURE");
                    ArrayNode purchaseUnits = mapper.createArrayNode();

                    for (Map.Entry<UUID, List<CartItem>> entry : itemsBySeller.entrySet()) {
                        UUID sellerUserId = entry.getKey();
                        List<CartItem> sellerItems = entry.getValue();

                        // Fetch the merchantId for the seller
                        SellerInformation sellerInfo = sellerInformationRepository.findByUser_UserId(sellerUserId);
                        String merchantId = sellerInfo != null ? sellerInfo.getMerchantId() : null;
                        if (merchantId == null) {
                            throw new IllegalStateException("No merchantId found for seller: " + sellerUserId);
                        }

                        // Calculate the total amount for this payee in USD
                        BigDecimal totalAmount = sellerItems.stream()
                                .reduce(BigDecimal.ZERO,
                                        (subtotal, item) -> subtotal.add(
                                                item.getDocument().getPrice()
                                                        .multiply(new BigDecimal(item.getQuantity()))),
                                        BigDecimal::add)
                                .multiply(new BigDecimal(exchangeRate.getConversion_rate()))
                                .setScale(2, RoundingMode.HALF_UP);

                        // Build the items array for this purchase_unit
                        ArrayNode itemsArray = mapper.createArrayNode();
                        for (CartItem item : sellerItems) {
                            BigDecimal itemTotal = item.getDocument().getPrice()
                                    .multiply(new BigDecimal(item.getQuantity()))
                                    .multiply(new BigDecimal(exchangeRate.getConversion_rate()))
                                    .setScale(2, RoundingMode.HALF_UP);

                            ObjectNode itemNode = mapper.createObjectNode();
                            itemNode.put("name", item.getDocument().getName());
                            itemNode.put("quantity", item.getQuantity());
                            ObjectNode unitAmount = mapper.createObjectNode();
                            unitAmount.put("currency_code", "USD");
                            unitAmount.put("value",
                                    itemTotal.divide(new BigDecimal(item.getQuantity()), 2, RoundingMode.HALF_UP));
                            itemNode.set("unit_amount", unitAmount);
                            ObjectNode total = mapper.createObjectNode();
                            total.put("currency_code", "USD");
                            total.put("value", itemTotal.toString());
                            itemNode.set("amount", total);
                            itemsArray.add(itemNode);
                        }

                        // Build the purchase_unit for this payee
                        ObjectNode purchaseUnit = mapper.createObjectNode();
                        ObjectNode payee = mapper.createObjectNode();
                        payee.put("merchant_id", merchantId);
                        purchaseUnit.set("payee", payee);
                        ObjectNode amount = mapper.createObjectNode();
                        amount.put("currency_code", "USD");
                        amount.put("value", totalAmount.toString());
                        ObjectNode breakdown = mapper.createObjectNode();
                        ObjectNode itemTotal = mapper.createObjectNode();
                        itemTotal.put("currency_code", "USD");
                        itemTotal.put("value", totalAmount.toString());
                        breakdown.set("item_total", itemTotal);
                        amount.set("breakdown", breakdown);
                        purchaseUnit.set("amount", amount);
                        purchaseUnit.set("items", itemsArray);

                        purchaseUnits.add(purchaseUnit);
                    }

                    requestBody.set("purchase_units", purchaseUnits);

                    // Create the PayPal order
                    PaypalOrderDTO orderDTO = paypalClient.post()
                            .uri("/v2/checkout/orders")
                            .header("Authorization", "Bearer " + accessToken)
                            .header("PayPal-Auth-Assertion",
                                    WebHookPaypalUtils.createAssertionId(clientId, paypalPartnerMerchantId))
                            .header("PayPal-Partner-Attribution-Id", paypalBNCode)
                            .header("PayPal-Request-Id", UUID.randomUUID().toString())
                            .contentType(MediaType.APPLICATION_JSON)
                            .bodyValue(requestBody)
                            .retrieve()
                            .bodyToMono(PaypalOrderDTO.class)
                            .block();

                    // Update the order with the PayPal order ID
                    order.setPaypalOrderId(orderDTO.getId());
                    orderRepository.save(order);

                    return orderDTO;
                } finally {
                    distributedLock.releaseLock(lockKey, lockValue);
                }
            } else {
                attempt++;
                try {
                    Thread.sleep(1000); // Wait 1 second before retrying
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("Interrupted while waiting for lock: " + userId, e);
                }
            }
        }
        throw new RuntimeException(
                "Unable to acquire lock for user: " + userId + " after " + maxAttempts + " attempts");
    }

    @Transactional
    public OrderDTO saveOrder(String userId, String status, String paymentMethod, String firstName,
            String lastName, String phoneNumber, String email) {
        Cart cart = cartRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new EntityNotFoundException("Cart not found", 1008));
        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new EntityNotFoundException("user not found", 1000));

        // Create the Order entity
        Order order = new Order();
        order.setOrderId(UUID.randomUUID());
        order.setStatus(EOrderStatus.valueOf(status));
        order.setPaymentMethod(EPaymentMethod.valueOf(paymentMethod));
        order.setCreatedBy(user);
        if ("CASH".equals(paymentMethod)) {
            order.setCustomerFirstName(firstName);
            order.setCustomerLastName(lastName);
            order.setCustomerPhoneNumber(phoneNumber);
            order.setCustomerEmail(email);
        }
        orderRepository.save(order);

        // Create OrderItem entities
        for (CartItem cartItem : cart.getCartItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setDocument(cartItem.getDocument());

            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setStatus(EOrderStatus.PENDING);
            orderItem.setOrder(order);
            orderItemRepository.save(orderItem);
        }

        // Fetch order items to include in response
        List<OrderItem> orderItems = orderItemRepository.findByOrder_OrderId(order.getOrderId());

        // Build response DTO
        OrderDTO response = new OrderDTO();
        response.setOrderId(order.getOrderId().toString());
        response.setOrderCode("ODR" + order.getOrderId().toString().substring(0, 8).toUpperCase());
        response.setDate(order.getCreatedAt().toString());
        response.setTotal(orderItems.stream()
                .map(item -> item.getDocument().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        response.setPaymentMethod(paymentMethod);
        response.setItems(orderItems.stream().map(item -> new OrderItemDTO(
                ((Document) item.getDocument()).getThumbnailUrl(),
                ((Document) item.getDocument()).getName(),
                item.getQuantity())).toList());

        return response;
    }

    @Override
    @Transactional
    public OrderDTO captureOrder(String orderId) {
        String lockKey = "order-capture-lock:" + orderId;
        String lockValue = UUID.randomUUID().toString();
        int maxAttempts = 5;
        int attempt = 0;

        while (attempt < maxAttempts) {
            if (distributedLock.acquireLock(lockKey, lockValue, 10)) {
                try {
                    String accessToken = getPaypalAccessToken().getAccess_token();

                    log.info("paypalBNCode: {}", paypalBNCode);
                    PaypalCaptureOrderDTO captureResponse = paypalClient.post()
                            .uri("/v2/checkout/orders/%s/capture".formatted(orderId))
                            .header("Authorization", "Bearer " + accessToken)
                            .header("PayPal-Auth-Assertion",
                                    WebHookPaypalUtils.createAssertionId(clientId, paypalPartnerMerchantId))
                            .header("PayPal-Partner-Attribution-Id", paypalBNCode)
                            .header("PayPal-Request-Id", UUID.randomUUID().toString())
                            .contentType(MediaType.APPLICATION_JSON)
                            .retrieve()
                            .bodyToMono(PaypalCaptureOrderDTO.class)
                            .block();

                    log.info("PayPal capture response: {}",
                            captureResponse != null ? captureResponse.toString() : "null");

                    // Check for PayPal-specific errors
                    if (captureResponse == null) {
                        throw new RuntimeException("No response received from PayPal for order: " + orderId);
                    }

                    if (captureResponse.getDetails() != null && !captureResponse.getDetails().isEmpty()) {
                        ErrorDetail errorDetail = captureResponse.getDetails().get(0);
                        if ("INSTRUMENT_DECLINED".equals(errorDetail.getIssue())) {
                            throw new PaypalException("Instrument declined for order: " + orderId, 1201);
                        } else {
                            throw new RuntimeException(errorDetail.getDescription() + " for order: " + orderId);
                        }
                    }

                    if (!"COMPLETED".equals(captureResponse.getStatus())) {
                        throw new RuntimeException("Capture failed with status: " + captureResponse.getStatus()
                                + " for order: " + orderId);
                    }

                    // Extract transaction details
                    String transactionId = null;
                    String transactionStatus = null;
                    if (captureResponse.getPurchaseUnits() != null && !captureResponse.getPurchaseUnits().isEmpty()) {
                        PurchaseUnit purchaseUnit = captureResponse.getPurchaseUnits().get(0);
                        if (purchaseUnit.getPayment() != null && purchaseUnit.getPayment().getCaptures() != null
                                && !purchaseUnit.getPayment().getCaptures().isEmpty()) {
                            Capture capture = purchaseUnit.getPayment().getCaptures().get(0);
                            transactionId = capture.getId();
                            transactionStatus = capture.getStatus();
                            log.info("Captured transaction: ID={}, Status={}", transactionId, transactionStatus);
                        }
                    }

                    // Update the order
                    Order order = orderRepository.findByPaypalOrderId(orderId);
                    if (order == null) {
                        throw new EntityNotFoundException("Order not found for PayPal order ID: " + orderId, 1008);
                    }

                    List<OrderItem> orderItems = orderItemRepository.findByOrder_OrderId(order.getOrderId());

                    // Build the response DTO
                    OrderDTO response = new OrderDTO();
                    response.setOrderId(order.getOrderId().toString());
                    response.setOrderCode("ODR" + order.getOrderId().toString().substring(0, 8).toUpperCase());
                    response.setDate(order.getCreatedAt().toString());
                    response.setTotal(orderItems.stream()
                            .map(item -> item.getDocument().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                            .reduce(BigDecimal.ZERO, BigDecimal::add));
                    response.setPaymentMethod("DIGITAL_WALLET");
                    response.setItems(orderItems.stream().map(item -> new OrderItemDTO(
                            item.getDocument().getThumbnailUrl(),
                            item.getDocument().getName(),
                            item.getQuantity())).toList());

                    return response;
                } catch (Exception e) {
                    log.error("Error capturing PayPal order {}: {}", orderId, e.getMessage(), e);
                    throw e;
                } finally {
                    distributedLock.releaseLock(lockKey, lockValue);
                }
            } else {
                attempt++;
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("Interrupted while waiting for lock: " + orderId, e);
                }
            }
        }
        throw new RuntimeException(
                "Unable to acquire lock for order: " + orderId + " after " + maxAttempts + " attempts");
    }
}
