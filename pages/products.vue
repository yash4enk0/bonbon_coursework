<template>
  <div>
    <AppHeader />
    <main class="main-content">
      <ProductList />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
useHead({
  title: 'Product Management - CRUD Application',
  meta: [
    {
      key: 'description',
      name: 'description',
      content: 'Manage bakery products, prices, and inventory'
    }
  ]
})
</script>

<style scoped>
.main-content {
  min-height: calc(100vh - 140px);
}
</style>