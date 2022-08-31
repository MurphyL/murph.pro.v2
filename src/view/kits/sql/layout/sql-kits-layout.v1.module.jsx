import { Outlet } from "react-router-dom";

import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";
import CodeEditor from "/src/plug/widgets/code/editor/code-editor.v1.module";

export default function SQLKitsLayout() {
    return (
        <Splitter>
            <SQLEditor />
            <div>
                <Outlet />
            </div>
        </Splitter>
    );
}

export function SQLEditor() {
    return (
        <CodeEditor />
    );
}