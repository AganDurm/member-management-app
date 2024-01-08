package de.fcb.userdata.adapter.db.orders.update;

import static de.fcb.userdata.utils.AppConstants.ROOT_ORIGIN;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import de.fcb.userdata.adapter.api.response.ApiResponse;
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

    @PutMapping(UPDATE_ORDER_BY_NAME)
    public ResponseEntity<ApiResponse> updateOrder(@RequestBody final Orders order) {
        try {
            this.ordersService.updateOrder(order);

            return ResponseEntity.ok(new ApiResponse("Die Bestellung für das Spiel erfolgreich geändert."));
        } catch (final Exception e) {
            e.printStackTrace();
            LOGGER.error("Error updating order for game {}", order.getName());
            return ResponseEntity.badRequest().body(new ApiResponse("Fehler: Die Bestellung für das Spiel wurde nicht geändert."));
        }
    }
}
