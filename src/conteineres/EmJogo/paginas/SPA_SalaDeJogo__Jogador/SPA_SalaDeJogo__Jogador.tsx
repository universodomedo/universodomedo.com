import styles from './styles.module.css';

import { useContextoSalaDeJogo__Jogador } from "Contextos/ContextoSalaDeJogo__Jogador/contexto";
import TelaDeJogo from "Componentes/ElementosDeJogo/TelaDeJogo/TelaDeJogo";
import SwiperDireita from 'Componentes/ElementosVisuais/SwiperDireita/SwiperDireita';
import ConteudoFichaDeJogo from 'Componentes/ElementosDeJogo/ConteudoFichaDeJogo/ConteudoFichaDeJogo';

export default function SPA_SalaDeJogo__Jogador() {
    const { objetoEmJogo, J_fichaAtualizada } = useContextoSalaDeJogo__Jogador();

    return (
        <>
            <div className={styles.recipiente_pagina_de_jogo}>
                <div className={styles.recipiente_container_tela_de_jogo__em_pagina_de_jogo}>
                    <TelaDeJogo capaSessao={objetoEmJogo.objetoInicialSala.capaSessao} />
                </div>
            </div>
            <SwiperDireita>
                <ConteudoFichaDeJogo JDadosFichaEmJogo={J_fichaAtualizada} desativarAcoes={false} />
            </SwiperDireita>
        </>
    );
};