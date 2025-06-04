<template>
  <div>
    <AppHeader />
    <main class="main-content">
      <div class="hero-section">
        <div class="container">
          <h1>CRUD Application</h1>
          <p class="hero-description">
            Reference Management System based on Nuxt.js and PostgreSQL
          </p>
          
          <div class="features-grid">
            <div class="feature-card">
              <h3>Categories</h3>
              <p>Manage product categories</p>
              <NuxtLink to="/categories" class="btn btn-primary">
                Go to Categories
              </NuxtLink>
            </div>
            
            <div class="feature-card">
              <h3>Users</h3>
              <p>Manage system users</p>
              <NuxtLink to="/users" class="btn btn-primary">
                Go to Users
              </NuxtLink>
            </div>
            
            <div class="feature-card">
              <h3>Products</h3>
              <p>Manage product catalog</p>
              <NuxtLink to="/products" class="btn btn-primary">
                Go to Products
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
useHead({
  title: 'CRUD Application - Home',
  meta: [
    {
      name: 'description',
      content: 'CRUD application for reference management'
    }
  ]
})
</script>

<style scoped>
.main-content {
  min-height: calc(100vh - 120px);
  background-color: #f8f9fa;
}

.hero-section {
  padding: 60px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-section h1 {
  text-align: center;
  font-size: 48px;
  margin-bottom: 20px;
  color: #333;
}

.hero-description {
  text-align: center;
  font-size: 20px;
  color: #6c757d;
  margin-bottom: 50px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 900px;
  margin: 0 auto;
}

.feature-card {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 24px;
}

.feature-card p {
  color: #6c757d;
  margin-bottom: 20px;
  line-height: 1.6;
}

.btn {
  display: inline-block;
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 36px;
  }
  
  .hero-description {
    font-size: 18px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>