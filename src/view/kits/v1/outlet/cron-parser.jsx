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

const parts = [['', {
	label: true
}], ['second'], ['minute'], ['hour'], ['day_of_month'], ['month', months], ['day_of_week', weekdays], ['year']];

const valueRange = ({ from, to, step = 1 }) => range(from, to + 1, step);

const flattenPartValues = ({ values = [], ranges = [], steps = [], nearestWeekdays = [], lastDays = [], lastDay, lastWeekday }) => {
	const convertedLastDays = lastDays.map(value => `${value} LAST DAYS`);
	lastDay && convertedLastDays.unshift('LAST DAY');
	const convertedWeekDays = nearestWeekdays.map(value => `${value} NEAREST WEEK DAYS`);
	lastWeekday && convertedWeekDays('LAST WEEK DAY');
	return [
		...values,
		...flattenDepth(ranges.map(valueRange), 1),
		...flattenDepth(steps.map(valueRange), 1),
		...convertedLastDays, 
		...convertedWeekDays 
	];
};

const convertors = [
	(data, options = {}) => {
		if (options.label) {
			return 'values';
		}
		if (data.all) {
			return options.values ? Object.keys(options.values).join(separator) : '*';
		} else {
			return flattenPartValues(data).join(separator);
		}
	},
	(data, options = {}) => {
		if (options.label) {
			return 'alias';
		}
		if (data.all) {
			return options.values ? Object.values(options.values).map(item => item.alias || item.name).join(separator) : '*';
		} else {
			return flattenPartValues(data).map(value => options.values && options.values[value] ? (options.values[value].alias || options.values[value].name) : value).join(separator);
		}
	},
	(data, options = {}) => {
		if (options.label) {
			return 'readable';
		}
		if (data.all) {
			return options.values ? Object.values(options.values).map(item => item.name).join(separator) : '*';
		} else {
			return flattenPartValues(data).map(value => options.values && options.values[value] ? options.values[value].name : value).join(separator);
		}
	},
	(data, options = {}) => options.label ? 'json' : JSON.stringify(data)
];

/**
 * 相关工具
 * - https://crontab.cronhub.io/
 * @returns 
 */
export default function CronParser() {
	useDocumentTitle('CRON 表达式工具集');
	const [expression, setExpression] = React.useState('* * * * * * *');
	const parsed = React.useMemo(() => {
		const result = {};
		if (trim(expression)) {
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
					<Alert variant="outlined" sx={{ m: 0.5 }} severity={parsed.desc.level}>{parsed.desc.text || '表达式转换出错'}</Alert>
				</Grid>
			</Grid>
			<Typography variant="h5" sx={{ m: 1 }}>Parsed</Typography>
			{parsed.data.success ? (
				<TableContainer component={Paper}>
					<Table aria-label="Parsed expression">
						<TableHead>
							<TableRow>
								{parts.map(([part], index) => (
									<TableCell key={index} align="center">{part.replaceAll('_', ' ')}</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{convertors.map((convertor, rowIndex) => (
								<TableRow key={rowIndex}>
									{parts.map(([part, options], colIndex) => <TableCell key={colIndex} align="center">{convertor(parsed.data.payload[part], options)}</TableCell>)}
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