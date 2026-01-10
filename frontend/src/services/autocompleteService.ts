import { API_BASE_URL } from '../config/apiConfig';

export const fetchMedicineAutocomplete = async (query: string, token: string): Promise<string[]> => {
    const response = await fetch(`${API_BASE_URL}/autocomplete?query=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Autocomplete failed');
    }

    return response.json();
};
