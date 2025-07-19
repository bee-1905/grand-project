export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export const authService = {
  async sendMagicLink(email: string): Promise<{ message: string }> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/magic-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send magic link');
    }

    return response.json();
  },

  async verifyToken(token: string): Promise<AuthResponse> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Token verification failed');
    }

    return response.json();
  },

  // Utility to get token from localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  // Utility to set token in localStorage
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  },

  // Utility to remove token
  removeToken(): void {
    localStorage.removeItem('authToken');
  },
};