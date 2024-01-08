package de.fcb.userdata.domain.orders;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import de.fcb.userdata.domain.orders.models.Orders;
import jakarta.annotation.Nonnull;

/**
 * Repository for {@link Orders} domain objects.
 */
@SuppressWarnings({ "SqlDialectInspection", "SqlResolve", "NullableProblems", "MissingJavadoc" })
@Repository
public interface OrdersRepository extends JpaRepository<Orders, Long> {

    @Nonnull
    @Override
    List<Orders> findAll();

    Orders findByName(String name);
}
