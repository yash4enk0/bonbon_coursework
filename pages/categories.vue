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
      key: 'description',
      name: 'description',
      content: 'Manage product categories'
    }
  ]
})
</script>

<style scoped>
.main-content {
  min-height: calc(100vh - 140px);
}
</style>