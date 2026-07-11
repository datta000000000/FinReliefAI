import api from './api';

const healthService = {
  async getFinancialHealth() {
    return await api.get('/api/financial-health');
  }
};

export default healthService;
