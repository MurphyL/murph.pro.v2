import { BrowserRouter, Routes, Route } from "react-router-dom";

import KitsRoutes from '../view/kits/kits-routes.v1';

import 'semantic-ui-css/semantic.min.css'
import './app.v1.css';

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

