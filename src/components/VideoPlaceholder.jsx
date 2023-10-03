import './placeholder-loading.min.css';
import styles from './styles.module.scss';

export default function VideoPlaceholder() {
    return (
        <div className={`ph-item ph-picture ${styles.videoPlaceholder}`} />
    )
}
