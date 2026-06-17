'use client';

import styles from './Cena3DSalaJogo.module.css';

import { useMemo } from 'react';

import { useContextoTelaDeJogoMapaLogico } from './ContextoTelaDeJogoMapaLogico';
import { criaDocumentoCena3DSalaJogo } from './Cena3DSalaJogo.helpers';
import { RuntimeCena3DPrototipoSalaDeJogo } from './RuntimeCena3DPrototipoSalaDeJogo';

export function Cena3DSalaJogo() {
    const { estadoCarregamento, erro, mapaLogicoSalaJogo, keysInteragiveisPercebidosNovos } = useContextoTelaDeJogoMapaLogico();
    const documento = useMemo(() => mapaLogicoSalaJogo === null ? null : criaDocumentoCena3DSalaJogo(mapaLogicoSalaJogo, keysInteragiveisPercebidosNovos), [keysInteragiveisPercebidosNovos, mapaLogicoSalaJogo]);

    if (estadoCarregamento === 'carregando') {
        return (
            <div className={styles.estado_cena_3d_sala_jogo}>
                <strong>Carregando cenário 3D da sala</strong>
                <span>Aguardando mapa lógico da Sala de Jogo.</span>
            </div>
        );
    }

    if (estadoCarregamento === 'erro' || documento === null) {
        return (
            <div className={styles.estado_cena_3d_sala_jogo}>
                <strong>Cenário 3D indisponível</strong>
                <span>{erro ?? 'Payload do mapa lógico ausente.'}</span>
            </div>
        );
    }

    return (
        <div className={styles.recipiente_cena_3d_sala_jogo}>
            <RuntimeCena3DPrototipoSalaDeJogo documento={documento} />
        </div>
    );
};
