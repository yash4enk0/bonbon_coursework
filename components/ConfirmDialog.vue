<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal confirm-modal">
      <div class="modal-header">
        <h3>
          <span class="modal-emoji">⚠️</span>
          {{ title }}
        </h3>
      </div>
      
      <div class="modal-body">
        <p>{{ message }}</p>
      </div>

      <div class="modal-footer">
        <button @click="$emit('cancel')" class="btn btn-secondary">
          Cancel
        </button>
        <button @click="$emit('confirm')" class="btn btn-delete">
          🗑️ Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
})

defineEmits(['confirm', 'cancel'])
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
  border: 3px solid #fdcb6e;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.confirm-modal {
  min-width: 400px;
  max-width: 500px;
}

.modal-header {
  display: flex;
  justify-content: center;
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

.modal-body {
  padding: 0 30px 25px;
}

.modal-body p {
  margin: 0;
  color: #2d3436;
  line-height: 1.6;
  font-size: 1.1rem;
  font-family: 'VT323', monospace;
  text-align: center;
}

.modal-footer {
  padding: 25px 30px;
  border-top: 2px solid #fab1a0;
  display: flex;
  gap: 15px;
  justify-content: flex-end;
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

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.btn-secondary {
  background: linear-gradient(135deg, #ddd, #bbb);
  color: #2d3436;
}

.btn-delete {
  background: linear-gradient(135deg, #ff7675, #e17055);
  color: white;
}

@media (max-width: 768px) {
  .confirm-modal {
    min-width: 90vw;
    margin: 20px;
  }
  
  .modal-footer {
    flex-direction: column;
    gap: 10px;
  }
}
</style>