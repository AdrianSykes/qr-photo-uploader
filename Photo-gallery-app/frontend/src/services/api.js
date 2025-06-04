[span_217](start_span)import axios from ‘axios’;[span_217](end_span)

[span_218](start_span)const api = axios.create({[span_218](end_span)
  baseURL: import.meta.env.VITE_API_URL || [span_219](start_span)’http://localhost:5000’,[span_219](end_span)
});

[span_220](start_span)api.interceptors.request.use((config) => {[span_220](end_span) // Corrected Api.interceptors to api.interceptors
  [span_221](start_span)const token = localStorage.getItem(‘token’);[span_221](end_span)
  [span_222](start_span)if (token) {[span_222](end_span) // Corrected If to if
    [span_223](start_span)config.headers.Authorization = `Bearer ${token}`;[span_223](end_span) // Corrected Config.headers to config.headers
  }
  [span_224](start_span)return config;[span_224](end_span) // Corrected Return to return
});

[span_225](start_span)export default api;[span_225](end_span)

