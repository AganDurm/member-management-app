package de.fcb.userdata.adapter.db.orders.fetch;

import static de.fcb.userdata.utils.AppConstants.ROOT_ORIGIN;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import de.fcb.userdata.domain.orders.models.Orders;
import de.fcb.userdata.domain.services.orders.OrdersService;
import lombok.RequiredArgsConstructor;

/**
 * Rest controller to delete {@link Orders}.
 */
@SuppressWarnings("MissingJavadoc")
@RestController
@RequiredArgsConstructor
@CrossOrigin(ROOT_ORIGIN)
public class FetchOrdersRestController {
    private static final Logger LOGGER = LoggerFactory.getLogger(FetchOrdersRestController.class);

    public static final String FETCH_ALL_ORDERS = "/orders";

    private final OrdersService ordersService;

    @GetMapping(FETCH_ALL_ORDERS)
    public ResponseEntity<List<Orders>> fetchExcelData() {
        try {
            final List<Orders> allOrders = this.ordersService.findAll();

            LOGGER.info("{} orders found!", allOrders.size());
            return ResponseEntity.ok(allOrders);
        } catch (final Exception e) {
            e.printStackTrace();
            LOGGER.error("Orders not found!");
            return ResponseEntity.badRequest().build();
        }
    }
}
