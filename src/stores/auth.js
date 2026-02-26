import { defineStore } from 'pinia'

export const useAuth = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')),
    nivel: Number(localStorage.getItem('nivel') || 0),
    assinatura: localStorage.getItem('assinatura') === 'true',
    admin: (() => {
      const a = localStorage.getItem('admin')
      return a === 'true' || a === '1' || a === '1';
    })()
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
      this.admin = Number(data.usuario.admin) === 1 || data.usuario.admin === true

      localStorage.setItem('token', this.token)
      localStorage.setItem('user', JSON.stringify(this.user))
      localStorage.setItem('nivel', this.nivel)
      localStorage.setItem('assinatura', this.assinatura)
      localStorage.setItem('admin', this.admin ? '1' : '0')
    },

    logout() {
      this.token = null
      this.user = null
      this.nivel = 0
      this.assinatura = false
      this.admin = false

      localStorage.clear()
    }
  }
})