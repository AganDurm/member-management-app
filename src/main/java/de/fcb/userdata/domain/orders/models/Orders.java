package de.fcb.userdata.domain.orders.models;

import jakarta.annotation.Nonnull;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Domain object and entity for orders.
 */
@SuppressWarnings({ "JpaDataSourceORMInspection", "SpellCheckingInspection" })
@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED, force = true)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Entity
@Table(name = "orders")
public class Orders {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Nonnull
    private String name;
    private int kat1;
    private int kat2;
    private int kat3;
    private int kat4;
    private int kat4platinum;
    private int kat4hunderts;
    private int kat1single;
    private int kat2single;
    private int kat3single;
    private int kat4single;
}

