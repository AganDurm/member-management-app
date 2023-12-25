package de.fcb.userdata;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import de.fcb.userdata.utils.AppConstants;

/**
 * UserdataApplication is the main entry point for the Spring Boot application focused on user management.
 * This class is annotated with @SpringBootApplication, which is a convenience annotation that adds all of the following:
 * - @Configuration: Tags the class as a source of bean definitions for the application context.
 * - @EnableAutoConfiguration: Tells Spring Boot to start adding beans based on classpath settings, other beans, and various property settings.
 * - @ComponentScan: Tells Spring to look for other components, configurations, and services in the 'de.fcb.userdata' package, allowing it to find and register all Spring components.
 *
 * The main method uses SpringApplication.run to bootstrap the application, starting the auto-configuration process, and creating the Spring application context.
 * This class can also be used to define additional beans and configurations if required.
 *
 * Additionally, this class can be extended to include custom initialization code or to implement CommandLineRunner or ApplicationRunner interfaces
 * for running specific pieces of code after the Spring application context is initialized.
 *
 * Usage Example:
 * <pre>{@code
 * public static void main(String[] args) {
 *     SpringApplication.run(UserdataApplication.class, args);
 * }
 * }</pre>
 *
 * @author durmex
 * @version 1.0
 */
@SpringBootApplication
public class UserdataApplication {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserdataApplication.class);

    /**
     * The main method acts as the entry point for the Spring Boot application.
     * It delegates to {@link SpringApplication#run} to bootstrap the application, which includes setting up the application context,
     * registering all Spring components, and starting the embedded web server if Spring Web is in the classpath.
     *
     * @param args Command line arguments passed to the application. Can be used to customize application startup behavior.
     */
    public static void main(final String[] args) {
        SpringApplication.run(UserdataApplication.class, args);
        LOGGER.info(AppConstants.LOGGER_LOGO);
    }

}
