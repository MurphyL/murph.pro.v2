import { createApp } from 'vue';
import { createPinia } from 'pinia';

import piniaPersistedstate from 'pinia-plugin-persistedstate';

import router from './core/router';
import appV1 from './core/app.v1.vue';

// 通用字体
import 'vfonts/Lato.css';
// 等宽字体
import 'vfonts/FiraCode.css';

import '@/core/app.v1.less';

/**
 * @ref https://segmentfault.com/a/1190000041686221
 * monaco-editor 的官方例子中，基本都是单文件的处理，不过多文件处理也非常简单，本文在此处仅做简单的介绍。
 * 多文件处理主要涉及到的就是 monaco.editor.create 以及 monaco.editor.createModel 两个api。
 * 其中，createModel 就是多文件处理的核心 api。根据文件路径创建不同的 model，在需要切换时，通过调用 editor.setModel 即可实现多文件的切换
 */
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import TypeScriptWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';

self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === 'json') {
            return new JsonWorker()
        }
        if (['css', 'scss', 'less'].includes(label)) {
            return new CssWorker()
        }
        if (['html', 'handlebars', 'razor'].includes(label)) {
            return new HtmlWorker()
        }
        if (['typescript', 'javascript'].includes(label)) {
            return new TypeScriptWorker()
        }
        return new EditorWorker()
    },
};

const app = createApp(appV1);

const pinia = createPinia();
pinia.use(piniaPersistedstate);

app.use(pinia);
app.use(router);

app.mount('#root');
