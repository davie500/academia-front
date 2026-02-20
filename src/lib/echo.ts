import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

;(window as any).Pusher = Pusher


export const echo = new Echo({
  broadcaster: 'reverb',

  key: "app-key",

  wsHost: 'localhost',
  wsPort: 8080,
  wssPort: 8080,

  forceTLS: false,
  enabledTransports: ['ws', 'wss'],

  authEndpoint: 'http://localhost:8000/api/broadcasting/auth',

  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  },
})

;(window as any).Echo = echo