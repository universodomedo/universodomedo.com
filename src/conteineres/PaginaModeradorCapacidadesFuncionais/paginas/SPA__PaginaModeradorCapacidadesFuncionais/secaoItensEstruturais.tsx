import formStyles from './formulario.module.css';

import type { GrupoItemEstruturalCapacidade } from 'Contextos/Contexto__PaginaModeradorCapacidadesFuncionais/tipos';
import type { ContextoCapacidades } from './SPA__PaginaModeradorCapacidadesFuncionais';
import EditorParametrosFuncionais from './editorParametrosFuncionais';
import CabecalhoSecaoCapacidadeFuncional from './secaoCabecalho';

export default function ItensEstruturaisCapacidadeFuncional({ contexto, grupo, titulo }: { contexto: ContextoCapacidades; grupo: GrupoItemEstruturalCapacidade; titulo: string; }) {
    const { formulario, opcoes, adicionaItemEstrutural, atualizaItemEstrutural, removeItemEstrutural, adicionaParametroItemEstrutural, atualizaParametroItemEstruturalTipo, atualizaParametroItemEstruturalNome, atualizaParametroItemEstruturalValor, removeParametroItemEstrutural } = contexto;
    const itens = formulario.estrutura[grupo];

    return (
        <section className={formStyles.secao}>
            <CabecalhoSecaoCapacidadeFuncional titulo={titulo} onAdicionar={() => adicionaItemEstrutural(grupo)} />
            <div className={formStyles.lista_linhas}>
                {itens.map((item, indice) => (
                    <div key={indice} className={formStyles.bloco_editor}>
                        <div className={formStyles.linha_editor}>
                            <input type="text" value={item.key} onChange={evento => atualizaItemEstrutural(grupo, indice, 'key', evento.target.value)} placeholder="key" />
                            <input type="text" value={item.nome} onChange={evento => atualizaItemEstrutural(grupo, indice, 'nome', evento.target.value)} placeholder="Nome" />
                            <input type="text" value={item.descricao ?? ''} onChange={evento => atualizaItemEstrutural(grupo, indice, 'descricao', evento.target.value)} placeholder="Descrição pública" />
                            <button type="button" onClick={() => removeItemEstrutural(grupo, indice)}>Remover</button>
                        </div>
                        <EditorParametrosFuncionais titulo="Parâmetros do item" parametros={item.parametrosFuncionais} opcoes={opcoes} onAdicionar={() => adicionaParametroItemEstrutural(grupo, indice)} onAtualizaTipo={(indiceParametro, tipo) => atualizaParametroItemEstruturalTipo(grupo, indice, indiceParametro, tipo)} onAtualizaNome={(indiceParametro, nome) => atualizaParametroItemEstruturalNome(grupo, indice, indiceParametro, nome)} onAtualizaValor={(indiceParametro, valor) => atualizaParametroItemEstruturalValor(grupo, indice, indiceParametro, valor)} onRemove={indiceParametro => removeParametroItemEstrutural(grupo, indice, indiceParametro)} />
                    </div>
                ))}
            </div>
        </section>
    );
};
