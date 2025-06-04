<template>
  <div class="loading-container" :class="{ 'overlay': overlay }">
    <div class="spinner-wrapper">
      <div class="bakery-spinner">
        <div class="croissant">🥐</div>
        <div class="dots">
          <span class="dot">.</span>
          <span class="dot">.</span>
          <span class="dot">.</span>
        </div>
      </div>
      <p class="loading-text">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'Loading...'
  },
  overlay: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  min-height: 200px;
}

.loading-container.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(245, 246, 250, 0.9);
  backdrop-filter: blur(5px);
  z-index: 9999;
  min-height: 100vh;
}

.spinner-wrapper {
  text-align: center;
}

.bakery-spinner {
  position: relative;
  margin-bottom: 20px;
}

.croissant {
  font-size: 3rem;
  animation: bounce 1.5s ease-in-out infinite;
  display: inline-block;
}

.dots {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #3498db;
  border-radius: 50%;
  display: inline-block;
  animation: dot-pulse 1.5s ease-in-out infinite;
}

.dot:nth-child(1) {
  animation-delay: 0s;
}

.dot:nth-child(2) {
  animation-delay: 0.3s;
}

.dot:nth-child(3) {
  animation-delay: 0.6s;
}

.loading-text {
  color: #7f8c8d;
  font-family: 'Quicksand', sans-serif;
  font-weight: 500;
  font-size: 1.1rem;
  margin: 0;
  animation: fade 2s ease-in-out infinite alternate;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

@keyframes dot-pulse {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}

@keyframes fade {
  0% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}
</style>