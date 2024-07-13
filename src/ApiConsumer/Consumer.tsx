import { useState, useEffect } from 'react';
import axios from 'axios';
import { TB_characters } from "udm-types";

export async function useApi<T>(uri: string): Promise<T> {
  // const url = "https://api.universodomedo.com/api/";
  const url = "http://localhost:3030/api/";

  const response = await axios.get<T>(`${url}${uri}`);
  
  return response.data as T;
}