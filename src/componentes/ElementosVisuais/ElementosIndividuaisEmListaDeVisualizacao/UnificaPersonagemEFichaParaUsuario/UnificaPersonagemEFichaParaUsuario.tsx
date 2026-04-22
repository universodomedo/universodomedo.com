'use client';

import styles from './styles.module.css';

import { CaminhoArquivoAvatar, ClasseDto, FichaTemporariaVisualizacaoDetalhadaDto, NivelDto, PAGINAS, PersonagemVisualizacaoDetalhadaDto } from 'types-nora-api';

import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';
import CustomLink from 'Componentes/Elementos/CustomLink/CustomLink';
import { RenderArquivoAvatar } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';
import { QUERY_PARAMS } from 'Constantes/parametros_query';
import { DestinoInput } from 'Funcionalidades/navegacaoInterna';

type EntradaListagem = { tipo: 'PERSONAGEM'; personagem: PersonagemVisualizacaoDetalhadaDto } | { tipo: 'FICHA_TEMPORARIA'; fichaTemporaria: FichaTemporariaVisualizacaoDetalhadaDto };

export default function ListagemPersonagensEFichasTemporariasUsuario__Unificada({ personagens, fichasTemporarias }: { personagens?: PersonagemVisualizacaoDetalhadaDto[], fichasTemporarias?: FichaTemporariaVisualizacaoDetalhadaDto[] }) {
    const entradas: EntradaListagem[] = [];
    (personagens ?? []).forEach(personagem => entradas.push({ tipo: 'PERSONAGEM', personagem }));
    (fichasTemporarias ?? []).forEach(fichaTemporaria => entradas.push({ tipo: 'FICHA_TEMPORARIA', fichaTemporaria }));

    return (
        <div id={styles.recipiente_lista_personagens}>
            {entradas.map(entrada => entrada.tipo === 'PERSONAGEM'
                ? <ListagemPersonagensEFichasTemporariasUsuario__ItemPersonagem key={`p-${entrada.personagem.id}`} personagem={entrada.personagem} />
                : <ListagemPersonagensEFichasTemporariasUsuario__ItemFichaTemporaria key={`ft-${entrada.fichaTemporaria.id}`} fichaTemporaria={entrada.fichaTemporaria} />)}
        </div>
    );
};

function ListagemPersonagensEFichasTemporariasUsuario__ItemPersonagem({ personagem }: { personagem: PersonagemVisualizacaoDetalhadaDto }) {
    return <ListagemPersonagensEFichasTemporariasUsuario__Molde
        destino={{ pagina: PAGINAS.personagens, query: { [QUERY_PARAMS.PERSONAGEM]: personagem.id } }}
        caminhoAvatar={personagem.avatarAtual}
        nome={personagem.nome}
        classe={personagem.classe}
        nivel={personagem.nivel}
    />;
};

function ListagemPersonagensEFichasTemporariasUsuario__ItemFichaTemporaria({ fichaTemporaria }: { fichaTemporaria: FichaTemporariaVisualizacaoDetalhadaDto }) {
    return (
        <ListagemPersonagensEFichasTemporariasUsuario__Molde
            destino={{ pagina: PAGINAS.fichas, query: { [QUERY_PARAMS.FICHA]: fichaTemporaria.id } }}
            nome={fichaTemporaria.nome}
            classe={fichaTemporaria.classe}
            nivel={fichaTemporaria.nivel}
        />
    );
};

function ListagemPersonagensEFichasTemporariasUsuario__Molde({ destino, caminhoAvatar, nome, classe, nivel }: { destino: DestinoInput; caminhoAvatar?: CaminhoArquivoAvatar; nome: string; classe: ClasseDto | null, nivel: NivelDto | null }) {
    return (
        <SecaoDeConteudo className={styles.secao_conteudo_recipiente_personagem}>
            <CustomLink className={styles.recipiente_personagem} semDecoracao inlineBlock={false} destino={destino}>
                <div className={styles.recipiente_avatar_personagem}>
                    {caminhoAvatar && <RenderArquivoAvatar caminhoArquivoAvatar={caminhoAvatar} />}
                </div>
                <div className={styles.recipiente_informacoes1_personagem}>
                    <div className={styles.recipiente_informacoes_personagem}>
                        <div className={styles.recipiente_nome_personagem}>
                            <h1>{nome}</h1>
                            {/* {pendeciaUsuario && pendeciaUsuario !== '' && (<div className={styles.recipiente_pendencia}>{pendeciaUsuario}</div>)} */}
                        </div>
                        {(classe || nivel) && (<div className={styles.recipiente_classe_e_nivel_personagem}><h2>{classe?.nome} - {nivel?.nomeVisualizacao}</h2></div>)}
                    </div>
                </div>
                {/* {tempoProximaSessaoPersonagem && (
                    <div className={styles.recipiente_informacoes2_personagem}>
                        <h2>{tempoProximaSessaoPersonagem}</h2>
                    </div>
                )} */}
            </CustomLink>
        </SecaoDeConteudo>
    );
};