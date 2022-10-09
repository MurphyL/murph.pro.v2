import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";


import TabNaviLayout, { ChildRouteLayout } from "/src/plug/layout/tab-navi/tab-navi.layout.module";

import AccountTreeIcon from '@mui/icons-material/AccountTree';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import FormatIndentIncreaseIcon from '@mui/icons-material/FormatIndentIncrease';
import LinkIcon from '@mui/icons-material/Link';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import SvgIcon from '@mui/material/SvgIcon';
import TranslateIcon from '@mui/icons-material/Translate';
import WidgetsIcon from '@mui/icons-material/Widgets';

import { SiJson, SiMysql, SiVisualstudiocode } from "react-icons/si";

const JSONView = React.lazy(() => import("./json/json-view/json-view.module"));
const JSONPathQuery = React.lazy(() => import("./json/path-query/path-query.module"));

const DataXOptionsMaker = React.lazy(() => import("./datax/datax-options.module"));

const DdlToX = React.lazy(() => import("./sql/ddl-to-x"));
const DdlFromCsv = React.lazy(() => import('./sql/ddl-from-csv'));

const RestTemplate = React.lazy(() => import("./http/rest-template/rest-template.v1.module"));
const StatusCodeList = React.lazy(() => import("./http/status-code/status-code.module"));
const ElasticSearchLayout = React.lazy(() => import("./elasticsearch/layout/es-layout.v1.module"));

const TextConvertors = React.lazy(() => import("./converters/text-converters.v1.module"));
const TextDifference = React.lazy(() => import("./difference/text-difference.module"));

const CodeKits = React.lazy(() => import('./code/code-kits.v1.module'));

const CronParser = React.lazy(() => import('./expression/cron-parser'));



export default function KitsRoutes() {
    return (
        <Routes>
            <Route path="/" element={<TabNaviLayout navi={ROOT_NAVI_ITEMS} />}>
                <Route path="/es" element={<Navigate to="../elasticsearch" />} />
                <Route path="/elasticsearch" element={<ElasticSearchLayout />} />
                <Route path="/cron/parser" element={<CronParser />} />
                <Route path="/sql/*" element={<ChildRouteLayout navi={SQL_KITS_NAVI} parent="/kits/source-code" />}>
                    <Route path="ddl2x" element={<DdlToX />} />
                    <Route path="ddl/from_csv" element={<DdlFromCsv />} />
                </Route>
                <Route path="/json/*" element={<ChildRouteLayout navi={JSON_KITS_NAVI} parent="/kits/source-code" />}>
                    <Route path="tree-view" element={<JSONView />} />
                    <Route path="path-query" element={<JSONPathQuery />} />    
                </Route>
                <Route path="/converters/*" element={<ChildRouteLayout navi={CONVERTORS_NAVI} parent="/kits/source-code" />}>
                    <Route index element={<Navigate to="../url" />} />
                    <Route path=":cate" element={<TextConvertors />} />
                </Route>
                <Route path="/difference" element={<TextDifference />} />
                <Route path="/icons/*" element={<Outlet />}>
                    <Route index element={<div>Icons</div>} />
                </Route>
                <Route path="/datax/*">
                    <Route path="options" element={<DataXOptionsMaker />} />
                </Route>
                <Route path="/http/*" element={<ChildRouteLayout navi={HTTP_KITS_NAVI} parent="/kits/source-code" />}>
                    <Route path="status-code" element={<StatusCodeList />} />
                    <Route path="rest-template" element={<RestTemplate />} />
                </Route>
                <Route path="/code" element={<ChildRouteLayout navi={ROOT_NAVI_ITEMS} />}>
                    <Route index element={<CodeKits />} />
                </Route>
            </Route>
        </Routes>
    );
}

const ROOT_NAVI_ITEMS = [{
    url: '/kits/source',
    icon: (<SvgIcon><SiVisualstudiocode /></SvgIcon>),
    label: 'Source Code',
}, {
    url: '/kits/json/path-query',
    icon: (<SvgIcon><SiJson /></SvgIcon>),
    label: 'JSONPath Query',
}, {
    url: '/kits/http/rest-template',
    icon: (<DynamicFormIcon />),
    label: 'REST Template',
}, {
    url: '/kits/sql/ddl2x',
    icon: (<SvgIcon><SiMysql /></SvgIcon>),
    label: 'DDL Parser & Render',
}, {
    url: '/kits/converters/crypto',
    icon: (<TranslateIcon />),
    label: '加/解密',
}, {
    url: '/kits/icons/finder',
    icon: (<WidgetsIcon />),
    label: '查找图标',
}];

const JSON_KITS_NAVI = [{
    url: '/kits/json/path-query',
    icon: (<ManageSearchIcon />),
    label: 'JSONPath Query',
}, {
    url: '/kits/json/tree-view',
    icon: (<AccountTreeIcon />),
    label: 'JSON TreeView',
}];

const SQL_KITS_NAVI = [{
    url: '/kits/sql/ddl2x',
    icon: (<AccountTreeIcon />),
    label: 'DDL Parser & Render',
}, {
    url: '/kits/sql/ddl_from_csv',
    icon: (<AccountTreeIcon />),
    label: 'DDL Parser & Render',
}];

const HTTP_KITS_NAVI = [{
    url: '/kits/http/rest-template',
    icon: (<FormatIndentIncreaseIcon />),
    label: 'REST Template',
}, {
    url: '/kits/http/status-code',
    icon: (<BubbleChartIcon />),
    label: 'HTTP Status Code',
}];

const CONVERTORS_NAVI = [{
    url: '/kits/converters/crypto',
    icon: (<PublishedWithChangesIcon />),
    label: '加/解密',
}, {
    url: '/kits/converters/url',
    icon: (<LinkIcon />),
    label: 'URL Encoder',
}];