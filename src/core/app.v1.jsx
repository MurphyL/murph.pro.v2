import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import './app.v1.css';

const KitsRoutes = React.lazy(() => import('../view/kits/kits-routes.v1'));

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<div>Home</div>} />
                <Route path="/kits/*" element={<KitsRoutes />} />
                <Route path="/about" element={<div>About</div>} />
            </Routes>
        </BrowserRouter>
    )
}

