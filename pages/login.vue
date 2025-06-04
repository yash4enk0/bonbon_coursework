<template>
  <div>
    <AppHeader />
    <main class="main-content">
      <div class="auth-section">
        <div class="container">
          <div class="auth-card">
            <div class="auth-header">
              <h1>
                <span class="auth-emoji">🔐</span>
                Sign In
              </h1>
              <p>Welcome back to BonBon Bakery!</p>
            </div>

            <form @submit.prevent="handleLogin" class="auth-form">
              <div class="form-group">
                <label for="email">Email or Phone *</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="text"
                  required
                  placeholder="your@email.com or +38-XXX-XXX-XXXX"
                  :disabled="isLoading"
                  :class="{ 'error': errors.email }"
                />
                <div v-if="errors.email" class="field-error">{{ errors.email }}</div>
              </div>

              <div class="form-group">
                <label for="password">Password *</label>
                <input
                  id="password"
                  v-model="form.password"
                  type="password"
                  required
                  placeholder="Your password"
                  :disabled="isLoading"
                  :class="{ 'error': errors.password }"
                />
                <div v-if="errors.password" class="field-error">{{ errors.password }}</div>
              </div>

              <button 
                type="submit" 
                class="btn btn-primary btn-full"
                :disabled="isLoading"
              >
                <span v-if="isLoading">🔄 Signing in...</span>
                <span v-else>🍞 Sign In</span>
              </button>

              <div v-if="error" class="error-message">
                <span class="error-emoji">❌</span>
                {{ error }}
              </div>
            </form>

            <div class="auth-links">
              <p>Don't have an account?</p>
              <NuxtLink to="/register" class="auth-link">
                📝 Create Account
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
import { ref, reactive } from 'vue'

definePageMeta({
  middleware: 'guest'
})

useHead({
  title: 'Sign In - BonBon Bakery',
  meta: [
    {
      key: 'description',
      name: 'description',
      content: 'Sign in to your BonBon Bakery account'
    }
  ]
})

const { login, isLoading } = useAuth()

const form = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: ''
})

const error = ref('')

const clearErrors = () => {
  errors.email = ''
  errors.password = ''
  error.value = ''
}

const validateForm = () => {
  clearErrors()
  let isValid = true

  if (!form.email.trim()) {
    errors.email = 'Email or phone is required'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return

  try {
    await login({
      email: form.email.trim(),
      password: form.password
    })
    
    const redirect = useRoute().query.redirect as string
    await navigateTo(redirect || '/')
    
  } catch (err: any) {
    error.value = err.data?.message || 'Login failed. Please check your credentials.'
  }
}
</script>

<style scoped>
.main-content {
  min-height: calc(100vh - 140px);
  background: linear-gradient(135deg, #f5f6fa 0%, #ffeaa7 100%);
}

.auth-section {
  padding: 60px 0;
  display: flex;
  align-items: center;
  min-height: calc(100vh - 140px);
}

.container {
  max-width: 500px;
  margin: 0 auto;
  padding: 0 20px;
}

.auth-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 2px solid #fdcb6e;
}

.auth-header {
  text-align: center;
  margin-bottom: 40px;
}

.auth-header h1 {
  margin: 0 0 10px 0;
  color: #2d3436;
  font-family: 'Playfair Display SC', serif;
  font-size: 2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.auth-emoji {
  font-size: 1.2em;
}

.auth-header p {
  color: #636e72;
  font-family: 'VT323', monospace;
  font-size: 1.1rem;
  margin: 0;
}

.auth-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2d3436;
  font-family: 'Quicksand', sans-serif;
}

.form-group input {
  width: 100%;
  padding: 15px 18px;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: 16px;
  font-family: 'Quicksand', sans-serif;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
}

.form-group input:focus {
  outline: none;
  border-color: #74b9ff;
  box-shadow: 0 0 0 3px rgba(116, 185, 255, 0.2);
  background: white;
}

.form-group input.error {
  border-color: #e74c3c;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
}

.form-group input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.field-error {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 6px;
  font-family: 'VT323', monospace;
}

.btn {
  padding: 15px 25px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  font-family: 'VT323', monospace;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(135deg, #74b9ff, #0984e3);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(116, 185, 255, 0.3);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-full {
  width: 100%;
}

.error-message {
  background: linear-gradient(135deg, #fadbd8, #f1948a);
  color: #c0392b;
  padding: 15px;
  border-radius: 10px;
  margin-top: 20px;
  border: 2px solid #e74c3c;
  font-family: 'VT323', monospace;
  display: flex;
  align-items: center;
  gap: 10px;
}

.error-emoji {
  font-size: 1.2em;
}

.auth-links {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.auth-links p {
  color: #636e72;
  margin: 0 0 10px 0;
  font-family: 'Quicksand', sans-serif;
}

.auth-link {
  color: #74b9ff;
  text-decoration: none;
  font-weight: 600;
  font-family: 'VT323', monospace;
  font-size: 1.1rem;
  transition: color 0.2s ease;
}

.auth-link:hover {
  color: #0984e3;
}

@media (max-width: 768px) {
  .auth-section {
    padding: 30px 0;
  }
  
  .container {
    padding: 0 15px;
  }
  
  .auth-card {
    padding: 30px 25px;
  }
  
  .auth-header h1 {
    font-size: 1.8rem;
  }
}
</style>