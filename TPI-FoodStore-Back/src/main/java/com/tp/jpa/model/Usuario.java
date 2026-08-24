package com.tp.jpa.model;

import com.tp.jpa.model.enums.Rol;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Usuario extends Base {

    private String nombre;
    private String apellido;
    private String mail;
    private String celular;
    private String contraseña;

    @Enumerated(EnumType.STRING)
    private Rol rol;

    @OneToMany(mappedBy = "usuario")
    private List<Pedido> pedidos = new ArrayList<>();

    public Usuario() {}

    public Usuario(String nombre, String apellido, String mail, String celular, String contraseña, Rol rol) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.mail = mail;
        this.celular = celular;
        this.contraseña = contraseña;
        this.rol = rol;
    }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getMail() { return mail; }
    public void setMail(String mail) { this.mail = mail; }

    public String getCelular() { return celular; }
    public void setCelular(String celular) { this.celular = celular; }

    public String getContraseña() { return contraseña; }
    public void setContraseña(String contraseña) { this.contraseña = contraseña; }

    public Rol getRol() { return rol; }
    public void setRol(Rol rol) { this.rol = rol; }

    public List<Pedido> getPedidos() { return pedidos; }
    public void setPedidos(List<Pedido> pedidos) { this.pedidos = pedidos; }
}