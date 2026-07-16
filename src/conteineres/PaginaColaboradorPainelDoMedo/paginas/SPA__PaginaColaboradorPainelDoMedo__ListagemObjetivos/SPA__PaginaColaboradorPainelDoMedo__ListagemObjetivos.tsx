'use client';

import styles from './styles.module.css';

import { CAPACIDADES } from 'types-nora-api';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { useContexto__PaginaColaboradorPainelDoMedo, Contexto__PaginaColaboradorPainelDoMedo__Props } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';

type RegistroObjetivo = Contexto__PaginaColaboradorPainelDoMedo__Props['objetivos']['registros'][number];

// Listagem de VISUALIZACAO: o item so apresenta e navega. Editar/excluir objetivo vivem na AreaBotoes do quadro do objetivo, em SPAs proprias.
export default function SPA__PaginaColaboradorPainelDoMedo__ListagemObjetivos() {
    const { objetivos, todosCards, irParaObjetivo, irParaCadastroObjetivo } = useContexto__PaginaColaboradorPainelDoMedo();
    const { verificarCapacidade } = useContextoAutenticacao();

    const contaCards = (objetivoId: number) => todosCards.registros.filter(card => card.fkObjetivosId === objetivoId).length;
    const podeCriarObjetivo = verificarCapacidade(CAPACIDADES.COLABORADOR__PAINEL_DO_MEDO__CRIA_OBJETIVO);

    return (
        <ListagemComposta
            listagem={objetivos}
            modoExibicao={ListagemCompostaModoExibicao.GRADE}
            itensPorLinha={4}
            obterIdRegistro={objetivo => objetivo.id}
            renderizarItem={objetivo => <RenderizaRegistroObjetivo objetivo={objetivo} contagemCards={contaCards(objetivo.id)} aoAbrir={() => irParaObjetivo(objetivo.id)} />}
            novoRegistro={podeCriarObjetivo ? { estaEmProcessoCriacao: false, aoIniciarCriacao: irParaCadastroObjetivo, textoBotao: 'Novo Objetivo' } : undefined}
        />
    );
};

function RenderizaRegistroObjetivo({ objetivo, contagemCards, aoAbrir }: { objetivo: RegistroObjetivo; contagemCards: number; aoAbrir: () => void }) {
    const trancado = objetivo.motivoTranca !== null;
    return (
        <article className={styles.cardObjetivo} onClick={aoAbrir}>
            {trancado && <span className={`${styles.seloTranca} ${objetivo.motivoTranca === 'CONCLUIDO' ? styles.seloTrancaConcluido : styles.seloTrancaInterrompido}`}>🔒 {objetivo.motivoTranca === 'CONCLUIDO' ? 'Concluído' : 'Interrompido'}</span>}
            <strong className={styles.objetivoNome}>{objetivo.nome}</strong>
            <div className={styles.objetivoRodape}>
                <span className={styles.objetivoContagem}>{contagemCards} cards</span>
            </div>
        </article>
    );
};
