import styles from './styles.module.css'

export default function IconeFaixaEtaria() {
  return (
    <div className={styles.container}>
      <div className={styles.ageCircle}>
        <span className={styles.ageText}>+18</span>
      </div>
    </div>
  );
};