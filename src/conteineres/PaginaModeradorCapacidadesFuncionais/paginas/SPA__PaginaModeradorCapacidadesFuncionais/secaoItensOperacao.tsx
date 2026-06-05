import formStyles from './formulario.module.css';

import type { GrupoItemEstruturalOperacao } from 'Contextos/Contexto__PaginaModeradorCapacidadesFuncionais/tipos';
import type { OperacaoFuncionalCapacidade } from 'types-nora-api';
import type { ContextoCapacidades } from './SPA__PaginaModeradorCapacidadesFuncionais';
import EditorParametrosFuncionais from './editorParametrosFuncionais';
import CabecalhoSecaoCapacidadeFuncional from './secaoCabecalho';

export default function ItensOperacaoCapacidadeFuncional({ contexto, operacao, indiceOperacao, grupo, titulo }: { contexto: ContextoCapacidades; operacao: OperacaoFuncionalCapacidade; indiceOperacao: number; grupo: GrupoItemEstruturalOperacao; titulo: string; }) {
    const { opcoes, adicionaItemOperacao, atualizaItemOperacao, removeItemOperacao, adicionaParametroItemOperacao, atualizaParametroItemOperacaoTipo, atualizaParametroItemOperacaoNome, atualizaParametroItemOperacaoValor, removeParametroItemOperacao } = contexto;
    const itens = operacao[grupo];

    return (
        <div className={formStyles.subsecao}>
            <CabecalhoSecaoCapacidadeFuncional titulo={titulo} onAdicionar={() => adicionaItemOperacao(indiceOperacao, grupo)} />
            <div className={formStyles.lista_linhas}>
                {itens.map((item, indiceItem) => (
                    <div key={indiceItem} className={formStyles.bloco_editor}>
                        <div className={formStyles.linha_editor}>
                            <input type="text" value={item.key} onChange={evento => atualizaItemOperacao(indiceOperacao, grupo, indiceItem, 'key', evento.target.value)} placeholder="key" />
                            <input type="text" value={item.nome} onChange={evento => atualizaItemOperacao(indiceOperacao, grupo, indiceItem, 'nome', evento.target.value)} placeholder="Nome" />
                            <input type="text" value={item.descricao ?? ''} onChange={evento => atualizaItemOperacao(indiceOperacao, grupo, indiceItem, 'descricao', evento.target.value)} placeholder="Descrição pública" />
                            <button type="button" onClick={() => removeItemOperacao(indiceOperacao, grupo, indiceItem)}>Remover</button>
                        </div>
                        <EditorParametrosFuncionais titulo="Parâmetros do item" parametros={item.parametrosFuncionais} opcoes={opcoes} onAdicionar={() => adicionaParametroItemOperacao(indiceOperacao, grupo, indiceItem)} onAtualizaTipo={(indiceParametro, tipo) => atualizaParametroItemOperacaoTipo(indiceOperacao, grupo, indiceItem, indiceParametro, tipo)} onAtualizaNome={(indiceParametro, nome) => atualizaParametroItemOperacaoNome(indiceOperacao, grupo, indiceItem, indiceParametro, nome)} onAtualizaValor={(indiceParametro, valor) => atualizaParametroItemOperacaoValor(indiceOperacao, grupo, indiceItem, indiceParametro, valor)} onRemove={indiceParametro => removeParametroItemOperacao(indiceOperacao, grupo, indiceItem, indiceParametro)} />
                    </div>
                ))}
            </div>
        </div>
    );
};
