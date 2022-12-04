import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import SvgIcon from '@mui/material/SvgIcon';

import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import TranslateIcon from '@mui/icons-material/Translate';

import { SiJson, SiMysql, SiVisualstudiocode } from "react-icons/si";

import KitsNaviLayout from "/src/plug/layout/kits-root.layout";

const JSONView = React.lazy(() => import("./json/json-view"));
const ExpressionQueryJSON = React.lazy(() => import("./json/expression-query"));

const DataXOptionsMaker = React.lazy(() => import("./datax/datax-options.module"));

const MySQLDDL2X = React.lazy(() => import("./sql/mysql-ddl2x"));

const RestTemplate = React.lazy(() => import("./http/rest-template/rest-template.v1.module"));
const ElasticSearchLayout = React.lazy(() => import("./elasticsearch/layout/es-layout.v1.module"));

const TextConvertors = React.lazy(() => import("./converters/text-converters.v1.module"));
const TextDifference = React.lazy(() => import("./difference/text-difference.module"));

const CodeKits = React.lazy(() => import('./code/code-kits.base'));

const CronParser = React.lazy(() => import('./expression/cron-parser'));
const DatetimeKits = React.lazy(() => import('./datetime/datetime-kits'));

export default function KitsRoutes() {
    return (
        <Routes>
            <Route path="/" element={<KitsNaviLayout navi={ROOT_NAVI_ITEMS} />}>
                <Route path="/es" element={<Navigate to="../elasticsearch" />} />
                <Route path="/elasticsearch" element={<ElasticSearchLayout />} />
                <Route path="/datetime" element={<DatetimeKits />}>

                </Route>
                <Route path="/cron/*" >
                    <Route path="parser" element={<CronParser />} />
                </Route>
                <Route path="/sql/*" >
                    <Route path="mysql/ddl2x" element={<MySQLDDL2X />} />
                </Route>
                <Route path="/json/*">
                    <Route path="tree-view" element={<JSONView />} />
                    <Route path="expression-query" element={<ExpressionQueryJSON />} />
                </Route>
                <Route path="/converters/*">
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
                <Route path="/http/*">
                    <Route path="rest-template" element={<RestTemplate />} />
                </Route>
                <Route path="/code" element={<CodeKits />}>
                </Route>
            </Route>
        </Routes>
    );
}

const ROOT_NAVI_ITEMS = [{
    url: '/kits/code',
    icon: (<SvgIcon><SiVisualstudiocode /></SvgIcon>),
    label: 'Source Code',
}, {
    url: '/kits/json/expression-query',
    icon: (<SvgIcon><SiJson /></SvgIcon>),
    label: 'JSONPath Query',
}, {
    url: '/kits/http/rest-template',
    icon: (<DynamicFormIcon />),
    label: 'REST Template',
}, {
    url: '/kits/sql/mysql/ddl2x',
    icon: (<SvgIcon><SiMysql /></SvgIcon>),
    label: 'DDL Parser & Render',
}, {
    url: '/kits/converters/crypto',
    icon: (<TranslateIcon />),
    label: '加/解密',
}];
