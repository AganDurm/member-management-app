package de.fcb.userdata.adapter.db.userData.fetch;

import static de.fcb.userdata.adapter.db.utils.UserConstants.CROSS_ORIGIN;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import de.fcb.userdata.domain.services.userData.UserDataService;
import de.fcb.userdata.domain.userData.models.UserData;
import lombok.RequiredArgsConstructor;

/**
 * Rest controller to delete {@link UserData}.
 */
@SuppressWarnings("MissingJavadoc")
@RestController
@RequiredArgsConstructor
@CrossOrigin("http://localhost:4200")
public class FetchUserDataRestController {
    private static final Logger LOGGER = LoggerFactory.getLogger(FetchUserDataRestController.class);

    private static final String FETCH_USER_DATA_BY_USER_ID = "/members/{userId}";
    public static final String FETCH_ALL_USER_DATA = "/members";
    public static final String FETCH_ALL_MEMBERS_COUNT_DATA = "/members/countMembers";

    private final UserDataService userDataService;

    @GetMapping(FETCH_ALL_MEMBERS_COUNT_DATA)
    public ResponseEntity<Integer> countMembers() {
        try {
            final Integer userDataAll = this.userDataService.countUser();
            return ResponseEntity.ok(userDataAll);
        } catch (final Exception exception) {
            LOGGER.error("Members not found!");
            return ResponseEntity.badRequest().body(0);
        }
    }

    @GetMapping(FETCH_USER_DATA_BY_USER_ID)
    public ResponseEntity<UserData> fetchUserData(@PathVariable final String userId) {
        try {
            final Optional<UserData> userDataAll = this.userDataService.findById(userId);
            return userDataAll.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.badRequest().build());
        } catch (final Exception exception) {
            LOGGER.error("Data for {} not found!", userId);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping(FETCH_ALL_USER_DATA)
    public ResponseEntity<List<UserData>> fetchExcelData() {
        try {
            final List<UserData> userDataAll = this.userDataService.findAll();

            LOGGER.info("{} user data found!", userDataAll.size());
            return ResponseEntity.ok(userDataAll);
        } catch (final Exception e) {
            e.printStackTrace();
            LOGGER.error("Data not found!");
            return ResponseEntity.badRequest().build();
        }
    }
}
