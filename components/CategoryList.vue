<template>
  <div class="admin-panel">
    <div class="header">
      <h1>Categories</h1>
      <button @click="addNewCategory" class="btn-add">+ Add Category</button>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    
    <div v-else class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category.id" class="table-row">
            <td class="id-cell">{{ category.id }}</td>
            <td class="name-cell">
              <input 
                v-if="editingId === category.id"
                v-model="editForm.name"
                @keyup.enter="saveCategory(category.id)"
                @keyup.escape="cancelEdit"
                class="edit-input"
                ref="editInput"
              />
              <span v-else class="name-display">{{ category.name }}</span>
            </td>
            <td class="actions-cell">
              <div v-if="editingId === category.id" class="edit-actions">
                <button @click="saveCategory(category.id)" class="btn-save">Save</button>
                <button @click="cancelEdit" class="btn-cancel">Cancel</button>
              </div>
              <div v-else class="view-actions">
                <button @click="startEdit(category)" class="btn-edit">Edit</button>
                <button @click="deleteCategory(category)" class="btn-delete">Delete</button>
              </div>
            </td>
          </tr>
          <tr v-if="showNewRow" class="table-row new-row">
            <td class="id-cell">—</td>
            <td class="name-cell">
              <input 
                v-model="newCategory.name"
                @keyup.enter="createCategory"
                @keyup.escape="cancelNew"
                class="edit-input"
                placeholder="Category name..."
                ref="newInput"
              />
            </td>
            <td class="actions-cell">
              <div class="edit-actions">
                <button @click="createCategory" class="btn-save">Save</button>
                <button @click="cancelNew" class="btn-cancel">Cancel</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'

const categories = ref([])
const loading = ref(false)
const error = ref('')
const editingId = ref(null)
const showNewRow = ref(false)
const editInput = ref()
const newInput = ref()

const editForm = reactive({
  name: ''
})

const newCategory = reactive({
  name: ''
})

const fetchCategories = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await $fetch('/api/categories')
    categories.value = response.sort((a, b) => a.id - b.id)
  } catch (err) {
    error.value = 'Failed to load categories'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const startEdit = async (category) => {
  editingId.value = category.id
  editForm.name = category.name
  await nextTick()
  if (editInput.value) {
    editInput.value.focus()
    editInput.value.select()
  }
}

const saveCategory = async (id) => {
  if (!editForm.name.trim()) {
    error.value = 'Category name is required'
    return
  }
  
  try {
    await $fetch(`/api/categories/${id}`, {
      method: 'PUT',
      body: { name: editForm.name.trim() }
    })
    await fetchCategories()
    cancelEdit()
  } catch (err) {
    error.value = 'Failed to update category'
    console.error(err)
  }
}

const cancelEdit = () => {
  editingId.value = null
  editForm.name = ''
  error.value = ''
}

const addNewCategory = async () => {
  showNewRow.value = true
  await nextTick()
  if (newInput.value) {
    newInput.value.focus()
  }
}

const createCategory = async () => {
  if (!newCategory.name.trim()) {
    error.value = 'Category name is required'
    return
  }
  
  try {
    await $fetch('/api/categories', {
      method: 'POST',
      body: { name: newCategory.name.trim() }
    })
    await fetchCategories()
    cancelNew()
  } catch (err) {
    error.value = 'Failed to create category'
    console.error(err)
  }
}

const cancelNew = () => {
  showNewRow.value = false
  newCategory.name = ''
  error.value = ''
}

const deleteCategory = async (category) => {
  if (!confirm(`Delete category "${category.name}"?`)) return
  
  try {
    await $fetch(`/api/categories/${category.id}`, {
      method: 'DELETE'
    })
    await fetchCategories()
  } catch (err) {
    error.value = 'Failed to delete category. It might have products.'
    console.error(err)
  }
}

onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
.admin-panel {
  max-width: 800px;
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
}

.data-table th {
  background: #f8f9fa;
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e9ecef;
}

.table-row {
  border-bottom: 1px solid #e9ecef;
  transition: background 0.2s;
}

.table-row:hover {
  background: #f8f9fa;
}

.table-row td {
  padding: 15px;
  vertical-align: middle;
}

.id-cell {
  width: 80px;
  color: #7f8c8d;
  font-weight: 500;
}

.name-cell {
  width: auto;
}

.name-display {
  font-weight: 500;
  color: #2c3e50;
}

.edit-input {
  width: 100%;
  border: 2px solid #3498db;
  border-radius: 4px;
  padding: 8px 12px;
  font-family: 'Quicksand', sans-serif;
  font-weight: 500;
  font-size: 14px;
  outline: none;
}

.edit-input:focus {
  border-color: #2980b9;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.actions-cell {
  width: 160px;
}

.view-actions {
  display: flex;
  gap: 8px;
}

.edit-actions {
  display: flex;
  gap: 8px;
}

.btn-edit, .btn-delete, .btn-save, .btn-cancel {
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-family: 'Quicksand', sans-serif;
  font-weight: 500;
  font-size: 13px;
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
  background: #f0f8ff;
}

.error {
  background: #fadbd8;
  color: #e74c3c;
  padding: 12px 16px;
  border-radius: 6px;
  margin-top: 20px;
  border-left: 4px solid #e74c3c;
  font-weight: 500;
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
    padding: 10px;
  }
  
  .id-cell {
    width: 60px;
  }
  
  .actions-cell {
    width: 140px;
  }
  
  .edit-actions,
  .view-actions {
    flex-direction: column;
    gap: 4px;
  }
}
</style>