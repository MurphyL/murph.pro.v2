import React from "react";
import { Card, CardContent, FormGroup, FormControlLabel, Stack, Switch, TextField } from "@mui/material";

import dayjs from "dayjs";
import weekOfYear from 'dayjs/plugin/weekOfYear';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';

import { useDocumentTitle } from '/src/plug/hooks';

dayjs.extend(weekOfYear);
dayjs.extend(quarterOfYear);

const QUARTERS = {
    1: 'Spring', 2: 'Summer', 3: 'Autumn', 4: 'winter'
};

export default function DatetimeKits() {
    useDocumentTitle('时间工具集');
    const [milliseconds, setMilliseconds] = React.useState(null);
    const [refresh, setRefresh] = React.useState({ enabled: true });
    React.useEffect(() => {
        if (!refresh.enabled && refresh.tid) {
            clearInterval(refresh.tid);
        }
        if (refresh.enabled && isNaN(refresh.tid)) {
            const tid = setInterval(() => {
                setMilliseconds(Date.now());
            }, 1000);
            setRefresh({ enabled: true, tid });
            return () => clearInterval(tid);
        }
    }, [refresh.enabled, setRefresh, setMilliseconds]);
    const parsed = React.useMemo(() => {
        const instance = dayjs(milliseconds === null ? Date.now() : milliseconds);
        return {
            display: instance.format('YYYY-MM-DD HH:mm:ss'),
            timestamp: instance.unix(),
            milliseconds: instance.valueOf(),
            quarter: {
                name:  QUARTERS[instance.quarter()],
                number: instance.quarter(),
            },
            month: {
                alias: instance.format('MMM'),
                name: instance.format('MMMM'),
            },
            weekOfYear: instance.week(),
            weekday: {
                alias: instance.format('ddd'),
                name: instance.format('dddd'),
            }
        };
    }, [milliseconds]);
    return (
        <Stack spacing={3} direction="row" sx={{ p: 1 }}>
            <Card elevation={5}>
                <CardContent>
                    <Stack direction="row" spacing={2}>
                        <Stack spacing={3}>
                            <TextField size="small" label="Datetime" value={parsed.display} />
                            <TextField size="small" label="Unix Timestamp" value={parsed.timestamp} />
                            <FormGroup>
                                <FormControlLabel value="interval" control={<Switch color="primary" checked={refresh.enabled} onClick={(e) => setRefresh({ enabled: e.target.checked })} />} label="Interval" labelPlacement="end" />
                            </FormGroup>
                        </Stack>
                        <Stack spacing={3}>
                            <TextField readOnly size="small" label="Month Name" value={parsed.month.name} />
                            <TextField readOnly size="small" label="Month Alias" value={parsed.month.alias} />
                            <TextField readOnly size="small" label="Quarter" value={parsed.quarter.name} />
                        </Stack>
                        <Stack spacing={3}>
                            <TextField readOnly size="small" label="Weekday" value={parsed.weekday.name} />
                            <TextField readOnly size="small" label="Weekday Alias" value={parsed.weekday.alias} />
                            <TextField readOnly size="small" label="Week of Year" value={parsed.weekOfYear} />
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </Stack >
    );
}