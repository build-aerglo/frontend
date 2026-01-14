import { nigerianLocations } from '~/utils/nigerianLocations';

export default function useNigerianLocations() {
    /**
     * Get all Nigerian states
     */
    const getStates = (): string[] => {
        return nigerianLocations.map(location => location.state);
    };

    /**
     * Get cities by state name
     */
    const getCitiesByState = (stateName: string): string[] => {
        const stateData = nigerianLocations.find(
            location => location.state.toLowerCase() === stateName.toLowerCase()
        );
        return stateData ? stateData.cities : [];
    };

    /**
     * Get all locations data
     */
    const getAllLocations = () => {
        return nigerianLocations;
    };

    /**
     * Validate if a state exists
     */
    const isValidState = (stateName: string): boolean => {
        return nigerianLocations.some(
            location => location.state.toLowerCase() === stateName.toLowerCase()
        );
    };

    /**
     * Validate if a city exists in a given state
     */
    const isValidCity = (stateName: string, cityName: string): boolean => {
        const cities = getCitiesByState(stateName);
        return cities.some(city => city.toLowerCase() === cityName.toLowerCase());
    };

    return {
        getStates,
        getCitiesByState,
        getAllLocations,
        isValidState,
        isValidCity
    };
}