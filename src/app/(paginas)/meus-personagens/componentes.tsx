'use client';

import styles from './styles.module.css';

import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import { useContextoPaginaPersonagem } from './contexto.tsx';

import { EstadoPendenciaAdministrativaPersonagem, EstadoPendenciaPersonagem, PersonagemDto } from 'types-nora-api';
import Link from 'next/link';

export function PaginaMeusPersonagens_Slot() {
    const { personagemSelecionado } = useContextoPaginaPersonagem();

    return !personagemSelecionado ? <PaginaListaPersonagens /> : <PaginaPersonagemSelecionado />
};

function PaginaListaPersonagens() {
    const { listaPersonagens } = useContextoPaginaPersonagem();

    if (!listaPersonagens || listaPersonagens.length < 1) return <div>Erro ao carregar personagens</div>;

    return <PaginaPersonagensComDados />
};

function PaginaPersonagemSelecionado() {
    const { personagemSelecionado } = useContextoPaginaPersonagem();

    if (!personagemSelecionado) return <div>Erro ao carregar personagem</div>;

    return <PaginaPersonagemComDados />
};

function PaginaPersonagemComDados() {
    const { personagemSelecionado } = useContextoPaginaPersonagem();

    return (
        <>
            <h1>{personagemSelecionado?.informacao?.nome}</h1>
            {personagemSelecionado?.fichaVigente?.evolucaoPendente && (
                <Link href={'/evoluindo-personagem'}>Evoluir</Link>
            )}
        </>
    );
}

function PaginaPersonagensComDados() {
    return (
        <>
            <h1>Meus Personagens</h1>
            {/* <div className={styles.recipiente_avisos_convite_pendentes}>
                <h1>Você tem um convite pendente!</h1>
                <h1>O Mestre Vigiani te convidou para jogar <Link href={'/aventuras'} target='_blank'>Profunda Herança</Link></h1>
                <div className={styles.recipiente_botoes_aviso_convite_pendente}>
                    <button>Aceitar</button>
                    <button>Rejeitar</button>
                </div>
            </div> */}
            <ListaPersonagens />
        </>
    );
};

function ListaPersonagens() {
    const { listaPersonagens, buscaDadosGeraisPersonagem } = useContextoPaginaPersonagem();

    function selecionaPersonagem(idPersonagem: number) {
        buscaDadosGeraisPersonagem(idPersonagem);
    }

    if (listaPersonagens!.length < 1) return (
        <div>
            <h2>Nenhum Personagem foi encontrado</h2>
            <Link href={'/dicas/criando-um-novo-personagem'} target='_blank'><h2>Maiores informações sobre o Cadastro de Personagens</h2></Link>
        </div>
    );

    return (
        <div id={styles.recipiente_lista_personagens}>
            {listaPersonagens!.map(personagem => (
                <div key={personagem.id} className={styles.recipiente_personagem} onClick={() => selecionaPersonagem(personagem.id)}>
                    <div className={styles.recipiente_avatar_personagem}>
                        <RecipienteImagem src={personagem.imagemAvatar?.fullPath} />
                    </div>
                    <div className={styles.recipiente_informacoes1_personagem}>
                        <div className={styles.recipiente_informacoes_personagem}>
                            <h1>{personagem.informacao?.nome}</h1>
                            <DetalheFichaVigenteOuAvisoPendencia personagem={personagem}/>
                        </div>
                    </div>
                    {personagem.tempoProximaSessaoPersonagem !== undefined && (
                        <div className={styles.recipiente_informacoes2_personagem}>
                            <h2>Próxima Sessão em</h2>
                            <h2>3 horas</h2>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

function DetalheFichaVigenteOuAvisoPendencia({ personagem}: { personagem: PersonagemDto}) {
    if (personagem.pendencias.pendenciaAdmin === EstadoPendenciaAdministrativaPersonagem.SEM_CONFIGURACAO_FICHA) return (<p>Aguardando Configuração da Ficha pelo Administrador</p>);

    if (personagem.pendencias.pendeciaUsuario === EstadoPendenciaPersonagem.FICHA_NAO_CRIADA) return (<div className={styles.recipiente_pendencia}>Criação da Ficha Pendente</div>);

    if (personagem.pendencias.pendeciaUsuario === EstadoPendenciaPersonagem.FICHA_PENDENTE) return (<div className={styles.recipiente_pendencia}>Evolução Pendente</div>);

    return (<p>{`${personagem.fichaVigente?.detalhe.classe.nome} - ${personagem.fichaVigente?.nivel.nomeVisualizacao}`}</p>);
};