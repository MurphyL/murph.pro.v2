import React from "react";

import clsx from "clsx";

import styles from './form-item.module.css';

const createFormInput = (type, id, className, name, extra) => {
    const valueKey = (extra.value && extra.onChange) ? 'value' : 'defaultValue';
    const props = { id, name, onChange: extra.onChange, [valueKey]: extra.value };
    switch (type) {
        case 'text':
        case 'number':
            props.className = clsx(styles[type], className);
            return React.createElement('input', props);
        case 'select':
            props.className = clsx(styles.select, className);
            const options = Object.entries(extra.options || {})
                .map(([key, value], index) => (
                    <option key={index} value={value}>{key}</option>
                ));
            return React.createElement('select', props, options)
    }

};

export default function FormItem({ className, name, type = 'text', label = '未命名字段', ...extra }) {
    const id = React.useId();
    const element = React.useMemo(() => {
        return createFormInput(type, id, className, name, extra);
    }, [id, className, type, name, extra]);
    return (
        <label className={styles.root} htmlFor={id}>
            <span className={styles.label}>{label}</span>
            {element}
        </label>
    )
}