<template>
  <div>
    <AppHeader />
    <main class="main-content">
      <div class="hero-section">
        <div class="container">
          <div class="hero-content">
            <div class="hero-text">
              <h1>🍞 BonBon Bakery</h1>
              <h2>CRUD Management System</h2>
              <p class="hero-description">
                Professional reference management system built with Nuxt.js, PostgreSQL & Prisma ORM.
                Manage your bakery's categories, users, and products with style and efficiency.
              </p>
              
              <div class="hero-stats">
                <div class="hero-stat">
                  <span class="stat-number">{{ stats.total }}</span>
                  <span class="stat-label">Total Records</span>
                </div>
                <div class="hero-stat">
                  <span class="stat-number">{{ stats.categories }}</span>
                  <span class="stat-label">Categories</span>
                </div>
                <div class="hero-stat">
                  <span class="stat-number">{{ stats.products }}</span>
                  <span class="stat-label">Products</span>
                </div>
                <div class="hero-stat">
                  <span class="stat-number">{{ stats.users }}</span>
                  <span class="stat-label">Users</span>
                </div>
              </div>

              <div class="hero-actions">
                <NuxtLink to="/dashboard" class="btn btn-primary btn-large">
                  📊 View Dashboard
                </NuxtLink>
                <NuxtLink to="/products" class="btn btn-secondary btn-large">
                  🥐 Browse Products
                </NuxtLink>
              </div>
            </div>
            
            <div class="hero-image">
              <div class="bakery-showcase">
                <div class="bakery-item">🥐</div>
                <div class="bakery-item">🍞</div>
                <div class="bakery-item">🧁</div>
                <div class="bakery-item">🥖</div>
                <div class="bakery-item">🍰</div>
                <div class="bakery-item">🥯</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="features-section">
        <div class="container">
          <h2 class="section-title">
            <span class="title-emoji">✨</span>
            Management Features
          </h2>
          
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">📋</div>
              <h3>Categories</h3>
              <p>Organize your bakery products into logical categories. Easy inline editing and smart validation.</p>
              <ul class="feature-list">
                <li>✅ Inline table editing</li>
                <li>✅ Dependency protection</li>
                <li>✅ Real-time validation</li>
              </ul>
              <NuxtLink to="/categories" class="feature-btn">
                Manage Categories →
              </NuxtLink>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">👥</div>
              <h3>Users</h3>
              <p>Complete user management with secure authentication. Handle customers and administrators efficiently.</p>
              <ul class="feature-list">
                <li>🔐 bcrypt password encryption</li>
                <li>👨‍💼 Admin role management</li>
                <li>🎁 Bonus points system</li>
              </ul>
              <NuxtLink to="/users" class="feature-btn">
                Manage Users →
              </NuxtLink>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">🥐</div>
              <h3>Products</h3>
              <p>Advanced product catalog with pricing, availability, and category relationships. Perfect for inventory management.</p>
              <ul class="feature-list">
                <li>💰 Price management</li>
                <li>📦 Stock availability</li>
                <li>🔗 Category relationships</li>
              </ul>
              <NuxtLink to="/products" class="feature-btn">
                Manage Products →
              </NuxtLink>
            </div>

            <div class="feature-card">
              <div class="feature-icon">📊</div>
              <h3>Analytics</h3>
              <p>Comprehensive dashboard with real-time statistics, activity tracking, and data export capabilities.</p>
              <ul class="feature-list">
                <li>📈 Real-time statistics</li>
                <li>📋 Activity monitoring</li>
                <li>💾 Data export (CSV)</li>
              </ul>
              <NuxtLink to="/dashboard" class="feature-btn">
                View Dashboard →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <div class="tech-section">
        <div class="container">
          <h2 class="section-title">
            <span class="title-emoji">🛠️</span>
            Built with Modern Technologies
          </h2>
          
          <div class="tech-grid">
            <div class="tech-item">
              <div class="tech-icon">⚡</div>
              <h4>Nuxt.js 3</h4>
              <p>Full-stack framework with server-side rendering</p>
            </div>
            <div class="tech-item">
              <div class="tech-icon">🐘</div>
              <h4>PostgreSQL</h4>
              <p>Robust relational database with ACID compliance</p>
            </div>
            <div class="tech-item">
              <div class="tech-icon">🔺</div>
              <h4>Prisma ORM</h4>
              <p>Type-safe database access with migrations</p>
            </div>
            <div class="tech-item">
              <div class="tech-icon">🎨</div>
              <h4>Vue 3</h4>
              <p>Reactive UI with Composition API</p>
            </div>
            <div class="tech-item">
              <div class="tech-icon">🔐</div>
              <h4>bcrypt</h4>
              <p>Secure password hashing and authentication</p>
            </div>
            <div class="tech-item">
              <div class="tech-icon">📱</div>
              <h4>Responsive</h4>
              <p>Works perfectly on all devices and screen sizes</p>
            </div>
          </div>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

useHead({
  title: 'BonBon Bakery - CRUD Management System',
  meta: [
    {
      key: 'description',
      name: 'description',
      content: 'Professional bakery management system with CRUD operations for categories, users, and products'
    }
  ]
})

const stats = ref({
  total: 0,
  categories: 0,
  users: 0,
  products: 0
})

const fetchStats = async () => {
  try {
    const [categoriesData, usersData, productsData] = await Promise.all([
      $fetch('/api/categories').catch(() => []),
      $fetch('/api/users').catch(() => []),
      $fetch('/api/products').catch(() => [])
    ])
    
    stats.value = {
      categories: categoriesData.length,
      users: usersData.length,
      products: productsData.length,
      total: categoriesData.length + usersData.length + productsData.length
    }
  } catch (error) {
    console.error('Failed to fetch stats:', error)
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
.main-content {
  min-height: calc(100vh - 140px);
}

.hero-section {
  background: linear-gradient(135deg, #f5f6fa 0%, #ffeaa7 100%);
  padding: 80px 0;
  border-bottom: 3px solid #fdcb6e;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero-text h1 {
  font-size: 3.5rem;
  margin: 0 0 10px 0;
  color: #2d3436;
  font-family: 'Playfair Display SC', serif;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.8);
}

.hero-text h2 {
  font-size: 1.8rem;
  margin: 0 0 20px 0;
  color: #74b9ff;
  font-family: 'VT323', monospace;
  font-weight: bold;
}

.hero-description {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #636e72;
  margin-bottom: 30px;
  font-family: 'VT323', monospace;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 30px 0;
  padding: 20px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 15px;
  border: 2px solid #fab1a0;
}

.hero-stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #74b9ff;
  font-family: 'VT323', monospace;
}

.stat-label {
  font-size: 0.85rem;
  color: #636e72;
  font-family: 'Quicksand', sans-serif;
  font-weight: 500;
}

.hero-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 25px;
  font-weight: bold;
  font-family: 'VT323', monospace;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn-large {
  padding: 16px 32px;
  font-size: 1.1rem;
}

.btn-primary {
  background: linear-gradient(135deg, #74b9ff, #0984e3);
  color: white;
}

.btn-secondary {
  background: linear-gradient(135deg, #fab1a0, #e17055);
  color: white;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.bakery-showcase {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 300px;
}

.bakery-item {
  font-size: 4rem;
  text-align: center;
  animation: float 3s ease-in-out infinite;
  transition: transform 0.3s ease;
}

.bakery-item:nth-child(1) { animation-delay: 0s; }
.bakery-item:nth-child(2) { animation-delay: 0.5s; }
.bakery-item:nth-child(3) { animation-delay: 1s; }
.bakery-item:nth-child(4) { animation-delay: 1.5s; }
.bakery-item:nth-child(5) { animation-delay: 2s; }
.bakery-item:nth-child(6) { animation-delay: 2.5s; }

.bakery-item:hover {
  transform: scale(1.2) rotate(10deg);
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.features-section {
  padding: 80px 0;
  background: white;
}

.tech-section {
  padding: 80px 0;
  background: #f8f9fa;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 50px;
  color: #2d3436;
  font-family: 'Playfair Display SC', serif;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.title-emoji {
  font-size: 1.2em;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.feature-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 234, 167, 0.3));
  border: 2px solid #fdcb6e;
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 35px rgba(116, 185, 255, 0.2);
}

.feature-icon {
  font-size: 3.5rem;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #2d3436;
  font-family: 'Playfair Display SC', serif;
}

.feature-card p {
  color: #636e72;
  line-height: 1.6;
  margin-bottom: 20px;
  font-family: 'VT323', monospace;
  font-size: 1rem;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 20px 0;
  text-align: left;
}

.feature-list li {
  color: #636e72;
  margin-bottom: 8px;
  font-family: 'VT323', monospace;
  font-size: 0.9rem;
}

.feature-btn {
  display: inline-block;
  color: #74b9ff;
  text-decoration: none;
  font-weight: bold;
  font-family: 'VT323', monospace;
  transition: color 0.2s ease;
}

.feature-btn:hover {
  color: #0984e3;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 25px;
}

.tech-item {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  transition: all 0.3s ease;
}

.tech-item:hover {
  border-color: #74b9ff;
  transform: translateY(-3px);
}

.tech-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.tech-item h4 {
  margin: 0 0 10px 0;
  color: #2d3436;
  font-family: 'Quicksand', sans-serif;
  font-weight: 600;
}

.tech-item p {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.4;
  font-family: 'VT323', monospace;
}

@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
  
  .hero-text h1 {
    font-size: 2.5rem;
  }
  
  .hero-text h2 {
    font-size: 1.5rem;
  }
  
  .hero-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .bakery-showcase {
    grid-template-columns: repeat(2, 1fr);
    max-width: 200px;
  }
  
  .bakery-item {
    font-size: 3rem;
  }
  
  .section-title {
    font-size: 2rem;
    margin-bottom: 30px;
  }
  
  .features-grid, .tech-grid {
    grid-template-columns: 1fr;
  }
  
  .hero-section, .features-section, .tech-section {
    padding: 50px 0;
  }
}
</style>