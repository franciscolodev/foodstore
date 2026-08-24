package com.tp.jpa.repository;

import com.tp.jpa.model.Base;
import com.tp.jpa.util.JPAUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import java.util.List;
import java.util.Optional;

public abstract class BaseRepository<T extends Base> {

    protected final Class<T> entityClass;

    public BaseRepository(Class<T> entityClass) {
        this.entityClass = entityClass;
    }

    public T guardar(T entity) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            T mergeada = em.merge(entity);
            tx.commit();
            return mergeada;
        } catch (Exception e) {
            if (tx != null && tx.isActive()) tx.rollback();
            throw new RuntimeException("Error al guardar en " + entityClass.getSimpleName(), e);
        } finally {
            if (em != null && em.isOpen()) em.close();
        }
    }

    public Optional<T> buscarPorId(Long id) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        try {
            return Optional.ofNullable(em.find(entityClass, id));
        } finally {
            if (em != null && em.isOpen()) em.close();
        }
    }

    public List<T> listarActivos() {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        try {
            String jpql = "SELECT e FROM " + entityClass.getSimpleName() + " e WHERE e.eliminado = false";
            return em.createQuery(jpql, entityClass).getResultList();
        } finally {
            if (em != null && em.isOpen()) em.close();
        }
    }

    public boolean eliminarLogico(Long id) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            T entity = em.find(entityClass, id);
            if (entity != null && !entity.isEliminado()) {
                tx.begin();
                entity.setEliminado(true);
                em.merge(entity);
                tx.commit();
                return true;
            }
            return false;
        } catch (Exception e) {
            if (tx != null && tx.isActive()) tx.rollback();
            return false;
        } finally {
            if (em != null && em.isOpen()) em.close();
        }
    }
}