package com.tp.jpa.model;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Producto extends Base {

    private String nombre;
    private Double precio;
    private String description;
    private int stock;
    private String imagen;
    private Boolean disponible = true;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    public Producto() {}

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }

    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }

    public Boolean getDisponible() { return disponible; }
    public void setDisponible(Boolean disponible) { this.disponible = disponible; }

    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }
}