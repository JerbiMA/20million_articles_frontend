import api from './api';

export const productService = {
  getProducts: async (params = {}) => {
    return api.get('/products', { params });
  },
  getProductBySlug: async (slug) => {
    return api.get(`/products/${slug}`);
  },
};

export const categoryService = {
  getCategories: async () => {
    return api.get('/categories');
  },
  getCategoryBySlug: async (slug) => {
    return api.get(`/categories/${slug}`);
  },
};

export const teamService = {
  getTeams: async (params = {}) => {
    return api.get('/teams', { params });
  },
  getTeamBySlug: async (slug) => {
    return api.get(`/teams/${slug}`);
  },
};

export const cartService = {
  getCart: async () => {
    return api.get('/cart');
  },
  addItem: async (productId, size, quantity = 1) => {
    return api.post('/cart/items', { productId, size, quantity });
  },
  updateItem: async (productId, size, quantity) => {
    return api.put('/cart/items', { productId, size, quantity });
  },
  removeItem: async (productId, size) => {
    return api.delete('/cart/items', { data: { productId, size } });
  },
  clearCart: async () => {
    return api.delete('/cart');
  },
};

export const couponService = {
  validateCoupon: async (code, orderAmount) => {
    return api.post('/coupons/validate', { code, orderAmount });
  },
};

export const orderService = {
  createOrder: async (orderPayload) => {
    return api.post('/orders', orderPayload);
  },
  getMyOrders: async () => {
    return api.get('/orders/my-orders');
  },
  getOrderById: async (id) => {
    return api.get(`/orders/${id}`);
  },
  getGuestOrder: async (orderNumber) => {
    return api.get(`/orders/guest/${orderNumber}`);
  },
};

export const adminService = {
  // Stats
  getStats: async () => {
    return api.get('/admin/orders/stats');
  },

  // Orders
  getOrders: async (params = {}) => {
    return api.get('/admin/orders', { params });
  },
  updateOrderStatus: async (id, data) => {
    return api.patch(`/admin/orders/${id}/status`, data);
  },

  // Products
  getProducts: async (params = {}) => {
    return api.get('/admin/products', { params });
  },
  createProduct: async (productData) => {
    return api.post('/admin/products', productData);
  },
  updateProduct: async (id, productData) => {
    return api.put(`/admin/products/${id}`, productData);
  },
  updateProductStock: async (id, sizes) => {
    return api.patch(`/admin/products/${id}/stock`, { sizes });
  },
  deleteProduct: async (id) => {
    return api.delete(`/admin/products/${id}`);
  },

  // Categories
  getCategories: async () => {
    return api.get('/admin/categories');
  },
  createCategory: async (categoryData) => {
    return api.post('/admin/categories', categoryData);
  },
  deleteCategory: async (id) => {
    return api.delete(`/admin/categories/${id}`);
  },

  // Teams
  getTeams: async (params = {}) => {
    return api.get('/admin/teams', { params });
  },
  createTeam: async (teamData) => {
    return api.post('/admin/teams', teamData);
  },
  deleteTeam: async (id) => {
    return api.delete(`/admin/teams/${id}`);
  },

  // Coupons
  getCoupons: async () => {
    return api.get('/admin/coupons');
  },
  createCoupon: async (couponData) => {
    return api.post('/admin/coupons', couponData);
  },
  deleteCoupon: async (id) => {
    return api.delete(`/admin/coupons/${id}`);
  },

  // Users
  getUsers: async (params = {}) => {
    return api.get('/admin/users', { params });
  },
  updateUserRole: async (id, data) => {
    return api.patch(`/admin/users/${id}`, data);
  },
};
