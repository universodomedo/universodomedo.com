import formStyles from './formulario.module.css';

import type { ContextoCapacidades } from './SPA__PaginaModeradorCapacidadesFuncionais';
import CabecalhoSecaoCapacidadeFuncional from './secaoCabecalho';

export function ParametrosAceitosCapacidadeFuncional({ contexto }: { contexto: ContextoCapacidades; }) {
    const { formulario, opcoes, adicionaParametroAceito, atualizaParametroAceitoTipo, atualizaParametroAceitoNome, alternaParametroAceitoObrigatorio, removeParametroAceito } = contexto;

    return (
        <section className={formStyles.secao}>
            <CabecalhoSecaoCapacidadeFuncional titulo="Parâmetros aceitos" onAdicionar={adicionaParametroAceito} desabilitado={!opcoes} />
            <div className={formStyles.lista_linhas}>
                {formulario.estrutura.parametrosAceitos.map((parametro, indice) => (
                    <div key={indice} className={formStyles.linha_editor}>
                        <SelectTipoParametro opcoes={opcoes} valor={parametro.tipo} onChange={tipo => atualizaParametroAceitoTipo(indice, tipo)} />
                        <input type="text" value={parametro.nome} onChange={evento => atualizaParametroAceitoNome(indice, evento.target.value)} placeholder="Nome público" />
                        <label className={formStyles.checkbox_linha}>
                            <input type="checkbox" checked={parametro.obrigatorio === true} onChange={() => alternaParametroAceitoObrigatorio(indice)} />
                            <span>Obrigatório</span>
                        </label>
                        <button type="button" onClick={() => removeParametroAceito(indice)}>Remover</button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export function ParametrosFuncionaisCapacidadeFuncional({ contexto }: { contexto: ContextoCapacidades; }) {
    const { formulario, opcoes, adicionaParametroFuncional, atualizaParametroFuncionalTipo, atualizaParametroFuncionalNome, atualizaParametroFuncionalValor, removeParametroFuncional } = contexto;

    return (
        <section className={formStyles.secao}>
            <CabecalhoSecaoCapacidadeFuncional titulo="Parâmetros funcionais próprios" onAdicionar={adicionaParametroFuncional} desabilitado={!opcoes} />
            <div className={formStyles.lista_linhas}>
                {formulario.estrutura.parametrosFuncionais.map((parametro, indice) => (
                    <div key={indice} className={formStyles.linha_editor}>
                        <SelectTipoParametro opcoes={opcoes} valor={parametro.tipo} onChange={tipo => atualizaParametroFuncionalTipo(indice, tipo)} />
                        <input type="text" value={parametro.nome ?? ''} onChange={evento => atualizaParametroFuncionalNome(indice, evento.target.value)} placeholder="Nome opcional" />
                        <input type="text" value={String(parametro.valor ?? '')} onChange={evento => atualizaParametroFuncionalValor(indice, evento.target.value)} placeholder="Valor" />
                        <button type="button" onClick={() => removeParametroFuncional(indice)}>Remover</button>
                    </div>
                ))}
            </div>
        </section>
    );
};

function SelectTipoParametro({ opcoes, valor, onChange }: { opcoes: ContextoCapacidades['opcoes']; valor: string; onChange: (valor: string) => void; }) {
    return (
        <select value={valor} onChange={evento => onChange(evento.target.value)} disabled={!opcoes}>
            {opcoes?.tiposParametrosFuncionais.map(opcao => <option key={opcao.key} value={opcao.key}>{opcao.nome}</option>)}
        </select>
    );
};
