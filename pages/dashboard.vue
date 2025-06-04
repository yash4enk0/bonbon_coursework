<template>
  <div>
    <AppHeader />
    <main class="main-content">
      <div class="dashboard">
        <div class="container">
          <div class="dashboard-header">
            <h1>
              <span class="header-emoji">📊</span>
              Dashboard
            </h1>
            <div class="last-updated">
              Last updated: {{ formatTime(lastUpdated) }}
            </div>
          </div>

          <LoadingSpinner v-if="loading" message="Loading statistics..." />
          
          <div v-else class="stats-grid">
            <!-- Categories Stats -->
            <div class="stat-card">
              <div class="stat-header">
                <h3>
                  <span class="stat-emoji">📋</span>
                  Categories
                </h3>
                <NuxtLink to="/categories" class="stat-link">View all</NuxtLink>
              </div>
              <div class="stat-number">{{ stats.categories.total }}</div>
              <div class="stat-details">
                <div class="stat-item">
                  <span class="detail-label">Most Popular:</span>
                  <span class="detail-value">{{ stats.categories.mostPopular?.name || 'N/A' }}</span>
                </div>
                <div class="stat-item">
                  <span class="detail-label">Products:</span>
                  <span class="detail-value">{{ stats.categories.mostPopular?.productCount || 0 }}</span>
                </div>
              </div>
            </div>

            <!-- Users Stats -->
            <div class="stat-card">
              <div class="stat-header">
                <h3>
                  <span class="stat-emoji">👥</span>
                  Users
                </h3>
                <NuxtLink to="/users" class="stat-link">View all</NuxtLink>
              </div>
              <div class="stat-number">{{ stats.users.total }}</div>
              <div class="stat-details">
                <div class="stat-item">
                  <span class="detail-label">Admins:</span>
                  <span class="detail-value">{{ stats.users.admins }}</span>
                </div>
                <div class="stat-item">
                  <span class="detail-label">Regular Users:</span>
                  <span class="detail-value">{{ stats.users.regular }}</span>
                </div>
                <div class="stat-item">
                  <span class="detail-label">Total Bonus Points:</span>
                  <span class="detail-value">🎁 {{ stats.users.totalBonusPoints }}</span>
                </div>
              </div>
            </div>

            <!-- Products Stats -->
            <div class="stat-card">
              <div class="stat-header">
                <h3>
                  <span class="stat-emoji">🥐</span>
                  Products
                </h3>
                <NuxtLink to="/products" class="stat-link">View all</NuxtLink>
              </div>
              <div class="stat-number">{{ stats.products.total }}</div>
              <div class="stat-details">
                <div class="stat-item">
                  <span class="detail-label">Available:</span>
                  <span class="detail-value available">✅ {{ stats.products.available }}</span>
                </div>
                <div class="stat-item">
                  <span class="detail-label">Out of Stock:</span>
                  <span class="detail-value unavailable">❌ {{ stats.products.unavailable }}</span>
                </div>
                <div class="stat-item">
                  <span class="detail-label">Avg Price:</span>
                  <span class="detail-value">💰 ${{ stats.products.avgPrice }}</span>
                </div>
              </div>
            </div>

            <!-- System Stats -->
            <div class="stat-card">
              <div class="stat-header">
                <h3>
                  <span class="stat-emoji">⚙️</span>
                  System
                </h3>
                <button @click="refreshStats" class="stat-link refresh-btn">
                  <span class="refresh-icon">🔄</span>
                  Refresh
                </button>
              </div>
              <div class="stat-number">{{ stats.system.totalRecords }}</div>
              <div class="stat-details">
                <div class="stat-item">
                  <span class="detail-label">Database Size:</span>
                  <span class="detail-value">{{ stats.system.dbSize }}</span>
                </div>
                <div class="stat-item">
                  <span class="detail-label">Last Backup:</span>
                  <span class="detail-value">{{ stats.system.lastBackup }}</span>
                </div>
                <div class="stat-item">
                  <span class="detail-label">Status:</span>
                  <span class="detail-value healthy">🟢 Healthy</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div v-if="!loading" class="recent-activity">
            <h2>
              <span class="section-emoji">📈</span>
              Recent Activity
            </h2>
            <div class="activity-list">
              <div v-for="activity in recentActivity" :key="activity.id" class="activity-item">
                <div class="activity-icon">{{ activity.icon }}</div>
                <div class="activity-content">
                  <div class="activity-title">{{ activity.title }}</div>
                  <div class="activity-time">{{ formatTime(activity.time) }}</div>
                </div>
                <div class="activity-type" :class="activity.type">
                  {{ activity.typeLabel }}
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div v-if="!loading" class="quick-actions">
            <h2>
              <span class="section-emoji">⚡</span>
              Quick Actions
            </h2>
            <div class="actions-grid">
              <NuxtLink to="/categories" class="action-card">
                <div class="action-icon">📋</div>
                <div class="action-title">Add Category</div>
                <div class="action-subtitle">Create new product category</div>
              </NuxtLink>
              
              <NuxtLink to="/users" class="action-card">
                <div class="action-icon">👤</div>
                <div class="action-title">Add User</div>
                <div class="action-subtitle">Register new user</div>
              </NuxtLink>
              
              <NuxtLink to="/products" class="action-card">
                <div class="action-icon">🥐</div>
                <div class="action-title">Add Product</div>
                <div class="action-subtitle">Add new bakery item</div>
              </NuxtLink>
              
              <button @click="exportData" class="action-card">
                <div class="action-icon">📊</div>
                <div class="action-title">Export Data</div>
                <div class="action-subtitle">Download CSV reports</div>
              </button>
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
  title: 'Dashboard - CRUD Application',
  meta: [
    {
      key: 'description',
      name: 'description',
      content: 'Dashboard with statistics and system overview'
    }
  ]
})

const loading = ref(true)
const lastUpdated = ref(new Date())

const stats = ref({
  categories: {
    total: 0,
    mostPopular: null
  },
  users: {
    total: 0,
    admins: 0,
    regular: 0,
    totalBonusPoints: 0
  },
  products: {
    total: 0,
    available: 0,
    unavailable: 0,
    avgPrice: '0.00'
  },
  system: {
    totalRecords: 0,
    dbSize: 'Unknown',
    lastBackup: 'Never'
  }
})

const recentActivity = ref([
  {
    id: 1,
    icon: '🥐',
    title: 'New product "Classic Butter Croissant" added',
    time: new Date(Date.now() - 2 * 60 * 1000),
    type: 'create',
    typeLabel: 'Created'
  },
  {
    id: 2,
    icon: '👤',
    title: 'User "Oliver Brown" updated profile',
    time: new Date(Date.now() - 15 * 60 * 1000),
    type: 'update',
    typeLabel: 'Updated'
  },
  {
    id: 3,
    icon: '📋',
    title: 'Category "Seasonal Specials" created',
    time: new Date(Date.now() - 30 * 60 * 1000),
    type: 'create',
    typeLabel: 'Created'
  },
  {
    id: 4,
    icon: '🗑️',
    title: 'Product "Old Item" deleted',
    time: new Date(Date.now() - 60 * 60 * 1000),
    type: 'delete',
    typeLabel: 'Deleted'
  }
])

const fetchStats = async () => {
  loading.value = true
  try {
    // Fetch all data in parallel
    const [categoriesData, usersData, productsData] = await Promise.all([
      $fetch('/api/categories'),
      $fetch('/api/users'),
      $fetch('/api/products')
    ])

    // Calculate categories stats
    const categoryProductCounts = {}
    productsData.forEach(product => {
      categoryProductCounts[product.categoryName] = (categoryProductCounts[product.categoryName] || 0) + 1
    })
    
    const mostPopularCategory = categoriesData.find(cat => 
      cat.name === Object.keys(categoryProductCounts).reduce((a, b) => 
        categoryProductCounts[a] > categoryProductCounts[b] ? a : b, Object.keys(categoryProductCounts)[0]
      )
    )

    stats.value.categories = {
      total: categoriesData.length,
      mostPopular: mostPopularCategory ? {
        name: mostPopularCategory.name,
        productCount: categoryProductCounts[mostPopularCategory.name] || 0
      } : null
    }

    // Calculate users stats
    const adminCount = usersData.filter(user => user.isAdmin).length
    const totalBonusPoints = usersData.reduce((sum, user) => sum + (user.bonusPoints || 0), 0)

    stats.value.users = {
      total: usersData.length,
      admins: adminCount,
      regular: usersData.length - adminCount,
      totalBonusPoints
    }

    // Calculate products stats
    const availableCount = productsData.filter(product => product.availability).length
    const avgPrice = productsData.length > 0 
      ? (productsData.reduce((sum, product) => sum + product.price, 0) / productsData.length).toFixed(2)
      : '0.00'

    stats.value.products = {
      total: productsData.length,
      available: availableCount,
      unavailable: productsData.length - availableCount,
      avgPrice
    }

    // System stats
    stats.value.system = {
      totalRecords: categoriesData.length + usersData.length + productsData.length,
      dbSize: '2.3 MB',
      lastBackup: 'Today, 02:00 AM'
    }

    lastUpdated.value = new Date()
  } catch (error) {
    console.error('Failed to fetch stats:', error)
  } finally {
    loading.value = false
  }
}

const refreshStats = async () => {
  await fetchStats()
  // You could add a toast notification here
}

const exportData = () => {
  // Simple CSV export simulation
  const csvContent = "data:text/csv;charset=utf-8," 
    + "Type,Name,Count\n"
    + `Categories,Total,${stats.value.categories.total}\n`
    + `Users,Total,${stats.value.users.total}\n`
    + `Products,Total,${stats.value.products.total}\n`
  
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `bakery_stats_${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const formatTime = (date) => {
  const now = new Date()
  const diff = now - new Date(date)
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  return 'Just now'
}

onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
.main-content {
  min-height: calc(100vh - 140px);
}

.dashboard {
  padding: 30px 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.dashboard-header h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 600;
  color: #2c3e50;
  font-family: 'Quicksand', sans-serif;
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-emoji {
  font-size: 1.2em;
}

.last-updated {
  color: #7f8c8d;
  font-size: 0.9rem;
  font-family: 'VT323', monospace;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 50px;
}

.stat-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 234, 167, 0.3));
  border-radius: 20px;
  padding: 25px;
  border: 2px solid #fdcb6e;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 35px rgba(116, 185, 255, 0.2);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.stat-header h3 {
  margin: 0;
  color: #2d3436;
  font-family: 'Playfair Display SC', serif;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-emoji {
  font-size: 1.1em;
}

.stat-link {
  color: #74b9ff;
  text-decoration: none;
  font-family: 'VT323', monospace;
  font-weight: bold;
  transition: color 0.2s ease;
}

.stat-link:hover {
  color: #0984e3;
}

.refresh-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.refresh-icon {
  animation: spin 2s linear infinite;
}

.stat-number {
  font-size: 3rem;
  font-weight: bold;
  color: #74b9ff;
  margin-bottom: 15px;
  font-family: 'VT323', monospace;
}

.stat-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'VT323', monospace;
}

.detail-label {
  color: #636e72;
  font-size: 0.9rem;
}

.detail-value {
  color: #2d3436;
  font-weight: bold;
}

.detail-value.available {
  color: #27ae60;
}

.detail-value.unavailable {
  color: #e74c3c;
}

.detail-value.healthy {
  color: #27ae60;
}

.recent-activity, .quick-actions {
  margin-bottom: 40px;
}

.recent-activity h2, .quick-actions h2 {
  color: #2d3436;
  font-family: 'Playfair Display SC', serif;
  font-size: 1.8rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-emoji {
  font-size: 1.1em;
}

.activity-list {
  background: white;
  border-radius: 15px;
  border: 2px solid #ddd;
  overflow: hidden;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  transition: background 0.2s ease;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-item:hover {
  background: #f8f9fa;
}

.activity-icon {
  font-size: 1.5rem;
  margin-right: 15px;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-title {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 4px;
  font-family: 'Quicksand', sans-serif;
}

.activity-time {
  color: #7f8c8d;
  font-size: 0.85rem;
  font-family: 'VT323', monospace;
}

.activity-type {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
  font-family: 'VT323', monospace;
}

.activity-type.create {
  background: #d5f4e6;
  color: #27ae60;
}

.activity-type.update {
  background: #ffeaa7;
  color: #f39c12;
}

.activity-type.delete {
  background: #fadbd8;
  color: #e74c3c;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.action-card {
  background: linear-gradient(135deg, #fff, #f8f9fa);
  border: 2px solid #e9ecef;
  border-radius: 15px;
  padding: 20px;
  text-decoration: none;
  color: inherit;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.action-card:hover {
  transform: translateY(-3px);
  border-color: #74b9ff;
  box-shadow: 0 8px 25px rgba(116, 185, 255, 0.2);
}

.action-icon {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.action-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 5px;
  font-family: 'Quicksand', sans-serif;
}

.action-subtitle {
  color: #7f8c8d;
  font-size: 0.85rem;
  font-family: 'VT323', monospace;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 20px 0;
  }
  
  .container {
    padding: 0 15px;
  }
  
  .dashboard-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .dashboard-header h1 {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .stat-card {
    padding: 20px;
  }
  
  .stat-number {
    font-size: 2.5rem;
  }
  
  .actions-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .action-card {
    padding: 15px;
  }
  
  .action-icon {
    font-size: 2rem;
  }
}
</style>