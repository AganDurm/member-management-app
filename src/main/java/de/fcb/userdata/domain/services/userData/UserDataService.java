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

    public Optional<UserData> findById(final String id) {
        return this.userRepository.findById(id);
    }

    public void saveAll(final List<UserData> userData) {
        this.userRepository.saveAll(userData);
    }

    public void toggleUserActiveStatus(final String userId) {
        final Optional<UserData> existingUser = this.userRepository.findById(userId);

        if (existingUser.isPresent()) {
            existingUser.get().setActive(!existingUser.get().isActive());
            this.userRepository.save(existingUser.get());
        }
    }

    public void changeUsernameByUserId(final String userId, final String username) {
        final Optional<UserData> existingUser = this.userRepository.findById(userId);

        if (existingUser.isPresent()) {
            final UserData user = existingUser.get();
            user.setUsername(username);
            this.userRepository.save(user);
        }
    }

    public void changeKundennummerByUserId(final String userId, final String kundennummer) {
        final Optional<UserData> existingUser = this.userRepository.findById(userId);

        if (existingUser.isPresent()) {
            final UserData user = existingUser.get();
            user.setKundennummer(kundennummer);
            this.userRepository.save(user);
        }
    }

    public void changeMitgliedsnummerByUserId(final String userId, final String mitgliedsnummer) {
        final Optional<UserData> existingUser = this.userRepository.findById(userId);

        if (existingUser.isPresent()) {
            final UserData user = existingUser.get();
            user.setMitgliedsnummer(mitgliedsnummer);
            this.userRepository.save(user);
        }
    }

    public void changePasswordByUserId(final String userId, final String password) {
        final Optional<UserData> existingUser = this.userRepository.findById(userId);

        if (existingUser.isPresent()) {
            final UserData user = existingUser.get();
            user.setPassword(password);
            this.userRepository.save(user);
        }
    }

    public void deleteUserById(final String userId) {
        this.userRepository.deleteById(userId);
    }

    public void deleteAllEntries() {
        this.userRepository.deleteAll();
    }
}
