package ohka39.oudocumenthub.backend.payload.DTO;

import java.util.LinkedHashMap;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResponseDTO {
    private final Object status;
    private final Object statusCode;
    private final Object data;
    private final Object message;

    public Map<String, Object> makeTemplate() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", status);
        response.put("statusCode", statusCode);
        response.put("data", data);
        response.put("message", message);
        return response;
    }
}
