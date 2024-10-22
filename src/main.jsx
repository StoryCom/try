import { KeepAwake } from '@capacitor-community/keep-awake';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const keepAwake = async () => {
  await KeepAwake.keepAwake();
};
keepAwake()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)