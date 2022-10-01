import React from 'react';
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";

import { selectorFamily, useRecoilValue } from 'recoil';

import axios from 'axios';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';

import BugReportIcon from '@mui/icons-material/BugReport';
import BallotIcon from '@mui/icons-material/Ballot';

import Dialog from '@mui/material/Dialog';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";

import { GithubIssueCreator } from './outlet/github-issue';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const getDocument = selectorFamily({
	key: 'get-document-v1',
	get: (unique) => async () => {
		console.log(unique);
		return {};
	},
});

export default function KitsV1Layout() {
	const params = useParams();
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [dialogVisible, setDialogVisible] = React.useState(false);
	const document = useRecoilValue(getDocument(params['*']));
	const preparedIssueMeta = React.useMemo(() => ({
		title: `工具模块 - ${pathname}`
	}), [pathname]);
	console.log(document);
	return (
		<React.Fragment>
			<Splitter sizes={[80, 20]} minSizes={[1100, 400]}>
				<Stack spacing={2} sx={{ padding: 1 }}>
					<Outlet />
				</Stack>
				<Box sx={{ padding: 2 }}>
					<Box sx={{ p: 2 }}>
						<span>文档</span>
					</Box>
				</Box>
			</Splitter>
			<SpeedDial ariaLabel="kits" sx={{ position: 'absolute', bottom: 16, right: 16 }} icon={<SpeedDialIcon />}>
				<SpeedDialAction icon={<BugReportIcon />} tooltipTitle="create a issue" onClick={() => setDialogVisible(true)} />
				<SpeedDialAction icon={<BallotIcon />} tooltipTitle="go kits home" onClick={() => navigate('/kits/v1')} />
			</SpeedDial>
			<Dialog fullScreen open={dialogVisible} TransitionComponent={Transition}>
				<AppBar sx={{ position: 'relative' }}>
					<Toolbar>
						<IconButton edge="start" color="inherit" aria-label="close" onClick={() => setDialogVisible(false)}>
							<CloseIcon />
						</IconButton>
						<Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">Create a issue</Typography>
						<Button autoFocus color="inherit">Save</Button>
					</Toolbar>
				</AppBar>
				<Stack spacing={2} sx={{ padding: 1 }}>
					<GithubIssueCreator {...preparedIssueMeta} />
				</Stack>
			</Dialog>
		</React.Fragment>
	);
}
