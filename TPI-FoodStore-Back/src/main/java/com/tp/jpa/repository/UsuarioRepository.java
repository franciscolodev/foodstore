package com.tp.jpa.repository;

/* TPI - Programación III - Francisco López */
import com.tp.jpa.model.Usuario;
import com.tp.jpa.util.JPAUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.TypedQuery;
import java.util.Optional;

public class UsuarioRepository extends BaseRepository<Usuario> {

    public UsuarioRepository() {
        super(Usuario.class);
    }

    public Optional<Usuario> buscarPorEmail(String mail) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        try {
            String jpql = "SELECT u FROM Usuario u WHERE u.mail = :mail AND u.eliminado = false";
            TypedQuery<Usuario> query = em.createQuery(jpql, Usuario.class);
            query.setParameter("mail", mail);
            return query.getResultList().stream().findFirst();
        } finally {
            if (em != null && em.isOpen()) {
                em.close();
            }
        }
    }

    /**
     * Añadido para el menú del TPI: Maneja la baja lógica del usuario.
     */
    public boolean eliminarLogico(Long id) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            Usuario usuario = em.find(Usuario.class, id);
            if (usuario != null && !usuario.isEliminado()) {
                tx.begin();
                usuario.setEliminado(true);
                em.merge(usuario);
                tx.commit();
                return true;
            }
            return false;
        } catch (Exception e) {
            if (tx != null && tx.isActive()) tx.rollback();
            return false;
        } finally {
            if (em != null && em.isOpen()) {
                em.close();
            }
        }
    }
}