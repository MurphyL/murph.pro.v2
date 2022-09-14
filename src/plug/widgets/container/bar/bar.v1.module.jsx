
import styles from './bar.v1.module.css';

export default function Bar({ children }) {
    return (
        <div className={styles.root}>
            { children }
        </div>
    );
}