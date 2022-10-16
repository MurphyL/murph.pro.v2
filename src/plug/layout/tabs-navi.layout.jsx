import React from "react";

import { Link, Outlet, useLocation } from "react-router-dom";

import { Box, Stack, Tab, Tabs } from "@mui/material";

export default function TabNaviLayout({ sx = { p: 1 }, routes = {} }) {
    const { pathname } = useLocation();
    const current = React.useMemo(() => Object.values(routes).indexOf(pathname), [routes, pathname]);
    return (
        <React.Fragment>
            <Stack direction="row" sx={{ boxShadow: '0 1px 1px 0 var(--border-color)' }}>
                <Tabs variant="scrollable" value={current}>
                    {Object.entries(routes).map(([label, url]) => (<Tab key={url} component={Link} label={label} to={url} />))}
                </Tabs>
            </Stack>
            <Box sx={sx}>
                <Outlet />
            </Box>
        </React.Fragment>
    );
}