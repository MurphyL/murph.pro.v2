import { format as formatSQL } from 'sql-formatter';

const INDENT_SIZE = 4;

// language - https://github.com/sql-formatter-org/sql-formatter/blob/HEAD/docs/language.md
export const format = (source) => {
    return formatSQL(source, {
        language: 'sql',
        tabWidth: INDENT_SIZE,
        keywordCase: 'upper',
        linesBetweenQueries: 2,
        paramTypes: { named: [':'] },
    });
};