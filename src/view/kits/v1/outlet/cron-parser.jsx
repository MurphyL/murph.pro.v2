import React from 'react';

import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import cronstrue from 'cronstrue';
import { flattenDepth, trim, range } from 'lodash';
import { parse as parseCRON } from '@datasert/cronjs-parser';

import { useDocumentTitle } from '/src/plug/hooks';

import { weekdays, months } from '/src/plug/datetime_ex';

const separator = ', ';

const parts_v1 = [{
	required: false,
	range: '0-59'
}, {
	label: 'second',
	required: false,
	range: '0-59',
	wildcards: ', - * /'
}, {
	label: 'minute',
	required: true,
	range: '0-59',
	wildcards: ', - * /'
}, {
	label: 'hour',
	required: true,
	range: '0-59',
	wildcards: ', - * /'
}, {
	label: 'day_of_month',
	required: true,
	range: '1-31',
	wildcards: ', - * / ? L W'
}, {
	...months,
	label: 'month',
	required: true,
	range: '1-12',
	wildcards: ', - * /'
}, {
	...weekdays,
	label: 'day_of_week',
	required: true,
	range: '0-7',
	wildcards: ', - * / ? L #'
}, {
	label: 'year',
	required: false,
	range: '1970-3000',
	wildcards: ', - * /'
}];

const valueRange = ({ from, to, step = 1 }) => range(from, to + 1, step);

const flattenPartValues = ({ values = [], ranges = [], steps = [], nearestWeekdays = [], lastDays = [], lastDay, lastWeekday }) => {
	const convertedLastDays = lastDays.map(value => `${value} LAST DAYS`);
	lastDay && convertedLastDays.unshift('LAST DAY');
	const convertedWeekDays = nearestWeekdays.map(value => `${value} NEAREST WEEK DAYS`);
	lastWeekday && convertedWeekDays.unshift('LAST WEEK DAY');
	return [
		...values,
		...flattenDepth(ranges.map(valueRange), 1),
		...flattenDepth(steps.map(valueRange), 1),
		...convertedLastDays,
		...convertedWeekDays
	];
};

const convertors_v1 = [({ part }, cellIndex) => {
	return cellIndex === 0 ? 'parts' : (part || '');
}, ({ parsed, options }, cellIndex) => {
	if(cellIndex === 0) {
		return 'values';
	} else {
		if (parsed.all) {
			return options.values ? Object.keys(options.values).join(separator) : '*';
		} else {
			return flattenPartValues(parsed).join(separator);
		}
	}
}, ({ parsed, options }, cellIndex) => {
	if(cellIndex === 0) {
		return 'alias';
	} else {
		const mapper = (value) => options.values && options.values[value] ? (options.values[value].alias || options.values[value].name) : value;
		if (parsed.all) {
			return options.values ? Object.keys(options.values).map(mapper).join(separator) : '*';
		} else {
			return flattenPartValues(parsed).map(mapper).join(separator);
		}
	}
}, ({ parsed, options }, cellIndex) => {
	if(cellIndex === 0) {
		return 'readable';
	} else {
		const mapper = (value) => options.values && options.values[value] ? options.values[value].name : value;
		if (parsed.all) {
			return options.values ? Object.keys(options.values).map(mapper).join(separator) : '*';
		} else {
			return flattenPartValues(parsed).map(mapper).join(separator);
		}
	}
}, ({ parsed }, cellIndex) => {
	return cellIndex === 0 ? 'json' : JSON.stringify(parsed);
}, ({ options }, cellIndex) => {
	return cellIndex === 0 ? 'required' : (options.required ? 'Yes': '');
}, ({ options }, cellIndex) => {
	return cellIndex === 0 ? 'wildcards' : options.wildcards || '';
}, ({ options }, cellIndex) => {
	return cellIndex === 0 ? 'value range' : options.range || '';
}];

/**
 * 相关工具
 * - https://crontab.cronhub.io/
 * @returns 
 */
export default function CronParser() {
	useDocumentTitle('CRON 表达式工具集');
	const [expression, setExpression] = React.useState('1-9/3 1-2 * 2W SEP,10 1L *');
	const parsed = React.useMemo(() => {
		const result = {};
		if (trim(expression)) {
			result.parts = expression.split(/\s/);
			try {
				const { expressions: [first] } = parseCRON(expression, { hasSeconds: true });
				result.data = { success: true, payload: first };
			} catch (e) {
				result.data = { success: false, payload: '解析表达式出错：' + e.message };
			}
			try {
				result.desc = { level: 'success', text: cronstrue.toString(expression) };
			} catch (e) {
				console.log('CRON 表达式转换出错', e);
				result.desc = { level: 'error', text: 'CRON 表达式转换出错' };
			}
		} else {
			result.desc = { level: 'warning', text: '表达式为空' };
		}
		return result;
	}, [expression]);
	return (
		<Stack sx={{ p: 1 }} spacing={1}>
			<Grid container spacing={2} sx={{ p: 1, backgroundColor: '#fcfcfc' }}>
				<Grid item xs={3}>
					<TextField fullWidth size="medium" label="CRON Expression" value={expression} onChange={e => setExpression(e.target.value)} />
				</Grid>
				<Grid item xs={9}>
					<Alert variant="outlined" sx={{ p: 1 }} severity={parsed.desc.level}>{parsed.desc.text || '表达式转换出错'}</Alert>
				</Grid>
			</Grid>
			<Typography variant="h5" sx={{ m: 1 }}>Parsed</Typography>
			{parsed.data.success ? (
				<TableContainer component={Paper}>
					<Table aria-label="Parsed expression">
						<TableHead>
							<TableRow>
								{parts_v1.map((part, index) => (
									<TableCell key={index} align="center" sx={{ backgroundColor: '#fafafa' }}>{part.label ? part.label.replaceAll('_', ' ') : ''}</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{convertors_v1.map((convertor, rowIndex) => (
								<TableRow key={rowIndex}>
									{parts_v1.map((part, colIndex) => (
										<TableCell key={colIndex} align="center">{convertor({
											part: colIndex > 0 ? parsed.parts[colIndex - 1] : null,
											options: part,
											parsed: colIndex > 0 ? parsed.data.payload[part.label] : null,
										}, colIndex)}</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			) : (
				<Alert sx={{ m: 1 }} severity="error">表达式解析出错</Alert>
			)}
		</Stack>
	);
}