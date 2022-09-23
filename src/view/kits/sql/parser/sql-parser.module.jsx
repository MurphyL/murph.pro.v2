import React from 'react';
import axios from 'axios';

import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";
import CodeEditor from "/src/plug/widgets/code/editor/code-editor.v1.module";

import { useServerKitRequest } from '/src/plug/hooks';

export default function SQLParser() {
	const x = useServerKitRequest({
		url: '/sql/parse'
	});
	console.log(x);
	return (
		<Splitter>
			<CodeEditor language="sql" />
			<span>SQL Parse</span>
		</Splitter>
	);
}