package ohka39.oudocumenthub.backend.exceptions.User;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message){
        super(message);
    }
}
