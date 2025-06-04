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
                This CRUD application is developed as a course project for Data Bases subject. 
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
      key: 'description',
      name: 'description',
      content: 'Information about the author of this CRUD application course project'
    }
  ]
})
</script>

<style scoped>
.main-content {
  min-height: calc(100vh - 140px);
}

.about-section {
  padding: 40px 0;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 30px;
}

.about-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 234, 167, 0.9));
  border-radius: 25px;
  padding: 50px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
  border: 3px solid #fdcb6e;
}

.author-info {
  text-align: center;
  margin-bottom: 50px;
}

.avatar {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #74b9ff, #0984e3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 25px;
  box-shadow: 0 8px 25px rgba(116, 185, 255, 0.4);
  border: 4px solid #ffeaa7;
}

.initials {
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  font-family: 'Playfair Display SC', serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.author-info h1 {
  margin: 0;
  color: #2d3436;
  font-size: 2.8rem;
  font-family: 'Playfair Display SC', serif;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.8);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 50px;
}

.info-item {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(250, 177, 160, 0.3));
  padding: 25px;
  border-radius: 20px;
  border-left: 6px solid #74b9ff;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.info-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 35px rgba(116, 185, 255, 0.2);
}

.info-item h3 {
  margin: 0 0 12px 0;
  color: #74b9ff;
  font-size: 1.2rem;
  font-weight: 700;
  font-family: 'Playfair Display SC', serif;
}

.info-item p {
  margin: 0;
  color: #2d3436;
  font-size: 1.1rem;
  font-weight: bold;
  font-family: 'VT323', monospace;
}

.project-info {
  border-top: 3px solid #fab1a0;
  padding-top: 40px;
}

.project-info h2 {
  color: #2d3436;
  margin-bottom: 20px;
  font-size: 2.2rem;
  font-family: 'Playfair Display SC', serif;
  font-weight: 700;
  text-align: center;
}

.project-info h3 {
  color: #74b9ff;
  margin: 30px 0 20px 0;
  font-size: 1.5rem;
  font-family: 'Playfair Display SC', serif;
  font-weight: 700;
}

.project-info p {
  color: #636e72;
  line-height: 1.8;
  margin-bottom: 25px;
  font-family: 'VT323', monospace;
  font-size: 1.1rem;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 30px;
  justify-content: center;
}

.tech-badge {
  background: linear-gradient(135deg, #74b9ff, #0984e3);
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: bold;
  font-family: 'VT323', monospace;
  box-shadow: 0 4px 15px rgba(116, 185, 255, 0.3);
  transition: all 0.3s ease;
}

.tech-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(116, 185, 255, 0.4);
}

.features-list {
  color: #636e72;
  line-height: 1.8;
  font-family: 'VT323', monospace;
  font-size: 1.1rem;
}

.features-list li {
  margin-bottom: 12px;
  padding-left: 10px;
  position: relative;
}

.features-list li::before {
  content: '🍞';
  position: absolute;
  left: -20px;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .about-card {
    padding: 30px 25px;
  }
  
  .author-info h1 {
    font-size: 2.2rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .avatar {
    width: 100px;
    height: 100px;
  }
  
  .initials {
    font-size: 2rem;
  }
  
  .container {
    padding: 0 20px;
  }
}

@media (max-width: 480px) {
  .about-card {
    padding: 25px 20px;
  }
  
  .tech-stack {
    justify-content: center;
  }
  
  .project-info h2 {
    font-size: 1.8rem;
  }
  
  .project-info h3 {
    font-size: 1.3rem;
  }
}
</style>