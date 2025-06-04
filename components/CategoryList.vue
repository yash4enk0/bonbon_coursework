<template>
  <div class="category-list">
    <div class="header">
      <h2>Category Management</h2>
      <button @click="showCreateForm = true" class="btn btn-primary">
        Add Category
      </button>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    
    <div v-else-if="categories.length === 0" class="empty-state">
      No categories found
    </div>

    <div v-else class="categories-grid">
      <div v-for="category in categories" :key="category.id" class="category-card">
        <div class="category-info">
          <h3>{{ category.name }}</h3>
          <p class="category-id">ID: {{ category.id }}</p>
        </div>
        <div class="category-actions">
          <button @click="editCategory(category)" class="btn btn-secondary">
            Edit
          </button>
          <button @click="confirmDelete(category)" class="btn btn-danger">
            Delete
          </button>
        </div>
      </div>
    </div>

    <CategoryForm
      v-if="showCreateForm || editingCategory"
      :category="editingCategory"
      :is-editing="!!editingCategory"
      @save="handleSave"
      @cancel="handleCancel"
    />

    <ConfirmDialog
      v-if="categoryToDelete"
      :title="'Delete Category'"
      :message="`Are you sure you want to delete category '${categoryToDelete.name}'?`"
      @confirm="deleteCategory"
      @cancel="categoryToDelete = null"
    />

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const categories = ref([])
const loading = ref(false)
const error = ref('')
const showCreateForm = ref(false)
const editingCategory = ref(null)
const categoryToDelete = ref(null)

const fetchCategories = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/categories')
    categories.value = response
    error.value = ''
  } catch (err) {
    error.value = 'Error loading categories'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const editCategory = (category) => {
  editingCategory.value = { ...category }
  showCreateForm.value = false
}

const confirmDelete = (category) => {
  categoryToDelete.value = category
}

const deleteCategory = async () => {
  try {
    await $fetch(`/api/categories/${categoryToDelete.value.id}`, {
      method: 'DELETE'
    })
    await fetchCategories()
    categoryToDelete.value = null
  } catch (err) {
    error.value = 'Error deleting category'
    console.error(err)
  }
}

const handleSave = async (categoryData) => {
  try {
    if (editingCategory.value) {
      await $fetch(`/api/categories/${editingCategory.value.id}`, {
        method: 'PUT',
        body: categoryData
      })
    } else {
      await $fetch('/api/categories', {
        method: 'POST',
        body: categoryData
      })
    }
    
    await fetchCategories()
    handleCancel()
  } catch (err) {
    error.value = editingCategory.value ? 
      'Error updating category' : 'Error creating category'
    console.error(err)
  }
}

const handleCancel = () => {
  showCreateForm.value = false
  editingCategory.value = null
}

onMounted(() => {
  fetchCategories()
})
</script>