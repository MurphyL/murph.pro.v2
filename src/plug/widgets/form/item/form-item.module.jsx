import React from "react";

import clsx from "clsx";

import styles from './form-item.module.css';

const createFormInput = (type, id, className, name, extra) => {
    const props = { 
        id, 
        name, 
        onChange: extra.onChange, 
        className: clsx(styles.item, styles[type], className),
        [(extra.value && extra.onChange) ? 'value' : 'defaultValue']: extra.value 
    };
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