import React from 'react';

import { ObjectInspector, TableInspector } from 'react-inspector';

import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';

import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DataObjectIcon from '@mui/icons-material/DataObject';

import { Splitter } from "/src/plug/widgets/containers";
import CodeEditor from "/src/plug/widgets/code/code-editor.v1";

const VIEWS = ['tree', 'code'];

// https://www.npmjs.com/package/react-inspector
export default function JSONView() {
	const [state, dispatch] = React.useReducer((state, action) => {
		return { ...state, ...action };
	}, {}, (initial) => {
		return { ...initial, selected: [VIEWS[0]] };
	});
	return (
		<Splitter>
			<CodeEditor language="json" />
			<Box>
				<ToggleButtonGroup size="small" value={state.selected} onChange={(e, [_, view]) => dispatch({ selected: [view] })}>
					<ToggleButton value="tree">
						<AccountTreeIcon />
					</ToggleButton>
					<ToggleButton value="code">
						<DataObjectIcon />
					</ToggleButton>
				</ToggleButtonGroup>
				{state.selected === 'code' ? (
					<ObjectInspector data={{}} />
				) : (
					<TableInspector data={{}} />
				)}
			</Box>
		</Splitter>
	);
}