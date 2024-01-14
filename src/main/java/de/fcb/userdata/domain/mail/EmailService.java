package de.fcb.userdata.domain.mail;

@SuppressWarnings("MissingJavadoc")
public interface EmailService {

    String sendSimpleMail(EmailDetails details);

}
