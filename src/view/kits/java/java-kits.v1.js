import { join } from "lodash";

const createClass = (name) => {
    return [
        `public class ${name} {}`
    ];
};

export const createPojoClass = ({ name }) => {
    return join(createClass(name), '\n');
};

export const createMapperClass = () => {

};

export const createServiceClass = () => {

};


