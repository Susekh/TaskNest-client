
const conf = {
    frontendUrl : 'http://localhost:5173',
    backendUrl : String(import.meta.env.VITE_BACKEND_URL),
    clientIdGithub : String(import.meta.env.VITE_CLIENT_ID),
    clientIdGoogle : String(import.meta.env.VITE_CLIENT_ID_GOOGLE),
    redirectUriGoogle : String(import.meta.env.VITE_REDIRECT_URI_GOOGLE)
}

export default conf;