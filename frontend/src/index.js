import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { AuthContextProvider } from './context/AuthContext';
import { TodoContextProvider } from './context/todoContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
    <TodoContextProvider>
      <App />
    </TodoContextProvider>
  </AuthContextProvider>
);
