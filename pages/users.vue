<template>
  <div>
    <AppHeader />
    <main class="main-content">
      <UserList />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
useHead({
  title: 'User Management - CRUD Application',
  meta: [
    {
      key: 'description',
      name: 'description',
      content: 'Manage system users and customer information'
    }
  ]
})
</script>

<style scoped>
.main-content {
  min-height: calc(100vh - 140px);
}
</style>