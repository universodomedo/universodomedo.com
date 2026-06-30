'use client';

import styles from './styles.module.css';

import { type ReactNode, useState } from 'react';
import classNames from 'classnames';

import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import ListagemComposta, { ListagemCompostaModoExibicao, type ListagemCompostaIdRegistro, type ListagemCompostaListagem } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';

interface Props<TRegistro extends object> {
    listagem: ListagemCompostaListagem<TRegistro>;
    obterIdRegistro: (registro: TRegistro) => ListagemCompostaIdRegistro;
    renderizarItem: (registro: TRegistro, selecionado: boolean) => ReactNode;
    aoConfirmar: (registro: TRegistro) => void | Promise<void>;
    aoCancelar?: () => void;
    idInicial?: ListagemCompostaIdRegistro | null;
    modoExibicao?: ListagemCompostaModoExibicao;
    itensPorLinha?: number;
    textoConfirmar?: string;
};

// Componente REUTILIZÁVEL de seleção de UM registro de qualquer entidade: abre uma ListagemComposta, clicar num registro o seleciona (destaque), e o botão de confirmação dispara aoConfirmar(id).
// NÃO é modal — quem renderiza decide onde. A fonte de dados (REST ou GraphQL) é responsabilidade de quem monta `listagem` (ex.: useNoraGraphQLListagem ou REST embrulhado no formato ListagemCompostaListagem).
export function Componente_Selecionador<TRegistro extends object>({ listagem, obterIdRegistro, renderizarItem, aoConfirmar, aoCancelar, idInicial = null, modoExibicao = ListagemCompostaModoExibicao.GRADE, itensPorLinha = 3, textoConfirmar = 'Confirmar' }: Props<TRegistro>) {
    const [idSelecionado, setIdSelecionado] = useState<ListagemCompostaIdRegistro | null>(idInicial);
    const [confirmando, setConfirmando] = useState(false);

    async function confirmar(): Promise<void> {
        if (idSelecionado === null) return;
        const registro = listagem.registros.find(reg => obterIdRegistro(reg) === idSelecionado);
        if (!registro) return;
        setConfirmando(true);
        try { await aoConfirmar(registro); }
        finally { setConfirmando(false); }
    };

    function renderizaRegistro(registro: TRegistro): ReactNode {
        const id = obterIdRegistro(registro);
        const selecionado = id === idSelecionado;
        return <DivClicavel className={classNames(styles.item, { [styles.item_selecionado]: selecionado })} onClick={() => setIdSelecionado(id)}>{renderizarItem(registro, selecionado)}</DivClicavel>;
    };

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <div className={styles.listagem}>
                    {modoExibicao === ListagemCompostaModoExibicao.GRADE
                        ? <ListagemComposta listagem={listagem} modoExibicao={ListagemCompostaModoExibicao.GRADE} itensPorLinha={itensPorLinha} obterIdRegistro={obterIdRegistro} renderizarItem={renderizaRegistro} />
                        : <ListagemComposta listagem={listagem} modoExibicao={ListagemCompostaModoExibicao.LINHA} obterIdRegistro={obterIdRegistro} renderizarItem={renderizaRegistro} />}
                </div>
            </ConteudoForm.AreaCorpo>

            <ConteudoForm.AreaBotoes>
                {aoCancelar && <button type="button" data-variante="secundario" onClick={aoCancelar} disabled={confirmando}>Cancelar</button>}
                <button type="button" onClick={() => void confirmar()} disabled={idSelecionado === null || confirmando}>{confirmando ? 'Confirmando…' : textoConfirmar}</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
