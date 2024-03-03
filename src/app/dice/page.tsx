// src/pages/dice.tsx
'use client'
import { useState } from 'react';
import axios from 'axios';

const page: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [result, setResult] = useState<number[]>([]);

  const handleButtonClick = async () => {
    // Parse the input value to extract parameters for the API payload
    const match = inputValue.match(/(\d+)#D(\d+)\+(\d+)/);

    if (match) {
      const n = parseInt(match[1]);
      const max = parseInt(match[2]);
      const modifier = parseInt(match[3]);
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    console.log(apiKey);
      // Construct the payload
      const payload = {
        jsonrpc: '2.0',
        method: 'generateIntegers',
        params: {
          apiKey,
          n,
          min: 1,
          max,
          replacement: true,
          base: 10,
        },
        id: 42,
      };
        console.log(apiKey)
      try {
        // Make the API request
        const response = await axios.post('https://api.random.org/json-rpc/4/invoke', payload);

        // Update the state with the result
        setResult(response.data.result.random.data);
      } catch (error) {
        console.error('Error fetching data from API:', error);
      }
    }
  };

  return (
    <div>
      <h1>Dice Page</h1>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter dice expression (e.g., 3#D20+15)"
      />
      <button onClick={handleButtonClick}>Roll Dice</button>
      <div>
        {result.length > 0 && (
          <>
            <h2>Result:</h2>
            <ul>
              {result.map((value, index) => (
                <li key={index}>{value}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default page;
