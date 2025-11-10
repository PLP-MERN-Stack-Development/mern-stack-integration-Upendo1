import { useState, useEffect } from 'react';
import api from '../services/api';

export default function useApi(path, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (params) => {
    setLoading(true);
    try {
      const res = await api.get(path, { params });
      setData(res.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, deps);

  return { data, loading, error, fetchData };
}
