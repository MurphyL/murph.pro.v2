import React from 'react';

import { Link, useParams } from "react-router-dom";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';

import { useDocumentTitle } from '/src/plug/hooks';

import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";

import styles from './text-converters.v1.module.css';

const convertors = {
	sha: {
		label: 'SHA',
		actions: [{
			label: '加密'
		}]
	},
	md5: {
		label: 'MD5',
		actions: [{
			label: '加密'
		}]	
	},
	base64: {
		label: 'Base 64',
		doc: '',
		actions: [{
			label: '加密'
		}]	
	},
	url: {
		label: 'URL',
		actions: [{
			label: 'Encode',
			apply: encodeURIComponent
		}, {
			label: 'Dencode',
			apply: decodeURIComponent
		}]	
	},
	utf8: {
		label: 'UTF-8',
		actions: [{
			label: 'Unicode 转中文'
		}]	
	},
	ascii: {
		label: 'ASCII',
		actions: [{
			label: 'Unicode 转中文'
		}]	
	}
};

Object.entries(convertors).forEach(([unique, entry], index) => {
	entry.index = index;
	entry.unique = unique;
});

const TEXT_AREA_PROPS = {
	fullWidth: true,
	multiline: true,
	minRows: 5,
};

export default function TextConverters() {
	const { cate } = useParams();
	const current = React.useMemo(() => convertors[cate], [cate]);
	const [ source, setSource ] = React.useState(window.location.origin);
	const [ target, setTarget ] = React.useState('');
	useDocumentTitle(`${current.label} - 转换工具`);
	const onSourceChange = React.useCallback((e) => setSource(e.target.value), [setSource]);
	const execAction = React.useCallback((action) => {
		if(action.apply) {
			setTarget(action.apply(source));
		}
	}, [source, setTarget]);
	return (
		<div className={styles.root}>
			<Tabs className={styles.header} value={current.index} variant="scrollable" scrollButtons="auto">
				{Object.entries(convertors).map(([key, entry]) => (
					<Tab key={key} component={Link} label={entry.label} to={`/kits/converters/${key}`} />
				))}
			</Tabs>
			<div className={styles.stage}>
				<Splitter sizes={[65, 35]} minSizes={[700, 500]}>
					<div className={styles.form}>
						<div className={styles.source}>
							<TextField {...TEXT_AREA_PROPS} autoFocus={true} label="原文" value={source} onChange={onSourceChange} />
						</div>
						<div className={styles.bar}>
							{(current.actions || []).map((action, index) => (
								<Button key={index} variant="contained" size="small" onClick={() => execAction(action)}>{action.label}</Button>
							))}
							<Button variant="contained" size="small" onClick={() => setSource(target)}>^ 传输</Button>
						</div>
						<div className={styles.target}>
							<TextField {...TEXT_AREA_PROPS} value={target} onChange={() => null} />
						</div>
					</div>
				</Splitter>
			</div>
		</div>
	);
}