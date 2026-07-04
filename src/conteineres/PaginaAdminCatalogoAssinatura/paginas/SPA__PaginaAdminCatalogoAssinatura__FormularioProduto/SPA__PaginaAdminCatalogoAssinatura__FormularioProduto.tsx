'use client';

import styles from './styles.module.css';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import InputNumerico from 'Componentes/Elementos/Inputs/InputNumerico/InputNumerico';
import AlternaOpcao from 'Componentes/Elementos/Inputs/AlternaOpcao/AlternaOpcao';
import { useContexto__PaginaAdminCatalogoAssinatura__FormularioProduto } from 'Contextos/Contexto__PaginaAdminCatalogoAssinatura__FormularioProduto/contexto';

export default function SPA__PaginaAdminCatalogoAssinatura__FormularioProduto() {
    const { form, ehEdicao, salvando, erro, podeSalvar, setCampo, salvar, ativo, definirAtivo, cancelar } = useContexto__PaginaAdminCatalogoAssinatura__FormularioProduto();

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <div className={styles.grade}>
                    <InputComRotulo rotulo="Código interno *">
                        <input type="text" value={form.codigoInterno} onChange={e => setCampo('codigoInterno', e.target.value)} disabled={ehEdicao} placeholder="ex.: PASSE_JOGADOR_30D" />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Nome *">
                        <input type="text" value={form.nome} onChange={e => setCampo('nome', e.target.value)} />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Descrição" classname={styles.campo_largo}>
                        <input type="text" value={form.descricao} onChange={e => setCampo('descricao', e.target.value)} />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Contribuição (valor livre)">
                        <AlternaOpcao opcao={form.valorLivre} onChange={valor => setCampo('valorLivre', valor)} />
                    </InputComRotulo>
                    {!form.valorLivre && (
                        <InputComRotulo rotulo="Valor (centavos)">
                            <InputNumerico value={form.valorCentavos} onChange={valor => setCampo('valorCentavos', valor)} min={0} />
                        </InputComRotulo>
                    )}
                    {ehEdicao && (
                        <InputComRotulo rotulo="Ativo">
                            <AlternaOpcao opcao={ativo} onChange={definirAtivo} />
                        </InputComRotulo>
                    )}
                    {erro && <p className={styles.erro}>{erro}</p>}
                </div>
            </ConteudoForm.AreaCorpo>
            <ConteudoForm.AreaBotoes>
                <button type="button" data-variante="secundario" onClick={cancelar} disabled={salvando}>Cancelar</button>
                <button type="button" onClick={salvar} disabled={!podeSalvar}>{salvando ? 'Salvando...' : (ehEdicao ? 'Salvar' : 'Criar Produto')}</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
