package de.fcb.userdata.domain.mail;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Descriobes the email details.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmailDetails {
    private List<String> recipient;
    private String msgBody;
    private String subject;
}
