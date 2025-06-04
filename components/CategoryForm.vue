<template>
  <div class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h3>{{ isEditing ? 'Edit Category' : 'Add Category' }}</h3>
        <button @click="$emit('cancel')" class="close-btn">&times;</button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="modal-body">
        <div class="form-group">
          <label for="categoryName">Category Name *</label>
          <input
            id="categoryName"
            v-model="form.name"
            type="text"
            required
            maxlength="100"
            placeholder="Enter category name"
            :class="{ 'error': errors.name }"
          />
          <div v-if="errors.name" class="field-error">{{ errors.name }}</div>
        </div>

        <div class="form-actions">
          <button type="button" @click="$emit('cancel')" class="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" :disabled="!isFormValid" class="btn btn-primary">
            {{ isEditing ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

const props = defineProps({
  category: {
    type: Object,
    default: null
  },
  isEditing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['save', 'cancel'])

const form = reactive({
  name: ''
})

const errors = reactive({
  name: ''
})

watch(() => props.category, (category) => {
  if (category) {
    form.name = category.name || ''
  } else {
    form.name = ''
  }
  clearErrors()
}, { immediate: true })

const validateForm = () => {
  clearErrors()
  let isValid = true

  if (!form.name.trim()) {
    errors.name = 'Category name is required'
    isValid = false
  } else if (form.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters'
    isValid = false
  } else if (form.name.trim().length > 100) {
    errors.name = 'Name cannot exceed 100 characters'
    isValid = false
  }

  return isValid
}

const clearErrors = () => {
  errors.name = ''
}

const isFormValid = computed(() => {
  return form.name.trim().length >= 2
})

const handleSubmit = () => {
  if (validateForm()) {
    emit('save', {
      name: form.name.trim()
    })
  }
}
</script>