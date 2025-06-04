<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal">
      <div class="modal-header">
        <h3>
          <span class="modal-emoji">{{ isEditing ? '✏️' : '➕' }}</span>
          {{ isEditing ? 'Edit Category' : 'Add New Category' }}
        </h3>
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
            placeholder="e.g., Croissants, Macarons, Breads..."
            :class="{ 'error': errors.name }"
            autocomplete="off"
          />
          <div v-if="errors.name" class="field-error">{{ errors.name }}</div>
        </div>

        <div class="form-actions">
          <button type="button" @click="$emit('cancel')" class="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" :disabled="!isFormValid" class="btn btn-primary">
            {{ isEditing ? '💾 Update' : '🍞 Create' }}
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

<style scoped>
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
  min-width: 450px;
  max-width: 550px;
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

.form-group input {
  width: 100%;
  padding: 15px 18px;
  border: 2px solid #ddd;
  border-radius: 15px;
  font-size: 16px;
  font-family: 'VT323', monospace;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
}

.form-group input:focus {
  outline: none;
  border-color: #74b9ff;
  box-shadow: 0 0 0 3px rgba(116, 185, 255, 0.3);
  background: white;
}

.form-group input.error {
  border-color: #ff7675;
  box-shadow: 0 0 0 3px rgba(255, 118, 117, 0.3);
}

.field-error {
  color: #d63031;
  font-size: 14px;
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

@media (max-width: 768px) {
  .modal {
    min-width: 90vw;
    margin: 20px;
  }
}
</style>