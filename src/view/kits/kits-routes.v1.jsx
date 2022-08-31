import { Routes, Route } from "react-router-dom";

import JSONKitsLayout from "./json/layout/json-kits-layout.v1.module";

import JSONKitsRoot from "./json/sidebar/json-kits-base/json-kits-base.module";
import JSONPathQuery from "./json/sidebar/json-path-query/json-path-query.module";
import JSON2X from "./json/sidebar/json-to-x/json-to-x.module";

import SQLKitsLayout from "./sql/layout/sql-kits-layout.v1.module";
import MySQL_DDL2X from "./sql/sidebar/mysql-ddl2x/mysql-ddl2x.module";

export default function KitsRoutes() {
    return (
        <Routes>
            <Route index={true} element={<div>Kits</div>} />
            <Route path="/json/*" element={<JSONKitsLayout />}>
                <Route index={true} element={<JSONKitsRoot />} />
                <Route path="path-query" element={<JSONPathQuery />} />
                <Route path="to-yaml" element={<JSON2X target="YAML" />} />
                <Route path="to-js" element={<JSON2X target="JavaScript" />} />
            </Route>
            <Route path="/sql" element={<SQLKitsLayout />}>
                <Route index={true} element={<div>SQL Kits</div>} />
            </Route>
            <Route path="/mysql/*">
                <Route path="ddl" element={<MySQL_DDL2X />} />
            </Route>
            <Route path="*" element={<div>404 - NOT FOUND</div>} />
        </Routes>
    );
}