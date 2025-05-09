import { fetchUtils, DataProvider, RaRecord, Identifier } from 'react-admin';
import { stringify } from 'query-string';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const httpClient = fetchUtils.fetchJson;

const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const { page = 1, perPage = 10 } = params.pagination || {};
    const { field = 'id', order = 'ASC' } = params.sort || {};
    
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify(params.filter),
    };
    
    const url = `${API_URL}/${resource}?${stringify(query)}`;
    
    const { json, headers } = await httpClient(url, {
      credentials: 'include',
    });
    
    let total = 0;
    if (headers.has('content-range')) {
      total = parseInt(headers.get('content-range')?.split('/').pop() || '0', 10);
    } else {
      total = json.length;
    }
    
    return {
      data: json,
      total,
    };
  },
  
  getOne: async (resource, params) => {
    const url = `${API_URL}/${resource}/${params.id}`;
    const { json } = await httpClient(url, {
      credentials: 'include',
    });
    return { data: json };
  },
  
  getMany: async (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const url = `${API_URL}/${resource}?${stringify(query)}`;
    const { json } = await httpClient(url, {
      credentials: 'include',
    });
    return { data: json };
  },
  
  getManyReference: async (resource, params) => {
    const { page = 1, perPage = 10 } = params.pagination || {};
    const { field = 'id', order = 'ASC' } = params.sort || {};
    
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify({
        ...params.filter,
        [params.target]: params.id,
      }),
    };
    
    const url = `${API_URL}/${resource}?${stringify(query)}`;
    const { json, headers } = await httpClient(url, {
      credentials: 'include',
    });
    
    let total = 0;
    if (headers.has('content-range')) {
      total = parseInt(headers.get('content-range')?.split('/').pop() || '0', 10);
    } else {
      total = json.length;
    }
    
    return {
      data: json,
      total,
    };
  },
  
  update: async (resource, params) => {
    const url = `${API_URL}/${resource}/${params.id}`;
    const { json } = await httpClient(url, {
      method: 'PUT',
      body: JSON.stringify(params.data),
      credentials: 'include',
    });
    return { data: json };
  },
  
  updateMany: async (resource, params) => {
    const responses = await Promise.all(
      params.ids.map(id =>
        httpClient(`${API_URL}/${resource}/${id}`, {
          method: 'PUT',
          body: JSON.stringify(params.data),
          credentials: 'include',
        })
      )
    );
    return { data: responses.map(response => response.json.id) };
  },
  
  create: async (resource, params) => {
    const url = `${API_URL}/${resource}`;
    const { json } = await httpClient(url, {
      method: 'POST',
      body: JSON.stringify(params.data),
      credentials: 'include',
    });
    
    // Fix the type issue by ensuring we return the correct format
    return { 
      data: { ...params.data, ...json } 
    };
  },
  
  delete: async (resource, params) => {
    const url = `${API_URL}/${resource}/${params.id}`;
    const { json } = await httpClient(url, {
      method: 'DELETE',
      credentials: 'include',
    });
    return { data: json };
  },
  
  deleteMany: async (resource, params) => {
    const responses = await Promise.all(
      params.ids.map(id =>
        httpClient(`${API_URL}/${resource}/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        })
      )
    );
    return { data: responses.map(response => response.json.id) };
  },
};

export default dataProvider;