<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <NuxtLink to="/" class="logo">
          <span class="logo-emoji">🥐</span>
          <h1>La Petite Boulangerie</h1>
          <span class="logo-subtitle">Française</span>
        </NuxtLink>
        
        <nav class="main-nav">
          <NuxtLink to="/" class="nav-link">
            <span class="nav-emoji">🏠</span>
            Accueil
          </NuxtLink>
          <NuxtLink to="/shop" class="nav-link">
            <span class="nav-emoji">🛍️</span>
            Boutique
          </NuxtLink>
          <NuxtLink to="/categories" class="nav-link">
            <span class="nav-emoji">📋</span>
            Catégories
          </NuxtLink>
          <NuxtLink to="/about" class="nav-link">
            <span class="nav-emoji">ℹ️</span>
            À propos
          </NuxtLink>
          <NuxtLink to="/contact" class="nav-link">
            <span class="nav-emoji">📞</span>
            Contact
          </NuxtLink>
        </nav>

        <div class="header-actions">
          <button @click="toggleSearch" class="action-btn search-btn">
            <span class="action-emoji">🔍</span>
          </button>
          <NuxtLink to="/cart" class="action-btn cart-btn">
            <span class="action-emoji">🛒</span>
            <span v-if="cartItemsCount > 0" class="cart-badge">{{ cartItemsCount }}</span>
          </NuxtLink>
          <NuxtLink to="/account" class="action-btn account-btn">
            <span class="action-emoji">👤</span>
          </NuxtLink>
        </div>
      </div>

      <div v-if="showSearch" class="search-container">
        <div class="search-bar">
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher des produits..."
            class="search-input"
            @keyup.enter="performSearch"
            ref="searchInput"
          />
          <button @click="performSearch" class="search-button">
            Rechercher
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const showSearch = ref(false)
const searchQuery = ref('')
const searchInput = ref()
const cartItemsCount = ref(0) // This would come from a store/composable

const toggleSearch = async () => {
  showSearch.value = !showSearch.value
  if (showSearch.value) {
    await nextTick()
    searchInput.value?.focus()
  }
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/shop?search=${encodeURIComponent(searchQuery.value)}`)
    showSearch.value = false
    searchQuery.value = ''
  }
}

// Mock cart count - in real app this would come from a store
onMounted(() => {
  // cartItemsCount.value = useCartStore().itemsCount
})
</script>

<style scoped>
.app-header {
  background: linear-gradient(135deg, #fff 0%, #ffeaa7 100%);
  border-bottom: 3px solid #fdcb6e;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
}

.logo {
  text-decoration: none;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;
}

.logo:hover {
  color: #3498db;
  transform: scale(1.02);
}

.logo-emoji {
  font-size: 2rem;
  animation: bounce 3s infinite;
}

.logo h1 {
  margin: 0;
  font-size: 1.8rem;
  font-family: 'Playfair Display SC', serif;
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
  line-height: 1;
}

.logo-subtitle {
  font-size: 0.9rem;
  color: #e17055;
  font-style: italic;
  font-family: 'Playfair Display', serif;
  margin-top: -5px;
  align-self: flex-end;
}

.main-nav {
  display: flex;
  gap: 30px;
}

.nav-link {
  color: #7f8c8d;
  text-decoration: none;
  font-weight: 600;
  font-family: 'Quicksand', sans-serif;
  font-size: 16px;
  padding: 10px 15px;
  border-radius: 25px;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-emoji {
  font-size: 1.1rem;
}

.nav-link:hover {
  color: #2c3e50;
  background: rgba(116, 185, 255, 0.1);
  transform: translateY(-2px);
}

.nav-link.router-link-active {
  color: #74b9ff;
  background: linear-gradient(135deg, rgba(116, 185, 255, 0.2), rgba(255, 234, 167, 0.3));
  border: 2px solid rgba(116, 185, 255, 0.3);
  font-weight: 700;
}

.header-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.action-btn {
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid #e9ecef;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #2c3e50;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
}

.action-btn:hover {
  background: #74b9ff;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(116, 185, 255, 0.3);
}

.action-emoji {
  font-size: 1.3rem;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  font-family: 'VT323', monospace;
}

.search-container {
  padding: 20px 0;
  border-top: 1px solid rgba(116, 185, 255, 0.2);
  animation: slideDown 0.3s ease;
}

.search-bar {
  display: flex;
  gap: 10px;
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  flex: 1;
  padding: 12px 18px;
  border: 2px solid #ddd;
  border-radius: 25px;
  font-size: 16px;
  font-family: 'Quicksand', sans-serif;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #74b9ff;
  box-shadow: 0 0 0 3px rgba(116, 185, 255, 0.2);
}

.search-button {
  background: linear-gradient(135deg, #74b9ff, #0984e3);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  font-family: 'Quicksand', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(116, 185, 255, 0.3);
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
  60% {
    transform: translateY(-4px);
  }
}

@keyframes slideDown {
  from {
    max-height: 0;
    opacity: 0;
  }
  to {
    max-height: 100px;
    opacity: 1;
  }
}

@media (max-width: 1024px) {
  .main-nav {
    gap: 20px;
  }
  
  .nav-link {
    font-size: 14px;
    padding: 8px 12px;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    height: auto;
    padding: 15px 0;
    gap: 15px;
  }
  
  .main-nav {
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .nav-link {
    padding: 6px 10px;
    font-size: 13px;
  }
  
  .logo h1 {
    font-size: 1.5rem;
  }
  
  .header-actions {
    gap: 10px;
  }
  
  .action-btn {
    width: 45px;
    height: 45px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 15px;
  }
  
  .main-nav {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    width: 100%;
  }
  
  .nav-link {
    justify-content: center;
    text-align: center;
    padding: 8px 4px;
    font-size: 12px;
    flex-direction: column;
    gap: 2px;
  }
  
  .nav-emoji {
    font-size: 1.3rem;
  }
  
  .search-bar {
    flex-direction: column;
    gap: 10px;
  }
}
</style>