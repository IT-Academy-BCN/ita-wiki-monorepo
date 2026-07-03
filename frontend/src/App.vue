<script setup lang="ts">
import { ref, onMounted } from 'vue'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

const showModal = ref(false)
const user = ref<{ name: string; avatar: string; github_user_name: string } | null>(null)

async function fetchUser(token: string) {
  const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (res.ok) {
    const data = await res.json()
    user.value = data.user
  } else {
    localStorage.removeItem('token')
  }
}

function loginWithGithub() {
  window.location.href = `${BACKEND_URL}/api/auth/github`
}

onMounted(async () => {
  const params = new URLSearchParams(window.location.search)
  const tokenParam = params.get('token')
  if (tokenParam) {
    localStorage.setItem('token', tokenParam)
    window.history.replaceState({}, '', '/')
  }
  const token = tokenParam || localStorage.getItem('token')
  if (token) await fetchUser(token)
})
</script>

<template>
  <div class="page">
    <div v-if="user" class="user-badge">
      <img :src="user.avatar" :alt="user.name" class="avatar" />
      <span>{{ user.name }}</span>
    </div>
    <button v-else class="login-btn" @click="showModal = true">Iniciar sessió</button>

    <Teleport to="body">
      <div v-if="showModal" class="overlay" @click.self="showModal = false">
        <div class="modal">
          <button class="close-btn" @click="showModal = false">✕</button>
          <h2 class="modal-title">Inici de sessió</h2>
          <button class="github-btn" @click="loginWithGithub">
            <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
                0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
                -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66
                .07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15
                -.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27
                .68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12
                .51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48
                0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            Inicia sessió amb GitHub
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.login-btn {
  padding: 10px 24px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  cursor: pointer;
}

.user-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 500;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 48px 40px;
  width: 400px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 20px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
}

.modal-title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
}

.github-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #24292e;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  justify-content: center;
}

.github-btn:hover {
  background: #3a3f44;
}
</style>
