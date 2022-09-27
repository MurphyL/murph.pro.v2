import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import { siJson, siMysql, siVisualstudiocode } from 'simple-icons/icons';
import SimpleIconWrap from '/src/plug/widgets/container/x-icon/x-icon.module';

import TabNaviLayout, { ChildRouteLayout } from "/src/plug/layout/tab-navi/tab-navi.layout.module";

import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import FormatIndentIncreaseIcon from '@mui/icons-material/FormatIndentIncrease';
import LinkIcon from '@mui/icons-material/Link';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import TranslateIcon from '@mui/icons-material/Translate';
import WidgetsIcon from '@mui/icons-material/Widgets';

const DatetimeKits = React.lazy(() => import('./datetime/datetime-kits.module'));

const IconsFinder = React.lazy(() => import("./icons/icons-finder/icons-finder.module"));

const JSONView = React.lazy(() => import("./json/json-view/json-view.module"));
const JSONPathQuery = React.lazy(() => import("./json/path-query/path-query.module"));

const DataXOptionsMaker = React.lazy(() => import("./datax/datax-options.module"));

const SQLParser = React.lazy(() => import("./sql/parser/sql-parser.module"));
const DDL2X = React.lazy(() => import("./sql/ddl2x/sql-ddl2x.module"));

const RestTemplate = React.lazy(() => import("./http/rest-template/rest-template.v1.module"));
const StatusCodeList = React.lazy(() => import("./http/status-code/status-code.module"));
const ElasticSearchLayout = React.lazy(() => import("./elasticsearch/layout/es-layout.v1.module"));

const TextConvertors = React.lazy(() => import("./converters/text-converters.v1.module"));
const TextDifference = React.lazy(() => import("./difference/text-difference.module"));

const SourceCodeKits = React.lazy(() => import('./source-code/code-kits.v1.module'));


export default function KitsRoutes() {
    return (
        <Routes>
            <Route path="/" element={<TabNaviLayout navi={ROOT_NAVI_ITEMS} />}>
                <Route path="/es" element={<Navigate to="../elasticsearch" />} />
                <Route path="/elasticsearch" element={<ElasticSearchLayout />} />
                <Route path="/datetime" element={<DatetimeKits />} />
                <Route path="/sql/*" element={<ChildRouteLayout navi={SQL_KITS_NAVI} parent="/kits/source-code" />}>
                    <Route path="parser" element={<SQLParser />} />
                    <Route path="ddl2x" element={<DDL2X />} />    
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
                    <Route path="finder" element={<IconsFinder />} />
                </Route>
                <Route path="/datax/*">
                    <Route path="options" element={<DataXOptionsMaker />} />
                </Route>
                <Route path="/http/*" element={<ChildRouteLayout navi={HTTP_KITS_NAVI} parent="/kits/source-code" />}>
                    <Route path="status-code" element={<StatusCodeList />} />
                    <Route path="rest-template" element={<RestTemplate />} />
                </Route>
                <Route path="/source-code" element={<ChildRouteLayout navi={ROOT_NAVI_ITEMS} />}>
                    <Route index element={<SourceCodeKits />} />
                </Route>
            </Route>
        </Routes>
    );
}

const ROOT_NAVI_ITEMS = [{
    url: '/kits/source',
    icon: (<SimpleIconWrap {...siVisualstudiocode} />),
    label: 'Source Code',
}, {
    url: '/kits/json/path-query',
    icon: (<SimpleIconWrap {...siJson} />),
    label: 'JSONPath Query',
}, {
    url: '/kits/http/rest-template',
    icon: (<DynamicFormIcon />),
    label: 'REST Template',
}, {
    url: '/kits/sql/ddl2x',
    icon: (<SimpleIconWrap {...siMysql} />),
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