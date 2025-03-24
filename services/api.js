const API_BASE_URL = `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/wp/v2`;

/**
 * Universal fetch function
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options (optional)
 * @returns {Promise<any>} - JSON response
 */
export const fetchAPI = async (endpoint, options = {}) => {
    try {
        const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            ...options,
        });

        if (!res.ok) {
            throw new Error(`API error: ${res.status} ${res.statusText}`);
        }

        return await res.json();
    } catch (error) {
        console.error("Fetch API Error:", error);
        return null;
    }
};