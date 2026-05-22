import styles from './styles.module.css';

interface CampoStatusEditor3DProps {
    titulo: string;
    valor: string;
};

export function CampoStatusEditor3D({ titulo, valor }: CampoStatusEditor3DProps) {
    return (
        <div className={styles.status}>
            <span>{titulo}</span>
            <strong>{valor}</strong>
        </div>
    );
};