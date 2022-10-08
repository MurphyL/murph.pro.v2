import { join } from "lodash";

const indent = (content) => {
    return `    ${content}`;
};

const createClass = (name, fields = []) => {
    const prepared = [];
    if (Array.isArray(fields) && fields.length > 0) {
        fields.forEach(field => {
            prepared.push(indent('/**'));
            field.comment && prepared.push(indent(` * ${field.comment}`));
            if (field.database) {
                const { column, length, defaultValue, notNull } = field.database;
                column && prepared.push(indent(` * database column: ${column}`));
                defaultValue && prepared.push(indent(` * database default: ${defaultValue}`));
                length && prepared.push(indent(` * database length: ${length}`));
                notNull && prepared.push(indent(' * database not allow null'));
            }
            prepared.push(indent(' */'));
            prepared.push(indent(`private ${field.dataType} ${field.name};\n`))
        });
    }
    return [
        `public class ${name} {\n`,
        ...prepared,
        '}'
    ];
};

export const createPojoClass = ({ comment, name, fields }) => {
    return join([`/** ${comment} **/`, ...createClass(name, fields)], '\n');
};

export const createMapperClass = () => {

};

export const createServiceClass = () => {

};


