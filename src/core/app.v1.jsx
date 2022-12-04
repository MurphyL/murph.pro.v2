import React from "react";
import { SnackbarProvider } from 'notistack';
import { RecoilRoot } from 'recoil';
import { HashRouter as BrowserRouter, Routes, Route } from "react-router-dom";
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import CheatSheets from "/src/view/cheat-sheets";

import HTTPMessagePayload from "../view/kits/http/http-message";

import 'normalize.css';
import './app.v1.css';

const KitsRoutes = React.lazy(() => import('../view/kits/kits-routes.v1'));
const SnippetRoutes = React.lazy(() => import('../view/snippets/snippets-routes.v1'));

export default function App() {
    return (
        <RecoilRoot>
            <SnackbarProvider maxSnack={5} autoHideDuration={5000}>
                <React.Suspense fallback={<Box sx={{ p: 1 }}><CircularProgress /></Box>}>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<div>Home</div>} />
                            <Route path="/cheat-sheets/*" element={<CheatSheets />}>
                                <Route path="http/message" element={<HTTPMessagePayload />} />
                            </Route>
                            <Route path="/snippets/*" element={<SnippetRoutes />} />
                            <Route path="/kits/*" element={<KitsRoutes />} errorElement={<div>Kits Error</div>} />
                            <Route path="/about" element={<div>About</div>} />
                        </Routes>
                    </BrowserRouter>
                </React.Suspense>
            </SnackbarProvider>
        </RecoilRoot>
    )
}

