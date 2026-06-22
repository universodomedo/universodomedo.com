'use client';

import styles from './styles.module.css';

import { useEffect, useState } from 'react';

export default function AlternaOpcao({ opcao, onChange, desabilitado = false }: { opcao: boolean; onChange: (valor: boolean) => void; desabilitado?: boolean; }) {
    const [ativo, setAtivo] = useState(opcao);

    useEffect(() => {
        setAtivo(opcao);
    }, [opcao]);

    const toggleOpcao = () => {
        if (desabilitado) return;

        const novoEstado = !ativo;
        setAtivo(novoEstado);
        onChange(novoEstado);
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.capsula} ${ativo ? styles.ativo : styles.inativo} ${desabilitado ? styles.desabilitado : ''}`} onClick={toggleOpcao} aria-disabled={desabilitado}>
                <div className={styles.slider}>
                    <div className={styles.indicador} />
                </div>
            </div>
        </div>
    );
};
