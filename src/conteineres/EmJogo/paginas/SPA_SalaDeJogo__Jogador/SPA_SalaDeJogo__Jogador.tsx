import styles from './styles.module.css';

import { useState } from 'react';
import { Eventos_EnviaERecebe } from 'types-nora-api';

import { useContextoSalaDeJogo__Jogador } from "Contextos/ContextoSalaDeJogo__Jogador/contexto";
import TelaDeJogo from "Componentes/ElementosDeJogo/TelaDeJogo/TelaDeJogo";
import JanelaDeMensagensDeJogo from 'Componentes/ElementosDeJogo/JanelaDeMensagensDeJogo/JanelaDeMensagensDeJogo';
import SwiperDireita from 'Componentes/ElementosVisuais/SwiperDireita/SwiperDireita';
import ConteudoFichaDeJogo from 'Componentes/ElementosDeJogo/ConteudoFichaDeJogo/ConteudoFichaDeJogo';
import { eventoWs } from 'Hooks/useEventoWs';
import { toast } from 'Hooks/useToast';

export default function SPA_SalaDeJogo__Jogador() {
    const { objetoEmJogo, J_fichaAtualizada, resultadoMissaoFuncional } = useContextoSalaDeJogo__Jogador();
    const [fechandoSala, setFechandoSala] = useState(false);
    const codigoSala = objetoEmJogo.objetoInicialSala.codigoSalaDeJogo;
    const missaoFuncional = objetoEmJogo.objetoInicialSala.missaoFuncional;

    function retornar(): void {
        if (fechandoSala) return;

        setFechandoSala(true);

        eventoWs(Eventos_EnviaERecebe.Jogo.eventos.requisicaoDeFechamentoDeSalaAberta, { codigoSalaDeJogo: codigoSala }, {
            onSuccess: () => { },
            onError: (err) => {
                setFechandoSala(false);
                toast.erro('Falha ao fechar Sala de Jogo', err.mensagem);
            },
        });
    };

    return (
        <div className={styles.recipiente_pagina_de_jogo}>
            {missaoFuncional && (
                <header className={styles.resumo_missao_funcional}>
                    <p>{missaoFuncional.nome}</p>
                    <span>{missaoFuncional.nomeCenario}</span>
                    <h1>{missaoFuncional.narracaoInicial}</h1>
                </header>
            )}
            <div className={styles.recipiente__pagina_de_jogo__superior}>
                <div className={styles.recipiente_container_tela_de_jogo__em_pagina_de_jogo}>
                    <TelaDeJogo codigoSala={codigoSala} />
                </div>
                <div className={styles.recipiente_container__janela_mensageens_de_jogo__em_pagina_de_jogo}>
                    <JanelaDeMensagensDeJogo codigoSala={codigoSala} />
                </div>
            </div>
            <SwiperDireita>
                <ConteudoFichaDeJogo JDadosFichaEmJogo={J_fichaAtualizada} desativarAcoes={resultadoMissaoFuncional !== null} exibirHabilidadesRuntime exibirAcoesRuntime exibirModificadoresRuntime codigoRecuperarFichaRuntime={`${codigoSala}_${objetoEmJogo.objetoInicialSala.idFicha}`} />
            </SwiperDireita>
            {resultadoMissaoFuncional && (
                <div className={styles.finalizacao_sala}>
                    <section className={styles.modal_finalizacao_sala}>
                        <p className={styles.etiqueta_finalizacao_sala}>{resultadoMissaoFuncional.nomeMissao}</p>
                        <h2>Vitória</h2>
                        <dl className={styles.detalhes_finalizacao_sala}>
                            <div>
                                <dt>Duração da Sala</dt>
                                <dd>{formataDuracaoSala(resultadoMissaoFuncional.duracaoSalaMs)}</dd>
                            </div>
                        </dl>
                        <button type="button" onClick={retornar} disabled={fechandoSala}>{fechandoSala ? 'Fechando...' : 'Retornar'}</button>
                    </section>
                </div>
            )}
        </div>
    );
};

function formataDuracaoSala(duracaoMs: number): string {
    const duracaoSegundos = Math.max(0, Math.floor(duracaoMs / 1000));
    const minutos = Math.floor(duracaoSegundos / 60);
    const segundos = duracaoSegundos % 60;

    if (minutos <= 0) return `${segundos}s`;
    return `${minutos}min ${segundos}s`;
};
