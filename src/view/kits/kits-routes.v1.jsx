import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import NaviStageLayout from "/src/plug/layout/navi-stage/navi-stage.layout.module";

import KitsHome from "./home/kits-home.module";

import JSONPathQuery from "./json/outlet/json-path-query/json-path-query.module";

import DataXOptionsMaker from "./datax/outlet/datax-options.module";

import MySQLDDL2X from "./sql/outlet/mysql-ddl2x/mysql-ddl2x.module";

import HttpKitsLayout from "./http/layout/http-kits.layout.module";
import RestTemplate from "./http/outlet/rest-template/rest-template.v1.module";

import ElasticSearchLayout from "./elasticsearch/layout/es-layout.v1.module";

import TextDifference from "./text/outlet/difference/text-difference.module";

const TextRootStage = React.lazy(() => import("./text/outlet/root-stage/text-root-stage.module"));


export default function KitsRoutes() {
    return (
        <Routes>
            <Route path="/" element={<NaviStageLayout />}>
                <Route index={true} element={<KitsHome />} />
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