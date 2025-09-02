# JWT Token Authentication App

A Vue.js application that handles JWT token authentication through URL parameters and local storage management.

## Features

- **URL Parameter Processing**: Automatically detects JWT tokens in URL parameters (`?token=...` or `?secret=...`)
- **Local Storage Management**: Securely stores valid tokens in browser's local storage
- **Automatic URL Cleaning**: Removes token parameters from the URL after successful authentication
- **Token Validation**: Validates JWT structure and expiration dates
- **Beautiful UI**: Modern, responsive design with status indicators
- **Token Inspection**: View decoded JWT header and payload information

## How It Works

1. **Initial Load**: The app checks for existing tokens in local storage
2. **URL Processing**: If no stored token exists, it looks for `token` or `secret` parameters in the URL
3. **Token Validation**: Validates the JWT structure and expiration
4. **Storage**: If valid, saves the token to local storage
5. **URL Cleaning**: Removes the token parameter from the URL to hide sensitive information
6. **Authentication**: User is now authenticated and can access protected content

## Usage Examples

### Example 1: Direct URL with Token
```
https://yourapp.com/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### Example 2: Using 'secret' Parameter
```
https://yourapp.com/?secret=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

## JWT Token Requirements

The application expects standard JWT tokens with:
- **Header**: Contains algorithm and token type
- **Payload**: Contains claims (sub, name, iat, exp, etc.)
- **Signature**: For validation (structure only, not cryptographic verification)

## Security Features

- **URL Parameter Removal**: Tokens are automatically removed from the URL after processing
- **Local Storage**: Tokens are stored securely in browser's local storage
- **Expiration Validation**: Checks token expiration before accepting
- **Structure Validation**: Ensures proper JWT format

## File Structure

```
Promo2000/
├── index.html          # Main HTML file with Vue.js and styling
├── app.js             # Vue.js application logic
└── README.md          # This documentation
```

## Running the Application

1. Open `index.html` in a web browser
2. The app will automatically check for tokens
3. To test with a token, append `?token=YOUR_JWT_TOKEN` to the URL
4. The token will be processed and stored in local storage
5. The URL will be automatically cleaned

## Browser Compatibility

- Modern browsers with ES6+ support
- Local Storage support required
- Vue.js 3.x compatibility

## Development

The application is built with:
- **Vue.js 3**: For reactive UI components
- **Vanilla JavaScript**: For JWT processing and local storage management
- **CSS3**: For modern styling and animations
- **HTML5**: For semantic markup

## Testing

You can test the application with sample JWT tokens:

1. **Valid Token**: Use a properly formatted JWT token
2. **Expired Token**: Use a token with past expiration
3. **Invalid Format**: Use malformed strings to test error handling
4. **No Token**: Test the initial state without parameters

## Notes

- This is a client-side only application
- JWT signature verification is not implemented (structure validation only)
- Tokens are stored in local storage (consider security implications for production use)
- The app automatically handles both `token` and `secret` URL parameters
