package com.tp.jpa.repository;

/* TPI - Programación III - Francisco López */
import com.tp.jpa.model.Pedido;
import com.tp.jpa.model.enums.Estado;
import com.tp.jpa.util.JPAUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import java.util.List;

public class PedidoRepository extends BaseRepository<Pedido> {

    public PedidoRepository() {
        super(Pedido.class);
    }

    /**
     * HU-04: Consulta JPQL que busca los pedidos activos de un usuario específico.
     */
    public List<Pedido> buscarPorUsuario(Long usuarioId) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        try {
            String jpql = "SELECT p FROM Pedido p WHERE p.usuario.id = :usuarioId AND p.eliminado = false";
            TypedQuery<Pedido> query = em.createQuery(jpql, Pedido.class);
            query.setParameter("usuarioId", usuarioId);
            return query.getResultList();
        } finally {
            if (em != null && em.isOpen()) {
                em.close();
            }
        }
    }

    /**
     * HU-04: Consulta JPQL que busca pedidos filtrados por su estado (Enum).
     * Modificado para usar exactamente tu tipo 'Estado'.
     */
    public List<Pedido> buscarPorEstado(Estado estado) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        try {
            String jpql = "SELECT p FROM Pedido p WHERE p.estado = :estado AND p.eliminado = false";
            TypedQuery<Pedido> query = em.createQuery(jpql, Pedido.class);
            query.setParameter("estado", estado);
            return query.getResultList();
        } finally {
            if (em != null && em.isOpen()) {
                em.close();
            }
        }
    }
}