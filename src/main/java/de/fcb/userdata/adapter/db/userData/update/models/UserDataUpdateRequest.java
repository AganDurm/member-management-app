package de.fcb.userdata.adapter.db.userData.update.models;

import de.fcb.userdata.domain.userData.models.UserData;
import lombok.Getter;
import lombok.Setter;

/**
 * Object that holds user ID and new value to update the {@link UserData} by id.
 */
@Getter
@Setter
public class UserDataUpdateRequest {
    private Long userId;
    private String valueToUpdate;
}
