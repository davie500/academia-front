import { defineStore } from 'pinia'

export const useAuth = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')),
    nivel: Number(localStorage.getItem('nivel') || 0),
    assinatura: localStorage.getItem('assinatura') === 'true'
  }),

  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    login(data) {
      this.token = data.token
      this.user = data.usuario
      this.nivel = Number(data.nivel_nome || 0)
      this.assinatura = data.assinatura_ativa

      localStorage.setItem('token', this.token)
      localStorage.setItem('user', JSON.stringify(this.user))
      localStorage.setItem('nivel', this.nivel)
      localStorage.setItem('assinatura', this.assinatura)
    },

    logout() {
      this.token = null
      this.user = null
      this.nivel = 0
      this.assinatura = false

      localStorage.clear()
    }
  }
})