import React from "react";
import { SnackbarProvider } from 'notistack';
import { RecoilRoot } from 'recoil';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import './app.v1.css';

const KitsRoutes = React.lazy(() => import('../view/kits/kits-routes.v1'));
const SnippetRoutes = React.lazy(() => import('../view/snippets/snippets-routes.v1'));
const KitsV1Routes = React.lazy(() => import('../view/kits/v1/kits.v1-routes'));

export default function App() {
    return (
        <SnackbarProvider maxSnack={5} autoHideDuration={5000}>
            <RecoilRoot>
                <React.Suspense fallback={<Box sx={{ p: 1 }}><CircularProgress /></Box>}>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<div>Home</div>} />
                            <Route path="/snippets/*" element={<SnippetRoutes />} />
                            <Route path="/kits/*" element={<KitsRoutes />} errorElement={<div>Kits Error</div>} />
                            <Route path="/kits/v1/*" element={<KitsV1Routes />} errorElement={<div>Kits Error</div>} />
                            <Route path="/about" element={<div>About</div>} />
                        </Routes>
                    </BrowserRouter>
                </React.Suspense>
            </RecoilRoot>
        </SnackbarProvider>
    )
}

