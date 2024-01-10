package de.fcb.userdata.domain.userFiles;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import de.fcb.userdata.domain.userFiles.models.UserFile;

/**
 * Repository for {@link UserFile} domain objects.
 */
@SuppressWarnings({ "SqlDialectInspection", "SqlResolve", "MissingJavadoc" })
@Repository
public interface UserFileRepository extends JpaRepository<UserFile, Long> {

    List<UserFile> findByUserDataId(final Long userId);
    List<UserFile> findByUserDataIdAndGame(final Long userId, final String game);

    UserFile findFirstByUserDataIdAndFileName(final Long userId, final String fileName);

    List<UserFile> findAllByGame(final String game);

    @Transactional
    @Modifying
    @Query("DELETE FROM UserFile uf WHERE uf.userData.id = :userId AND uf.fileName = :fileName")
    void deleteByUserDataIdAndFileName(@Param("userId") Long userId, @Param("fileName") String fileName);
}
