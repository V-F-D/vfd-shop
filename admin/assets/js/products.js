// ==========================================
// VFD Admin - Products Management
// ==========================================

let allProducts = [];
let filteredProducts = [];
let editingProductId = null;

// Categories mapping
const CATEGORIES = {
    'dresses': 'Dresses',
    'tops': 'Tops',
    'two-pieces': 'Two Pieces',
    'shoes': 'Shoes',
    'skirts': 'Skirts',
    'underwear': 'Underwear',
    'bags': 'Bags & Accessories'
};

// Load all products
async function loadProducts() {
    try {
        showLoadingState();
        
        const { data: products, error } = await supabaseClient
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        allProducts = products || [];
        filteredProducts = allProducts;
        
        renderProducts();
        updateProductsCount();
        
    } catch (error) {
        console.error('Load products error:', error);
        showErrorState(error.message);
    }
}

// Render products grid
function renderProducts() {
    const grid = document.getElementById('products-grid');
    
    if (!filteredProducts || filteredProducts.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);">
                <div style="font-size: 3rem; margin-bottom: 1rem;">📦</div>
                <div>No products found</div>
                <p style="font-size: 0.875rem; margin-top: 0.5rem;">Click "Add Product" to start building your catalog</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredProducts.map(product => `
        <div style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); overflow: hidden; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='var(--shadow-lg)'" onmouseout="this.style.transform=''; this.style.boxShadow=''">
            <!-- Product Image -->
            <div style="aspect-ratio: 1; background: var(--bg-secondary); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;">
                ${product.image_url ? 
                    `<img src="${product.image_url}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 400 400%27%3E%3Crect fill=%27%23f3f4f6%27 width=%27400%27 height=%27400%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27monospace%27 font-size=%2724%27 fill=%27%239ca3af%27%3ENo Image%3C/text%3E%3C/svg%3E'">` 
                    : 
                    `<svg width="80" height="80" fill="none" stroke="var(--text-tertiary)" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>`
                }
                
                <!-- Badges -->
                <div style="position: absolute; top: 0.5rem; left: 0.5rem; display: flex; gap: 0.5rem;">
                    ${product.badge ? `<span class="badge badge-info" style="font-size: 0.688rem;">${product.badge}</span>` : ''}
                    ${!product.is_active ? `<span class="badge badge-danger" style="font-size: 0.688rem;">Inactive</span>` : ''}
                    ${product.stock_quantity < 5 ? `<span class="badge badge-warning" style="font-size: 0.688rem;">Low Stock</span>` : ''}
                </div>
            </div>

            <!-- Product Info -->
            <div style="padding: var(--space-md);">
                <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${product.name}">${product.name}</h3>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span style="color: var(--text-secondary); font-size: 0.875rem;">${CATEGORIES[product.category] || product.category}</span>
                    <span class="badge ${product.is_active ? 'badge-success' : 'badge-danger'}" style="font-size: 0.688rem;">
                        ${product.is_active ? 'Active' : 'Inactive'}
                    </span>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md);">
                    <div>
                        <p style="font-size: 1.25rem; font-weight: 700; color: var(--primary);">KSh ${parseFloat(product.price).toLocaleString()}</p>
                        <p style="font-size: 0.813rem; color: var(--text-secondary);">Stock: ${product.stock_quantity}</p>
                    </div>
                </div>

                ${product.description ? `
                    <p style="font-size: 0.813rem; color: var(--text-secondary); margin-bottom: var(--space-md); overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                        ${product.description}
                    </p>
                ` : ''}

                <!-- Actions -->
                <div style="display: flex; gap: 0.5rem;">
                    <button onclick="editProduct('${product.id}')" class="btn btn-sm btn-primary" style="flex: 1; font-size: 0.813rem;">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Edit
                    </button>
                    <button onclick="toggleProductStatus('${product.id}', ${!product.is_active})" class="btn btn-sm ${product.is_active ? 'btn-secondary' : 'btn-success'}" style="font-size: 0.813rem;">
                        ${product.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onclick="deleteProduct('${product.id}', '${product.name}')" class="btn btn-sm btn-danger" style="font-size: 0.813rem;" title="Delete">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter products
function filterProducts() {
    const categoryFilter = document.getElementById('category-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    const searchQuery = document.getElementById('search-input').value.toLowerCase();

    filteredProducts = allProducts.filter(product => {
        // Category filter
        if (categoryFilter !== 'all' && product.category !== categoryFilter) {
            return false;
        }

        // Status filter
        if (statusFilter !== 'all') {
            if (statusFilter === 'active' && !product.is_active) return false;
            if (statusFilter === 'inactive' && product.is_active) return false;
            if (statusFilter === 'low-stock' && product.stock_quantity >= 5) return false;
        }

        // Search filter
        if (searchQuery) {
            const searchable = `${product.name} ${product.category} ${product.description || ''}`.toLowerCase();
            if (!searchable.includes(searchQuery)) {
                return false;
            }
        }

        return true;
    });

    renderProducts();
    updateProductsCount();
}

// Show add product form
function showAddProductForm() {
    editingProductId = null;
    document.getElementById('modal-title').textContent = 'Add Product';
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('product-active').checked = true;
    document.getElementById('product-modal').style.display = 'flex';
}

// Edit product
async function editProduct(productId) {
    try {
        const product = allProducts.find(p => p.id === productId);
        if (!product) throw new Error('Product not found');

        editingProductId = productId;
        document.getElementById('modal-title').textContent = 'Edit Product';
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-stock').value = product.stock_quantity;
        document.getElementById('product-description').value = product.description || '';
        document.getElementById('product-image').value = product.image_url || '';
        document.getElementById('product-badge').value = product.badge || '';
        document.getElementById('product-active').checked = product.is_active;
        document.getElementById('product-modal').style.display = 'flex';
        
    } catch (error) {
        console.error('Edit product error:', error);
        showNotification('Error loading product details', 'error');
    }
}

// Save product (add or update)
async function saveProduct(event) {
    event.preventDefault();

    try {
        const productData = {
            name: document.getElementById('product-name').value.trim(),
            category: document.getElementById('product-category').value,
            price: parseFloat(document.getElementById('product-price').value),
            stock_quantity: parseInt(document.getElementById('product-stock').value),
            description: document.getElementById('product-description').value.trim() || null,
            image_url: document.getElementById('product-image').value.trim() || null,
            badge: document.getElementById('product-badge').value || null,
            is_active: document.getElementById('product-active').checked
        };

        if (editingProductId) {
            // Update existing product
            const { error } = await supabaseClient
                .from('products')
                .update({ ...productData, updated_at: new Date().toISOString() })
                .eq('id', editingProductId);

            if (error) throw error;

            showNotification('Product updated successfully!', 'success');
        } else {
            // Add new product
            const { error } = await supabaseClient
                .from('products')
                .insert([productData]);

            if (error) throw error;

            showNotification('Product added successfully!', 'success');
        }

        closeProductModal();
        loadProducts();
        
    } catch (error) {
        console.error('Save product error:', error);
        showNotification('Error saving product: ' + error.message, 'error');
    }
}

// Toggle product status
async function toggleProductStatus(productId, newStatus) {
    if (!confirm(`Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} this product?`)) {
        return;
    }

    try {
        const { error } = await supabaseClient
            .from('products')
            .update({ 
                is_active: newStatus,
                updated_at: new Date().toISOString()
            })
            .eq('id', productId);

        if (error) throw error;

        showNotification(`Product ${newStatus ? 'activated' : 'deactivated'} successfully!`, 'success');
        loadProducts();
        
    } catch (error) {
        console.error('Toggle status error:', error);
        showNotification('Error updating product status', 'error');
    }
}

// Delete product
async function deleteProduct(productId, productName) {
    if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
        return;
    }

    try {
        const { error } = await supabaseClient
            .from('products')
            .delete()
            .eq('id', productId);

        if (error) throw error;

        showNotification('Product deleted successfully!', 'success');
        loadProducts();
        
    } catch (error) {
        console.error('Delete product error:', error);
        showNotification('Error deleting product: ' + error.message, 'error');
    }
}

// Close modal
function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
    editingProductId = null;
}

// Helper functions
function updateProductsCount() {
    document.getElementById('products-count').textContent = filteredProducts.length;
}

function showLoadingState() {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⏳</div>
            <div>Loading products...</div>
        </div>
    `;
}

function showErrorState(message) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--danger);">
            <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
            <div>Error loading products</div>
            <p style="font-size: 0.875rem; margin-top: 0.5rem;">${message}</p>
            <button onclick="loadProducts()" class="btn btn-primary" style="margin-top: 1rem;">Try Again</button>
        </div>
    `;
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('product-modal');
    if (e.target === modal) {
        closeProductModal();
    }
});
