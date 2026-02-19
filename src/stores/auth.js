import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const token = ref(localStorage.getItem('token'))
const user = ref(null)
const nivelId = ref(null)
const nivelNome = ref(null)
const loadingUser = ref(false)

// se já temos token no localStorage, configura header global do axios
if (token.value) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
}

export function useAuth() {
  const router = useRouter()

  const isAuthenticated = computed(() => !!token.value)

  function login(newToken) {
    token.value = newToken
    localStorage.setItem('token', newToken)
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
  }

  async function fetchUser() {
    if (!token.value) return false

    loadingUser.value = true

    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`

    try {
      const response = await axios.get('http://127.0.0.1:8000/api/auth/me')
      console.log('fetchUser response:', response.data)
      user.value = response.data.usuario
      nivelId.value = response.data.assinatura?.nivel_id ?? null
      nivelNome.value = response.data.assinatura?.plano?.nivel?.nome ?? null
      return true
    } catch (error) {
      const status = error?.response?.status
      if (status === 401 || status === 403) {
        logout()
        return false
      } else {
        console.error('fetchUser network error:', error)
        return false
      }
    } finally {
      loadingUser.value = false
    }
  }

  function logout() {
    token.value = null
    user.value = null
    nivelId.value = null
    nivelNome.value = null
    loadingUser.value = false

    delete axios.defaults.headers.common['Authorization']
    localStorage.removeItem('token')
    router.push('/login')
  }

  return {
    token,
    user,
    nivelId,
    nivelNome,
    loadingUser,
    isAuthenticated,
    login,
    logout,
    fetchUser
  }
}
