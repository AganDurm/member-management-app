package de.fcb.userdata.adapter.db.userData.update;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import de.fcb.userdata.adapter.api.response.ApiResponse;
import de.fcb.userdata.adapter.db.userData.update.models.UserDataUpdateRequest;
import de.fcb.userdata.domain.services.userData.UserDataService;
import de.fcb.userdata.domain.userData.models.UserData;
import lombok.RequiredArgsConstructor;

/**
 * Rest controller to update {@link UserData}.
 */
@SuppressWarnings("MissingJavadoc")
@RestController
@RequiredArgsConstructor
@CrossOrigin("http://localhost:4200")
public class UpdateUserDataRestController {
    private static final Logger LOGGER = LoggerFactory.getLogger(UpdateUserDataRestController.class);

    private static final String UPDATE_USER_ACTIVE_STATUS = "/members/updateMemberActiveStatus";
    private static final String UPDATE_USERNAME = "/members/updateMemberUsername";
    private static final String UPDATE_PASSWORD = "/members/updateMemberPassword";
    private static final String UPDATE_KUNDENNUMMER = "/members/updateMemberKundennummer";
    private static final String UPDATE_MITGLIEDSNUMMER = "/members/updateMemberMitgliedsnummer";

    private final UserDataService userDataService;

    @PutMapping(UPDATE_USER_ACTIVE_STATUS)
    public ResponseEntity<ApiResponse> updateUserActiveStatus(@RequestBody final Long userId) {
        try {
            this.userDataService.toggleUserActiveStatus(userId);

            return ResponseEntity.ok(new ApiResponse("Der Status für das Mitglied erfolgreich geändert."));
        } catch (final Exception e) {
            e.printStackTrace();
            LOGGER.error("Error updating user active status for {}", userId);
            return ResponseEntity.badRequest().body(new ApiResponse("Fehler: Der Status für das Mitglied wurde nicht geändert."));
        }
    }

    @PutMapping(UPDATE_USERNAME)
    public ResponseEntity<ApiResponse> updateUsername(@RequestBody final UserDataUpdateRequest request) {
        final Long userId = request.getUserId();
        final String username = request.getValueToUpdate();

        try {
            this.userDataService.changeUsernameByUserId(userId, username);

            return ResponseEntity.ok(new ApiResponse("Name geändert."));
        } catch (final Exception e) {
            e.printStackTrace();
            LOGGER.error("Error updating new {} username for user {}", username, userId);
            return ResponseEntity.badRequest().body(new ApiResponse("Fehler: Name nicht geändert!"));
        }
    }

    @PutMapping(UPDATE_KUNDENNUMMER)
    public ResponseEntity<ApiResponse> updateKundennummer(@RequestBody final UserDataUpdateRequest request) {
        final Long userId = request.getUserId();
        final String kundennummer = request.getValueToUpdate();

        try {
            this.userDataService.changeKundennummerByUserId(userId, kundennummer);

            return ResponseEntity.ok(new ApiResponse("Kundennummer geändert."));
        } catch (final Exception e) {
            e.printStackTrace();
            LOGGER.error("Error updating new {} Kundennummer for user {}", kundennummer, userId);
            return ResponseEntity.badRequest().body(new ApiResponse("Fehler: Kundennummer nicht geändert!"));
        }
    }

    @PutMapping(UPDATE_MITGLIEDSNUMMER)
    public ResponseEntity<ApiResponse> updateMitgliedsnummer(@RequestBody final UserDataUpdateRequest request) {
        final Long userId = request.getUserId();
        final String mitgliedsnummer = request.getValueToUpdate();

        try {
            this.userDataService.changeMitgliedsnummerByUserId(userId, mitgliedsnummer);

            return ResponseEntity.ok(new ApiResponse("Mitgliedsnummer geändert."));
        } catch (final Exception e) {
            e.printStackTrace();
            LOGGER.error("Error updating new {} Mitgliedsnummer for user {}", mitgliedsnummer, userId);
            return ResponseEntity.badRequest().body(new ApiResponse("Fehler: Mitgliedsnummer nicht geändert!"));
        }
    }

    @PutMapping(UPDATE_PASSWORD)
    public ResponseEntity<ApiResponse> updatePassword(@RequestBody final UserDataUpdateRequest request) {
        final Long userId = request.getUserId();
        final String password = request.getValueToUpdate();

        try {
            this.userDataService.changePasswordByUserId(userId, password);

            return ResponseEntity.ok(new ApiResponse("Password geändert."));
        } catch (final Exception e) {
            e.printStackTrace();
            LOGGER.error("Error updating new {} password for user {}", password, userId);
            return ResponseEntity.badRequest().body(new ApiResponse("Fehler: Password nicht geändert!"));
        }
    }
}
