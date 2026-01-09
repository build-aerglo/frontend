export default function useGeolocation() {
    const reverseGeocode = async (lat: number, lon: number): Promise<string | null> => {
        try {
            // Using Nominatim (OpenStreetMap) - free, no API key needed
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'ReviewApp/1.0' // Nominatim requires a User-Agent
                    }
                }
            );

            if (!response.ok) {
                console.warn('Reverse geocoding failed:', response.statusText);
                return null;
            }

            const data = await response.json();
            const address = data.address;

            // Format: "City, State, Country"
            const city = address.city || address.town || address.village || address.suburb || '';
            const state = address.state || '';
            const country = address.country || '';

            // Build formatted address
            const parts = [city, state, country].filter(Boolean);
            return parts.length > 0 ? parts.join(', ') : null;
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            return null;
        }
    };

    const getGeolocation = (): Promise<string | null> => {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                console.warn('Geolocation not supported');
                resolve(null);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    // Reverse geocode to get formatted address
                    const address = await reverseGeocode(lat, lon);
                    resolve(address);
                },
                (error) => {
                    console.warn('Geolocation error:', error.message);
                    resolve(null);
                },
                {
                    timeout: 5000,
                    enableHighAccuracy: false
                }
            );
        });
    };

    return {
        getGeolocation
    };
}