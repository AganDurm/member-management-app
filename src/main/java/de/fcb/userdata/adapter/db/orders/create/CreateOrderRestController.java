package de.fcb.userdata.adapter.db.orders.create;

import static de.fcb.userdata.utils.AppConstants.ROOT_ORIGIN;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
public class CreateOrderRestController {
    private static final Logger LOGGER = LoggerFactory.getLogger(CreateOrderRestController.class);

    private final OrdersService ordersService;

    public static final String CREATE_ORDERS_RESOURCE_URL = "/orders/create";

    @PostMapping(CREATE_ORDERS_RESOURCE_URL)
    public ResponseEntity<ApiResponse> createOrder(@RequestBody final Orders order) {
        try {
            LOGGER.info("Order with Name {} created.", order.getName());
            final Orders orders = Orders.builder()
                    .name(order.getName())
                    .kat1(order.getKat1())
                    .kat2(order.getKat2())
                    .kat3(order.getKat3())
                    .kat4(order.getKat4())
                    .kat4hunderts(order.getKat4hunderts())
                    .kat4platinum(order.getKat4platinum())
                    .build();
            this.ordersService.saveAll(List.of(orders));
            return ResponseEntity.ok(new ApiResponse("Bestellung erstellt."));
        } catch (final Exception exception) {
            exception.printStackTrace();
            return ResponseEntity.badRequest().body(new ApiResponse("Fehler: Bestellung nicht erstellt."));
        }
    }
}
