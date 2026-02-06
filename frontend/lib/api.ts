// API configuration for MarketMind
// Uses environment variable in production, falls back to localhost for development

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = {
    baseUrl: API_BASE_URL,

    // Campaign Generator
    campaign: `${API_BASE_URL}/campaign`,

    // Pitch Creator
    pitch: `${API_BASE_URL}/pitch`,

    // Lead Scorer
    score: `${API_BASE_URL}/score`,

    // Company Intelligence
    intel: `${API_BASE_URL}/intel`,
};

export default api;
