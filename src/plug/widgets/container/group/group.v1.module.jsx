import styles from './group.v1.module.css';

export default function Group({ title, children }) {
    return (
        <fieldset className={styles.root}>
            {title ? (
                <legend className={styles.title}>{title}</legend>
            ) : null}
            <div>{children}</div>
        </fieldset>
    );
}