const { createApp } = Vue;

createApp({
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
                // Check if we have a token in local storage
                const storedToken = localStorage.getItem('jwt_token');

                if (storedToken) {
                    // Validate stored token
                    if (this.validateToken(storedToken)) {
                        this.setAuthenticated(storedToken);
                        this.cleanUrl();
                    } else {
                        // Token is invalid, remove it
                        localStorage.removeItem('jwt_token');
                        this.setUnauthenticated('Stored token is invalid or expired');
                    }
                } else {
                    // Check URL for token parameter
                    await this.checkUrlForToken();
                }
            } catch (error) {
                console.error('Initialization error:', error);
                this.setUnauthenticated('Failed to initialize application');
            } finally {
                this.loading = false;
            }
        },

        async checkUrlForToken() {
            try {
                this.loading = true;

                // Get token from URL parameters
                const urlParams = new URLSearchParams(window.location.search);
                const tokenParam = urlParams.get('token') || urlParams.get('secret');

                if (tokenParam) {
                    // Validate the token from URL
                    if (this.validateToken(tokenParam)) {
                        // Save token to local storage
                        localStorage.setItem('jwt_token', tokenParam);

                        // Set authenticated state
                        this.setAuthenticated(tokenParam);

                        // Clean URL and redirect
                        this.cleanUrl();

                        return true;
                    } else {
                        this.setUnauthenticated('Invalid or expired token provided');
                        return false;
                    }
                } else {
                    this.setUnauthenticated('No token found in URL parameters');
                    return false;
                }
            } catch (error) {
                console.error('Error checking URL for token:', error);
                this.setUnauthenticated('Error processing token from URL');
                return false;
            } finally {
                this.loading = false;
            }
        },

        validateToken(token) {
            try {
                // Basic JWT structure validation
                const parts = token.split('.');
                if (parts.length !== 3) {
                    return false;
                }

                // Decode payload
                const payload = JSON.parse(this.base64UrlDecode(parts[1]));

                // Check expiration
                if (payload.exp && payload.exp < Date.now() / 1000) {
                    return false;
                }

                // Check if token is not issued in the future
                if (payload.iat && payload.iat > Date.now() / 1000) {
                    return false;
                }

                return true;
            } catch (error) {
                console.error('Token validation error:', error);
                return false;
            }
        },

        base64UrlDecode(str) {
            // Convert base64url to base64
            str = str.replace(/-/g, '+').replace(/_/g, '/');

            // Add padding if needed
            while (str.length % 4) {
                str += '=';
            }

            // Decode
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

                console.log('URL cleaned, token removed from address bar');
            } catch (error) {
                console.error('Error cleaning URL:', error);
            }
        },

        toggleTokenInfo() {
            this.showTokenInfo = !this.showTokenInfo;
        },

        logout() {
            // Remove token from local storage
            localStorage.removeItem('jwt_token');

            // Reset state
            this.setUnauthenticated('Logged out successfully');
            this.showTokenInfo = false;

            console.log('User logged out, token removed from local storage');
        }
    }
}).mount('#app');
