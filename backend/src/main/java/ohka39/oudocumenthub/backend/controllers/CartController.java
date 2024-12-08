package ohka39.oudocumenthub.backend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ohka39.oudocumenthub.backend.models.User;
import ohka39.oudocumenthub.backend.payload.DTO.CartDTO;
import ohka39.oudocumenthub.backend.payload.DTO.ResponseDTO;
import ohka39.oudocumenthub.backend.payload.requests.CartRequest;
import ohka39.oudocumenthub.backend.services.interfaces.ICartService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/${api-route}/cart")
@Slf4j
public class CartController {
    private final ICartService cartService;

    @PostMapping
    public ResponseEntity<ResponseDTO> createCart(Authentication auth,
            @RequestPart("cart") @Valid CartRequest request) {

        log.info("cart items: {}", request.getCartItems());
        CartDTO cart = cartService.createCart(((User) auth.getPrincipal()).getUserId().toString(), request);

        ResponseDTO response = new ResponseDTO("success", HttpStatus.OK.value(), cart,
                "created cart successfuly");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<ResponseDTO> getCart(Authentication auth) {

        CartDTO cart = cartService.getCart(((User) auth.getPrincipal()).getUserId().toString());

        ResponseDTO response = new ResponseDTO("success", HttpStatus.OK.value(), cart,
                "get cart successfully");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // @PostMapping("/confirm")
}
