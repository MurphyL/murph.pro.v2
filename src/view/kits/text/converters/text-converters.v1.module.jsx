import React from 'react';

import { Link, useParams } from "react-router-dom";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { useDocumentTitle } from '/src/plug/hooks';

import Bar from "/src/plug/widgets/container/bar/bar.v1.module";
import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";

import styles from './text-converters.v1.module.css';

const convertors = {
	sha: {
		label: 'SHA'
	},
	md5: {
		label: 'MD5'	
	},
	url: {
		label: 'URL'	
	},
	utf8: {
		label: 'UTF-8'	
	}
};

Object.entries(convertors).forEach(([unique, entry], index) => {
	entry.index = index;
	entry.unique = unique;
});

export default function TextConverters() {
	const { cate } = useParams();
	const { index, label } = React.useMemo(() => convertors[cate], [cate]);
	useDocumentTitle(`${label} - 转换工具`);
	return (
		<div className={styles.root}>
			<Tabs className={styles.header} value={index} variant="scrollable" scrollButtons="auto">
				{Object.entries(convertors).map(([key, entry]) => (
					<Tab key={key} component={Link} label={entry.label} to={`/kits/converters/${key}`} />
				))}
			</Tabs>
			<div className={styles.stage}>
				<Splitter sizes={[65, 35]} minSizes={[700, 500]}>
					<div className={styles.form}>
						<div className={styles.source}>
							<textarea></textarea>
						</div>
						<Bar>
							<Button variant="contained" size="small">Small</Button>
						</Bar>
						<div className={styles.target}>
							<textarea></textarea>
						</div>
					</div>
				</Splitter>
			</div>

		</div>
	);
}