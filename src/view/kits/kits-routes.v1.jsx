import { Routes, Route, Navigate } from "react-router-dom";

import JSONKitsLayout, { JSONKitsHome } from "./json/layout/json-kits-layout.v1.module";

// import JSONKitsRoot from "./json/outlet/json-kits-base/json-kits-base.module";
import JSONPathQuery from "./json/outlet/json-path-query/json-path-query.module";
import JSON2X from "./json/outlet/json-to-x/json-to-x.module";

import DataXOptionsMaker from "./datax/datax-options.module";

import SQLKitsLayout from "./sql/layout/sql-kits-layout.v1.module";
import MySQLDDL2X from "./sql/outlet/mysql-ddl2x/mysql-ddl2x.module";

import HttpKitsLayout from "./http/layout/http-kits.layout.module";
import RestTemplate from "./http/outlet/rest-template/rest-template.v1.module";

import ElasticSearchLayout from "./elasticsearch/layout/es-layout.v1.module";

import TextKitsLayout from "./text/layout/text-kits-layout.v1.module";

export default function KitsRoutes() {
    return (
        <Routes>
            <Route index={true} element={<div>Kits</div>} />
            <Route path="/json">
                <Route index={true} element={<TextKitsLayout language="json" />} />
                <Route path="path-query" element={<JSONPathQuery />} />
            </Route>
            <Route path="/http/*" element={<HttpKitsLayout />}>
                <Route path="rest-template" element={<RestTemplate />} />
            </Route>
            <Route path="/sql" element={<SQLKitsLayout />}>
                <Route index={true} element={<div>SQL Kits</div>} />
            </Route>
            <Route path="/text" element={<TextKitsLayout />} />
            <Route path="/datax/*">
                <Route path="options" element={<DataXOptionsMaker />} />
            </Route>
            <Route path="/mysql/*">
                <Route path="ddl" element={<MySQLDDL2X />} />
            </Route>
            <Route path="/es" element={<Navigate to="../elasticsearch" replace={true} />} />
            <Route path="/elasticsearch" element={<ElasticSearchLayout />}>
            </Route>
            <Route path="*" element={<div>404 - NOT FOUND</div>} />
        </Routes>
    );
}