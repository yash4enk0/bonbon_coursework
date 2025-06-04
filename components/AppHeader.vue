<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <NuxtLink to="/" class="logo">
          <h1>CRUD App</h1>
        </NuxtLink>
        
        <nav class="main-nav">
          <NuxtLink to="/" class="nav-link">Home</NuxtLink>
          <NuxtLink to="/categories" class="nav-link">Categories</NuxtLink>
          <NuxtLink to="/users" class="nav-link">Users</NuxtLink>
          <NuxtLink to="/products" class="nav-link">Products</NuxtLink>
          <NuxtLink to="/about" class="nav-link">About</NuxtLink>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background-color: #343a40;
  color: white;
  padding: 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
  color: white;
}

.logo h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.logo:hover {
  color: #007bff;
}

.main-nav {
  display: flex;
  gap: 30px;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
  background-color: #007bff;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    height: auto;
    padding: 15px 0;
  }
  
  .main-nav {
    margin-top: 15px;
    flex-wrap: wrap;
    gap: 15px;
  }
}
</style>