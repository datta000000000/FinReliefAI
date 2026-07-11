import api from './api';

const loanService = {
  async getAllLoans() {
    return await api.get('/api/loans');
  },

  async getLoanById(id) {
    return await api.get(`/api/loans/${id}`);
  },

  async createLoan(loanData) {
    return await api.post('/api/loans', loanData);
  },

  async updateLoan(id, loanData) {
    return await api.put(`/api/loans/${id}`, loanData);
  },

  async deleteLoan(id) {
    return await api.delete(`/api/loans/${id}`);
  }
};

export default loanService;
