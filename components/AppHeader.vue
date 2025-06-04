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
          <NuxtLink to="/dashboard" class="nav-link">
            <span class="nav-emoji">📊</span>
            Dashboard
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
  position: sticky;
  top: 0;
  z-index: 100;
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
  transform: scale(1.05);
}

.logo-emoji {
  font-size: 1.5rem;
  animation: bounce 2s infinite;
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
  font-family: 'Playfair Display SC', serif;
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
}

.main-nav {
  display: flex;
  gap: 25px;
}

.nav-link {
  color: #7f8c8d;
  text-decoration: none;
  font-weight: 500;
  font-family: 'Quicksand', sans-serif;
  font-size: 15px;
  padding: 8px 12px;
  border-radius: 20px;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-emoji {
  font-size: 1rem;
}

.nav-link:hover {
  color: #2c3e50;
  background: rgba(116, 185, 255, 0.1);
  transform: translateY(-1px);
}

.nav-link.router-link-active {
  color: #74b9ff;
  background: linear-gradient(135deg, rgba(116, 185, 255, 0.2), rgba(255, 234, 167, 0.3));
  border: 2px solid rgba(116, 185, 255, 0.3);
  font-weight: 600;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background: #74b9ff;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
  60% {
    transform: translateY(-3px);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(116, 185, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(116, 185, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(116, 185, 255, 0);
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
    gap: 15px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .nav-link {
    padding: 6px 10px;
    font-size: 14px;
  }
  
  .container {
    padding: 0 15px;
  }
  
  .logo h1 {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .main-nav {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    width: 100%;
    display: grid;
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
    font-size: 1.2rem;
  }
}
</style>