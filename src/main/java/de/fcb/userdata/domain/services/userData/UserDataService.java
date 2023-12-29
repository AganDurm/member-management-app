package de.fcb.userdata.domain.services.userData;


import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import de.fcb.userdata.domain.userData.UserDataRepository;
import de.fcb.userdata.domain.userData.models.UserData;
import lombok.RequiredArgsConstructor;

/**
 * Fetches the {@link UserData}.
 */
@SuppressWarnings({ "MissingJavadoc", "java:S112" })
@Service
@Transactional
@RequiredArgsConstructor
public class UserDataService {

    private final UserDataRepository userRepository;

    public List<UserData> findAll() {
        return this.userRepository.findAll();
    }

    public Integer countUser() {
        return this.userRepository.findAll().size();
    }

    public Optional<UserData> findById(final Long id) {
        return this.userRepository.findById(id);
    }

    public UserData findByEmail(final String email) {
        return this.userRepository.findByEmail(email);
    }

    public void saveAll(final List<UserData> userData) {
        this.userRepository.saveAll(userData);
    }

    public void toggleUserActiveStatus(final Long userId) {
        final Optional<UserData> existingUser = this.userRepository.findById(userId);

        if (existingUser.isPresent()) {
            existingUser.get().setActive(!existingUser.get().isActive());
            this.userRepository.save(existingUser.get());
        }
    }

    public void changeUsernameByUserId(final Long userId, final String username) {
        final Optional<UserData> existingUser = this.userRepository.findById(userId);

        if (existingUser.isPresent()) {
            final UserData user = existingUser.get();
            user.setUsername(username);
            this.userRepository.save(user);
        }
    }

    public void changeKundennummerByUserId(final Long userId, final String kundennummer) {
        final Optional<UserData> existingUser = this.userRepository.findById(userId);

        if (existingUser.isPresent()) {
            final UserData user = existingUser.get();
            user.setKundennummer(kundennummer);
            this.userRepository.save(user);
        }
    }

    public void changeMitgliedsnummerByUserId(final Long userId, final String mitgliedsnummer) {
        final Optional<UserData> existingUser = this.userRepository.findById(userId);

        if (existingUser.isPresent()) {
            final UserData user = existingUser.get();
            user.setMitgliedsnummer(mitgliedsnummer);
            this.userRepository.save(user);
        }
    }

    public void changePasswordByUserId(final Long userId, final String password) {
        final Optional<UserData> existingUser = this.userRepository.findById(userId);

        if (existingUser.isPresent()) {
            final UserData user = existingUser.get();
            user.setPassword(password);
            this.userRepository.save(user);
        }
    }

    public void changeCardNumberByUserId(final Long userId, final String cardNumber) {
        final Optional<UserData> existingUser = this.userRepository.findById(userId);

        if (existingUser.isPresent()) {
            final UserData user = existingUser.get();
            user.setCardnumber(cardNumber);
            this.userRepository.save(user);
        }
    }

    public void changeVisaOrMc(final Long userId, final String visaormc) {
        final Optional<UserData> existingUser = this.userRepository.findById(userId);

        if (existingUser.isPresent()) {
            final UserData user = existingUser.get();
            user.setVisaormc(visaormc);
            this.userRepository.save(user);
        }
    }

    public void changeYear(final Long userId, final String year) {
        final Optional<UserData> existingUser = this.userRepository.findById(userId);

        if (existingUser.isPresent()) {
            final UserData user = existingUser.get();
            user.setYear(year);
            this.userRepository.save(user);
        }
    }

    public void changeMonth(final Long userId, final String month) {
        final Optional<UserData> existingUser = this.userRepository.findById(userId);

        if (existingUser.isPresent()) {
            final UserData user = existingUser.get();
            user.setMonth(month);
            this.userRepository.save(user);
        }
    }

    public void changeCvc(final Long userId, final String cvc) {
        final Optional<UserData> existingUser = this.userRepository.findById(userId);

        if (existingUser.isPresent()) {
            final UserData user = existingUser.get();
            user.setCvc(cvc);
            this.userRepository.save(user);
        }
    }

    public void changeNameOnCard(final Long userId, final String nameOnCard) {
        final Optional<UserData> existingUser = this.userRepository.findById(userId);

        if (existingUser.isPresent()) {
            final UserData user = existingUser.get();
            user.setNameoncard(nameOnCard);
            this.userRepository.save(user);
        }
    }

    public void changeGeb(final Long userId, final String geb) {
        final Optional<UserData> existingUser = this.userRepository.findById(userId);

        if (existingUser.isPresent()) {
            final UserData user = existingUser.get();
            user.setGeb(geb);
            this.userRepository.save(user);
        }
    }

    public void changePLZ(final Long userId, final String plz) {
        final Optional<UserData> existingUser = this.userRepository.findById(userId);

        if (existingUser.isPresent()) {
            final UserData user = existingUser.get();
            user.setPlz(plz);
            this.userRepository.save(user);
        }
    }

    public void changeStreet(final Long userId, final String street) {
        final Optional<UserData> existingUser = this.userRepository.findById(userId);

        if (existingUser.isPresent()) {
            final UserData user = existingUser.get();
            user.setStreet(street);
            this.userRepository.save(user);
        }
    }

    public void changeCity(final Long userId, final String city) {
        final Optional<UserData> existingUser = this.userRepository.findById(userId);

        if (existingUser.isPresent()) {
            final UserData user = existingUser.get();
            user.setCity(city);
            this.userRepository.save(user);
        }
    }

    public void deleteUserById(final Long userId) {
        this.userRepository.deleteById(userId);
    }

    public void deleteAllEntries() {
        this.userRepository.deleteAll();
    }
}
