'use client';

import styles from './styles.module.css';

import { useState } from 'react';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import InputNumerico from 'Componentes/Elementos/Inputs/InputNumerico/InputNumerico';
import AlternaOpcao from 'Componentes/Elementos/Inputs/AlternaOpcao/AlternaOpcao';
import { Componente_Selecionador__Produto } from 'Componentes/Selecionadores/Componente_Selecionador__Produto/Componente_Selecionador__Produto';
import { Componente_Selecionador__Passe } from 'Componentes/Selecionadores/Componente_Selecionador__Passe/Componente_Selecionador__Passe';
import { useContexto__PaginaAdminCatalogoAssinatura__FormularioVinculo } from 'Contextos/Contexto__PaginaAdminCatalogoAssinatura__FormularioVinculo/contexto';

export default function SPA__PaginaAdminCatalogoAssinatura__FormularioVinculo() {
    const { form, ehEdicao, salvando, erro, podeSalvar, setCampo, salvar, ativo, definirAtivo, cancelar } = useContexto__PaginaAdminCatalogoAssinatura__FormularioVinculo();
    const [escolhendoProduto, setEscolhendoProduto] = useState<boolean>(false);
    const [escolhendoPasse, setEscolhendoPasse] = useState<boolean>(false);

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <div className={styles.grade}>
                    <InputComRotulo rotulo="Produto *" classname={styles.campo_largo}>
                        {ehEdicao ? (
                            <span className={styles.fixo}>{form.nomeProduto}</span>
                        ) : escolhendoProduto ? (
                            <div className={styles.caixa_selecionador}>
                                <Componente_Selecionador__Produto idInicial={form.fkProdutosId} aoConfirmar={(id, nome) => { setCampo('fkProdutosId', id); setCampo('nomeProduto', nome); setEscolhendoProduto(false); }} aoCancelar={() => setEscolhendoProduto(false)} />
                            </div>
                        ) : (
                            <div className={styles.escolha}>
                                <span>{form.fkProdutosId === null ? 'Nenhum produto selecionado' : form.nomeProduto}</span>
                                <button type="button" className={styles.botao_leve} onClick={() => setEscolhendoProduto(true)}>Escolher</button>
                            </div>
                        )}
                    </InputComRotulo>

                    <InputComRotulo rotulo="Passe *" classname={styles.campo_largo}>
                        {ehEdicao ? (
                            <span className={styles.fixo}>{form.nomePasse}</span>
                        ) : escolhendoPasse ? (
                            <div className={styles.caixa_selecionador}>
                                <Componente_Selecionador__Passe idInicial={form.fkPassesId} aoConfirmar={(id, nome) => { setCampo('fkPassesId', id); setCampo('nomePasse', nome); setEscolhendoPasse(false); }} aoCancelar={() => setEscolhendoPasse(false)} />
                            </div>
                        ) : (
                            <div className={styles.escolha}>
                                <span>{form.fkPassesId === null ? 'Nenhum passe selecionado' : form.nomePasse}</span>
                                <button type="button" className={styles.botao_leve} onClick={() => setEscolhendoPasse(true)}>Escolher</button>
                            </div>
                        )}
                    </InputComRotulo>

                    <InputComRotulo rotulo="Dias de validade *">
                        <InputNumerico value={form.diasDeValidade} onChange={valor => setCampo('diasDeValidade', valor)} min={1} max={365} />
                    </InputComRotulo>

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
                <button type="button" onClick={salvar} disabled={!podeSalvar}>{salvando ? 'Salvando...' : (ehEdicao ? 'Salvar' : 'Criar Vínculo')}</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
