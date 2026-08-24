import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: 'index.html',
        storeHome: 'src/pages/store/home/home.html',
        storeCart: 'src/pages/store/cart/cart.html',
        productDetail: 'src/pages/store/productDetail/productDetail.html',
        clientOrders: 'src/pages/client/orders/orders.html',
        adminHome: 'src/pages/admin/home/home.html', // Ruta de administración
      },
    },
  },
  base: './',
});