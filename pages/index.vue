<template>
  <div>
    <AppHeader />
    <main class="main-content">
      <section class="hero-section">
        <div class="container">
          <div class="hero-content">
            <div class="hero-text">
              <h1>🥐 La Petite Boulangerie Française</h1>
              <h2>Authentique pâtisserie artisanale</h2>
              <p class="hero-description">
                Découvrez nos délicieuses créations françaises, préparées chaque jour avec amour et savoir-faire traditionnel. 
                De nos croissants dorés aux macarons colorés, chaque bouchée vous transporte au cœur de Paris.
              </p>
              
              <div class="hero-actions">
                <NuxtLink to="/shop" class="btn btn-primary btn-large">
                  🛍️ Découvrir nos produits
                </NuxtLink>
                <NuxtLink to="/categories" class="btn btn-secondary btn-large">
                  📋 Nos catégories
                </NuxtLink>
              </div>
            </div>
            
            <div class="hero-image">
              <div class="bakery-showcase">
                <div class="bakery-item floating">🥐</div>
                <div class="bakery-item floating">🥖</div>
                <div class="bakery-item floating">🍰</div>
                <div class="bakery-item floating">🧁</div>
                <div class="bakery-item floating">🥯</div>
                <div class="bakery-item floating">🥧</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="featured-section">
        <div class="container">
          <h2 class="section-title">
            <span class="title-emoji">⭐</span>
            Nos Spécialités
          </h2>
          
          <div v-if="loading" class="loading-container">
            <LoadingSpinner message="Chargement des produits..." />
          </div>
          
          <div v-else class="products-grid">
            <div 
              v-for="product in featuredProducts" 
              :key="product.id" 
              class="product-card"
              @click="viewProduct(product.id)"
            >
              <div class="product-image">
                <span class="product-emoji">
                  {{ getProductEmoji(product.categoryId) }}
                </span>
                <div class="product-badge" v-if="!product.availability">
                  Épuisé
                </div>
              </div>
              
              <div class="product-info">
                <h3 class="product-name">{{ product.name }}</h3>
                <p class="product-description">{{ truncateText(product.description, 80) }}</p>
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
          
          <div class="section-footer">
            <NuxtLink to="/shop" class="btn btn-outline">
              Voir tous nos produits →
            </NuxtLink>
          </div>
        </div>
      </section>

      <section class="categories-section">
        <div class="container">
          <h2 class="section-title">
            <span class="title-emoji">🏷️</span>
            Nos Catégories
          </h2>
          
          <div class="categories-grid">
            <NuxtLink 
              v-for="category in categories" 
              :key="category.id"
              :to="`/shop?category=${category.id}`"
              class="category-card"
            >
              <div class="category-icon">
                {{ getCategoryEmoji(category.name) }}
              </div>
              <h3>{{ category.name }}</h3>
              <span class="category-count">{{ getCategoryProductCount(category.id) }} produits</span>
            </NuxtLink>
          </div>
        </div>
      </section>

      <section class="about-section">
        <div class="container">
          <div class="about-content">
            <div class="about-text">
              <h2>
                <span class="title-emoji">👨‍🍳</span>
                Notre Savoir-Faire
              </h2>
              <p>
                Depuis plus de 20 ans, notre équipe de boulangers-pâtissiers perpétue la tradition française 
                avec passion. Chaque produit est préparé selon des recettes authentiques, avec des ingrédients 
                de première qualité sélectionnés avec soin.
              </p>
              <ul class="about-features">
                <li>🌾 Farines françaises premium</li>
                <li>🧈 Beurre AOP des meilleurs producteurs</li>
                <li>🥚 Œufs de poules élevées au sol</li>
                <li>🍫 Chocolat Valrhona grand cru</li>
                <li>⏰ Préparation quotidienne artisanale</li>
              </ul>
              <NuxtLink to="/about" class="btn btn-primary">
                En savoir plus sur nous
              </NuxtLink>
            </div>
            
            <div class="about-image">
              <div class="chef-illustration">
                <span class="chef-emoji">👨‍🍳</span>
                <div class="chef-tools">
                  <span>🥄</span>
                  <span>🍳</span>
                  <span>⚖️</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="newsletter-section">
        <div class="container">
          <div class="newsletter-content">
            <h2>
              <span class="title-emoji">📧</span>
              Restez informé
            </h2>
            <p>Recevez nos dernières nouveautés et offres spéciales directement dans votre boîte mail</p>
            
            <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
              <input 
                v-model="newsletterEmail"
                type="email" 
                placeholder="Votre adresse email..."
                required
                class="newsletter-input"
              />
              <button type="submit" class="newsletter-btn">
                S'abonner
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

useHead({
  title: 'La Petite Boulangerie Française - Pâtisserie Artisanale',
  meta: [
    {
      key: 'description',
      name: 'description',
      content: 'Découvrez notre pâtisserie française artisanale. Croissants, macarons, baguettes et bien plus, préparés quotidiennement avec amour et savoir-faire traditionnel.'
    }
  ]
})

const loading = ref(true)
const featuredProducts = ref([])
const categories = ref([])
const products = ref([])
const newsletterEmail = ref('')

const categoryEmojis = {
  'Croissants': '🥐',
  'Macarons': '🍪',
  'Baguettes': '🥖',
  'Pastries': '🥧',
  'Cakes': '🍰',
  'Tarts': '🥧',
  'Breads': '🍞',
  'Gift Sets': '🎁',
  'Seasonal Specials': '⭐'
}

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

const fetchData = async () => {
  try {
    const [categoriesData, productsData] = await Promise.all([
      $fetch('/api/categories').catch(() => []),
      $fetch('/api/products').catch(() => [])
    ])
    
    categories.value = categoriesData
    products.value = productsData
    
    featuredProducts.value = productsData
      .filter(product => product.availability)
      .slice(0, 6)
      
  } catch (error) {
    console.error('Failed to fetch data:', error)
  } finally {
    loading.value = false
  }
}

const getCategoryEmoji = (categoryName) => {
  return categoryEmojis[categoryName] || '🥐'
}

const getProductEmoji = (categoryId) => {
  return productEmojis[categoryId] || '🥐'
}

const getCategoryProductCount = (categoryId) => {
  return products.value.filter(product => product.categoryId === categoryId).length
}

const formatPrice = (price) => {
  return price.toFixed(2)
}

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const viewProduct = (productId) => {
  navigateTo(`/product/${productId}`)
}

const addToCart = (product) => {
  console.log('Add to cart:', product)
}

const subscribeNewsletter = () => {
  console.log('Subscribe:', newsletterEmail.value)
  newsletterEmail.value = ''
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.main-content {
  min-height: calc(100vh - 140px);
}

.hero-section {
  background: linear-gradient(135deg, #f5f6fa 0%, #ffeaa7 50%, #fab1a0 100%);
  padding: 80px 0;
  border-bottom: 3px solid #fdcb6e;
}

.container {
  max-width: 1400px;
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
  color: #e17055;
  font-family: 'Playfair Display', serif;
  font-style: italic;
}

.hero-description {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #636e72;
  margin-bottom: 30px;
  font-family: 'Quicksand', sans-serif;
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
  font-weight: 600;
  font-family: 'Quicksand', sans-serif;
  transition: all 0.3s ease;
  border: 2px solid transparent;
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

.btn-outline {
  background: transparent;
  color: #74b9ff;
  border-color: #74b9ff;
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
  transition: transform 0.3s ease;
}

.bakery-item.floating {
  animation: float 3s ease-in-out infinite;
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
  50% { transform: translateY(-15px); }
}

.featured-section, .categories-section, .about-section {
  padding: 80px 0;
}

.featured-section {
  background: white;
}

.categories-section {
  background: #f8f9fa;
}

.about-section {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 234, 167, 0.3));
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

.loading-container {
  text-align: center;
  padding: 60px 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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

.product-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #e74c3c;
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
}

.product-info {
  padding: 25px;
}

.product-name {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d3436;
  margin-bottom: 10px;
  font-family: 'Playfair Display', serif;
}

.product-description {
  color: #636e72;
  line-height: 1.5;
  margin-bottom: 20px;
  font-family: 'Quicksand', sans-serif;
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
  padding: 8px 16px;
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

.section-footer {
  text-align: center;
  margin-top: 40px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 25px;
}

.category-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 20px;
  padding: 30px 20px;
  text-decoration: none;
  color: inherit;
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.category-card:hover {
  transform: translateY(-3px);
  border-color: #74b9ff;
  box-shadow: 0 8px 25px rgba(116, 185, 255, 0.2);
}

.category-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

.category-card h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d3436;
  font-family: 'Playfair Display', serif;
}

.category-count {
  color: #7f8c8d;
  font-size: 0.9rem;
  font-family: 'Quicksand', sans-serif;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.about-text h2 {
  font-size: 2.2rem;
  margin-bottom: 25px;
  color: #2d3436;
  font-family: 'Playfair Display SC', serif;
  display: flex;
  align-items: center;
  gap: 15px;
}

.about-text p {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #636e72;
  margin-bottom: 25px;
  font-family: 'Quicksand', sans-serif;
}

.about-features {
  list-style: none;
  padding: 0;
  margin: 30px 0;
}

.about-features li {
  padding: 8px 0;
  font-size: 1rem;
  color: #2d3436;
  font-family: 'Quicksand', sans-serif;
  font-weight: 500;
}

.about-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.chef-illustration {
  position: relative;
  text-align: center;
}

.chef-emoji {
  font-size: 8rem;
  filter: drop-shadow(4px 4px 8px rgba(0, 0, 0, 0.1));
}

.chef-tools {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 40px;
  animation: rotate 10s linear infinite;
}

.chef-tools span {
  font-size: 2rem;
  animation: counterRotate 10s linear infinite;
}

@keyframes rotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes counterRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

.newsletter-section {
  background: linear-gradient(135deg, #2d3436, #636e72);
  color: white;
  padding: 60px 0;
}

.newsletter-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.newsletter-content h2 {
  font-size: 2rem;
  margin-bottom: 15px;
  font-family: 'Playfair Display SC', serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.newsletter-content p {
  font-size: 1.1rem;
  margin-bottom: 30px;
  opacity: 0.9;
  font-family: 'Quicksand', sans-serif;
}

.newsletter-form {
  display: flex;
  gap: 15px;
  max-width: 400px;
  margin: 0 auto;
}

.newsletter-input {
  flex: 1;
  padding: 15px 20px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-family: 'Quicksand', sans-serif;
  outline: none;
}

.newsletter-btn {
  background: linear-gradient(135deg, #74b9ff, #0984e3);
  color: white;
  border: none;
  padding: 15px 25px;
  border-radius: 25px;
  font-weight: 600;
  font-family: 'Quicksand', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.newsletter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(116, 185, 255, 0.3);
}

@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
  
  .about-content {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .hero-text h1 {
    font-size: 2.5rem;
  }
  
  .hero-text h2 {
    font-size: 1.5rem;
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
  
  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .categories-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
  }
  
  .chef-emoji {
    font-size: 6rem;
  }
  
  .chef-tools {
    gap: 30px;
  }
  
  .chef-tools span {
    font-size: 1.5rem;
  }
  
  .newsletter-form {
    flex-direction: column;
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .hero-section, .featured-section, .categories-section, .about-section {
    padding: 50px 0;
  }
  
  .container {
    padding: 0 15px;
  }
  
  .hero-text h1 {
    font-size: 2rem;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .product-info {
    padding: 20px;
  }
  
  .category-card {
    padding: 20px 15px;
  }
}
</style>