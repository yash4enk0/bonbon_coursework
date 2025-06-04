<template>
  <div>
    <AppHeader />
    <main class="main-content">
      <CategoryList />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
useHead({
  title: 'Category Management - CRUD Application',
  meta: [
    {
      name: 'description',
      content: 'Manage product categories'
    }
  ]
})
</script>

<style scoped>
.main-content {
  min-height: calc(100vh - 120px);
  background-color: #f8f9fa;
}
</style>