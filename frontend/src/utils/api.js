// ─── Base URL ──────────────────────────────────────────────────────────────
// This points to your Django dev server locally, or the production URL when built.
const BASE_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000/api`;

// ─── Helper: Make an API request ───────────────────────────────────────────
export async function apiRequest(endpoint, method = 'GET', body = null, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // Handle 204 No Content (e.g. delete with no body)
  if (response.status === 204) {
    return null;
  }

  let data;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('text/html')) {
    throw new Error('Server error — please restart the backend server and try again.');
  }
  try {
    data = await response.json();
  } catch (parseError) {
    throw new Error('Server returned an invalid response. Check if the backend is running.');
  }

  if (!response.ok) {
    if (data.detail) {
      throw new Error(data.detail);
    } else if (data.non_field_errors) {
      throw new Error(data.non_field_errors[0]);
    } else {
      const fieldErrors = Object.entries(data)
        .map(([field, messages]) => {
          const msg = Array.isArray(messages) ? messages[0] : messages;
          return `${field.charAt(0).toUpperCase() + field.slice(1)}: ${msg}`;
        })
        .join('\n');
      throw new Error(fieldErrors || 'Something went wrong');
    }
  }

  return data;
}

// ─── Products API ────────────────────────────────────────────────────────────

// Fetch all products with optional query params
// params: { category, search, min_price, max_price, min_rating, sort_by, featured }
export async function fetchProducts(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      query.append(key, value);
    }
  });
  const qs = query.toString() ? `?${query.toString()}` : '';
  return apiRequest(`/products/products/${qs}`);
}

// Fetch a single product by ID
export async function fetchProductById(id) {
  return apiRequest(`/products/products/${id}/`);
}

// Fetch all categories
export async function fetchCategories() {
  return apiRequest('/products/categories/');
}

// ─── Cart API ────────────────────────────────────────────────────────────────

// Fetch the current user's cart
export async function fetchCart(token) {
  return apiRequest('/cart/cartdetail/', 'GET', null, token);
}

// Add a product to the cart (or increase qty if already there)
export async function addCartItem(productId, quantity = 1, token) {
  return apiRequest('/cart/cartdetail/', 'POST', { product_id: productId, quantity }, token);
}

// Update the quantity of an existing cart item
// If quantity <= 0, the backend will remove the item
export async function updateCartItem(productId, quantity, token) {
  return apiRequest('/cart/cartdetail/', 'PUT', { product_id: productId, quantity }, token);
}

// Remove a single product from the cart
export async function removeCartItem(productId, token) {
  return apiRequest(`/cart/cartdetail/?product_id=${productId}`, 'DELETE', null, token);
}

// Clear the entire cart
export async function clearCartItems(token) {
  return apiRequest('/cart/cartdetail/', 'DELETE', null, token);
}

// ─── Wishlist API ─────────────────────────────────────────────────────────────

export async function fetchWishlist(token) {
  return apiRequest('/wishlist/wishlistdetail/', 'GET', null, token);
}

export async function toggleWishlistItem(productId, token) {
  return apiRequest('/wishlist/wishlistdetail/', 'POST', { product_id: productId }, token);
}

// ─── Orders API ──────────────────────────────────────────────────────────────

// Fetch the list of orders for the logged-in user
export async function fetchOrders(token) {
  return apiRequest('/orders/orders/', 'GET', null, token);
}

// Place a new order — backend reads cart from DB and creates OrderItems
// orderData: { fullName, email, phone, streetAddress, city, postalCode, state, paymentMethod }
export async function createOrder(orderData, token) {
  return apiRequest('/orders/orders/', 'POST', orderData, token);
}

// Fetch a single order by ID
export async function fetchOrderById(orderId, token) {
  return apiRequest(`/orders/orders/${orderId}/`, 'GET', null, token);
}
