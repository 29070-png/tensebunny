
import React from 'react';
import ReactDOM from 'react-dom/client';
// import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Could not find root element to mount to");

console.log("Starting React render...");
try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
  console.log("React render called successfully");
} catch (err) {
  console.error("React render error:", err);
}
