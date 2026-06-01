import { useState, useEffect } from 'react';

const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const SHEET_ID = process.env.REACT_APP_SHEET_ID;

export function useSheetData(sheetName, range) {
    console.log('SHEET ID:', process.env.REACT_APP_SHEET_ID);
    console.log('API KEY:', process.env.REACT_APP_GOOGLE_API_KEY);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}!${range}?key=${API_KEY}`;
    fetch(url)
      .then(r => r.json())
      .then(d => {
        setData(d.values || []);
        setLoading(false);
      })
      .catch(e => {
        setError(e);
        setLoading(false);
      });
  }, [sheetName, range]);

  return { data, loading, error };
}