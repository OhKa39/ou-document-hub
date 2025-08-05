package ohka39.oudocumenthub.backend.payload.ResponseWebClient;

import java.util.List;

public class PaypalCaptureOrderDTO {
    private String id;
    private String status;
    private List<PurchaseUnit> purchaseUnits;
    private List<ErrorDetail> details;

    public static class PurchaseUnit {
        private Payment payment;

        public Payment getPayment() {
            return payment;
        }

        public void setPayment(Payment payment) {
            this.payment = payment;
        }
    }

    public static class Payment {
        private List<Capture> captures;

        public List<Capture> getCaptures() {
            return captures;
        }

        public void setCaptures(List<Capture> captures) {
            this.captures = captures;
        }
    }

    public static class Capture {
        private String id;
        private String status;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

    public static class ErrorDetail {
        private String issue;
        private String description;

        public String getIssue() {
            return issue;
        }

        public void setIssue(String issue) {
            this.issue = issue;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<PurchaseUnit> getPurchaseUnits() {
        return purchaseUnits;
    }

    public void setPurchaseUnits(List<PurchaseUnit> purchaseUnits) {
        this.purchaseUnits = purchaseUnits;
    }

    public List<ErrorDetail> getDetails() {
        return details;
    }

    public void setDetails(List<ErrorDetail> details) {
        this.details = details;
    }
}
