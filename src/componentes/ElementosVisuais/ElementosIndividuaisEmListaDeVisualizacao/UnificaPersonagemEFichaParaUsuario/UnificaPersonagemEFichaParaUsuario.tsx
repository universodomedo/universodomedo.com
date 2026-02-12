'use client';

import styles from './styles.module.css';

import { ClasseDto, EstadoPendenciaPersonagem, FichaDto, FichaPersonagemDto, FichaTemporariaDto, NivelDto, PersonagemDto } from 'types-nora-api';
import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';
import CustomLink from 'Componentes/Elementos/CustomLink/CustomLink';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

import { QUERY_PARAMS } from 'Constantes/parametros_query';

type EntradaListagem = { tipo: 'PERSONAGEM'; personagem: PersonagemDto } | { tipo: 'FICHA_TEMPORARIA'; fichaTemporaria: FichaTemporariaDto };

export default function ListagemPersonagensEFichasTemporariasUsuario__Unificada({ personagens, fichasTemporarias }: { personagens?: PersonagemDto[], fichasTemporarias?: FichaTemporariaDto[] }) {
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

function ListagemPersonagensEFichasTemporariasUsuario__ItemPersonagem({ personagem }: { personagem: PersonagemDto }) {
    return <ListagemPersonagensEFichasTemporariasUsuario__Molde
        linkInterno={`/personagens?${QUERY_PARAMS.PERSONAGEM}=${personagem.id}`}
        caminhoAvatar={personagem.caminhoAvatar}
        nome={personagem.informacao?.nome}
        pendeciaUsuario={personagem.pendencias.pendeciaUsuario}
        classe={personagem.fichaVigente?.ficha.fichaDeJogo?.classe}
        nivel={personagem.fichaVigente?.nivel}
        tempoProximaSessaoPersonagem={personagem.tempoProximaSessaoPersonagem}
    />;
};

function ListagemPersonagensEFichasTemporariasUsuario__ItemFichaTemporaria({ fichaTemporaria }: { fichaTemporaria: FichaTemporariaDto }) {
    return (
        <ListagemPersonagensEFichasTemporariasUsuario__Molde
            linkInterno={`/teste`}
            nome={fichaTemporaria.nome}
            classe={fichaTemporaria.ficha.fichaDeJogo?.classe}
            nivel={fichaTemporaria.nivel}
        />
    );
};

function ListagemPersonagensEFichasTemporariasUsuario__Molde({ linkInterno, caminhoAvatar, nome, pendeciaUsuario, classe, nivel, tempoProximaSessaoPersonagem }: { linkInterno: string; caminhoAvatar?: string; nome: string; pendeciaUsuario?: EstadoPendenciaPersonagem | string; classe?: ClasseDto, nivel?: NivelDto, tempoProximaSessaoPersonagem?: string }) {
    return (
        <SecaoDeConteudo className={styles.secao_conteudo_recipiente_personagem}>
            <CustomLink className={styles.recipiente_personagem} semDecoracao inlineBlock={false} href={linkInterno}>
                <div className={styles.recipiente_avatar_personagem}>
                    {caminhoAvatar && <RecipienteImagem src={caminhoAvatar} />}
                </div>
                <div className={styles.recipiente_informacoes1_personagem}>
                    <div className={styles.recipiente_informacoes_personagem}>
                        <div className={styles.recipiente_nome_personagem}>
                            <h1>{nome}</h1>
                            {pendeciaUsuario && pendeciaUsuario !== '' && (<div className={styles.recipiente_pendencia}>{pendeciaUsuario}</div>)}
                        </div>
                        {(classe || nivel) && (<div className={styles.recipiente_classe_e_nivel_personagem}><h2>{classe?.nome} - {nivel?.nomeVisualizacao}</h2></div>)}
                    </div>
                </div>
                {tempoProximaSessaoPersonagem && (
                    <div className={styles.recipiente_informacoes2_personagem}>
                        <h2>{tempoProximaSessaoPersonagem}</h2>
                    </div>
                )}
            </CustomLink>
        </SecaoDeConteudo>
    );
};