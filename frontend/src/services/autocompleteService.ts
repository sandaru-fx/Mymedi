import { API_URL } from '../config/constants';

export const fetchMedicineAutocomplete = async (query: string, token: string): Promise<string[]> => {
    const response = await fetch(`${API_URL}/api/medical/autocomplete?query=${encodeURIComponent(query)}`, {
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
