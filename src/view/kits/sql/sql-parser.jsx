import React from 'react';

import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";
import CodeEditor from "/src/plug/widgets/code/editor/code-editor.v1.module";


export default function SQLParser() {
	return (
		<Splitter>
			<CodeEditor language="sql" />
			<span>SQL Parse</span>
		</Splitter>
	);
}