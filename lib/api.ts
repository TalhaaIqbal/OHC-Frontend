const API_BASE_URL = process.env.BACKEND_URI || 'https://ohc-agents-201cb3da6038.herokuapp.com';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      const errorText = await response.text();
      return { error: errorText || `HTTP error! status: ${response.status}` };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'An error occurred' };
  }
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};

export const statesApi = {
  getAll: () => api.get<{ type: string; states: any[]; updated_at?: string }>('/api/v1/config/states'),
  add: (state: { state: string; abbreviation: string; served: boolean; enrolled: boolean }) =>
    api.post('/api/v1/config/states', state),
  update: (index: number, state: { state: string; abbreviation: string; served: boolean; enrolled: boolean }) =>
    api.put(`/api/v1/config/states/${index}`, state),
  delete: (index: number) => api.delete(`/api/v1/config/states/${index}`),
};

export const rulesApi = {
  getAll: () => api.get<{ type: string; rules: any[]; updated_at?: string }>('/api/v1/config/rules'),
  add: (rule: { payer_plan_type: string; decision: string; condition: string }) =>
    api.post('/api/v1/config/rules', rule),
  update: (index: number, rule: { payer_plan_type: string; decision: string; condition: string }) =>
    api.put(`/api/v1/config/rules/${index}`, rule),
  delete: (index: number) => api.delete(`/api/v1/config/rules/${index}`),
};

export const configApi = {
  reload: () => api.post<{ status: string; message: string }>('/api/v1/config/reload', {}),
};
