import formStyles from './formulario.module.css';

import type { ContextoCapacidades } from './SPA__PaginaModeradorCapacidadesFuncionais';
import EditorParametrosFuncionais from './editorParametrosFuncionais';
import CabecalhoSecaoCapacidadeFuncional from './secaoCabecalho';
import ItensOperacaoCapacidadeFuncional from './secaoItensOperacao';

export default function OperacoesCapacidadeFuncional({ contexto }: { contexto: ContextoCapacidades; }) {
    const { formulario, opcoes, adicionaOperacao, atualizaOperacao, removeOperacao, adicionaParametroOperacao, atualizaParametroOperacaoTipo, atualizaParametroOperacaoNome, atualizaParametroOperacaoValor, removeParametroOperacao } = contexto;

    return (
        <section className={formStyles.secao}>
            <CabecalhoSecaoCapacidadeFuncional titulo="Operações funcionais" onAdicionar={adicionaOperacao} />
            <div className={formStyles.lista_linhas}>
                {formulario.estrutura.operacoesFuncionais.map((operacao, indice) => (
                    <div key={indice} className={formStyles.bloco_editor}>
                        <div className={formStyles.linha_editor}>
                            <input type="text" value={operacao.key} onChange={evento => atualizaOperacao(indice, 'key', evento.target.value)} placeholder="key_operacao" />
                            <input type="text" value={operacao.nome} onChange={evento => atualizaOperacao(indice, 'nome', evento.target.value)} placeholder="Nome" />
                            <input type="number" value={operacao.ordem ?? 0} onChange={evento => atualizaOperacao(indice, 'ordem', evento.target.value)} placeholder="Ordem" />
                            <button type="button" onClick={() => removeOperacao(indice)}>Remover</button>
                        </div>
                        <EditorParametrosFuncionais titulo="Parâmetros da operação" parametros={operacao.parametrosFuncionais} opcoes={opcoes} onAdicionar={() => adicionaParametroOperacao(indice)} onAtualizaTipo={(indiceParametro, tipo) => atualizaParametroOperacaoTipo(indice, indiceParametro, tipo)} onAtualizaNome={(indiceParametro, nome) => atualizaParametroOperacaoNome(indice, indiceParametro, nome)} onAtualizaValor={(indiceParametro, valor) => atualizaParametroOperacaoValor(indice, indiceParametro, valor)} onRemove={indiceParametro => removeParametroOperacao(indice, indiceParametro)} />
                        <ItensOperacaoCapacidadeFuncional contexto={contexto} operacao={operacao} indiceOperacao={indice} grupo="requisitosEstruturais" titulo="Requisitos da operação" />
                        <ItensOperacaoCapacidadeFuncional contexto={contexto} operacao={operacao} indiceOperacao={indice} grupo="condicoesFuncionais" titulo="Condições da operação" />
                        <ItensOperacaoCapacidadeFuncional contexto={contexto} operacao={operacao} indiceOperacao={indice} grupo="estadosBloqueiosPublicos" titulo="Bloqueios da operação" />
                    </div>
                ))}
            </div>
        </section>
    );
};
