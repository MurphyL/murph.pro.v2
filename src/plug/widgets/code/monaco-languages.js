import { languages } from 'monaco-editor';

/***
 * 站内用于自定义高亮的语言
 */
const filters = [
    // "abap",
    // "aes",
    // "apex",
    // "azcli",
    "bat",
    // "bicep",
    "c",
    // "cameligo",
    // "clojure",
    "coffeescript",
    "cpp",
    "csharp",
    // "csp",
    "css",
    // "cypher",
    "dart",
    "dockerfile",
    // "ecl",
    // "elixir",
    // "flow9",
    // "freemarker2",
    // "freemarker2.tag-angle.interpolation-bracket",
    // "freemarker2.tag-angle.interpolation-dollar",
    // "freemarker2.tag-auto.interpolation-bracket",
    // "freemarker2.tag-auto.interpolation-dollar",
    // "freemarker2.tag-bracket.interpolation-bracket",
    // "freemarker2.tag-bracket.interpolation-dollar",
    // "fsharp",
    "go",
    // "graphql",
    // "handlebars",
    // "hcl",
    "html",
    "ini",
    "java",
    "javascript",
    "json",
    "julia",
    "kotlin",
    // "less",
    // "lexon",
    // "liquid",
    "lua",
    // "m3",
    "markdown",
    // "mips",
    // "msdax",
    "mysql",
    "objective-c",
    // "pascal",
    // "pascaligo",
    // "perl",
    "pgsql",
    // "php",
    // "pla",
    "plaintext",
    // "postiats",
    // "powerquery",
    "powershell",
    "proto",
    // "pug",
    "python",
    // "qsharp",
    "r",
    // "razor",
    "redis",
    // "redshift",
    // "restructuredtext",
    // "ruby",
    // "rust",
    // "sb",
    // "scala",
    // "scheme",
    "scss",
    "shell",
    // "sol",
    // "sparql",
    "sql",
    // "st",
    "swift",
    // "systemverilog",
    // "tcl",
    // "twig",
    "typescript",
    // "vb",
    // "verilog",
    "xml",
    "yaml"
];

export default languages.getLanguages().filter(item => filters.includes(item.id))