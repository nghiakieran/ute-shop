import { apiClient } from './api.utils';

export const dashboardApi = {
  getChartCard: () => apiClient.get('/ute-shop/api/admin/dashboard/chartCard'),

  getRevenueByTime: (body: any) =>
    apiClient.post('/ute-shop/api/admin/dashboard/revenueByTime', body),

  getProfitByTime: (body: any) =>
    apiClient.post('/ute-shop/api/admin/dashboard/profitByTime', body),

  getNewUserByTime: (body: any) =>
    apiClient.post('/ute-shop/api/admin/dashboard/newUserByTime', body),
  getBestSeller: (body: any) =>
    apiClient.post('/ute-shop/api/admin/dashboard/productBestSelling', body),
};
