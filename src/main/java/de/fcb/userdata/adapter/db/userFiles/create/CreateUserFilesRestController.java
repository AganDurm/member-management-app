package de.fcb.userdata.adapter.db.userFiles.create;

import static de.fcb.userdata.adapter.db.utils.UserConstants.CLASSPATH_RESOURCES_USER_FILES;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import de.fcb.userdata.adapter.db.userFiles.create.exceptions.DirectoryCreationException;
import de.fcb.userdata.domain.services.userData.UserDataService;
import de.fcb.userdata.domain.services.userFiles.UserFileService;
import de.fcb.userdata.domain.userData.models.UserData;
import de.fcb.userdata.domain.userFiles.models.UserFile;
import lombok.RequiredArgsConstructor;

/**
 * Rest controller to create {@link UserFile}.
 */
@SuppressWarnings("MissingJavadoc")
@RestController
@RequiredArgsConstructor
@CrossOrigin("http://localhost:4200")
public class CreateUserFilesRestController {
    private static final Logger LOGGER = LoggerFactory.getLogger(CreateUserFilesRestController.class);

    public static final String UPLOAD_USER_FILE_FOR_USER_RESOURCE_URL = "/upload/{memberId}/pdf";

    private final UserFileService userFileService;
    private final UserDataService userDataService;

    @SuppressWarnings("FeatureEnvy")
    @PostMapping(UPLOAD_USER_FILE_FOR_USER_RESOURCE_URL)
    public ResponseEntity<List<UserFile>> uploadFile(@PathVariable("memberId") final Long memberId, @RequestParam("files") final MultipartFile[] files,
                                                @RequestParam("game") final String game) {
        try {
            final List<UserFile> userFiles = new ArrayList<>();
            final Optional<UserData> user = this.userDataService.findById(memberId);

            for (final MultipartFile file : files) {
                final UserFile fileByUser = this.userFileService.findFirstByUserDataIdAndFileName(memberId, file.getOriginalFilename());
                if(fileByUser == null) {
                    final File directory = createDirectoryForUserByUserId(memberId);
                    final String fileName = file.getOriginalFilename();
                    final File destinationFile = new File(directory, Objects.requireNonNull(fileName));

                    process(file, destinationFile);

                    final UserFile userFile = new UserFile();
                    userFile.setFileName(file.getOriginalFilename());
                    userFile.setGame(game);
                    user.ifPresent(userFile::setUserData);

                    userFiles.add(userFile);
                } else {
                    return ResponseEntity.badRequest().body(this.userFileService.getUserFilesByUserId(memberId));
                }
            }

            this.userFileService.saveUserFiles(userFiles);
            LOGGER.info("{} file/s uploaded and saved.", userFiles.size());
            return ResponseEntity.ok(this.userFileService.getUserFilesByUserId(memberId));

        } catch (final Exception exception) {
            exception.printStackTrace();
            return ResponseEntity.badRequest().body(this.userFileService.getUserFilesByUserId(memberId));
        }
    }

    private File createDirectoryForUserByUserId(final Long userId) {
        final String uploadDirectory = CLASSPATH_RESOURCES_USER_FILES + userId;
        final File directory = new File(uploadDirectory);
        if (!directory.exists()) {
            final boolean directoryCreated = directory.mkdirs();
            if (!directoryCreated) {
                throw new DirectoryCreationException(uploadDirectory);
            }
        }
        return directory;
    }

    private void process(final MultipartFile file, final File destinationFile) {
        try (final InputStream fileInputStream = file.getInputStream();
             final OutputStream fileOutputStream = new FileOutputStream(destinationFile)) {
            final byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = fileInputStream.read(buffer)) != -1) {
                fileOutputStream.write(buffer, 0, bytesRead);
            }
        } catch (final IOException ioException) {
            LOGGER.error("Error occurred during file processing: " + ioException.getMessage(), ioException);
        } catch (final Exception exception) {
            LOGGER.error("An unexpected error occurred: " + exception.getMessage(), exception);
        }
    }
}
