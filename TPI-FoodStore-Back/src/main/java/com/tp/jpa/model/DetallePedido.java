package com.tp.jpa.model;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class DetallePedido extends Base {

    private int cantidad;
    private Double subtotal;

    @ManyToOne
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "producto_id")
    private Producto producto;

    public DetallePedido() {}

    public DetallePedido(int cantidad, Producto producto, Pedido pedido) {
        this.cantidad = cantidad;
        this.producto = producto;
        this.pedido = pedido;
        this.subtotal = producto.getPrecio() * cantidad;
    }

    public int getCantidad() { return cantidad; }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }

    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }

    public Pedido getPedido() { return pedido; }
    public void setPedido(Pedido pedido) { this.pedido = pedido; }

    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }
}