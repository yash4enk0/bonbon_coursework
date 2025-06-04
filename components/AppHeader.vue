<!-- components/AppHeader.vue -->
<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <NuxtLink to="/" class="logo">
          <span class="logo-emoji">🍞</span>
          <h1>BonBon</h1>
        </NuxtLink>
        
        <nav class="main-nav">
          <NuxtLink to="/" class="nav-link">
            <span class="nav-emoji">🏠</span>
            Home
          </NuxtLink>
          <NuxtLink to="/categories" class="nav-link">
            <span class="nav-emoji">📋</span>
            Categories
          </NuxtLink>
          <NuxtLink to="/users" class="nav-link">
            <span class="nav-emoji">👥</span>
            Users
          </NuxtLink>
          <NuxtLink to="/products" class="nav-link">
            <span class="nav-emoji">🥐</span>
            Products
          </NuxtLink>
          <NuxtLink to="/about" class="nav-link">
            <span class="nav-emoji">ℹ️</span>
            About
          </NuxtLink>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: white;
  border-bottom: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
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
}

.logo-emoji {
  font-size: 1.5rem;
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
  font-family: 'Quicksand', sans-serif;
  font-weight: 600;
}

.main-nav {
  display: flex;
  gap: 30px;
}

.nav-link {
  color: #7f8c8d;
  text-decoration: none;
  font-weight: 500;
  font-family: 'Quicksand', sans-serif;
  font-size: 15px;
  padding: 8px 0;
  transition: color 0.2s ease;
  position: relative;
}

.nav-emoji {
  margin-right: 6px;
}

.nav-link:hover {
  color: #2c3e50;
}

.nav-link.router-link-active {
  color: #3498db;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #3498db;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    height: auto;
    padding: 15px 0;
    gap: 15px;
  }
  
  .main-nav {
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .container {
    padding: 0 15px;
  }
}
</style>