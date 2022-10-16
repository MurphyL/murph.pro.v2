import React from 'react';

import { Link, Outlet, useOutletContext } from "react-router-dom";

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';

import CircularProgress from '@mui/material/CircularProgress';

import IconButton from '@mui/material/IconButton';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export default function KitsRootLayout({ navi = [], parent }) {
	const naviPopoverAnchor = React.useRef(null);
	const [payload, setPayload] = React.useState({ navi, parent });
	return (
		<React.Fragment>
			<div style={{ display: 'flex', height: '100%' }}>
				<Box sx={{ display: 'flex', px: '3px', py: 1, flexDirection: 'column', justifyContent: 'space-between', borderRight: '1px solid #efefef' }}>
					<Stack spacing={1}>
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
					<IconButton size="small" ref={naviPopoverAnchor}>
						<MoreHorizIcon />
					</IconButton>
				</Box>
				<Box sx={{ flex: 1 }}>
					<React.Suspense fallback={<Box sx={{ p: 1 }}><CircularProgress /></Box>}>
						<Outlet context={{ setNavi: setPayload }} />
					</React.Suspense>
				</Box>
			</div>
			<Popover open={false} anchorEl={naviPopoverAnchor.current} anchorOrigin={{ vertical: 'top', horizontal: 'right'}} transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
				<Box sx={{ p: 1, width: 1000, height: 618 }}></Box>
			</Popover>
		</React.Fragment>
	);
}

export function ChildRouteLayout({ navi = [], parent }) {
	const { setNavi } = useOutletContext();
	React.useEffect(() => setNavi({ navi, parent }), [navi]);
	return (
		<Outlet context={{ setNavi }} />
	);
}