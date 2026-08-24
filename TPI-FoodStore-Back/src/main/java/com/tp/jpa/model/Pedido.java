package com.tp.jpa.model;

/* TPI - Programación III - Francisco López */
import com.tp.jpa.model.enums.Estado;
import com.tp.jpa.model.enums.FormaPago;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Pedido extends Base implements Calculable {

    private String fecha;

    @Enumerated(EnumType.STRING)
    private Estado estado;

    private Double total = 0.0;

    @Enumerated(EnumType.STRING)
    private FormaPago formaPago;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetallePedido> detalles = new ArrayList<>();

    public Pedido() {}

    public Pedido(Estado estado, FormaPago formaPago, Usuario usuario) {
        this.estado = estado;
        this.formaPago = formaPago;
        this.usuario = usuario;
    }

    public void addDetallePedido(int cantidad, Producto producto) {
        DetallePedido detalle = new DetallePedido(cantidad, producto, this);
        this.detalles.add(detalle);
        calcularTotal();
    }

    @Override
    public void calcularTotal() {
        this.total = 0.0;
        for (DetallePedido det : detalles) {
            this.total += det.getSubtotal();
        }
    }

    // Getters y Setters alineados estrictamente con el flujo del TPI
    public String getFecha() { return fecha; }
    public void setFecha(String fecha) { this.fecha = fecha; }

    public Estado getEstado() { return estado; }
    public void setEstado(Estado estado) { this.estado = estado; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public FormaPago getFormaPago() { return formaPago; }
    public void setFormaPago(FormaPago formaPago) { this.formaPago = formaPago; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public List<DetallePedido> getDetalles() { return detalles; }
    public void setDetalles(List<DetallePedido> detalles) { this.detalles = detalles; }
}