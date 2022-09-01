import React from "react"

import styles from './form-item.module.css';

const createFormInput = (type, id, name, extra) => {
    switch (type) {
        case 'text':
            return React.createElement('input', { id, name, type });
        case 'select':
            const options = Object.entries(extra.options || {})
                .map(([key, value], index) => (
                    <option key={index} value={value}>{key}</option>
                ));
            return React.createElement('select', { id, name }, options)
    }

};

export default function FormItem({ name, type = 'text', label = '未命名字段', ...extra }) {
    const id = React.useId();
    return (
        <label className={styles.root} htmlFor={id}>
            <span className={styles.label}>{label}</span>
            {createFormInput(type, id, name, extra)}
        </label>
    )
}