<template>
  <div>
    <AppHeader />
    <main class="main-content">
      <div class="shop-container">
        <div class="container">
          <div class="page-header">
            <h1>
              <span class="header-emoji">🛍️</span>
              Notre Boutique
            </h1>
            <p class="page-subtitle">Découvrez toutes nos délicieuses créations artisanales</p>
          </div>

          <div class="shop-controls">
            <div class="filters-section">
              <div class="filter-group">
                <label for="category-filter">Catégorie:</label>
                <select v-model="selectedCategory" @change="applyFilters" id="category-filter">
                  <option value="">Toutes les catégories</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <div class="filter-group">
                <label for="sort-filter">Trier par:</label>
                <select v-model="sortBy" @change="applyFilters" id="sort-filter">
                  <option value="name">Nom (A-Z)</option>
                  <option value="name-desc">Nom (Z-A)</option>
                  <option value="price">Prix (croissant)</option>
                  <option value="price-desc">Prix (décroissant)</option>
                </select>
              </div>

              <div class="filter-group">
                <label for="availability-filter">Disponibilité:</label>
                <select v-model="availabilityFilter" @change="applyFilters" id="availability-filter">
                  <option value="">Tous les produits</option>
                  <option value="available">Disponibles seulement</option>
                  <option value="unavailable">Épuisés seulement</option>
                </select>
              </div>
            </div>

            <div class="search-section">
              <div class="search-box">
                <input 
                  v-model="searchQuery"
                  type="text"
                  placeholder="Rechercher un produit..."
                  @input="debounceSearch"
                  class="search-input"
                />
                <button @click="clearSearch" v-if="searchQuery" class="clear-search">
                  ✕
                </button>
              </div>
            </div>
          </div>

          <div class="results-info">
            <span class="results-count">
              {{ filteredProducts.length }} produit{{ filteredProducts.length !== 1 ? 's' : '' }} trouvé{{ filteredProducts.length !== 1 ? 's' : '' }}
            </span>
            <button @click="clearAllFilters" v-if="hasActiveFilters" class="clear-filters">
              Effacer les filtres
            </button>
          </div>

          <div v-if="loading" class="loading-container">
            <LoadingSpinner message="Chargement des produits..." />
          </div>

          <div v-else-if="filteredProducts.length > 0" class="products-grid">
            <div 
              v-for="product in paginatedProducts" 
              :key="product.id" 
              class="product-card"
              @click="viewProduct(product.id)"
            >
              <div class="product-image">
                <span class="product-emoji">
                  {{ getProductEmoji(product.categoryId) }}
                </span>
                <div class="product-badges">
                  <div v-if="!product.availability" class="product-badge unavailable">
                    Épuisé
                  </div>
                  <div v-if="isNewProduct(product)" class="product-badge new">
                    Nouveau
                  </div>
                </div>
              </div>
              
              <div class="product-info">
                <div class="product-category">{{ getCategoryName(product.categoryId) }}</div>
                <h3 class="product-name">{{ product.name }}</h3>
                <p class="product-description">{{ truncateText(product.description, 100) }}</p>
                
                <div class="product-details">
                  <div class="product-article">Art. {{ product.article }}</div>
                  <div class="product-reviews" v-if="product.reviewCount > 0">
                    ⭐ {{ product.reviewCount }} avis
                  </div>
                </div>
                
                <div class="product-footer">
                  <span class="product-price">{{ formatPrice(product.price) }}€</span>
                  <button 
                    @click.stop="addToCart(product)"
                    :disabled="!product.availability"
                    class="add-to-cart-btn"
                  >
                    {{ product.availability ? '🛒 Ajouter' : '❌ Épuisé' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="no-results">
            <div class="no-results-icon">😔</div>
            <h3>Aucun produit trouvé</h3>
            <p>Essayez de modifier vos critères de recherche ou de navigation.</p>
            <button @click="clearAllFilters" class="btn btn-primary">
              Voir tous les produits
            </button>
          </div>

          <div v-if="totalPages > 1" class="pagination">
            <button 
              @click="currentPage = 1"
              :disabled="currentPage === 1"
              class="pagination-btn"
            >
              ⏮️
            </button>
            <button 
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="pagination-btn"
            >
              ⬅️
            </button>
            
            <span class="pagination-info">
              Page {{ currentPage }} sur {{ totalPages }}
            </span>
            
            <button 
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="pagination-btn"
            >
              ➡️
            </button>
            <button 
              @click="currentPage = totalPages"
              :disabled="currentPage === totalPages"
              class="pagination-btn"
            >
              ⏭️
            </button>
          </div>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

useHead({
  title: 'Boutique - La Petite Boulangerie Française',
  meta: [
    {
      key: 'description',
      name: 'description',
      content: 'Découvrez tous nos produits artisanaux français. Croissants, macarons, baguettes et bien plus encore.'
    }
  ]
})

const loading = ref(true)
const products = ref([])
const categories = ref([])
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('name')
const availabilityFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 12

let searchTimeout = null

const productEmojis = {
  1: '🥐', // Croissants
  2: '🍪', // Macarons
  3: '🥖', // Baguettes
  4: '🥧', // Pastries
  5: '🍰', // Cakes
  6: '🥧', // Tarts
  7: '🍞', // Breads
  9: '🎁', // Gift Sets
  10: '⭐' // Seasonal Specials
}

const filteredProducts = computed(() => {
  let filtered = [...products.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query) ||
      product.article.toLowerCase().includes(query)
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(product => 
      product.categoryId === parseInt(selectedCategory.value)
    )
  }

  if (availabilityFilter.value === 'available') {
    filtered = filtered.filter(product => product.availability)
  } else if (availabilityFilter.value === 'unavailable') {
    filtered = filtered.filter(product => !product.availability)
  }

  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      case 'price':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      default:
        return 0
    }
  })

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage)
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

const hasActiveFilters = computed(() => {
  return searchQuery.value || selectedCategory.value || availabilityFilter.value !== ''
})

const fetchData = async () => {
  try {
    const [categoriesData, productsData] = await Promise.all([
      $fetch('/api/categories').catch(() => []),
      $fetch('/api/products').catch(() => [])
    ])
    
    categories.value = categoriesData
    products.value = productsData
    
    const route = useRoute()
    if (route.query.category) {
      selectedCategory.value = route.query.category
    }
    if (route.query.search) {
      searchQuery.value = route.query.search
    }
    
  } catch (error) {
    console.error('Failed to fetch data:', error)
  } finally {
    loading.value = false
  }
}

const getProductEmoji = (categoryId) => {
  return productEmojis[categoryId] || '🥐'
}

const getCategoryName = (categoryId) => {
  const category = categories.value.find(cat => cat.id === categoryId)
  return category ? category.name : ''
}

const formatPrice = (price) => {
  return price.toFixed(2)
}

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const isNewProduct = (product) => {
  return product.id > 10
}

const viewProduct = (productId) => {
  navigateTo(`/product/${productId}`)
}

const addToCart = (product) => {
  console.log('Add to cart:', product)
}

const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 300)
}

const clearSearch = () => {
  searchQuery.value = ''
  applyFilters()
}

const applyFilters = () => {
  currentPage.value = 1
  updateURL()
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  availabilityFilter.value = ''
  sortBy.value = 'name'
  currentPage.value = 1
  updateURL()
}

const updateURL = () => {
  const query = {}
  
  if (searchQuery.value) query.search = searchQuery.value
  if (selectedCategory.value) query.category = selectedCategory.value
  if (availabilityFilter.value) query.availability = availabilityFilter.value
  if (sortBy.value !== 'name') query.sort = sortBy.value
  if (currentPage.value > 1) query.page = currentPage.value
  
  navigateTo({ 
    path: '/shop', 
    query: Object.keys(query).length ? query : undefined 
  }, { replace: true })
}

watch(() => currentPage.value, () => {
  updateURL()
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.main-content {
  min-height: calc(100vh - 140px);
  background: #f8f9fa;
}

.shop-container {
  padding: 40px 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 50px;
}

.page-header h1 {
  font-size: 3rem;
  color: #2d3436;
  font-family: 'Playfair Display SC', serif;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.header-emoji {
  font-size: 1.2em;
}

.page-subtitle {
  font-size: 1.2rem;
  color: #636e72;
  font-family: 'Quicksand', sans-serif;
  margin: 0;
}

.shop-controls {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 2px solid #e9ecef;
}

.filters-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-weight: 600;
  color: #2d3436;
  font-family: 'Quicksand', sans-serif;
}

.filter-group select {
  padding: 12px 15px;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-family: 'Quicksand', sans-serif;
  font-size: 14px;
  transition: all 0.3s ease;
}

.filter-group select:focus {
  outline: none;
  border-color: #74b9ff;
  box-shadow: 0 0 0 3px rgba(116, 185, 255, 0.2);
}

.search-section {
  border-top: 1px solid #e9ecef;
  padding-top: 25px;
}

.search-box {
  position: relative;
  max-width: 400px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 15px 50px 15px 20px;
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

.clear-search {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #7f8c8d;
  cursor: pointer;
  font-size: 18px;
  transition: color 0.3s ease;
}

.clear-search:hover {
  color: #e74c3c;
}

.results-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 0 10px;
}

.results-count {
  font-weight: 600;
  color: #2d3436;
  font-family: 'Quicksand', sans-serif;
}

.clear-filters {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 15px;
  font-family: 'Quicksand', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-filters:hover {
  background: #c0392b;
  transform: translateY(-1px);
}

.loading-container {
  text-align: center;
  padding: 80px 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
}

.product-card {
  background: white;
  border-radius: 20px;
  border: 2px solid #e9ecef;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 35px rgba(116, 185, 255, 0.2);
  border-color: #74b9ff;
}

.product-image {
  height: 200px;
  background: linear-gradient(135deg, #ffeaa7, #fab1a0);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.product-emoji {
  font-size: 4rem;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1));
}

.product-badges {
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-badge {
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
}

.product-badge.unavailable {
  background: #e74c3c;
  color: white;
}

.product-badge.new {
  background: #00b894;
  color: white;
}

.product-info {
  padding: 25px;
}

.product-category {
  color: #74b9ff;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  font-family: 'Quicksand', sans-serif;
}

.product-name {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d3436;
  margin-bottom: 10px;
  font-family: 'Playfair Display', serif;
  line-height: 1.3;
}

.product-description {
  color: #636e72;
  line-height: 1.5;
  margin-bottom: 15px;
  font-family: 'Quicksand', sans-serif;
  font-size: 0.95rem;
}

.product-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 0.85rem;
}

.product-article {
  color: #7f8c8d;
  font-family: 'VT323', monospace;
  background: #f8f9fa;
  padding: 2px 8px;
  border-radius: 10px;
}

.product-reviews {
  color: #f39c12;
  font-family: 'Quicksand', sans-serif;
  font-weight: 500;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #74b9ff;
  font-family: 'VT323', monospace;
}

.add-to-cart-btn {
  background: linear-gradient(135deg, #00b894, #00a085);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-family: 'Quicksand', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.add-to-cart-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 184, 148, 0.3);
}

.add-to-cart-btn:disabled {
  background: #95a5a6;
  cursor: not-allowed;
  transform: none;
}

.no-results {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 20px;
  border: 2px solid #e9ecef;
}

.no-results-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.no-results h3 {
  font-size: 1.8rem;
  color: #2d3436;
  margin-bottom: 15px;
  font-family: 'Playfair Display', serif;
}

.no-results p {
  color: #636e72;
  margin-bottom: 30px;
  font-family: 'Quicksand', sans-serif;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 25px;
  font-weight: 600;
  font-family: 'Quicksand', sans-serif;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background: linear-gradient(135deg, #74b9ff, #0984e3);
  color: white;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 50px;
  padding: 30px 0;
}

.pagination-btn {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #74b9ff;
  background: #74b9ff;
  color: white;
  transform: translateY(-2px);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f8f9fa;
}

.pagination-info {
  background: white;
  border: 2px solid #74b9ff;
  color: #74b9ff;
  padding: 12px 20px;
  border-radius: 25px;
  font-weight: 600;
  font-family: 'Quicksand', sans-serif;
  margin: 0 10px;
}

@media (max-width: 1024px) {
  .filters-section {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 25px;
  }
}

@media (max-width: 768px) {
  .shop-container {
    padding: 30px 0;
  }
  
  .page-header h1 {
    font-size: 2.5rem;
  }
  
  .shop-controls {
    padding: 20px;
  }
  
  .filters-section {
    grid-template-columns: 1fr;
    gap: 15px;
    margin-bottom: 20px;
  }
  
  .search-section {
    padding-top: 20px;
  }
  
  .results-info {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
    text-align: center;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .product-info {
    padding: 20px;
  }
  
  .pagination {
    gap: 10px;
    flex-wrap: wrap;
  }
  
  .pagination-btn {
    width: 45px;
    height: 45px;
    font-size: 1rem;
  }
  
  .pagination-info {
    order: -1;
    margin: 0;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 15px;
  }
  
  .page-header h1 {
    font-size: 2rem;
    flex-direction: column;
    gap: 10px;
  }
  
  .shop-controls {
    padding: 15px;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .product-details {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
  
  .product-footer {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .add-to-cart-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>