import styles from './styles.module.css';

import { Eventos_EnviaERecebe } from 'types-nora-api';

import { useContextoSalaDeJogo__Narrador } from 'Contextos/ContextoSalaDeJogo__Narrador/contexto';
import { eventoWs } from 'Hooks/useEventoWs';
import { toast } from 'Hooks/useToast';
import TelaDeJogo from 'Componentes/ElementosDeJogo/TelaDeJogo/TelaDeJogo';
import JanelaDeMensagensDeJogo from 'Componentes/ElementosDeJogo/JanelaDeMensagensDeJogo/JanelaDeMensagensDeJogo';
import IconsRegionEmJogo from 'Componentes/ComponentesNarradorEmJogo/IconsRegionEmJogo/IconsRegionEmJogo';

export default function SPA_SalaDeJogo__Narrador() {
    const { objetoEmJogo } = useContextoSalaDeJogo__Narrador();

    const executaRequisicaoDeFechamentoDeSala = async () => {
        const confirmou = window.confirm('Deseja finalizar a sessao?');

        if (!confirmou) return;

        eventoWs(Eventos_EnviaERecebe.Jogo.eventos.requisicaoDeFechamentoDeSalaAberta, {}, {
            onSuccess: () => { toast.sucesso('Sala Fechada', 'Sala fechada com sucesso', { recarregaPagina: true }); },
            onError: (err) => { toast.erro('Falha ao fechar sala', err.mensagem); },
        });
    };

    return (
        <div className={styles.recipiente_pagina_de_jogo}>
            <div className={styles.recipiente__pagina_de_jogo__superior}>
                <div className={styles.recipiente_container_tela_de_jogo__em_pagina_de_jogo}>
                    <TelaDeJogo capaSessao={objetoEmJogo.objetoInicialSala.capaSessao} />
                </div>
                <div className={styles.recipiente_container__janela_mensageens_de_jogo__em_pagina_de_jogo}>
                    <JanelaDeMensagensDeJogo />
                </div>
            </div>
            <div className={styles.recipiente_regiao_icones_narrador}>
                <IconsRegionEmJogo />
            </div>
            {/* <button onClick={executaRequisicaoDeFechamentoDeSala}>Finalizar</button> */}
        </div>
    );
};