package de.fcb.userdata.adapter.db.userData.delete;

import static de.fcb.userdata.adapter.db.utils.UserConstants.CLASSPATH_RESOURCES_USER_FILES;
import static de.fcb.userdata.utils.AppConstants.ROOT_ORIGIN;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import de.fcb.userdata.adapter.api.response.ApiResponse;
import de.fcb.userdata.domain.services.userData.UserDataService;
import de.fcb.userdata.domain.services.userFiles.UserFileService;
import de.fcb.userdata.domain.userData.models.UserData;
import lombok.RequiredArgsConstructor;

/**
 * Rest controller to delete {@link UserData}.
 */
@SuppressWarnings("MissingJavadoc")
@RestController
@RequiredArgsConstructor
@CrossOrigin(ROOT_ORIGIN)
public class DeleteUserDataRestController {
    private static final Logger LOGGER = LoggerFactory.getLogger(DeleteUserDataRestController.class);

    private static final String DELETE_ALL = "/members/deleteAll";
    private static final String DELETE_USER_BY_ID = "/members/delete/{memberId}";
    protected static final String ALLE_MITGLIEDER_ERFOLGREICH_GELOESCHT = "Alle Mitglieder erfolgreich gelöscht!";
    protected static final String ERROR_MITGLIEDER_KONNTEN_NICHT_GELOESCHT_WERDEN = "Error: Mitglieder konnten nicht gelöscht werden!";

    private final UserFileService userFileService;
    private final UserDataService userDataService;

    @DeleteMapping(DELETE_ALL)
    public ResponseEntity<ApiResponse> deleteAllUserData() {
        try {
            this.userFileService.deleteAllFiles();
            this.userDataService.deleteAllEntries();

            final Path directory = Paths.get(CLASSPATH_RESOURCES_USER_FILES);

            if (Files.exists(directory) && Files.isDirectory(directory)) {
                deleteParentFiles(directory);
            } else {
                LOGGER.error("The specified directory does not exist or is not a directory.");
                return ResponseEntity.badRequest().body(new ApiResponse(ERROR_MITGLIEDER_KONNTEN_NICHT_GELOESCHT_WERDEN));
            }

            return ResponseEntity.ok(new ApiResponse(ALLE_MITGLIEDER_ERFOLGREICH_GELOESCHT));
        } catch (final Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new ApiResponse(ERROR_MITGLIEDER_KONNTEN_NICHT_GELOESCHT_WERDEN));
        }
    }

    /**
     * Deletes the {@link UserData} by the id of the user.
     *
     * @param memberId to delet the {@link UserData} for member with this user ID
     * @return the {@link ResponseEntity#ok} if delte was success or {@link ResponseEntity#badRequest} if not.
     */
    @SuppressWarnings("FeatureEnvy")
    @DeleteMapping(DELETE_USER_BY_ID)
    @Transactional
    public ResponseEntity<ApiResponse> deleteMamberById(@PathVariable final Long memberId) {
        final Optional<UserData> userDataOptional = this.userDataService.findById(memberId);

        try {
            this.userDataService.deleteUserById(memberId);

            if (userDataOptional.isPresent()) {
                final UserData userData = userDataOptional.get();
                LOGGER.info("Member with E-Mail: {} deleted.", userData.getEmail());
                return ResponseEntity.ok().body(new ApiResponse("Mitglied mit der E-Mail: " + userData.getEmail() + " gelöscht."));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse("Mitglied nicht gefunden und nicht gelöscht."));
            }
        } catch (final Exception e) {
            e.printStackTrace();
            if (userDataOptional.isPresent()) {
                final UserData userData = userDataOptional.get();
                LOGGER.error("Member with E-Mail: {} not deleted!", userData.getEmail());
                return ResponseEntity.badRequest().body(new ApiResponse("Fehler! Mitglied mit der E-Mail: " + userData.getEmail() + " nicht gelöscht!"));
            } else {
                return ResponseEntity.badRequest().body(new ApiResponse("Fehler! Mitglied mit der ID: " + memberId + " nicht gelöscht!"));
            }
        }
    }

    private void deleteParentFiles(final Path directory) {
        try (final DirectoryStream<Path> stream = Files.newDirectoryStream(directory)) {
            for (final Path parentFile : stream) {
                if (Files.isRegularFile(parentFile)) {
                    deleteFile(parentFile);
                } else if (Files.isDirectory(parentFile)) {
                    deleteChildFiles(parentFile);
                    deleteParentDirectory(parentFile);
                }
            }
        } catch (final IOException e) {
            LOGGER.error("Failed to list files in the directory: {}", e.getMessage());
        }
    }

    private void deleteFile(final Path file) {
        try {
            Files.delete(file);
            LOGGER.info("Deleted file: {}", file.getFileName());
        } catch (final IOException e) {
            LOGGER.error("Failed to delete file: {}, {}", file.getFileName(), e.getMessage());
        }
    }

    private void deleteChildFiles(final Path parentFiles) {
        try (final DirectoryStream<Path> childFiles = Files.newDirectoryStream(parentFiles)) {
            for (final Path file : childFiles) {
                if (Files.isRegularFile(file)) {
                    deleteFile(file);
                }
            }
        } catch (final IOException e) {
            LOGGER.error("Failed to list files in the directory: {}", e.getMessage());
        }
    }

    private void deleteParentDirectory(final Path directory) {
        try {
            Files.delete(directory);
            LOGGER.info("Directory {} deleted.", directory);
        } catch (final IOException e) {
            LOGGER.error("Failed to delete the directory: {}", e.getMessage());
        }
    }
}
