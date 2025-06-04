<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <p>&copy; 2025 CRUD Application. Course Project.</p>
        <p>Nuxt.js + PostgreSQL + Prisma</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: #343a40;
  color: white;
  padding: 20px 0;
  margin-top: auto;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  text-align: center;
}

.footer-content p {
  margin: 5px 0;
  font-size: 14px;
  color: #adb5bd;
}
</style>