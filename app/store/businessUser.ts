import { defineStore } from 'pinia'
import type { BusinessUser } from '~/types'

export interface UserState {
  accessToken: string | null
  idToken: string | null
  role: string | null
  userData: BusinessUser | null 
}

export const useBusinessUserStore = defineStore('businessUser', { // FIX: Changed store ID to 'businessUser'
  state: (): UserState => ({
    accessToken: null,
    idToken: null,
    role: null,
    userData: null,
  }),

  actions: {
    // Called on login
    setLoginData(payload: { access_token: string; id_token: string; role: string }) {
      this.accessToken = payload.access_token
      this.idToken = payload.id_token
      this.role = payload.role
    },

    // Called on signup
    setUserData(user: BusinessUser) {
      this.userData = user
    },

    // Optional: clear user info (logout)
    clearUser() {
      this.accessToken = null
      this.idToken = null
      this.role = null
      this.userData = null
    },
  },

  persist: true, 
})