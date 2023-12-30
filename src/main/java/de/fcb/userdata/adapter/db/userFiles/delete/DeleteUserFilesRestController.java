package de.fcb.userdata.adapter.db.userFiles.delete;

import static de.fcb.userdata.adapter.db.utils.UserConstants.CLASSPATH_RESOURCES_USER_FILES;
import static de.fcb.userdata.utils.AppConstants.ROOT_ORIGIN;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import de.fcb.userdata.adapter.api.response.ApiResponse;
import de.fcb.userdata.domain.services.userFiles.UserFileService;
import lombok.RequiredArgsConstructor;

@SuppressWarnings("MissingJavadoc")
@RestController
@RequiredArgsConstructor
@CrossOrigin(ROOT_ORIGIN)
public class DeleteUserFilesRestController {
    private static final Logger LOGGER = LoggerFactory.getLogger(DeleteUserFilesRestController.class);

    private static final String USER_DELETE_FILE_BY_USER_ID_RESOURCE_URL = "/members/{memberId}/{fileName}/delete";

    private final UserFileService userFileService;

    @DeleteMapping(USER_DELETE_FILE_BY_USER_ID_RESOURCE_URL)
    public ResponseEntity<ApiResponse> deleteFile(@PathVariable final Long memberId, @PathVariable final String fileName) {
        try {
            final String uploadDirectory = CLASSPATH_RESOURCES_USER_FILES + memberId;
            final Path directory = Paths.get(uploadDirectory);
            final Path fileToDelete = directory.resolve(fileName);

            if (Files.exists(fileToDelete)) {
                Files.delete(fileToDelete);
                this.userFileService.deleteFile(memberId, fileName);
                return ResponseEntity.ok(new ApiResponse("File " + fileName + " deleted."));
            } else {
                LOGGER.error("File {} not found.", fileName);
                return ResponseEntity.badRequest().body(new ApiResponse("Error deleting file " + fileName));
            }
        } catch (final Exception exception) {
            exception.printStackTrace();
            return ResponseEntity.badRequest().body(new ApiResponse("Error deleting file " + fileName));
        }
    }
}
