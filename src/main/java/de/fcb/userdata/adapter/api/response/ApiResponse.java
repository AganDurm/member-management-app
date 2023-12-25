package de.fcb.userdata.adapter.api.response;

@SuppressWarnings("MissingJavadoc")
public class ApiResponse {
    private final String message;

    public ApiResponse(final String message) {
        this.message = message;
    }

    public String getMessage() {
        return this.message;
    }
}
