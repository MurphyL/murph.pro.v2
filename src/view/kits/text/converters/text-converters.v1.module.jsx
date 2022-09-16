import React from 'react';

import { Link, useParams } from "react-router-dom";

import { useSnackbar } from 'notistack';

import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';

import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";

import { useDocumentTitle } from '/src/plug/hooks';
import { toBase64, fromBase64, toMD5, toSHA256, fromUnicode } from '../text-kits.v1';

import styles from './text-converters.v1.module.css';

const convertors = {
	sha: {
		display: 'SHA',
		actions: [{
			display: 'SHA256',
			apply(source) {
				return toSHA256(source);
			}
		}, {
			display: 'HAMC SHA256',
			apply(source) {
				return toSHA256(source, true);
			}
		}]
	},
	md5: {
		display: 'MD5',
		actions: [{
			display: '加密',
			apply(source) {
				return toMD5(source);
			}
		}]
	},
	base64: {
		display: 'Base 64',
		excerpt: 'res/documents/what-is-base64.md',
		actions: [{
			display: '加密',
			apply: toBase64
		}, {
			display: '解密',
			apply: fromBase64
		}]
	},
	url: {
		display: 'URL',
		actions: [{
			display: 'Encode',
			apply: encodeURIComponent
		}, {
			display: 'Dencode',
			apply: decodeURIComponent
		}]
	},
	ascii: {
		display: 'ASCII',
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
	const [source, setSource] = React.useState(window.location.origin);
	const [target, setTarget] = React.useState('');
	useDocumentTitle(`${current.display} - 转换工具`);
	const onSourceChange = React.useCallback((e) => setSource(e.target.value), [setSource]);
	const execAction = React.useCallback((action) => {
		if (action.apply) {
			try {
				setTarget(action.apply(source));
			} catch (e) {
				console.log('操作失败：', action, e);
				enqueueSnackbar(`操作失败：${e.message || '未知错误'}`, {
					variant: 'error',
				})
			}

		}
	}, [source, setTarget]);
	return (
		<div className={styles.root}>
			<Tabs className={styles.header} value={current.index} variant="scrollable" scrollButtons="auto">
				{Object.entries(convertors).map(([key, entry]) => (
					<Tab key={key} component={Link} label={entry.display} to={`/kits/converters/${key}`} />
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
								<Button key={index} variant="contained" size="small" onClick={() => execAction(action)}>{action.display}</Button>
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