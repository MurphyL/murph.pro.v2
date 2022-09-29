import React from 'react';
import { Routes, Route, Outlet } from "react-router-dom";

import TextField from '@mui/material/TextField';

import styles from './translators-layout.module.css';

const TEXT_AREA_PROPS = {
	fullWidth: true,
	multiline: true,
	minRows: 5,
};


export default function TranslatorsLayout() {
	const [ content, setContent ] = React.useState('');
	return (
		<div className={styles.root}>
			<div className={styles.source}>
				<TextField {...TEXT_AREA_PROPS} size="small" onChange={(e, v) => setContent(e.target.value) } />
			</div>
			<div className={styles.result}>
				<Outlet context={{ content }} />
			</div>
		</div>
	);
}