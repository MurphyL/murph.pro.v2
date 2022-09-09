import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const NaviStageLayout = React.lazy(() => import("/src/plug/layout/navi-stage/navi-stage.layout.module"));

const KitsHome = React.lazy(() => import("./home/kits-home.module"));
const IconsFinder = React.lazy(() => import("./icons/outlet/icons-finder/icons-finder.module"));

const JSONPathQuery = React.lazy(() => import("./json/outlet/json-path-query/json-path-query.module"));

const DataXOptionsMaker = React.lazy(() => import("./datax/outlet/datax-options.module"));

const MySQLDDL2X = React.lazy(() => import("./sql/outlet/mysql-ddl2x/mysql-ddl2x.module"));

const HttpKitsLayout = React.lazy(() => import("./http/layout/http-kits.layout.module"));

const RestTemplate = React.lazy(() => import("./http/outlet/rest-template/rest-template.v1.module"));
const ElasticSearchLayout = React.lazy(() => import("./elasticsearch/layout/es-layout.v1.module"));

const TextRootStage = React.lazy(() => import("./text/outlet/root-stage/text-root-stage.module"));
const TextDifference = React.lazy(() => import("./text/outlet/difference/text-difference.module"));

export default function KitsRoutes() {
    return (
        <Routes>
            <Route path="/" element={<NaviStageLayout />}>
                <Route index={true} element={<KitsHome />} />
                <Route path="/icons/*">
                    <Route path="*" element={<IconsFinder />} />
                </Route>
                <Route path="/json">
                    <Route index={true} element={<TextRootStage language="json" />} />
                    <Route path="path-query" element={<JSONPathQuery />} />
                </Route>
                <Route path="/http/*" element={<HttpKitsLayout />}>
                    <Route path="rest-template" element={<RestTemplate />} />
                </Route>
                <Route path="/sql" element={<TextRootStage language="sql" />} />
                <Route path="/text/*">
                    <Route index={true} element={<TextRootStage />} />
                    <Route path="difference" element={<TextDifference />} />
                </Route>
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
            </Route>
        </Routes>
    );
}