import styles from './styles.module.css';
import { useState, useEffect } from 'react';

export default function AlternaOpcao({ opcao, onChange }: { opcao: boolean; onChange: (valor: boolean) => void; }) {
    const [ativo, setAtivo] = useState(opcao);

    useEffect(() => {
        setAtivo(opcao);
    }, [opcao]);

    const toggleOpcao = () => {
        const novoEstado = !ativo;
        setAtivo(novoEstado);
        onChange(novoEstado);
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.capsula} ${ativo ? styles.ativo : styles.inativo}`} onClick={toggleOpcao}>
                <div className={styles.slider}>
                    <div className={styles.indicador} />
                </div>
            </div>
        </div>
    );
};