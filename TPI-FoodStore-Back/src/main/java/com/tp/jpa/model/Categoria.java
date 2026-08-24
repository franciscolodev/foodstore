package com.tp.jpa.model;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Categoria extends Base {

    private String nombre;
    private String description; // Atributo solicitado en la HU del parcial

    @OneToMany(mappedBy = "categoria")
    private List<Producto> productos = new ArrayList<>();

    public Categoria() {}

    public Categoria(String nombre, String description) {
        this.nombre = nombre;
        this.description = description;
    }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<Producto> getProductos() { return productos; }
    public void setProductos(List<Producto> productos) { this.productos = productos; }
}