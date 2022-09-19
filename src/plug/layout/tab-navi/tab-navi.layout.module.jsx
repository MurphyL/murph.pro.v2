import React from 'react';

import { Link, Outlet, useOutletContext } from "react-router-dom";

import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

import CircularProgress from '@mui/material/CircularProgress';

import IconButton from '@mui/material/IconButton';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import styles from './tab-navi.layout.module.css';

export default function KitsRootLayout({ navi = [], parent }) {
	const [ payload, setPayload ] = React.useState({ navi, parent });
	return (
		<div className={styles.root}>
			<Stack className={styles.navi} spacing={1}>
				{payload.parent ? (
					<IconButton size="small" component={Link} to={payload.parent}>
						<MoreHorizIcon />
					</IconButton>
				) : null}
				{Array.isArray(payload.navi) ? payload.navi.map((item, index) => (
					<Tooltip key={index} placement="right" title={item.label}>
						<IconButton size="small" component={Link} to={item.url}>{item.icon}</IconButton>
					</Tooltip>
				)) : null}
			</Stack>
			<div className={styles.stage}>
				<React.Suspense fallback={<Box sx={{ p: 1 }}><CircularProgress /></Box>}>
					<Outlet context={{ setNavi: setPayload }} />
				</React.Suspense>
			</div>
		</div>
	);
}

export function ChildRouteLayout({ navi = [], parent }) {
	const { setNavi } = useOutletContext();
	React.useEffect(() => setNavi({ navi, parent }), [navi]);
	return (
		<Outlet context={{ setNavi }} />
	);
}