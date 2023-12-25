package de.fcb.userdata.adapter.db.userFiles.create.exceptions;

/**
 * Custom exception for {@link RuntimeException}.
 */
public class DirectoryCreationException extends RuntimeException {

    @SuppressWarnings("MissingJavadoc")
    public DirectoryCreationException(final String directory) {
        super("Failed to create directory: " + directory);
    }
}
