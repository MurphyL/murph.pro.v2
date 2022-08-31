import { Routes, Route } from "react-router-dom";

import JSONKitsLayout from "./json/layout/json-kits-layout.v1.module";

import JSONKitsRoot from "./json/sidebar/json-kits-base/json-kits-base.module";
import JSONPathQuery from "./json/sidebar/json-path-query/json-path-query.module";
import JSON2X from "./json/sidebar/json-to-x/json-to-x.module";

export default function KitsRoutes() {
    return (
        <Routes>
            <Route path="/json/*" element={<JSONKitsLayout />}>
                <Route index={true} element={<JSONKitsRoot />} />
                <Route path="path-query" element={<JSONPathQuery />} />
                <Route path="to-yaml" element={<JSON2X target="YAML" />} />
                <Route path="to-js" element={<JSON2X target="JavaScript" />} />
            </Route>
            <Route path="*" element={<div>404 - NOT FOUND</div>} />
        </Routes>
    );
}