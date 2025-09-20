import React, { useState } from "react";
import axios from "axios";

const FraudDetection = () => {
  const [transactions, setTransactions] = useState([]);
  const [result, setResult] = useState(null);

  const detectFraud = async () => {
    try {
      const response = await axios.post("http://localhost:5000/detect-fraud", { transactions });
      setResult(response.data.is_fraud ? "Fraudulent Activity Detected!" : "No Fraud Detected");
    } catch (error) {
      console.error("Error detecting fraud:", error);
    }
  };

  return (
    <div>
      <h2>Detect UPI Fraud</h2>
      <button onClick={detectFraud}>Check Transactions</button>
      {result && <p>{result}</p>}
    </div>
  );
};

export default FraudDetection;
