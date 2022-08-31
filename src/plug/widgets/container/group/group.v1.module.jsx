import styles from './group.v1.module.css';

export default function KitsSidebar({ title, children }) {
    return (
        <fieldset className={styles.root}>
            <legend className={styles.title}>{ title || '未命名分组' }</legend>
            <div>{children}</div>
        </fieldset>
    );
}