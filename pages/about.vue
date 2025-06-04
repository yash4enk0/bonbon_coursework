<template>
  <div>
    <AppHeader />
    <main class="main-content">
      <div class="about-section">
        <div class="container">
          <div class="about-card">
            <div class="author-info">
              <div class="avatar">
                <span class="initials">OY</span>
              </div>
              <h1>About Author</h1>
            </div>
            
            <div class="info-grid">
              <div class="info-item">
                <h3>Name</h3>
                <p>Oleksandra Yashchenko</p>
              </div>
              
              <div class="info-item">
                <h3>Group</h3>
                <p>IC-34</p>
              </div>
              
              <div class="info-item">
                <h3>Subject</h3>
                <p>Data Bases</p>
              </div>
              
              <div class="info-item">
                <h3>University</h3>
                <p>Kyiv Polytechnic Institute</p>
              </div>
              
              <div class="info-item">
                <h3>Email</h3>
                <p>oleksandra.yash4enk0@gmail.com</p>
              </div>
              
              <div class="info-item">
                <h3>Project Type</h3>
                <p>Course Work</p>
              </div>
            </div>
            
            <div class="project-info">
              <h2>Project Description</h2>
              <p>
                This CRUD application is developed as a course project for Web Programming subject. 
                The application demonstrates a complete reference management system built with modern web technologies.
              </p>
              
              <h3>Technology Stack</h3>
              <div class="tech-stack">
                <span class="tech-badge">Nuxt.js 3</span>
                <span class="tech-badge">PostgreSQL</span>
                <span class="tech-badge">Prisma ORM</span>
                <span class="tech-badge">Vue 3</span>
                <span class="tech-badge">JavaScript</span>
                <span class="tech-badge">CSS3</span>
              </div>
              
              <h3>Features</h3>
              <ul class="features-list">
                <li>Complete CRUD operations for Categories, Users, and Products</li>
                <li>Responsive design for all devices</li>
                <li>Form validation and error handling</li>
                <li>Database relationships and constraints</li>
                <li>Modern Vue 3 Composition API</li>
                <li>RESTful API endpoints</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
useHead({
  title: 'About Author - CRUD Application',
  meta: [
    {
      name: 'description',
      content: 'Information about the author of this CRUD application course project'
    }
  ]
})
</script>

<style scoped>
.main-content {
  min-height: calc(100vh - 120px);
  background-color: #f8f9fa;
}

.about-section {
  padding: 40px 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.about-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.author-info {
  text-align: center;
  margin-bottom: 40px;
}

.avatar {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #007bff, #0056b3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 4px 15px rgba(0,123,255,0.3);
}

.initials {
  color: white;
  font-size: 36px;
  font-weight: 700;
}

.author-info h1 {
  margin: 0;
  color: #333;
  font-size: 2.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.info-item {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.info-item h3 {
  margin: 0 0 10px 0;
  color: #007bff;
  font-size: 1.1rem;
  font-weight: 600;
}

.info-item p {
  margin: 0;
  color: #333;
  font-size: 1rem;
  font-weight: 500;
}

.project-info {
  border-top: 1px solid #e9ecef;
  padding-top: 30px;
}

.project-info h2 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.8rem;
}

.project-info h3 {
  color: #007bff;
  margin: 25px 0 15px 0;
  font-size: 1.3rem;
}

.project-info p {
  color: #666;
  line-height: 1.7;
  margin-bottom: 20px;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 25px;
}

.tech-badge {
  background: #007bff;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.features-list {
  color: #666;
  line-height: 1.7;
}

.features-list li {
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .about-card {
    padding: 25px;
  }
  
  .author-info h1 {
    font-size: 2rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .avatar {
    width: 80px;
    height: 80px;
  }
  
  .initials {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 15px;
  }
  
  .about-card {
    padding: 20px;
  }
  
  .tech-stack {
    justify-content: center;
  }
}
</style>