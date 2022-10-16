import React from "react";
import useComponentSize from '@rehooks/component-size';

import { Link, Outlet, useLocation } from "react-router-dom";

import { Box, Stack, Tab, Tabs } from "@mui/material";

export default function TabNaviLayout({ sx = { p: 1 }, routes = {} }) {
    const ref = React.useRef(null);
    const { pathname } = useLocation();
    const { height } = useComponentSize(ref);
    const current = React.useMemo(() => Object.values(routes).indexOf(pathname), [routes, pathname]);
    return (
        <Box sx={{ height: '100%' }}>
            <Stack direction="row" sx={{ boxShadow: '0 1px 1px 0 var(--border-color)' }} ref={ref}>
                <Tabs variant="scrollable" value={current}>
                    {Object.entries(routes).map(([label, url]) => (<Tab key={url} component={Link} label={label} to={url} />))}
                </Tabs>
            </Stack>
            <Box sx={sx} height={`calc(100% - ${height}px - 2 * 1px)`}>
                <Outlet />
            </Box>
        </Box>
    );
}