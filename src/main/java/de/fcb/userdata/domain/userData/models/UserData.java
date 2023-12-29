package de.fcb.userdata.domain.userData.models;

import jakarta.annotation.Nonnull;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Nonnull
    private String email;
    private String username;
    private String password;
    private boolean active;
    private String mitgliedsnummer;
    private String kundennummer;
    private String cardnumber;
    private String visaormc;
    private String month;
    private String year;
    private String cvc;
    private String nameoncard;
    private String geb;
    private String street;
    private String plz;
    private String city;
}
