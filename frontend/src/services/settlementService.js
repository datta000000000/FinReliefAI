import api from './api';

const settlementService = {
  async getSettlementAnalysis() {
    return await api.get('/api/settlement');
  },

  async getSettlementHistory() {
    return await api.get('/api/settlement/history');
  }
};

export default settlementService;
