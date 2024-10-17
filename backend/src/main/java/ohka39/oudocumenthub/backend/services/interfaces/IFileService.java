package ohka39.oudocumenthub.backend.services.interfaces;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

import ohka39.oudocumenthub.backend.events.OnDeleteFile;
import ohka39.oudocumenthub.backend.events.OnUploadFile;

public interface IFileService {
    public void uploadFile(OnUploadFile uploadFile) throws IOException;

    public void deleteFile(OnDeleteFile deleteFile);
}
