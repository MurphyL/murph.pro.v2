import React from 'react';
import { useLocation } from 'react-router-dom';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DataObjectIcon from '@mui/icons-material/DataObject';

import Group from '/src/plug/widgets/container/group/group.v1.module';
import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";
import CodeEditor from "/src/plug/widgets/code/editor/code-editor.v1.module";

import styles from './json-view.module.css';

export default function JSONView() {
	const [ currentView, setCurrentView ] = React.useState('code');
	return (
		<Splitter className={styles.root}>
			<CodeEditor language="json" />
			<div className={styles.views}>
				<Group title="文本视图">
					<div className={styles.switch}>
						<ToggleButtonGroup size="small" value={[currentView]} onChange={(e, [ view ]) => setCurrentView(view)}>
							<ToggleButton value="code" key="code">
								<DataObjectIcon />
							</ToggleButton>
							<ToggleButton value="tree" key="tree">
								<AccountTreeIcon />
							</ToggleButton>
						</ToggleButtonGroup>
					</div>
					<div>Hello</div>
				</Group>
			</div>
		</Splitter>
	);
}