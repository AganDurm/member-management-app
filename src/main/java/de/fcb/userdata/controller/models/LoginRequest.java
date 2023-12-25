package de.fcb.userdata.controller.models;

import lombok.Getter;
import lombok.Setter;

/**
 * Containing the user's login credentials
 */
@Getter
@Setter
public class LoginRequest {
    private String username;
    private String password;
}
