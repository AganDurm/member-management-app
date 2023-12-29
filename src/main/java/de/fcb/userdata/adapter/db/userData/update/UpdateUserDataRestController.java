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
    private static final String UPDATE_MITGLIEDS_CARD_NUMBER = "/members/updateMemberCardNumber";
    private static final String UPDATE_MITGLIEDS_VISA_OR_MC = "/members/updateMemberVisaOrMc";
    private static final String UPDATE_MITGLIEDS_MONAT = "/members/updateMemberMonth";
    private static final String UPDATE_MITGLIEDS_JAHR = "/members/updateMemberYear";
    private static final String UPDATE_MITGLIEDS_CVC = "/members/updateMemberCvc";
    private static final String UPDATE_NAME_ON_CARD = "/members/updateMemberNameOnCard";
    private static final String UPDATE_GEB = "/members/updateMemberGeb";
    private static final String UPDATE_PLZ = "/members/updateMemberPLZ";
    private static final String UPDATE_STREET = "/members/updateMemberStreet";
    private static final String UPDATE_CITY = "/members/updateMemberCity";

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

    @PutMapping(UPDATE_MITGLIEDS_CARD_NUMBER)
    public ResponseEntity<ApiResponse> updateCardNumber(@RequestBody final UserDataUpdateRequest request) {
        final Long userId = request.getUserId();
        final String cardNumber = request.getValueToUpdate();

        try {
            this.userDataService.changeCardNumberByUserId(userId, cardNumber);

            return ResponseEntity.ok(new ApiResponse("Kartennummer geändert."));
        } catch (final Exception e) {
            e.printStackTrace();
            LOGGER.error("Error updating new {} card number for user {}", cardNumber, userId);
            return ResponseEntity.badRequest().body(new ApiResponse("Fehler: Kartennummer nicht geändert!"));
        }
    }

    @PutMapping(UPDATE_MITGLIEDS_VISA_OR_MC)
    public ResponseEntity<ApiResponse> updateVisaOrMc(@RequestBody final UserDataUpdateRequest request) {
        final Long userId = request.getUserId();
        final String visaOrMc = request.getValueToUpdate();

        try {
            this.userDataService.changeVisaOrMc(userId, visaOrMc);

            return ResponseEntity.ok(new ApiResponse("Visa oder MC geändert."));
        } catch (final Exception e) {
            e.printStackTrace();
            LOGGER.error("Error updating new {} visa or mc for user {}", visaOrMc, userId);
            return ResponseEntity.badRequest().body(new ApiResponse("Fehler: VISA oder MC nicht geändert!"));
        }
    }

    @PutMapping(UPDATE_MITGLIEDS_MONAT)
    public ResponseEntity<ApiResponse> updateMonth(@RequestBody final UserDataUpdateRequest request) {
        final Long userId = request.getUserId();
        final String month = request.getValueToUpdate();

        try {
            this.userDataService.changeMonth(userId, month);

            return ResponseEntity.ok(new ApiResponse("Ablaufmonat geändert."));
        } catch (final Exception e) {
            e.printStackTrace();
            LOGGER.error("Error updating new {} month for user {}", month, userId);
            return ResponseEntity.badRequest().body(new ApiResponse("Fehler: Ablaufmonat nicht geändert!"));
        }
    }

    @PutMapping(UPDATE_MITGLIEDS_JAHR)
    public ResponseEntity<ApiResponse> updateYear(@RequestBody final UserDataUpdateRequest request) {
        final Long userId = request.getUserId();
        final String year = request.getValueToUpdate();

        try {
            this.userDataService.changeYear(userId, year);

            return ResponseEntity.ok(new ApiResponse("Ablaufjahr geändert."));
        } catch (final Exception e) {
            e.printStackTrace();
            LOGGER.error("Error updating new {} year for user {}", year, userId);
            return ResponseEntity.badRequest().body(new ApiResponse("Fehler: Ablaufjahr nicht geändert!"));
        }
    }

    @PutMapping(UPDATE_MITGLIEDS_CVC)
    public ResponseEntity<ApiResponse> updateCvc(@RequestBody final UserDataUpdateRequest request) {
        final Long userId = request.getUserId();
        final String cvc = request.getValueToUpdate();

        try {
            this.userDataService.changeCvc(userId, cvc);

            return ResponseEntity.ok(new ApiResponse("CVC geändert."));
        } catch (final Exception e) {
            e.printStackTrace();
            LOGGER.error("Error updating new {} CVC for user {}", cvc, userId);
            return ResponseEntity.badRequest().body(new ApiResponse("Fehler: CVC nicht geändert!"));
        }
    }

    @PutMapping(UPDATE_NAME_ON_CARD)
    public ResponseEntity<ApiResponse> updateNameOnCard(@RequestBody final UserDataUpdateRequest request) {
        final Long userId = request.getUserId();
        final String nameOnCard = request.getValueToUpdate();

        try {
            this.userDataService.changeNameOnCard(userId, nameOnCard);

            return ResponseEntity.ok(new ApiResponse("Name auf der Karte geändert."));
        } catch (final Exception e) {
            e.printStackTrace();
            LOGGER.error("Error updating new {} name on card for user {}", nameOnCard, userId);
            return ResponseEntity.badRequest().body(new ApiResponse("Fehler: Name auf der Karte nicht geändert!"));
        }
    }

    @PutMapping(UPDATE_GEB)
    public ResponseEntity<ApiResponse> updateGeb(@RequestBody final UserDataUpdateRequest request) {
        final Long userId = request.getUserId();
        final String geb = request.getValueToUpdate();

        try {
            this.userDataService.changeGeb(userId, geb);

            return ResponseEntity.ok(new ApiResponse("Geburtstag geändert."));
        } catch (final Exception e) {
            e.printStackTrace();
            LOGGER.error("Error updating new {} birthday for user {}", geb, userId);
            return ResponseEntity.badRequest().body(new ApiResponse("Fehler: Geburtstag nicht geändert!"));
        }
    }

    @PutMapping(UPDATE_PLZ)
    public ResponseEntity<ApiResponse> updatePLZ(@RequestBody final UserDataUpdateRequest request) {
        final Long userId = request.getUserId();
        final String plz = request.getValueToUpdate();

        try {
            this.userDataService.changePLZ(userId, plz);

            return ResponseEntity.ok(new ApiResponse("PLZ geändert."));
        } catch (final Exception e) {
            e.printStackTrace();
            LOGGER.error("Error updating new {} PLZ for user {}", plz, userId);
            return ResponseEntity.badRequest().body(new ApiResponse("Fehler: PLZ nicht geändert!"));
        }
    }

    @PutMapping(UPDATE_STREET)
    public ResponseEntity<ApiResponse> updateStreet(@RequestBody final UserDataUpdateRequest request) {
        final Long userId = request.getUserId();
        final String street = request.getValueToUpdate();

        try {
            this.userDataService.changeStreet(userId, street);

            return ResponseEntity.ok(new ApiResponse("Straße geändert."));
        } catch (final Exception e) {
            e.printStackTrace();
            LOGGER.error("Error updating new {} street for user {}", street, userId);
            return ResponseEntity.badRequest().body(new ApiResponse("Fehler: Straße nicht geändert!"));
        }
    }

    @PutMapping(UPDATE_CITY)
    public ResponseEntity<ApiResponse> updateCity(@RequestBody final UserDataUpdateRequest request) {
        final Long userId = request.getUserId();
        final String city = request.getValueToUpdate();

        try {
            this.userDataService.changeStreet(userId, city);

            return ResponseEntity.ok(new ApiResponse("Stadt geändert."));
        } catch (final Exception e) {
            e.printStackTrace();
            LOGGER.error("Error updating new {} city for user {}", city, userId);
            return ResponseEntity.badRequest().body(new ApiResponse("Fehler: Stadt nicht geändert!"));
        }
    }
}
