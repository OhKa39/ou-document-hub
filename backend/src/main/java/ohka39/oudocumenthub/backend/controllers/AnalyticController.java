package ohka39.oudocumenthub.backend.controllers;

import lombok.RequiredArgsConstructor;
import ohka39.oudocumenthub.backend.payload.DTO.AnalyticResponseDTO;
import ohka39.oudocumenthub.backend.services.interfaces.IAnalyticService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/${api-route}/analytics")
@RequiredArgsConstructor
public class AnalyticController {

    private final IAnalyticService analyticService;

    @GetMapping
    public List<AnalyticResponseDTO> getAnalytics(
            @RequestParam(value = "period", defaultValue = "WEEK") String period) {
        return analyticService.getAnalytics(period);
    }
}
