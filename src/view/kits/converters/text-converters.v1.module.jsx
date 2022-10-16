import React from 'react';

import { Link, useParams } from "react-router-dom";

import { useSnackbar } from 'notistack';

import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';

import { Splitter } from "/src/plug/widgets/containers";
import CodeBlock from '/src/plug/widgets/code/code-block.v1';

import { useDocumentTitle } from '/src/plug/hooks';

import textConvertersReducer from './text-converters.v1.reducer';

import styles from './text-converters.v1.module.css';

const convertors = {
	crypto: {
		display: 'CRYPTO.JS',
		actions: [{
			type: 'sha256/encode',
			display: 'SHA256',
		}, {
			type: 'hamc-sha256/encode',
			display: 'HAMC SHA256',
		}, {
			type: 'md5/encode',
			display: 'MD5',
		}]
	},
	base64: {
		display: 'Base 64',
		excerpt: 'res/documents/what-is-base64.md',
		actions: [{
			type: 'base64/encode',
			display: '加密',
		}, {
			type: 'base64/dencode',
			display: '解密',
		}]
	},
	url: {
		display: 'URL',
		actions: [{
			type: 'url/encode',
			display: 'Encode',
		}, {
			type: 'url/dencode',
			display: 'Dencode',
		}]
	},
	cron: {
		display: 'CRON',
		actions: [{
			display: 'Unicode 转中文'
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
	const { enqueueSnackbar } = useSnackbar();
	const current = React.useMemo(() => convertors[cate], [cate]);
	const [state, dispatch] = React.useReducer(textConvertersReducer, { source: window.location.origin, target: '\n' });
	useDocumentTitle(`${current.display} - 转换工具`);
	React.useEffect(() => {
		if (state.success === false) {
			enqueueSnackbar(state.message || '未知错误', {
				variant: 'error',
			})
		}
	}, [state]);
	return (
		<div className={styles.root}>
			<Tabs className={styles.header} value={current.index} variant="scrollable" scrollButtons="auto">
				{Object.entries(convertors).map(([key, entry]) => (
					<Tab key={key} component={Link} label={entry.display} to={`/kits/converters/${key}`} />
				))}
			</Tabs>
			<div className={styles.stage}>
				<Splitter sizes={[65, 35]} minSize={[700, 500]}>
					<div className={styles.form}>
						<div className={styles.source}>
							<TextField {...TEXT_AREA_PROPS} autoFocus={true} label="原文" value={state.source} onChange={(e) => dispatch({ type: 'exchange', source: e.target.value })} />
						</div>
						<div className={styles.bar}>
							{(current.actions || []).map((action, index) => (
								<Button key={index} variant="contained" size="small" onClick={() => dispatch({ ...action, source: state.source })}>{action.display}</Button>
							))}
							<Button variant="contained" size="small" onClick={() => dispatch({ type: 'exchange', source: state.target })}>^ 传输</Button>
						</div>
						<div className={styles.target}>
							<CodeBlock showLineNumbers={false} children={state.target} language={state.language || 'plaintext'} />
						</div>
					</div>
					<div className={styles.extra}>
						<p>相关文档</p>
					</div>
				</Splitter>
			</div>
		</div>
	);
}