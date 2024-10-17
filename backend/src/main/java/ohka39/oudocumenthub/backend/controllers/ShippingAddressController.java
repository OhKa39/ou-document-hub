package ohka39.oudocumenthub.backend.controllers;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ohka39.oudocumenthub.backend.payload.DTO.ShippingAddressDTO;
import ohka39.oudocumenthub.backend.payload.DTO.ResponseDTO;
import ohka39.oudocumenthub.backend.payload.requests.CreateShippingAddressRequest;
import ohka39.oudocumenthub.backend.services.interfaces.IShippingAddressService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/${api-route}/shipping-addresses")
@Slf4j
public class ShippingAddressController {
    private final IShippingAddressService ShippingAddressService;

    @PostMapping
    public ResponseEntity<ResponseDTO> createShippingAddress(@RequestBody @Valid CreateShippingAddressRequest request) {
        log.info("ShippingAddress request:{}", request.getShippingAddressName());
        ShippingAddressDTO data = ShippingAddressService.createShippingAddress(request);
        ResponseDTO response = new ResponseDTO("success", HttpStatus.CREATED.value(), data,
                "create ShippingAddress successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<ResponseDTO> retrieveShippingAddress(Pageable pageable) {
        Page<ShippingAddressDTO> data = ShippingAddressService.getShippingAddresses(pageable);
        ResponseDTO response = new ResponseDTO("success", HttpStatus.OK.value(), data,
                "retrieve ShippingAddress successfully");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ResponseDTO> updateShippingAddress(@PathVariable("id") String id,
            @RequestBody @Valid CreateShippingAddressRequest request) {
        ShippingAddressDTO data = ShippingAddressService.updateShippingAddress(id, request);
        ResponseDTO response = new ResponseDTO("success", HttpStatus.OK.value(), data,
                "update ShippingAddress successfully");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO> deleteShippingAddress(@PathVariable("id") String id) {
        ShippingAddressService.deleteShippingAddress(id);
        ResponseDTO response = new ResponseDTO("success", HttpStatus.NO_CONTENT.value(), null,
                "delete ShippingAddress successfully");
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);
    }
}
