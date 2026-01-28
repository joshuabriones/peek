import axios from 'axios';

/**
 * Initialize CSRF protection for Sanctum
 * This ensures the CSRF token cookie is set before making requests
 */
export async function initializeCsrf() {
    try {
        await axios.get('/sanctum/csrf-cookie');
    } catch (error) {
        console.error('Failed to initialize CSRF protection:', error);
    }
}

/**
 * Setup axios interceptor to call CSRF endpoint before POST/PUT/PATCH/DELETE
 */
export function setupCsrfInterceptor() {
    let csrfTokenPromise: Promise<void> | null = null;

    axios.interceptors.request.use(async (config) => {
        // Only ensure CSRF token for state-changing requests
        if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
            // Get CSRF token on first request, then reuse it
            if (!csrfTokenPromise) {
                csrfTokenPromise = initializeCsrf();
            }
            await csrfTokenPromise;
        }
        return config;
    });
}
