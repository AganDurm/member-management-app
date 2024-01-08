package de.fcb.userdata.domain.services.orders;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import de.fcb.userdata.domain.orders.OrdersRepository;
import de.fcb.userdata.domain.orders.models.Orders;
import lombok.RequiredArgsConstructor;

/**
 * Fetches the {@link Orders}.
 */
@SuppressWarnings({ "MissingJavadoc", "java:S112", "FeatureEnvy", "LawOfDemeter" })
@Service
@Transactional
@RequiredArgsConstructor
public class OrdersService {
    private final OrdersRepository ordersRepository;

    public List<Orders> findAll() {
        return this.ordersRepository.findAll();
    }

    public Optional<Orders> findById(final Long id) {
        return this.ordersRepository.findById(id);
    }

    public Orders findByName(final String name) {
        return this.ordersRepository.findByName(name);
    }

    public void saveAll(final List<Orders> orders) {
        this.ordersRepository.saveAll(orders);
    }

    public void updateOrder(final Orders order) {
        final Orders orderByName = this.ordersRepository.findByName(order.getName());
        if(orderByName != null) {
            orderByName.setKat1(order.getKat1());
            orderByName.setKat2(order.getKat2());
            orderByName.setKat3(order.getKat3());
            orderByName.setKat4(order.getKat4());
            orderByName.setKat4platinum(order.getKat4platinum());
            orderByName.setKat4hunderts(order.getKat4hunderts());
            this.ordersRepository.save(orderByName);
        }
    }

    public void deleteOrderByName(final Long gameId) {
        this.ordersRepository.deleteById(gameId);
    }
}
