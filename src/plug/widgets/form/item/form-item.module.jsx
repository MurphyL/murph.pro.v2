import React from "react"

import styles from './form-item.module.css';

const createFormInput = (type, id, name, extra) => {
    const valueKey = (extra.value && extra.onChange) ? 'value' : 'defaultValue';
    const props = { id, name, onChange: extra.onChange, [valueKey]: extra.value };
    switch (type) {
        case 'text':
        case 'number':
            return React.createElement('input', props);
        case 'select':
            const options = Object.entries(extra.options || {})
                .map(([key, value], index) => (
                    <option key={index} value={value}>{key}</option>
                ));
            return React.createElement('select', props, options)
    }

};

export default function FormItem({ name, type = 'text', label = '未命名字段', ...extra }) {
    const id = React.useId();
    const element = React.useMemo(() => {
        return createFormInput(type, id, name, extra);
    }, [type, id, name, extra]);
    return (
        <label className={styles.root} htmlFor={id}>
            <span className={styles.label}>{label}</span>
            {element}
        </label>
    )
}