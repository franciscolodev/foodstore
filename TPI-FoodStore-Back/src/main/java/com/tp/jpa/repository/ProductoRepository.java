package com.tp.jpa.repository;

import com.tp.jpa.model.Producto;
import com.tp.jpa.util.JPAUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import java.util.List;

public class ProductoRepository extends BaseRepository<Producto> {

    public ProductoRepository() {
        super(Producto.class);
    }

    /**
     * Consulta JPQL que busca productos activos asociados a una categoría específica.
     * Filtra estrictamente por la condición de p.eliminado = false.
     * Usa un parámetro nombrado ":categoriaId" y TypedQuery sin casteos manuales.
     */
    public List<Producto> buscarPorCategoria(Long categoriaId) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        try {
            String jpql = "SELECT p FROM Producto p WHERE p.categoria.id = :categoriaId AND p.eliminado = false";
            TypedQuery<Producto> query = em.createQuery(jpql, Producto.class);
            query.setParameter("categoriaId", categoriaId);
            return query.getResultList();
        } finally {
            if (em != null && em.isOpen()) {
                em.close();
            }
        }
    }
}