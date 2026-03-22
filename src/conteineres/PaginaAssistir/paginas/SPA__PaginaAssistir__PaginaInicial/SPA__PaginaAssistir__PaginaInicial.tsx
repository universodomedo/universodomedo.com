'use client';

import styles from './styles.module.css';

import { PAGINAS } from 'types-nora-api';

import { useContextoPaginaAssistir__PaginaInicial } from 'Contextos/ContextoPaginaAssistir__PaginaInicial/contexto';
import SecaoDeConteudo from "Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo"
import CustomLink from 'Componentes/Elementos/CustomLink/CustomLink';
import { QUERY_PARAMS } from 'Constantes/parametros_query';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

export default function SPA__PaginaAssistir__PaginaInicial() {
    const { detalhesUltimasSessoesPostadas } = useContextoPaginaAssistir__PaginaInicial();

    return (
        <SecaoDeConteudo className={styles.recipiente_ultimas_sessoes_postadas}>
            <h1>Ultimas Sessões Postadas</h1>

            <div className={styles.recipiente_cartas_ultimas_sessoes_postadas}>
                {detalhesUltimasSessoesPostadas?.map(detalheSessao => {
                    return detalheSessao.tipoSessao === 'AVENTURA'
                        ? (
                            // <CustomLink key={detalheSessao.idSessao} inlineBlock={false} className={styles.carta_sessao_recente} destino={{ pagina: PAGINAS.assistir, params: { id: detalheSessao.idGrupoAventura }, query: { [QUERY_PARAMS.EPISODIO]: detalheSessao.episodio } }}>
                            <CustomLink key={detalheSessao.idSessao} inlineBlock={false} className={styles.carta_sessao_recente} destino= {{ pagina: PAGINAS.assistir }}>
                                <div className={styles.recipiente_capa_carta_sessao_recente}>
                                    <RecipienteImagem src={detalheSessao.capaSessao} />
                                </div>

                                <div className={styles.recipiente_info_carta_sessao_recente}>
                                    <h2>{detalheSessao.tituloPrincipal}</h2>
                                    <h3>{detalheSessao.tituloDetalhado}</h3>
                                </div>
                            </CustomLink>
                        )
                        : (
                            <CustomLink key={detalheSessao.idSessao} inlineBlock={false} className={styles.carta_sessao_recente} destino={{ pagina: PAGINAS.assistir }}>
                                <div className={styles.recipiente_capa_carta_sessao_recente}>
                                    <RecipienteImagem src={detalheSessao.capaSessao} />
                                </div>

                                <div className={styles.recipiente_info_carta_sessao_recente}>
                                    <h2>{detalheSessao.titulo}</h2>
                                </div>
                            </CustomLink>
                        );
                })}
            </div>
        </SecaoDeConteudo>
    );
};