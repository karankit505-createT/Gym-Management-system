import api from '../services/api';

/**
 * Downloads a CSV report file from the backend API with proper JWT Authorization header and current filters.
 * @param {string} endpoint - API route (e.g. '/admin/members/export')
 * @param {object} params - Filter query parameters (e.g. { search, status, startDate, endDate })
 * @param {string} defaultFilename - Fallback filename prefix (e.g. 'members_report.csv')
 */
export const downloadCsvReport = async (endpoint, params = {}, defaultFilename = 'report.csv') => {
  try {
    const response = await api.get(endpoint, {
      params,
      responseType: 'blob'
    });

    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // Attach current date in format YYYY-MM-DD to filename
    const today = new Date().toISOString().split('T')[0];
    let baseName = defaultFilename.replace(/\.csv$/i, '');
    if (!baseName.includes(today)) {
      baseName = `${baseName}_${today}`;
    }

    link.setAttribute('download', `${baseName}.csv`);
    document.body.appendChild(link);
    link.click();

    // Clean up DOM and memory URL
    link.remove();
    window.URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error(`CSV Export Error (${endpoint}):`, error);
    throw error;
  }
};
