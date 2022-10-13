import React from 'react';

import { Link, Outlet } from "react-router-dom";
import { useRecoilValue } from 'recoil';

import { parse as parsePath } from 'path-browserify';

import { fetchEntries } from '/src/plug/github_api';

import { Splitter } from "/src/plug/widgets/containers";

const CONTENT_BASE = 'src/core/';

export default function SnippetRootStage() {
    const [success, entries] = useRecoilValue(fetchEntries(CONTENT_BASE));
    return success ? (
        <Splitter>
            <ul>
                {(entries || []).map((entry) => {
                    const parts = parsePath(entry.path);
                    console.log(parts);
                    return (
                        <li key={entry.path} data-entry-path={entry.path}>
                            <Link to={`/snippets/${parts.ext.substring(1)}/${parts.name}`}>{entry.path}</Link>
                        </li>
                    );
                })}
            </ul>
            <div>
                <Outlet />
            </div>
        </Splitter>
    ) : null;
}
