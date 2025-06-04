<template>
  <div class="admin-panel">
    <div class="header">
      <h1>
        <span class="header-emoji">👥</span>
        Users
      </h1>
      <button @click="addNewUser" class="btn-add">+ Add User</button>
    </div>

    <div v-if="loading" class="loading">
      <span class="loading-emoji">⏳</span>
      Loading users...
    </div>
    
    <div v-else class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Bonus Points</th>
            <th>Admin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="table-row">
            <td class="id-cell">{{ user.id }}</td>
            
            <!-- Name -->
            <td class="name-cell">
              <input 
                v-if="editingId === user.id"
                v-model="editForm.name"
                @keyup.enter="saveUser(user.id)"
                @keyup.escape="cancelEdit"
                class="edit-input"
                ref="editInput"
                required
              />
              <span v-else class="name-display">{{ user.name }}</span>
            </td>

            <!-- Email -->
            <td class="email-cell">
              <input 
                v-if="editingId === user.id"
                v-model="editForm.email"
                type="email"
                @keyup.enter="saveUser(user.id)"
                @keyup.escape="cancelEdit"
                class="edit-input"
                placeholder="Optional"
              />
              <span v-else class="email-display">{{ user.email || '—' }}</span>
            </td>

            <!-- Phone -->
            <td class="phone-cell">
              <input 
                v-if="editingId === user.id"
                v-model="editForm.phone"
                type="tel"
                @keyup.enter="saveUser(user.id)"
                @keyup.escape="cancelEdit"
                class="edit-input"
                required
              />
              <span v-else class="phone-display">{{ user.phone }}</span>
            </td>

            <!-- Address -->
            <td class="address-cell">
              <input 
                v-if="editingId === user.id"
                v-model="editForm.address"
                @keyup.enter="saveUser(user.id)"
                @keyup.escape="cancelEdit"
                class="edit-input"
                placeholder="Optional"
              />
              <span v-else class="address-display">{{ user.address || '—' }}</span>
            </td>

            <!-- Bonus Points -->
            <td class="points-cell">
              <input 
                v-if="editingId === user.id"
                v-model.number="editForm.bonusPoints"
                type="number"
                min="0"
                @keyup.enter="saveUser(user.id)"
                @keyup.escape="cancelEdit"
                class="edit-input"
              />
              <span v-else class="points-display">
                <span class="points-emoji">🎁</span>
                {{ user.bonusPoints }}
              </span>
            </td>

            <!-- Admin Status -->
            <td class="admin-cell">
              <select 
                v-if="editingId === user.id"
                v-model="editForm.isAdmin"
                @keyup.enter="saveUser(user.id)"
                @keyup.escape="cancelEdit"
                class="edit-select"
              >
                <option :value="false">👤 User</option>
                <option :value="true">👨‍💼 Admin</option>
              </select>
              <span v-else :class="['admin-badge', { 'is-admin': user.isAdmin }]">
                {{ user.isAdmin ? '👨‍💼 Admin' : '👤 User' }}
              </span>
            </td>

            <!-- Actions -->
            <td class="actions-cell">
              <div v-if="editingId === user.id" class="edit-actions">
                <button @click="saveUser(user.id)" class="btn-save">💾 Save</button>
                <button @click="cancelEdit" class="btn-cancel">❌ Cancel</button>
              </div>
              <div v-else class="view-actions">
                <button @click="startEdit(user)" class="btn-edit">✏️ Edit</button>
                <button @click="deleteUser(user)" class="btn-delete">🗑️ Delete</button>
              </div>
            </td>
          </tr>
          
          <!-- New User Row -->
          <tr v-if="showNewRow" class="table-row new-row">
            <td class="id-cell">—</td>
            <td class="name-cell">
              <input 
                v-model="newUser.name"
                @keyup.enter="createUser"
                @keyup.escape="cancelNew"
                class="edit-input"
                placeholder="Full name..."
                ref="newNameInput"
                required
              />
            </td>
            <td class="email-cell">
              <input 
                v-model="newUser.email"
                type="email"
                @keyup.enter="createUser"
                @keyup.escape="cancelNew"
                class="edit-input"
                placeholder="email@example.com"
              />
            </td>
            <td class="phone-cell">
              <input 
                v-model="newUser.phone"
                type="tel"
                @keyup.enter="createUser"
                @keyup.escape="cancelNew"
                class="edit-input"
                placeholder="+38-068-123-4567"
                required
              />
            </td>
            <td class="address-cell">
              <input 
                v-model="newUser.address"
                @keyup.enter="createUser"
                @keyup.escape="cancelNew"
                class="edit-input"
                placeholder="Address..."
              />
            </td>
            <td class="points-cell">
              <input 
                v-model.number="newUser.bonusPoints"
                type="number"
                min="0"
                @keyup.enter="createUser"
                @keyup.escape="cancelNew"
                class="edit-input"
                placeholder="0"
              />
            </td>
            <td class="admin-cell">
              <select 
                v-model="newUser.isAdmin"
                @keyup.enter="createUser"
                @keyup.escape="cancelNew"
                class="edit-select"
              >
                <option :value="false">👤 User</option>
                <option :value="true">👨‍💼 Admin</option>
              </select>
            </td>
            <td class="actions-cell">
              <div class="edit-actions">
                <button @click="createUser" class="btn-save">💾 Save</button>
                <button @click="cancelNew" class="btn-cancel">❌ Cancel</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Password Modal for New User -->
    <div v-if="showPasswordModal" class="modal-overlay" @click.self="cancelPasswordModal">
      <div class="modal">
        <div class="modal-header">
          <h3>
            <span class="modal-emoji">🔐</span>
            Set Password for New User
          </h3>
          <button @click="cancelPasswordModal" class="close-btn">&times;</button>
        </div>
        
        <form @submit.prevent="submitNewUser" class="modal-body">
          <div class="form-group">
            <label for="newPassword">Password *</label>
            <input
              id="newPassword"
              v-model="newUser.password"
              type="password"
              required
              minlength="6"
              placeholder="Minimum 6 characters"
              class="password-input"
              autocomplete="new-password"
            />
            <div class="password-hint">Password must be at least 6 characters long</div>
          </div>

          <div class="form-actions">
            <button type="button" @click="cancelPasswordModal" class="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" :disabled="!newUser.password || newUser.password.length < 6" class="btn btn-primary">
              🍞 Create User
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="error" class="error">
      <span class="error-emoji">❌</span>
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'

const users = ref([])
const loading = ref(false)
const error = ref('')
const editingId = ref(null)
const showNewRow = ref(false)
const showPasswordModal = ref(false)
const editInput = ref()
const newNameInput = ref()

const editForm = reactive({
  name: '',
  email: '',
  phone: '',
  address: '',
  bonusPoints: 0,
  isAdmin: false
})

const newUser = reactive({
  name: '',
  email: '',
  phone: '',
  address: '',
  bonusPoints: 0,
  isAdmin: false,
  password: ''
})

const fetchUsers = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await $fetch('/api/users')
    users.value = response.sort((a, b) => a.id - b.id)
  } catch (err) {
    error.value = 'Failed to load users'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const startEdit = async (user) => {
  editingId.value = user.id
  Object.assign(editForm, {
    name: user.name,
    email: user.email || '',
    phone: user.phone,
    address: user.address || '',
    bonusPoints: user.bonusPoints,
    isAdmin: user.isAdmin
  })
  await nextTick()
  if (editInput.value) {
    editInput.value.focus()
    editInput.value.select()
  }
}

const saveUser = async (id) => {
  if (!editForm.name.trim() || !editForm.phone.trim()) {
    error.value = 'Name and phone are required'
    return
  }
  
  try {
    await $fetch(`/api/users/${id}`, {
      method: 'PUT',
      body: editForm
    })
    await fetchUsers()
    cancelEdit()
  } catch (err) {
    error.value = err.data?.message || 'Failed to update user'
    console.error(err)
  }
}

const cancelEdit = () => {
  editingId.value = null
  Object.assign(editForm, {
    name: '',
    email: '',
    phone: '',
    address: '',
    bonusPoints: 0,
    isAdmin: false
  })
  error.value = ''
}

const addNewUser = async () => {
  showNewRow.value = true
  await nextTick()
  if (newNameInput.value) {
    newNameInput.value.focus()
  }
}

const createUser = () => {
  if (!newUser.name.trim() || !newUser.phone.trim()) {
    error.value = 'Name and phone are required'
    return
  }
  
  // Show password modal
  showNewRow.value = false
  showPasswordModal.value = true
}

const submitNewUser = async () => {
  try {
    await $fetch('/api/users', {
      method: 'POST',
      body: newUser
    })
    await fetchUsers()
    cancelPasswordModal()
  } catch (err) {
    error.value = err.data?.message || 'Failed to create user'
    console.error(err)
  }
}

const cancelNew = () => {
  showNewRow.value = false
  Object.assign(newUser, {
    name: '',
    email: '',
    phone: '',
    address: '',
    bonusPoints: 0,
    isAdmin: false,
    password: ''
  })
  error.value = ''
}

const cancelPasswordModal = () => {
  showPasswordModal.value = false
  Object.assign(newUser, {
    name: '',
    email: '',
    phone: '',
    address: '',
    bonusPoints: 0,
    isAdmin: false,
    password: ''
  })
  error.value = ''
}

const deleteUser = async (user) => {
  if (!confirm(`Delete user "${user.name}"? This action cannot be undone.`)) return
  
  try {
    await $fetch(`/api/users/${user.id}`, {
      method: 'DELETE'
    })
    await fetchUsers()
  } catch (err) {
    error.value = err.data?.message || 'Failed to delete user. User might have orders or reviews.'
    console.error(err)
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.admin-panel {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 20px;
  font-family: 'Quicksand', sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-emoji {
  font-size: 1.2em;
}

.btn-add {
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-family: 'Quicksand', sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-add:hover {
  background: #2980b9;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
  font-weight: 500;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.loading-emoji {
  font-size: 1.5em;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
}

.data-table th {
  background: #f8f9fa;
  padding: 15px 10px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e9ecef;
  font-size: 14px;
}

.table-row {
  border-bottom: 1px solid #e9ecef;
  transition: background 0.2s;
}

.table-row:hover {
  background: #f8f9fa;
}

.table-row td {
  padding: 12px 10px;
  vertical-align: middle;
  font-size: 14px;
}

.id-cell {
  width: 60px;
  color: #7f8c8d;
  font-weight: 500;
}

.name-cell {
  width: 150px;
}

.email-cell {
  width: 180px;
}

.phone-cell {
  width: 140px;
}

.address-cell {
  width: 200px;
}

.points-cell {
  width: 120px;
}

.admin-cell {
  width: 100px;
}

.actions-cell {
  width: 160px;
}

.name-display, .email-display, .phone-display, .address-display {
  font-weight: 500;
  color: #2c3e50;
}

.points-display {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;
  color: #2c3e50;
}

.points-emoji {
  font-size: 1.1em;
}

.admin-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: #95a5a6;
  color: white;
}

.admin-badge.is-admin {
  background-color: #f39c12;
}

.edit-input, .edit-select {
  width: 100%;
  border: 2px solid #3498db;
  border-radius: 4px;
  padding: 6px 8px;
  font-family: 'Quicksand', sans-serif;
  font-weight: 500;
  font-size: 13px;
  outline: none;
}

.edit-input:focus, .edit-select:focus {
  border-color: #2980b9;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.view-actions, .edit-actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.btn-edit, .btn-delete, .btn-save, .btn-cancel {
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Quicksand', sans-serif;
  font-weight: 500;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit {
  background: #f39c12;
  color: white;
}

.btn-edit:hover {
  background: #d68910;
}

.btn-delete {
  background: #e74c3c;
  color: white;
}

.btn-delete:hover {
  background: #c0392b;
}

.btn-save {
  background: #27ae60;
  color: white;
}

.btn-save:hover {
  background: #229954;
}

.btn-cancel {
  background: #95a5a6;
  color: white;
}

.btn-cancel:hover {
  background: #7f8c8d;
}

.new-row {
  background: linear-gradient(135deg, #f0f8ff, #e8f4fd);
  border: 2px solid #3498db;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(45, 52, 54, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal {
  background: linear-gradient(135deg, #fff, #ffeaa7);
  border-radius: 25px;
  min-width: 450px;
  max-width: 550px;
  max-height: 90vh;
  overflow-y: auto;
  border: 3px solid #fdcb6e;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px 0;
  border-bottom: 2px solid #fab1a0;
  margin-bottom: 25px;
}

.modal-header h3 {
  margin: 0;
  color: #2d3436;
  font-family: 'Playfair Display SC', serif;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-emoji {
  font-size: 1.3rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #636e72;
  padding: 0;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: #2d3436;
  background: rgba(255, 255, 255, 0.5);
  transform: rotate(90deg);
}

.modal-body {
  padding: 0 30px 25px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #2d3436;
  font-family: 'Playfair Display SC', serif;
  font-size: 1.1rem;
}

.password-input {
  width: 100%;
  padding: 15px 18px;
  border: 2px solid #ddd;
  border-radius: 15px;
  font-size: 16px;
  font-family: 'VT323', monospace;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
}

.password-input:focus {
  outline: none;
  border-color: #74b9ff;
  box-shadow: 0 0 0 3px rgba(116, 185, 255, 0.3);
  background: white;
}

.password-hint {
  color: #636e72;
  font-size: 13px;
  margin-top: 6px;
  font-family: 'VT323', monospace;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 35px;
}

.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  font-family: 'VT323', monospace;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background: linear-gradient(135deg, #74b9ff, #0984e3);
  color: white;
}

.btn-secondary {
  background: linear-gradient(135deg, #ddd, #bbb);
  color: #2d3436;
}

.error {
  background: linear-gradient(135deg, #fadbd8, #f1948a);
  color: #c0392b;
  padding: 16px 20px;
  border-radius: 15px;
  margin-top: 20px;
  border: 2px solid #e74c3c;
  font-weight: 500;
  font-family: 'VT323', monospace;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.2);
}

.error-emoji {
  font-size: 1.2em;
}

@media (max-width: 1200px) {
  .table-container {
    overflow-x: auto;
  }
}

@media (max-width: 768px) {
  .admin-panel {
    padding: 20px 15px;
  }
  
  .header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .data-table th,
  .data-table td {
    padding: 8px 6px;
    font-size: 12px;
  }
  
  .header h1 {
    font-size: 24px;
  }
  
  .modal {
    min-width: 90vw;
    margin: 20px;
  }
  
  .view-actions,
  .edit-actions {
    flex-direction: column;
    gap: 4px;
  }
}
</style>