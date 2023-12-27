package de.fcb.userdata.domain.userData;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import de.fcb.userdata.domain.userData.models.UserData;
import jakarta.annotation.Nonnull;

/**
 * Repository for {@link UserData} domain objects.
 */
@SuppressWarnings({ "SqlDialectInspection", "SqlResolve", "NullableProblems" })
@Repository
public interface UserDataRepository extends JpaRepository<UserData, Long> {

    @Nonnull
    @Override
    List<UserData> findAll();
}
