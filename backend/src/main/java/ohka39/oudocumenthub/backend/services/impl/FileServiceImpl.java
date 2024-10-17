package ohka39.oudocumenthub.backend.services.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;

import lombok.RequiredArgsConstructor;
import ohka39.oudocumenthub.backend.events.OnDeleteFile;
import ohka39.oudocumenthub.backend.events.OnUploadFile;
import ohka39.oudocumenthub.backend.exceptions.FileIsEmptyException;
import ohka39.oudocumenthub.backend.services.interfaces.IFileService;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements IFileService {
    private final AmazonS3 s3Client;

    @Value("${aws.s3.bucket-name}")
    private String BUCKET_NAME;

    @Override
    @Async
    @EventListener
    public void uploadFile(OnUploadFile uploadFile) throws IOException {
        MultipartFile request = uploadFile.getFile();
        if (request.isEmpty())
            throw new FileIsEmptyException("file is empty", 1002);

        Path tempFile = Files.createTempFile("upload-", request.getOriginalFilename());
        request.transferTo(tempFile.toFile());

        String key = uploadFile.getKey();
        // Create S3 PutObjectRequest
        PutObjectRequest putObjectRequest = new PutObjectRequest(BUCKET_NAME,
                key, tempFile.toFile());

        // Upload the file to S3
        s3Client.putObject(putObjectRequest);

        // Delete temporary file
        Files.delete(tempFile);
    }

    @Override
    @Async
    @EventListener
    public void deleteFile(OnDeleteFile deleteFile) {
        String key = deleteFile.getKey();
        s3Client.deleteObject(new DeleteObjectRequest(BUCKET_NAME,
                key));
    }

}
