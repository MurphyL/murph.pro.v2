import React from 'react';
import { useOutletContext } from "react-router-dom";

import Box from '@mui/material/Box';

import cronstrue from 'cronstrue';

import cronConverter from 'cron-converter';

console.dir(cronstrue)

export default function CronTranslator() {
	const { content } = useOutletContext();
	const [ success, result ] = React.useMemo(() => {
		try {
			console.log(cronConverter.fromString(content));
			return [ true, cronstrue.toString(content)];
		} catch(e) {
			return [ false, '转换出错' ]
		}
	}, [content]);
	return (
		<Box>CRON - {result}</Box>
	);
}