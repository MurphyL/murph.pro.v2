import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import PlaintextKitsReference from "./text/outlet/plaintext-root.text-reference";

import HttpKitsLayout from "./http/layout/http-kits.layout.module";

import JSONKitsTextReference from "./json/outlet/json-kits.text-reference";
import SQLKitsTextReference from "./sql/outlet/sql-kits.text-reference";

const DatetimeKits = React.lazy(() => import('./datetime/datetime-kits.module'));

const IconsFinder = React.lazy(() => import("./icons/outlet/icons-finder/icons-finder.module"));

const JSONPathQuery = React.lazy(() => import("./json/outlet/json-path-query/json-path-query.module"));

const DataXOptionsMaker = React.lazy(() => import("./datax/outlet/datax-options.module"));

const MySQLDDL2X = React.lazy(() => import("./sql/outlet/mysql-ddl2x/mysql-ddl2x.module"));

const RestTemplate = React.lazy(() => import("./http/outlet/rest-template/rest-template.v1.module"));
const ElasticSearchLayout = React.lazy(() => import("./elasticsearch/layout/es-layout.v1.module"));

const TextRootStage = React.lazy(() => import("./text/layout/root-stage/text-root-stage.module"));
const TextDifference = React.lazy(() => import("./text/outlet/difference/text-difference.module"));

export default function KitsRoutes() {
    return (
        <Routes>
            <Route path="/es" element={<Navigate to="../elasticsearch" />} />
            <Route path="/elasticsearch" element={<ElasticSearchLayout />} />
            <Route path="/datetime" element={<DatetimeKits />} />
            <Route path="/mysql/ddl" element={<MySQLDDL2X />} />
            <Route path="/json/path-query" element={<JSONPathQuery />} />
            <Route path="/text/difference" element={<TextDifference />} />
            <Route path="/icons/*" element={<Outlet />}>
                <Route index element={<div>Icons</div>} />
                <Route path="finder" element={<IconsFinder />} />
            </Route>
            <Route path="/datax/*">
                <Route path="options" element={<DataXOptionsMaker />} />
            </Route>
            <Route path="/http/*" element={<HttpKitsLayout />}>
                <Route path="rest-template" element={<RestTemplate />} />
            </Route>
            <Route path="/*" element={<TextRootStage />}>
                <Route path="json" element={<JSONKitsTextReference />} />
                <Route path="sql" element={<SQLKitsTextReference />} />
                <Route path="plaintext" element={<PlaintextKitsReference />} />
            </Route>
        </Routes>
    );
}