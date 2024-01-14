package de.fcb.userdata.adapter.db.orders.update;

import static de.fcb.userdata.utils.AppConstants.ROOT_ORIGIN;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import de.fcb.userdata.adapter.api.response.ApiResponse;
import de.fcb.userdata.domain.mail.EmailDetails;
import de.fcb.userdata.domain.mail.EmailService;
import de.fcb.userdata.domain.orders.models.Orders;
import de.fcb.userdata.domain.services.orders.OrdersService;
import lombok.RequiredArgsConstructor;

/**
 * Excel controller to handle the update of {@link Orders}.
 */
@SuppressWarnings("MissingJavadoc")
@RestController
@RequiredArgsConstructor
@CrossOrigin(ROOT_ORIGIN)
public class UpdateOrdersRestController {
    private static final Logger LOGGER = LoggerFactory.getLogger(UpdateOrdersRestController.class);

    private static final String UPDATE_ORDER_BY_NAME = "/orders/updateOrder";

    private final OrdersService ordersService;
    private final EmailService emailService;

    @SuppressWarnings({ "LawOfDemeter", "FeatureEnvy" })
    @PutMapping(UPDATE_ORDER_BY_NAME)
    public ResponseEntity<ApiResponse> updateOrder(@RequestBody final Orders order) {
        try {
            this.ordersService.updateOrder(order);
            final List<String> recipients = List.of("durmisevicagan@outlook.de");
            final String orderName = String.format("Bestellung für das Spiel %s", order.getName());
            final String orders = String.format("Aktuelle Bestellung für das Spiel %s: %n" +
                            "Kat. 1: %s %n" +
                            "Kat. 2: %s %n" +
                            "Kat. 3: %s %n" +
                            "Kat. 4: %s %n" +
                            "Kat. 1 Einzeln: %s %n" +
                            "Kat. 2 Einzeln: %s %n" +
                            "Kat. 3 Einzeln: %s %n" +
                            "Kat. 4 Einzeln: %s %n" +
                            "Kat. 1 1xx: %s %n" +
                            "Kat. 1 Blöcke: %s %n",
                    order.getName(),
                    order.getKat1(),
                    order.getKat2(),
                    order.getKat3(),
                    order.getKat4(),
                    order.getKat1single(),
                    order.getKat2single(),
                    order.getKat3single(),
                    order.getKat4single(),
                    order.getKat4hunderts(),
                    order.getKat4platinum());
            final EmailDetails details = EmailDetails.builder()
                    .subject(orderName)
                    .msgBody(orders)
                    .recipient(recipients)
                    .build();
            final String status = this.emailService.sendSimpleMail(details);

            return ResponseEntity.ok(new ApiResponse("Die Bestellung für das Spiel erfolgreich geändert." + status));
        } catch (final Exception e) {
            e.printStackTrace();
            LOGGER.error("Error updating order for game {}", order.getName());
            return ResponseEntity.badRequest().body(new ApiResponse("Fehler: Die Bestellung für das Spiel wurde nicht geändert."));
        }
    }
}
