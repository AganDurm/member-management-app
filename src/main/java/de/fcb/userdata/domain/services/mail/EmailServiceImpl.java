package de.fcb.userdata.domain.services.mail;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import de.fcb.userdata.domain.mail.EmailDetails;
import de.fcb.userdata.domain.mail.EmailService;
import lombok.Setter;

@SuppressWarnings({ "MissingJavadoc", "FeatureEnvy" })
@Service
@Setter
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String sender;

    @Override
    public String sendSimpleMail(final EmailDetails details) {
        try {
            final SimpleMailMessage mailMessage = new SimpleMailMessage();
            final List<String> recipients = details.getRecipient();
            final String[] recipientsArray = recipients.toArray(new String[0]);

            mailMessage.setFrom(this.sender);
            mailMessage.setTo(recipientsArray);
            mailMessage.setText(details.getMsgBody());
            mailMessage.setSubject(details.getSubject());

            this.javaMailSender.send(mailMessage);
            return "E-Mail gesendet.";
        } catch (final Exception e) {
            return "Error: E-Mail nicht gesendet.";
        }
    }
}
