import formStyles from './formulario.module.css';

import type { OpcoesCadastroCapacidadeFuncionalDto, ParametroFuncionalCapacidade } from 'types-nora-api';

export default function EditorParametrosFuncionais({ titulo, parametros, opcoes, onAdicionar, onAtualizaTipo, onAtualizaNome, onAtualizaValor, onRemove }: { titulo: string; parametros: readonly ParametroFuncionalCapacidade[]; opcoes: OpcoesCadastroCapacidadeFuncionalDto | null; onAdicionar: () => void; onAtualizaTipo: (indice: number, tipo: string) => void; onAtualizaNome: (indice: number, nome: string) => void; onAtualizaValor: (indice: number, valor: string) => void; onRemove: (indice: number) => void; }) {
    return (
        <div className={formStyles.subsecao}>
            <header className={formStyles.cabecalho_secao}>
                <h4>{titulo}</h4>
                <button type="button" onClick={onAdicionar} disabled={!opcoes}>Adicionar parâmetro</button>
            </header>
            <div className={formStyles.lista_linhas}>
                {parametros.map((parametro, indice) => (
                    <div key={indice} className={formStyles.linha_editor}>
                        <select value={parametro.tipo} onChange={evento => onAtualizaTipo(indice, evento.target.value)} disabled={!opcoes}>
                            {opcoes?.tiposParametrosFuncionais.map(opcao => <option key={opcao.key} value={opcao.key}>{opcao.nome}</option>)}
                        </select>
                        <input type="text" value={parametro.nome ?? ''} onChange={evento => onAtualizaNome(indice, evento.target.value)} placeholder="Nome opcional" />
                        <input type="text" value={String(parametro.valor ?? '')} onChange={evento => onAtualizaValor(indice, evento.target.value)} placeholder="Valor" />
                        <button type="button" onClick={() => onRemove(indice)}>Remover</button>
                    </div>
                ))}
            </div>
        </div>
    );
};
