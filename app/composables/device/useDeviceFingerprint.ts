import FingerprintJS from '@fingerprintjs/fingerprintjs';

export default function useDeviceFingerprint() {
    let fpPromise: Promise<any> | null = null;

    const generateFingerprint = async (): Promise<string> => {
        try {
            // Initialize FingerprintJS only once
            if (!fpPromise) {
                fpPromise = FingerprintJS.load();
            }

            const fp = await fpPromise;
            const result = await fp.get();
            return result.visitorId;
        } catch (error) {
            console.error('Failed to generate fingerprint:', error);
            // Fallback to simple hash
            return btoa(navigator.userAgent + Date.now()).substring(0, 32);
        }
    };

    return {
        generateFingerprint
    };
}