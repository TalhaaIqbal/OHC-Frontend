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

export const eligibilityApi = {
  getAll: (contact_id?: string, limit: number = 100) => {
    const params = new URLSearchParams();
    if (contact_id) params.append('contact_id', contact_id);
    params.append('limit', limit.toString());
    const query = params.toString();
    return api.get<any[]>(`/api/v1/insurance/eligibility/results${query ? `?${query}` : ''}`);
  },
  check: (data: {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    member_id: string;
    payer_name: string;
    payer_id: string;
    provider_name?: string | null;
    provider_npi?: string | null;
    contact_id?: string | null;
    pipeline_stage_id?: string | null;
    service_value?: string;
    dependent_first_name?: string | null;
    dependent_last_name?: string | null;
    dependent_date_of_birth?: string | null;
  }) => api.post<any>('/api/v1/insurance/eligibility/check', data),
};
