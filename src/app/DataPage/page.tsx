'use client'
import React, { useEffect, useState } from 'react';
function DataPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    }
    
    fetchData();
  }, []);
}

