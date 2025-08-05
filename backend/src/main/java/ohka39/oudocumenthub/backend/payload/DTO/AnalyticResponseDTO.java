package ohka39.oudocumenthub.backend.payload.DTO;

import lombok.Data;

@Data
public class AnalyticResponseDTO {
    private String name;
    private long count;
    private String iconLink;
    private double percentageChange;

    public static double calculatePercentageChange(long current, long previous) {
        if (previous == 0)
            return current > 0 ? 100.0 : 0.0;
        return ((double) (current - previous) / previous) * 100;
    }

    public static AnalyticResponseDTO createAnalyticResponseDTO(String name, long count, String iconLink,
            double percentageChange) {
        AnalyticResponseDTO analyticResponseDTO = new AnalyticResponseDTO();
        analyticResponseDTO.setName(name);
        analyticResponseDTO.setCount(count);
        analyticResponseDTO.setIconLink(iconLink);
        analyticResponseDTO.setPercentageChange(percentageChange);
        return analyticResponseDTO;
    }
}
