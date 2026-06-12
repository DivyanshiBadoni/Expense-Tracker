import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

export function useExpenses(filters) {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.category && filters.category !== 'All') {
        params.category = filters.category;
      }
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const [expensesData, summaryData] = await Promise.all([
        api.getExpenses(params),
        api.getSummary(),
      ]);
      setExpenses(expensesData);
      setSummary(summaryData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.startDate, filters.endDate]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addExpense = async (data) => {
    const created = await api.createExpense(data);
    await fetchAll();
    return created;
  };

  const editExpense = async (id, data) => {
    await api.updateExpense(id, data);
    await fetchAll();
  };

  const removeExpense = async (id) => {
    await api.deleteExpense(id);
    await fetchAll();
  };

  return { expenses, summary, loading, error, addExpense, editExpense, removeExpense, refetch: fetchAll };
}
