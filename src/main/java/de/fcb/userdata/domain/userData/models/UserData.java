package de.fcb.userdata.domain.userData.models;

import jakarta.annotation.Nonnull;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Domain object and entity for user data.
 */
@SuppressWarnings({ "JpaDataSourceORMInspection", "SpellCheckingInspection" })
@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED, force = true)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Entity
@Table(name = "userInfo")
public class UserData {
    @Id
    @Nonnull
    private String id;

    private String username;
    private String password;
    private boolean active;
    private String mitgliedsnummer;
    private String kundennummer;
}
