import React from 'react';

import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';

import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DataObjectIcon from '@mui/icons-material/DataObject';

import { Group, Splitter } from "/src/plug/widgets/containers";
import CodeEditor from "/src/plug/widgets/code/code-editor.v1";

const VIEWS = ['tree', 'code'];

// https://www.npmjs.com/package/react-inspector
export default function JSONView() {
	const [state, dispatch] = React.useReducer((state, action) => {
		return { ...state, ...action };
	}, {}, (initial) => {
		return { ...initial, selected: [ VIEWS[0] ] };
	});
	return (
		<Splitter>
			<CodeEditor language="json" />
			<Box sx={{ position: 'relative', p: 1 }}>
				<ToggleButtonGroup size="small" value={state.selected} sx={{position: 'absolute', top: '15px', right: '15px'}} onChange={(e, [_, view]) => dispatch({selected: [view]})}>
					<ToggleButton value="tree">
						<AccountTreeIcon />
					</ToggleButton>
					<ToggleButton value="code">
						<DataObjectIcon />
					</ToggleButton>
				</ToggleButtonGroup>
				{state.selected === 'code' ? (
					<div>Code</div>
				) : (
					<div>Tree</div>
				)}
			</Box>
		</Splitter>
	);
}