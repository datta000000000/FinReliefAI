import api from './api';

const aiService = {
  async generateNegotiationStrategy() {
    return await api.post('/api/ai/strategy');
  },

  async generateSettlementLetter(lenderName = null) {
    return await api.post('/api/ai/letter', { lender_name: lenderName });
  },

  async getAIHistory() {
    return await api.get('/api/ai/history');
  }
};

export default aiService;
