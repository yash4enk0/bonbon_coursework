<template>
  <div class="admin-panel">
    <div class="header">
      <h1>
        <span class="header-emoji">🥐</span>
        Products
      </h1>
      <button @click="addNewProduct" class="btn-add">+ Add Product</button>
    </div>

    <div v-if="loading" class="loading">
      <span class="loading-emoji">⏳</span>
      Loading products...
    </div>
    
    <div v-else class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Article</th>
            <th>Price</th>
            <th>Category</th>
            <th>Available</th>
            <th>Orders</th>
            <th>Reviews</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id" class="table-row">
            <td class="id-cell">{{ product.id }}</td>
            
            <!-- Name -->
            <td class="name-cell">
              <input 
                v-if="editingId === product.id"
                v-model="editForm.name"
                @keyup.enter="saveProduct(product.id)"
                @keyup.escape="cancelEdit"
                class="edit-input"
                ref="editInput"
                required
              />
              <span v-else class="name-display" :title="product.description">
                {{ product.name }}
              </span>
            </td>

            <!-- Article -->
            <td class="article-cell">
              <input 
                v-if="editingId === product.id"
                v-model="editForm.article"
                @keyup.enter="saveProduct(product.id)"
                @keyup.escape="cancelEdit"
                class="edit-input"
                placeholder="e.g., CRST-001"
                required
              />
              <span v-else class="article-display">{{ product.article }}</span>
            </td>

            <!-- Price -->
            <td class="price-cell">
              <input 
                v-if="editingId === product.id"
                v-model.number="editForm.price"
                type="number"
                step="0.01"
                min="0"
                @keyup.enter="saveProduct(product.id)"
                @keyup.escape="cancelEdit"
                class="edit-input"
                required
              />
              <span v-else class="price-display">
                <span class="price-emoji">💰</span>
                ${{ product.price.toFixed(2) }}
              </span>
            </td>

            <!-- Category -->
            <td class="category-cell">
              <select 
                v-if="editingId === product.id"
                v-model="editForm.categoryId"
                @keyup.enter="saveProduct(product.id)"
                @keyup.escape="cancelEdit"
                class="edit-select"
                required
              >
                <option value="">Select category...</option>
                <option 
                  v-for="category in categories" 
                  :key="category.id" 
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
              <span v-else class="category-display">
                <span class="category-emoji">📋</span>
                {{ product.categoryName }}
              </span>
            </td>

            <!-- Availability -->
            <td class="availability-cell">
              <select 
                v-if="editingId === product.id"
                v-model="editForm.availability"
                @keyup.enter="saveProduct(product.id)"
                @keyup.escape="cancelEdit"
                class="edit-select"
              >
                <option :value="true">✅ Available</option>
                <option :value="false">❌ Out of Stock</option>
              </select>
              <span v-else :class="['availability-badge', { 'available': product.availability }]">
                {{ product.availability ? '✅ Available' : '❌ Out of Stock' }}
              </span>
            </td>

            <!-- Order Count -->
            <td class="count-cell">
              <span class="count-display">
                <span class="count-emoji">📦</span>
                {{ product.orderCount }}
              </span>
            </td>

            <!-- Review Count -->
            <td class="count-cell">
              <span class="count-display">
                <span class="count-emoji">⭐</span>
                {{ product.reviewCount }}
              </span>
            </td>

            <!-- Actions -->
            <td class="actions-cell">
              <div v-if="editingId === product.id" class="edit-actions">
                <button @click="saveProduct(product.id)" class="btn-save">💾 Save</button>
                <button @click="cancelEdit" class="btn-cancel">❌ Cancel</button>
              </div>
              <div v-else class="view-actions">
                <button @click="startEdit(product)" class="btn-edit">✏️ Edit</button>
                <button @click="deleteProduct(product)" class="btn-delete">🗑️ Delete</button>
              </div>
            </td>
          </tr>
          
          <!-- New Product Row -->
          <tr v-if="showNewRow" class="table-row new-row">
            <td class="id-cell">—</td>
            <td class="name-cell">
              <input 
                v-model="newProduct.name"
                @keyup.enter="createProduct"
                @keyup.escape="cancelNew"
                class="edit-input"
                placeholder="Product name..."
                ref="newNameInput"
                required
              />
            </td>
            <td class="article-cell">
              <input 
                v-model="newProduct.article"
                @keyup.enter="createProduct"
                @keyup.escape="cancelNew"
                class="edit-input"
                placeholder="PROD-001"
                required
              />
            </td>
            <td class="price-cell">
              <input 
                v-model.number="newProduct.price"
                type="number"
                step="0.01"
                min="0"
                @keyup.enter="createProduct"
                @keyup.escape="cancelNew"
                class="edit-input"
                placeholder="0.00"
                required
              />
            </td>
            <td class="category-cell">
              <select 
                v-model="newProduct.categoryId"
                @keyup.enter="createProduct"
                @keyup.escape="cancelNew"
                class="edit-select"
                required
              >
                <option value="">Select category...</option>
                <option 
                  v-for="category in categories" 
                  :key="category.id" 
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </td>
            <td class="availability-cell">
              <select 
                v-model="newProduct.availability"
                @keyup.enter="createProduct"
                @keyup.escape="cancelNew"
                class="edit-select"
              >
                <option :value="true">✅ Available</option>
                <option :value="false">❌ Out of Stock</option>
              </select>
            </td>
            <td class="count-cell">—</td>
            <td class="count-cell">—</td>
            <td class="actions-cell">
              <div class="edit-actions">
                <button @click="createProduct" class="btn-save">💾 Save</button>
                <button @click="cancelNew" class="btn-cancel">❌ Cancel</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Description Modal -->
    <div v-if="showDescriptionModal" class="modal-overlay" @click.self="cancelDescriptionModal">
      <div class="modal">
        <div class="modal-header">
          <h3>
            <span class="modal-emoji">📝</span>
            Product Description
          </h3>
          <button @click="cancelDescriptionModal" class="close-btn">&times;</button>
        </div>
        
        <form @submit.prevent="submitDescription" class="modal-body">
          <div class="form-group">
            <label for="description">Description (Optional)</label>
            <textarea
              id="description"
              v-model="descriptionForm.description"
              rows="4"
              placeholder="Detailed product description..."
              class="description-textarea"
            ></textarea>
            <div class="description-hint">Describe the product features, ingredients, or special notes</div>
          </div>

          <div class="form-actions">
            <button type="button" @click="cancelDescriptionModal" class="btn btn-secondary">
              Skip
            </button>
            <button type="submit" class="btn btn-primary">
              🍞 Create Product
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="error" class="error">
      <span class="error-emoji">❌</span>
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'

const products = ref([])
const categories = ref([])
const loading = ref(false)
const error = ref('')
const editingId = ref(null)
const showNewRow = ref(false)
const showDescriptionModal = ref(false)
const editInput = ref()
const newNameInput = ref()

const editForm = reactive({
  name: '',
  article: '',
  price: 0,
  categoryId: '',
  availability: true
})

const newProduct = reactive({
  name: '',
  article: '',
  price: 0,
  categoryId: '',
  availability: true
})

const descriptionForm = reactive({
  description: ''
})

const fetchProducts = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await $fetch('/api/products')
    products.value = response.sort((a, b) => a.id - b.id)
  } catch (err) {
    error.value = 'Failed to load products'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const response = await $fetch('/api/categories')
    categories.value = response.sort((a, b) => a.name.localeCompare(b.name))
  } catch (err) {
    error.value = 'Failed to load categories'
    console.error(err)
  }
}

const startEdit = async (product) => {
  editingId.value = product.id
  Object.assign(editForm, {
    name: product.name,
    article: product.article,
    price: product.price,
    categoryId: product.categoryId,
    availability: product.availability
  })
  await nextTick()
  if (editInput.value) {
    editInput.value.focus()
    editInput.value.select()
  }
}

const saveProduct = async (id) => {
  if (!editForm.name.trim() || !editForm.article.trim() || !editForm.price || !editForm.categoryId) {
    error.value = 'Name, article, price, and category are required'
    return
  }
  
  try {
    await $fetch(`/api/products/${id}`, {
      method: 'PUT',
      body: editForm
    })
    await fetchProducts()
    cancelEdit()
  } catch (err) {
    error.value = err.data?.message || 'Failed to update product'
    console.error(err)
  }
}

const cancelEdit = () => {
  editingId.value = null
  Object.assign(editForm, {
    name: '',
    article: '',
    price: 0,
    categoryId: '',
    availability: true
  })
  error.value = ''
}

const addNewProduct = async () => {
  showNewRow.value = true
  await nextTick()
  if (newNameInput.value) {
    newNameInput.value.focus()
  }
}

const createProduct = () => {
  if (!newProduct.name.trim() || !newProduct.article.trim() || !newProduct.price || !newProduct.categoryId) {
    error.value = 'Name, article, price, and category are required'
    return
  }
  
  // Show description modal
  showNewRow.value = false
  showDescriptionModal.value = true
}

const submitDescription = async () => {
  try {
    const productData = {
      ...newProduct,
      description: descriptionForm.description.trim() || null
    }
    
    await $fetch('/api/products', {
      method: 'POST',
      body: productData
    })
    await fetchProducts()
    cancelDescriptionModal()
  } catch (err) {
    error.value = err.data?.message || 'Failed to create product'
    console.error(err)
  }
}

const cancelNew = () => {
  showNewRow.value = false
  Object.assign(newProduct, {
    name: '',
    article: '',
    price: 0,
    categoryId: '',
    availability: true
  })
  error.value = ''
}

const cancelDescriptionModal = () => {
  showDescriptionModal.value = false
  descriptionForm.description = ''
  Object.assign(newProduct, {
    name: '',
    article: '',
    price: 0,
    categoryId: '',
    availability: true
  })
  error.value = ''
}

const deleteProduct = async (product) => {
  if (!confirm(`Delete product "${product.name}"? This action cannot be undone.`)) return
  
  try {
    await $fetch(`/api/products/${product.id}`, {
      method: 'DELETE'
    })
    await fetchProducts()
  } catch (err) {
    error.value = err.data?.message || 'Failed to delete product. Product might be in orders or have reviews.'
    console.error(err)
  }
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
})
</script>

<style scoped>
.admin-panel {
  max-width: 1600px;
  margin: 0 auto;
  padding: 30px 20px;
  font-family: 'Quicksand', sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-emoji {
  font-size: 1.2em;
}

.btn-add {
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-family: 'Quicksand', sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-add:hover {
  background: #2980b9;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
  font-weight: 500;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.loading-emoji {
  font-size: 1.5em;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;
}

.data-table th {
  background: #f8f9fa;
  padding: 15px 10px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e9ecef;
  font-size: 14px;
}

.table-row {
  border-bottom: 1px solid #e9ecef;
  transition: background 0.2s;
}

.table-row:hover {
  background: #f8f9fa;
}

.table-row td {
  padding: 12px 10px;
  vertical-align: middle;
  font-size: 14px;
}

.id-cell {
  width: 60px;
  color: #7f8c8d;
  font-weight: 500;
}

.name-cell {
  width: 200px;
}

.article-cell {
  width: 120px;
}

.price-cell {
  width: 100px;
}

.category-cell {
  width: 150px;
}

.availability-cell {
  width: 120px;
}

.count-cell {
  width: 80px;
  text-align: center;
}

.actions-cell {
  width: 160px;
}

.name-display {
  font-weight: 500;
  color: #2c3e50;
  cursor: help;
}

.article-display {
  font-family: 'Courier New', monospace;
  background: #f8f9fa;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
  color: #495057;
}

.price-display, .category-display, .count-display {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;
  color: #2c3e50;
}

.price-emoji, .category-emoji, .count-emoji {
  font-size: 1.1em;
}

.availability-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: #e74c3c;
  color: white;
}

.availability-badge.available {
  background-color: #27ae60;
}

.edit-input, .edit-select {
  width: 100%;
  border: 2px solid #3498db;
  border-radius: 4px;
  padding: 6px 8px;
  font-family: 'Quicksand', sans-serif;
  font-weight: 500;
  font-size: 13px;
  outline: none;
}

.edit-input:focus, .edit-select:focus {
  border-color: #2980b9;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.view-actions, .edit-actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.btn-edit, .btn-delete, .btn-save, .btn-cancel {
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Quicksand', sans-serif;
  font-weight: 500;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit {
  background: #f39c12;
  color: white;
}

.btn-edit:hover {
  background: #d68910;
}

.btn-delete {
  background: #e74c3c;
  color: white;
}

.btn-delete:hover {
  background: #c0392b;
}

.btn-save {
  background: #27ae60;
  color: white;
}

.btn-save:hover {
  background: #229954;
}

.btn-cancel {
  background: #95a5a6;
  color: white;
}

.btn-cancel:hover {
  background: #7f8c8d;
}

.new-row {
  background: linear-gradient(135deg, #f0f8ff, #e8f4fd);
  border: 2px solid #3498db;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(45, 52, 54, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal {
  background: linear-gradient(135deg, #fff, #ffeaa7);
  border-radius: 25px;
  min-width: 500px;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  border: 3px solid #fdcb6e;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px 0;
  border-bottom: 2px solid #fab1a0;
  margin-bottom: 25px;
}

.modal-header h3 {
  margin: 0;
  color: #2d3436;
  font-family: 'Playfair Display SC', serif;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-emoji {
  font-size: 1.3rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #636e72;
  padding: 0;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: #2d3436;
  background: rgba(255, 255, 255, 0.5);
  transform: rotate(90deg);
}

.modal-body {
  padding: 0 30px 25px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #2d3436;
  font-family: 'Playfair Display SC', serif;
  font-size: 1.1rem;
}

.description-textarea {
  width: 100%;
  padding: 15px 18px;
  border: 2px solid #ddd;
  border-radius: 15px;
  font-size: 16px;
  font-family: 'VT323', monospace;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  resize: vertical;
  min-height: 100px;
}

.description-textarea:focus {
  outline: none;
  border-color: #74b9ff;
  box-shadow: 0 0 0 3px rgba(116, 185, 255, 0.3);
  background: white;
}

.description-hint {
  color: #636e72;
  font-size: 13px;
  margin-top: 6px;
  font-family: 'VT323', monospace;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 35px;
}

.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  font-family: 'VT323', monospace;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background: linear-gradient(135deg, #74b9ff, #0984e3);
  color: white;
}

.btn-secondary {
  background: linear-gradient(135deg, #ddd, #bbb);
  color: #2d3436;
}

.error {
  background: linear-gradient(135deg, #fadbd8, #f1948a);
  color: #c0392b;
  padding: 16px 20px;
  border-radius: 15px;
  margin-top: 20px;
  border: 2px solid #e74c3c;
  font-weight: 500;
  font-family: 'VT323', monospace;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.2);
}

.error-emoji {
  font-size: 1.2em;
}

@media (max-width: 1400px) {
  .table-container {
    overflow-x: auto;
  }
}

@media (max-width: 768px) {
  .admin-panel {
    padding: 20px 15px;
  }
  
  .header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .data-table th,
  .data-table td {
    padding: 8px 6px;
    font-size: 12px;
  }
  
  .header h1 {
    font-size: 24px;
  }
  
  .modal {
    min-width: 90vw;
    margin: 20px;
  }
  
  .view-actions,
  .edit-actions {
    flex-direction: column;
    gap: 4px;
  }
  
  .name-cell, .article-cell, .category-cell {
    min-width: 120px;
  }
}
</style>