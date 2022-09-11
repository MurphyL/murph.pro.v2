import React from "react";

import styles from './x-icon.module.css';

export default React.memo(function SimpleIconWrap({ size = 24, ...si }) {
    return (
        <svg className={styles.root} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{'--si-size': `${size}px`}}>
            <title data-slug={si.slug}>{si.title}</title>
            <path d={si.path} />
        </svg>
    );
});