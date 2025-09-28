'use client';

import styles from './styles.module.css';

import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import { AventuraDto } from 'types-nora-api';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import { useContextoPaginaAventuras } from 'Contextos/ContextoPaginaAventuras/contexto';
import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';
import CustomLink from 'Componentes/Elementos/CustomLink/CustomLink';

import { QUERY_PARAMS } from 'Constantes/parametros_query';

export function ItemAventuraLista({ aventura }: { aventura: AventuraDto }) {
    const { buscaAventuraSelecionada, aventuraSelecionada } = useContextoPaginaAventuras();

    return (
        <DivClicavel className={styles.recipiente_item_menu_aventuras} classeParaDesabilitado={styles.ativo} desabilitado={aventura.id === aventuraSelecionada?.id} onClick={() => { buscaAventuraSelecionada(aventura.id); }}>
            <div className={styles.recipiente_imagem_aventura_item_menu}>
                <RecipienteImagem src={aventura.imagemCapa?.fullPath} />
            </div>
            <div className={styles.recipiente_dados_aventura}>
                <h3 className={styles.recipiente_dados_aventura_titulo}>{aventura.titulo}</h3>
                <h3 className={styles.recipiente_dados_aventura_estado}>{aventura.estadoAtual}</h3>
            </div>
        </DivClicavel>
    );
};

export function UltimasSessoesPostadas() {
    const { detalhesUltimasSessoesPostadas } = useContextoPaginaAventuras();

    return (
        <SecaoDeConteudo id={styles.recipiente_ultimas_sessoes_postadas}>
            <h1>Ultimas Sessões Postadas</h1>

            <div id={styles.recipiente_cartas_ultimas_sessoes_postadas}>
                {detalhesUltimasSessoesPostadas?.map(detalheSessao => (
                    <CustomLink key={detalheSessao.sessao.id} inlineBlock={false} className={styles.carta_sessao_recente} href={`/aventura/${detalheSessao.sessao.detalheSessaoAventura.grupoAventura.id}?${QUERY_PARAMS.EPISODIO}=${detalheSessao.sessao.detalheSessaoAventura.episodio}`}>
                        <div className={styles.recipiente_capa_carta_sessao_recente}>
                            <RecipienteImagem src={detalheSessao.sessao.detalheSessaoAventura.grupoAventura.aventura.imagemCapa?.fullPath} />
                        </div>
                        <div className={styles.recipiente_info_carta_sessao_recente}>
                            <h2>{detalheSessao.sessao.detalheSessaoAventura.grupoAventura.aventura.titulo}</h2>
                            <h3>{!detalheSessao.sessao.detalheSessaoAventura.grupoAventura.aventura.temApenasUmGrupo && `${detalheSessao.sessao.detalheSessaoAventura.grupoAventura.nome} - `}{detalheSessao.sessao.detalheSessaoAventura.episodioPorExtenso}</h3>
                        </div>
                    </CustomLink>
                ))}
            </div>
        </SecaoDeConteudo>
    );
};