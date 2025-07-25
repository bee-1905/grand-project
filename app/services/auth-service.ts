import api from "@/lib/api"

export const authService = {
  sendMagicLink: async (email: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/send-magic-link', { email })
      return response.data.success
    } catch (error) {
      console.error('Failed to send magic link:', error)
      throw error
    }
  },

  verifyMagicLink: async (token: string) => {
    try {
      const response = await api.get(`/auth/verify/${token}`)
      return response.data
    } catch (error) {
      console.error('Failed to verify magic link:', error)
      throw error
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
      // Don't throw error for logout, just log it
    }
  },

  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false
    const token = localStorage.getItem('auth_token')
    const user = localStorage.getItem('user')
    return !!(token && user)
  },
}
