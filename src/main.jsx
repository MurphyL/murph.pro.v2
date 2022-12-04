import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './core/app.v1.jsx'
// import App from './core/app.v2.jsx'

const root = document.getElementById('root');

createRoot(root).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
