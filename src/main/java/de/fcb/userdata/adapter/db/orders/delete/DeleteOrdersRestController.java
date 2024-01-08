package de.fcb.userdata.adapter.db.orders.delete;

import static de.fcb.userdata.utils.AppConstants.ROOT_ORIGIN;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import de.fcb.userdata.adapter.api.response.ApiResponse;
import de.fcb.userdata.domain.orders.models.Orders;
import de.fcb.userdata.domain.services.orders.OrdersService;
import lombok.RequiredArgsConstructor;

/**
 * Excel controller to handle the creation of {@link Orders}.
 */
@SuppressWarnings({ "FeatureEnvy", "LawOfDemeter", "MissingJavadoc" })
@RestController
@RequiredArgsConstructor
@CrossOrigin(ROOT_ORIGIN)
public class DeleteOrdersRestController {
    private static final Logger LOGGER = LoggerFactory.getLogger(DeleteOrdersRestController.class);

    private final OrdersService ordersService;

    public static final String DELETE_ORDERS_RESOURCE_URL = "/orders/deleteOrder/{gameId}";

    @DeleteMapping(DELETE_ORDERS_RESOURCE_URL)
    public ResponseEntity<ApiResponse> deleteGameByName(@PathVariable final Long gameId) {
        try {
            this.ordersService.deleteOrderByName(gameId);
            return ResponseEntity.ok(new ApiResponse("Die Bestellung wurde gelöscht."));
        } catch (final Exception exception) {
            exception.printStackTrace();
            return ResponseEntity.badRequest().body(new ApiResponse("Fehler: Die Bestellung wurde nicht gelöscht."));
        }
    }
}
