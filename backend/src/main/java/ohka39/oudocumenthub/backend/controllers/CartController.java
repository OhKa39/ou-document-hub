package ohka39.oudocumenthub.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ohka39.oudocumenthub.backend.models.User;
import ohka39.oudocumenthub.backend.payload.DTO.CartDTO;
import ohka39.oudocumenthub.backend.payload.DTO.ResponseDTO;
import ohka39.oudocumenthub.backend.services.interfaces.ICartService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/${api-route}/cart")
public class CartController {
    private final ICartService cartService;

    @PostMapping
    public ResponseEntity<ResponseDTO> createCart(Authentication auth, @RequestBody @Valid CartDTO request) {

        CartDTO cart = cartService.createCart(((User) auth).getUserId().toString(), request);

        ResponseDTO response = new ResponseDTO("success", HttpStatus.OK.value(), cart,
                "get document by url successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseDTO> syncCart(String id) {

        return ResponseEntity.status(HttpStatus.OK).body(null);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseDTO> updateCart(String id) {

        return ResponseEntity.status(HttpStatus.OK).body(null);
    }
}
