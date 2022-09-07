import clsx from 'clsx';
import styles from './group.v1.module.css';

export default function Group({ className, title, children }) {
    return (
        <fieldset className={clsx(styles.root, className)}>
            {title ? (
                <legend className={styles.title}>{title}</legend>
            ) : null}
            <div className={styles.body}>{children}</div>
        </fieldset>
    );
}