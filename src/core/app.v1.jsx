import React from "react";
import { SnackbarProvider } from 'notistack';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import './app.v1.css';

const KitsRoutes = React.lazy(() => import('../view/kits/kits-routes.v1'));

export default function App() {
    return (
        <SnackbarProvider maxSnack={5} autoHideDuration={5000}>
            <React.Suspense fallback={
                <Box sx={{ display: 'flex', p: 1 }}>
                    <CircularProgress />
                </Box>
            }>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<div>Home</div>} />
                        <Route path="/kits/*" element={<KitsRoutes />} />
                        <Route path="/about" element={<div>About</div>} />
                    </Routes>
                </BrowserRouter>
            </React.Suspense>
        </SnackbarProvider>
    )
}

