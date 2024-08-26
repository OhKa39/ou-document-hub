package ohka39.oudocumenthub.backend.exceptions.User;

public class EntityAlreadyExistsException extends RuntimeException{
   public EntityAlreadyExistsException(String message){
        super(message);
    } 
}
