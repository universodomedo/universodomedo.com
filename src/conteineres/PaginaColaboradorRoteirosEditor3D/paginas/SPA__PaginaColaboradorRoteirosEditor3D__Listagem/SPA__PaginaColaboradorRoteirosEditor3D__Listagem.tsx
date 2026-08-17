import styles from './styles.module.css';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import { useContexto__PaginaColaboradorRoteirosEditor3D__Listagem } from 'Contextos/Contexto__PaginaColaboradorRoteirosEditor3D__Listagem/contexto';
import type { EstadoValidacaoRoteiroEditor3D, RegistroRoteiroEditor3D } from 'Contextos/Contexto__PaginaColaboradorRoteirosEditor3D/contexto';

export default function SPA__PaginaColaboradorRoteirosEditor3D__Listagem() {
    const ctx = useContexto__PaginaColaboradorRoteirosEditor3D__Listagem();

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <div className={styles.recipiente}>
                    {ctx.resumoValidacao !== null && <p className={styles.resumo_validacao}>{ctx.resumoValidacao}</p>}
                    <ListagemComposta
                        listagem={ctx.listagemRoteiros}
                        modoExibicao={ListagemCompostaModoExibicao.GRADE}
                        itensPorLinha={4}
                        obterIdRegistro={roteiro => roteiro.id}
                        renderizarItem={roteiro => <CartaoRoteiro roteiro={roteiro} validacao={ctx.resultadosValidacao[roteiro.id]} aoAbrirDetalhe={idRoteiro => void ctx.abrirDetalheValidacao(idRoteiro)} />}
                        novoRegistro={{ estaEmProcessoCriacao: ctx.estaEmCadastro, aoIniciarCriacao: ctx.iniciarCadastro, textoBotao: 'Novo Roteiro' }}
                    />
                </div>
            </ConteudoForm.AreaCorpo>
            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={() => void ctx.validarTodos()} disabled={ctx.validandoTodos} title="Reexecuta cada roteiro aprovado e compara com o resultado aprovado">{ctx.validandoTodos ? 'Validando…' : 'Validar Todos'}</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};

// O estado do roteiro é DERIVADO: bloqueado (aguardando ferramenta) > aprovado (tem golden) > em montagem.
function estadoRoteiro(roteiro: RegistroRoteiroEditor3D): { rotulo: string; classe: string } {
    if (roteiro.bloqueadoMotivo !== null) return { rotulo: 'Bloqueado', classe: styles.selo_bloqueado };
    if (roteiro.aprovado) return { rotulo: 'Aprovado', classe: styles.selo_aprovado };
    return { rotulo: 'Em montagem', classe: styles.selo_montagem };
};

function seloValidacao(validacao: EstadoValidacaoRoteiroEditor3D): { rotulo: string; classe: string } {
    if (validacao === 'VALIDANDO') return { rotulo: 'validando…', classe: styles.selo_validando };
    if (validacao.desfecho === 'VALIDO') return { rotulo: '✓ válido', classe: styles.selo_valido };
    if (validacao.desfecho === 'DIVERGENTE') return { rotulo: `divergente · passo ${validacao.indicePasso + 1}`, classe: styles.selo_divergente };
    return { rotulo: `falhou · passo ${validacao.indicePasso + 1}`, classe: styles.selo_falhou };
};

// Qualquer roteiro COM passos abre o detalhe: aprovado mostra o desfecho da validação, em montagem mostra só o passo a
// passo — que é a resposta a "como se faz isso mesmo?". Roteiro sem passo nenhum não tem o que abrir.
function CartaoRoteiro({ roteiro, validacao, aoAbrirDetalhe }: { roteiro: RegistroRoteiroEditor3D; validacao: EstadoValidacaoRoteiroEditor3D | undefined; aoAbrirDetalhe: (idRoteiro: number) => void; }) {
    const estado = estadoRoteiro(roteiro);
    const seloResultado = validacao !== undefined ? seloValidacao(validacao) : null;

    const conteudo = (
        <>
            <strong className={styles.nome}>{roteiro.nome}</strong>
            <span className={styles.objetivo}>{roteiro.objetivo}</span>
            {/* O motivo do bloqueio é o backlog da ferramenta falando: fica legível no cartão, não escondido num title. */}
            {roteiro.bloqueadoMotivo !== null && <span className={styles.motivo_bloqueio}>{roteiro.bloqueadoMotivo}</span>}
            <div className={styles.detalhes}>
                <span className={`${styles.selo} ${estado.classe}`}>{estado.rotulo}</span>
                {seloResultado !== null && <span className={`${styles.selo} ${seloResultado.classe}`}>{seloResultado.rotulo}</span>}
                <span className={styles.passos}>{roteiro.quantidadePassos} {roteiro.quantidadePassos === 1 ? 'passo' : 'passos'}</span>
            </div>
        </>
    );

    if (roteiro.quantidadePassos === 0) return <div className={styles.cartao}>{conteudo}</div>;

    return <DivClicavel className={styles.cartao} onClick={() => aoAbrirDetalhe(roteiro.id)}>{conteudo}</DivClicavel>;
};