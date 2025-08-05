package ohka39.oudocumenthub.backend.payload.DTO;

public class OrderItemDTO {
    private String imageUrl;
    private String name;
    private int quantity;

    public OrderItemDTO(String imageUrl, String name, int quantity) {
        this.imageUrl = imageUrl;
        this.name = name;
        this.quantity = quantity;
    }

    // Getters and setters
    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
