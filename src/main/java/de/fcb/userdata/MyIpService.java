package de.fcb.userdata;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.stereotype.Service;

@SuppressWarnings({"MissingJavadoc", "java:S2142"})
@Service
public class MyIpService {
    protected static final String FIREBASE_PROJECT_ID = "member-management-applic-bf256";
    protected static final String FIREBASE_COLLECTION = "ip_addresses";
    protected static final int STATUS_OK = 200;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<String> getAllowedIps() {
        try {
            final HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI("https://firestore.googleapis.com/v1/projects/" + FIREBASE_PROJECT_ID + "/databases/(default)/documents/" + FIREBASE_COLLECTION))
                    .GET()
                    .build();

            final HttpResponse<String> response = this.httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == STATUS_OK) {
                return parseFirestoreResponse(response.body());
            } else {
                return List.of();
            }
        } catch (final IOException | URISyntaxException | InterruptedException exception) {
            exception.printStackTrace();
            return List.of();
        }
    }

    private List<String> parseFirestoreResponse(final String responseJson) throws IOException {
        final List<String> ipAddresses = new ArrayList<>();
        final JsonNode root = this.objectMapper.readTree(responseJson);

        if (root.has("documents")) {
            for (final JsonNode document : root.get("documents")) {
                final JsonNode fields = document.get("fields");
                if (fields != null && fields.has("ip")) {
                    final JsonNode ipNode = fields.get("ip");
                    if (ipNode != null && ipNode.has("stringValue")) {
                        final String ipAddress = ipNode.get("stringValue").asText();
                        ipAddresses.add(ipAddress);
                    }
                }
            }
        }

        return ipAddresses;
    }
}
