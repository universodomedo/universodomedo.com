'use client';

import styles from './styles.module.css';

import { PAGINAS } from 'types-nora-api';

import { useContextoPaginaAssistir__AventuraSelecionada } from "Contextos/ContextoPaginaAssistir__AventuraSelecionada/contexto";
import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';
import PlayerYouTube from 'Componentes/Elementos/PlayerYouTube/PlayerYouTube';
import { RenderArquivoArteCapa, RenderArquivoAvatar } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';
import CustomLink from 'Componentes/Elementos/CustomLink/CustomLink';

export default function SPA__PaginaAssistir__AventuraSelecionada() {
    const { aventura } = useContextoPaginaAssistir__AventuraSelecionada();

    return (
        <SecaoDeConteudo className={styles.recipiente_conteudo_selecionado}>
            <div className={styles.recipiente_cabecalho_aventura_selecionada}>
                <h1>{aventura.titulo}</h1>
                <div className={styles.recipiente_capa_aventura_selecionada}>
                    {aventura.gruposAventura && aventura.gruposAventura.length > 0 && aventura.gruposAventura[0].linkTrailerYoutube
                        ? <PlayerYouTube urlSufixo={aventura.gruposAventura[0].linkTrailerYoutube.sufixo} />
                        : <RenderArquivoArteCapa caminhoArquivoArte={aventura.caminhoArquivoArteCapa} />
                    }
                </div>
            </div>
            <div className={styles.recipiente_grupos_aventura_selecionada}>
                {aventura.gruposAventura?.sort((a, b) => a.id - b.id).map(grupo => (
                    <div key={grupo.id} className={styles.recipiente_linha_grupo}>
                        <div className={styles.linha_grupo_esquerda}>
                            <div className={styles.recipiente_personagens_participantes}>
                                {grupo.personagensDaAventura?.map((personagensDaAventura, index) => (
                                    <div key={index} className={styles.recipiente_imagem_personagem_participante}>
                                        <RenderArquivoAvatar key={personagensDaAventura.personagem.id} caminhoArquivoAvatar={personagensDaAventura.personagem.avatarAtual} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.linha_grupo_direita}>
                            {/* <h1><CustomLink destino={{ pagina: PAGINAS.aventura, params: { id: grupo.id } }}>Assistir</CustomLink></h1> */}
                            <h1>Assistir</h1>
                            {!aventura.temApenasUmGrupo && (<h2>{grupo.nome}</h2>)}
                        </div>
                    </div>
                ))}
            </div>
        </SecaoDeConteudo>
    );
};