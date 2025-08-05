package ohka39.oudocumenthub.backend.services.interfaces;

import java.util.List;

import ohka39.oudocumenthub.backend.payload.DTO.AnalyticResponseDTO;

public interface IAnalyticService {
    public List<AnalyticResponseDTO> getAnalytics(String period);

}
