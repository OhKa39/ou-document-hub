package ohka39.oudocumenthub.backend.utils;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class TimeUtils {

    public static long now() {
        return System.currentTimeMillis();
    }

    public static LocalDateTime parseTimestamp(String timestamp) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME; // Handles 'Z'
            ZonedDateTime zonedDateTime = ZonedDateTime.parse(timestamp, formatter);
            return zonedDateTime.toLocalDateTime();
        } catch (Exception e) {
            log.error("Failed to parse timestamp: {}", timestamp, e);
            throw new IllegalArgumentException("Invalid timestamp format: " + timestamp);
        }
    }
}
