<template>
  <div class="bg-gray-100 p-4">
    <div class="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 class="text-2xl font-bold mb-4">Promo 2000</h1>

      <!-- Loading State -->
      <div v-if="loading" class="p-3 mb-4 bg-blue-100 text-blue-800 rounded">
        <div class="inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        Cargando...
      </div>

      <!-- Success State -->
      <div v-else-if="isAuthenticated" class="p-3 mb-4 bg-green-100 text-green-800 rounded">
        <RandomVideo />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-3 mb-4 bg-red-100 text-red-800 rounded">
        ❌ {{ error }}
      </div>
      
      <div v-else class="p-3 mb-4 rounded">
        <p>Descripción del proyecto de la biblioteca, una foto de curso e indicación de dónde encontrar el QR.</p>
      </div>

      <!-- Token Information (when authenticated) -->
      <div v-if="isAuthenticated && showTokenInfo" class="p-3 mb-4 bg-gray-100 text-sm font-mono rounded">
        <strong>Token Details:</strong><br>
        <strong>Header:</strong> {{ tokenHeader }}<br>
        <strong>Payload:</strong> {{ tokenPayload }}<br>
        <strong>Expires:</strong> {{ tokenExpiry }}
      </div>

      <!-- Action Buttons -->
      <div v-if="isAuthenticated" class="space-y-2">
        <button @click="toggleTokenInfo" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          {{ showTokenInfo ? 'Hide' : 'Show' }} Token Info
        </button>
        <button @click="logout" class="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>

      <div v-else-if="!loading && !error" class="mt-4">
        <button @click="checkUrlForToken" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Check URL for Token
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import RandomVideo from './RandomVideo.vue';

export default {
  name: 'JWTApp',
  components: {
    RandomVideo
  },
  data() {
    return {
      loading: true,
      isAuthenticated: false,
      error: null,
      token: null,
      tokenHeader: null,
      tokenPayload: null,
      tokenExpiry: null,
      showTokenInfo: false
    };
  },

  mounted() {
    this.initializeApp();
  },

  methods: {
    async initializeApp() {
      try {
        const storedToken = localStorage.getItem('jwt_token');

        if (storedToken) {
          if (this.validateToken(storedToken)) {
            this.setAuthenticated(storedToken);
            this.cleanUrl();
          } else {
            localStorage.removeItem('jwt_token');
            this.setUnauthenticated('Invalid stored token');
          }
        } else {
          // Check URL for token parameter
          await this.checkUrlForToken();
        }
      } catch (error) {
        console.error('Initialization error:', error);
        this.setUnauthenticated('Failed to initialize');
      } finally {
        this.loading = false;
      }
    },

    async checkUrlForToken() {
      try {
        this.loading = true;

        const urlParams = new URLSearchParams(window.location.search);
        const tokenParam = urlParams.get('secret');

        if (tokenParam) {
          if (this.validateToken(tokenParam)) {
            localStorage.setItem('jwt_token', tokenParam);
            this.setAuthenticated(tokenParam);
            this.cleanUrl();

            return true;
          } else {
            this.setUnauthenticated('Invalid provided token');
            return false;
          }
        } else {
          this.setUnauthenticated('No token provided');
          return false;
        }
      } catch (error) {
        console.error('Error getting token from URL:', error);
        this.setUnauthenticated('Provided URL token error');
        return false;
      } finally {
        this.loading = false;
      }
    },

    validateToken(token) {
      try {
        const parts = token.split('.');
        if (parts.length !== 3) {
          return false;
        }

        const payload = JSON.parse(this.base64UrlDecode(parts[1]));
        if (payload.exp && payload.exp < Date.now() / 1000) {
          return false;
        }

        return true;
      } catch (error) {
        console.error('Token validation error:', error);
        return false;
      }
    },

    base64UrlDecode(str) {
      str = str.replace(/-/g, '+').replace(/_/g, '/');

      while (str.length % 4) {
        str += '=';
      }

      return atob(str);
    },

    setAuthenticated(token) {
      this.token = token;
      this.isAuthenticated = true;
      this.error = null;

      // Parse token for display
      try {
        const parts = token.split('.');
        const header = JSON.parse(this.base64UrlDecode(parts[0]));
        const payload = JSON.parse(this.base64UrlDecode(parts[1]));

        this.tokenHeader = JSON.stringify(header, null, 2);
        this.tokenPayload = JSON.stringify(payload, null, 2);

        if (payload.exp) {
          this.tokenExpiry = new Date(payload.exp * 1000).toLocaleString();
        } else {
          this.tokenExpiry = 'No expiration set';
        }
      } catch (error) {
        console.error('Error parsing token:', error);
        this.tokenHeader = 'Error parsing header';
        this.tokenPayload = 'Error parsing payload';
        this.tokenExpiry = 'Unknown';
      }
    },

    setUnauthenticated(errorMessage) {
      this.isAuthenticated = false;
      this.token = null;
      this.error = errorMessage;
      this.tokenHeader = null;
      this.tokenPayload = null;
      this.tokenExpiry = null;
    },

    cleanUrl() {
      try {
        // Remove token from URL parameters
        const url = new URL(window.location);
        url.searchParams.delete('token');
        url.searchParams.delete('secret');

        // Update URL without reloading the page
        window.history.replaceState({}, document.title, url.toString());
      } catch (error) {
        console.error('Error cleaning URL:', error);
      }
    },

    toggleTokenInfo() {
      this.showTokenInfo = !this.showTokenInfo;
    },

    logout() {
      localStorage.removeItem('jwt_token');

      this.setUnauthenticated('Logged out successfully');
      this.showTokenInfo = false;
    }
  }
};
</script>

<style>
/* Tailwind CSS will be injected by Vite */
</style>
