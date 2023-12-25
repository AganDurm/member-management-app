package de.fcb.userdata.domain.services.userFiles;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import de.fcb.userdata.domain.userFiles.UserFileRepository;
import de.fcb.userdata.domain.userFiles.models.UserFile;
import lombok.RequiredArgsConstructor;

@SuppressWarnings({ "MissingJavadoc", "java:S112" })
@Service
@Transactional
@RequiredArgsConstructor
public class UserFileService {

    private final UserFileRepository userFileRepository;

    @SuppressWarnings("unused")
    public List<UserFile> findAll() {
        return this.userFileRepository.findAll();
    }

    public void saveUserFile(final UserFile userFile) {
        this.userFileRepository.save(userFile);
    }

    public void saveUserFiles(final List<UserFile> userFiles) {
        this.userFileRepository.saveAll(userFiles);
    }

    public List<UserFile> getUserFilesByUserId(final String id) {
        return this.userFileRepository.findByUserDataId(id);
    }

    public UserFile findFirstByUserDataIdAndFileName(final String userId, final String fileName) {
        return this.userFileRepository.findFirstByUserDataIdAndFileName(userId, fileName);
    }

    public UserFile getUserFileById(final Long fileId) {
        return this.userFileRepository.findById(fileId).orElse(null);
    }

    public void deleteFile(final String userId, final String fileName) {
        this.userFileRepository.deleteByUserDataIdAndFileName(userId, fileName);
    }

    public void deleteAllFiles() {
        this.userFileRepository.deleteAll();
    }
}
