import { API_BASE_URL } from '../config/apiConfig';

export const fetchMedicineAutocomplete = async (query: string, token?: string | null): Promise<string[]> => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/autocomplete?query=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers
    });

    if (!response.ok) {
        throw new Error('Autocomplete failed');
    }

    return response.json();
};
