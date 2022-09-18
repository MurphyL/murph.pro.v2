import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import PlaintextKitsReference from "./text/outlet/plaintext-root.text-reference";

import HttpKitsLayout from "./http/layout/http-kits.layout.module";

import JSONKitsTextReference from "./json/outlet/json-kits.text-reference";
import SQLKitsTextReference from "./sql/outlet/sql-kits.text-reference";

const DatetimeKits = React.lazy(() => import('./datetime/datetime-kits.module'));

const IconsFinder = React.lazy(() => import("./icons/icons-finder/icons-finder.module"));

const JSONView = React.lazy(() => import("./json/json-view/json-view.module"));
const JSONPathQuery = React.lazy(() => import("./json/path-query/path-query.module"));

const DataXOptionsMaker = React.lazy(() => import("./datax/outlet/datax-options.module"));

const MySQLDDL2X = React.lazy(() => import("./sql/mysql-ddl2x/mysql-ddl2x.module"));

const RestTemplate = React.lazy(() => import("./http/outlet/rest-template/rest-template.v1.module"));
const StatusCodeList = React.lazy(() => import("./http/outlet/status-code/status-code.module"));
const ElasticSearchLayout = React.lazy(() => import("./elasticsearch/layout/es-layout.v1.module"));

const TextRootStage = React.lazy(() => import("./text/layout/root-stage/text-root-stage.module"));
const TextConvertors = React.lazy(() => import("./text/converters/text-converters.v1.module"));
const TextDifference = React.lazy(() => import("./text/outlet/difference/text-difference.module"));

const CodeKits = React.lazy(() => import('./code/code-kits.v1.module'));


export default function KitsRoutes() {
    return (
        <Routes>
            <Route path="/es" element={<Navigate to="../elasticsearch" />} />
            <Route path="/elasticsearch" element={<ElasticSearchLayout />} />
            <Route path="/datetime" element={<DatetimeKits />} />
            <Route path="/mysql/ddl" element={<MySQLDDL2X />} />
            <Route path="/json/tree-view" element={<JSONView />} />
            <Route path="/json/path-query" element={<JSONPathQuery />} />
            <Route path="/converters/*" element={<Outlet />}>
                <Route index element={<Navigate to="../url" />} />
                <Route path=":cate" element={<TextConvertors />} />
            </Route>
            <Route path="/text/difference" element={<TextDifference />} />
            <Route path="/icons/*" element={<Outlet />}>
                <Route index element={<div>Icons</div>} />
                <Route path="finder" element={<IconsFinder />} />
            </Route>
            <Route path="/datax/*">
                <Route path="options" element={<DataXOptionsMaker />} />
            </Route>
            <Route path="/http/*" element={<HttpKitsLayout />}>
                <Route path="status-code" element={<StatusCodeList />} />
                <Route path="rest-template" element={<RestTemplate />} />
            </Route>
            <Route path="/source-code" element={<CodeKits />}>
            </Route>
            <Route path="/*" element={<TextRootStage />}>
                <Route path="json" element={<JSONKitsTextReference />} />
                <Route path="sql" element={<SQLKitsTextReference />} />
                <Route path="plaintext" element={<PlaintextKitsReference />} />
            </Route>
        </Routes>
    );
}