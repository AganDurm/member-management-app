package de.fcb.userdata.adapter.db.userFiles.fetch;

import static de.fcb.userdata.adapter.db.utils.UserConstants.CLASSPATH_RESOURCES_USER_FILES;
import static de.fcb.userdata.utils.AppConstants.ROOT_ORIGIN;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Stream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import de.fcb.userdata.domain.services.userFiles.UserFileService;
import de.fcb.userdata.domain.userFiles.models.UserFile;
import lombok.RequiredArgsConstructor;

/**
 * Rest controller to fetch {@link UserFile}.
 */
@SuppressWarnings("MissingJavadoc")
@RestController
@RequiredArgsConstructor
@CrossOrigin(ROOT_ORIGIN)
public class FetchUserFilesRestController {
    private static final Logger LOGGER = LoggerFactory.getLogger(FetchUserFilesRestController.class);

    public static final String FETCH_USER_FILES_BY_USER_ID_RESOURCE_URL = "/members/{userId}/userFiles";
    public static final String FETCH_USER_FILES_BY_USER_ID_AND_GAME_RESOURCE_URL = "/members/{memberId}/{game}/files";
    private static final String PREVIEW_PDF_RESOURCE_URL = "/members/{memberId}/{filename:.+}/{game}/preview";
    private static final String DOWNLOAD_FILE_BY_USER_ID_AND_FILE_NAME_RESOURCE_URL = "/members/{userId}/{filename:.+}/{game}/download";
    private static final String DOWNLOAD_FILES_BY_GAME_RESOURCE_URL = "/members/{game}/download";
    private static final String FETCH_FILES_BY_GAME_RESOURCE_URL = "/members/{game}/gameFiles";
    private static final String FETCH_ALL_FILES_RESOURCE_URL = "/members/gameFiles";

    private final UserFileService userFileService;

    @GetMapping(FETCH_USER_FILES_BY_USER_ID_RESOURCE_URL)
    public ResponseEntity<List<UserFile>> loadAllFilesByUserId(@PathVariable("userId") final Long userId) {
        try {
            final List<UserFile> userFiles = this.userFileService.getUserFilesByUserId(userId);
            return ResponseEntity.ok(userFiles);
        } catch (final Exception exception) {
            exception.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping(FETCH_USER_FILES_BY_USER_ID_AND_GAME_RESOURCE_URL)
    public ResponseEntity<List<UserFile>> loadAllFilesByUserIdAndGame(@PathVariable("memberId") final Long memberId,
                                                                      @PathVariable("game") final String game) {
        try {
            final List<UserFile> userFiles = this.userFileService.getUserFilesByMemberIdAndGame(memberId, game);
            return ResponseEntity.ok(userFiles);
        } catch (final Exception exception) {
            exception.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping(DOWNLOAD_FILE_BY_USER_ID_AND_FILE_NAME_RESOURCE_URL)
    @ResponseBody
    public ResponseEntity<Resource> downloadFile(@PathVariable final String userId,
                                                 @PathVariable final String filename,
                                                 @PathVariable final String game) {
        try {
            final Path fileStorageLocation = Paths.get(CLASSPATH_RESOURCES_USER_FILES + game)
                    .toAbsolutePath().normalize();
            final Path filePath = fileStorageLocation.resolve(filename).normalize();
            LOGGER.info("Attempting to access file at path: {}", filePath);
            final Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                final String contentType = "application/octet-stream";
                LOGGER.info("File {} for user {} found", filename, userId);
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                LOGGER.error("File {} for user {} not found", filename, userId);
                return ResponseEntity.notFound().build();
            }
        } catch (final MalformedURLException malformedURLException) {
            malformedURLException.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping(PREVIEW_PDF_RESOURCE_URL)
    @ResponseBody
    public ResponseEntity<Resource> serveFile(@PathVariable final String memberId,
                                              @PathVariable final String filename,
                                              @PathVariable final String game) {
        try {
            final Path fileStorageLocation = Paths.get(CLASSPATH_RESOURCES_USER_FILES + game)
                    .toAbsolutePath().normalize();
            final Path filePath = fileStorageLocation.resolve(filename).normalize();
            final Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_PDF)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (final MalformedURLException malformedURLException) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping(FETCH_FILES_BY_GAME_RESOURCE_URL)
    @ResponseBody
    public ResponseEntity<List<UserFile>> serveFileByGameName(@PathVariable final String game) {
        try {
            final List<UserFile> userFiles = this.userFileService.getUserFilesByGame(game);
            return ResponseEntity.ok(userFiles);
        } catch (final Exception exception) {
            exception.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping(FETCH_ALL_FILES_RESOURCE_URL)
    @ResponseBody
    public ResponseEntity<List<UserFile>> serveAllFiles() {
        try {
            final List<UserFile> userFiles = this.userFileService.getAllFiles();
            return ResponseEntity.ok(userFiles);
        } catch (final Exception exception) {
            exception.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping(DOWNLOAD_FILES_BY_GAME_RESOURCE_URL)
    @ResponseBody
    public ResponseEntity<Resource> downloadFile(@PathVariable final String game) {
        try {
            final Path fileStorageLocation = Paths.get(CLASSPATH_RESOURCES_USER_FILES + game)
                    .toAbsolutePath().normalize();

            if (!Files.exists(fileStorageLocation) || !Files.isDirectory(fileStorageLocation)) {
                LOGGER.error("Directory for game {} not found", game);
                return ResponseEntity.notFound().build();
            }

            final Path tempZipFile = Files.createTempFile("files-", ".zip");
            try (final ZipOutputStream zos = new ZipOutputStream(Files.newOutputStream(tempZipFile));
                 final Stream<Path> paths = Files.walk(fileStorageLocation)) {

                paths.filter(path -> !Files.isDirectory(path)).forEach(path -> {
                    final ZipEntry zipEntry = new ZipEntry(fileStorageLocation.relativize(path).toString());
                    try {
                        zos.putNextEntry(zipEntry);
                        Files.copy(path, zos);
                        zos.closeEntry();
                    } catch (final IOException uncheckedIOException) {
                        throw new UncheckedIOException(uncheckedIOException);
                    }
                });
            }


            final Resource resource = new UrlResource(tempZipFile.toUri());
            final String contentType = "application/zip";
            LOGGER.info("Returning ZIP file for game {}", game);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (final IOException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}
