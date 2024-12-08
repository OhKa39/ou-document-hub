package ohka39.oudocumenthub.backend.payload.ResponseWebClient;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class GoogleInformation {
    private String resourceName;
    private String etag;
    private List<Gender> genders;
    private List<Birthday> birthdays;

    // Getters and Setters...

    @Getter
    public static class Gender {
        private Metadata metadata;
        private String value;
        private String formattedValue;

        // Getters and Setters...
    }

    @Getter
    public static class Birthday {
        private Metadata metadata;
        private Date date;

        // Getters and Setters...
    }

    @Getter
    public static class Metadata {
        private boolean primary;
        private Source source;

        // Getters and Setters...
    }

    @Getter
    public static class Source {
        private String type;
        private String id;

        // Getters and Setters...
    }

    @Getter
    public static class Date {
        private int year;
        private int month;
        private int day;

        public String toString() {
            return year + "-" + month + "-" + day;
        }

        // Getters and Setters...
    }

}
