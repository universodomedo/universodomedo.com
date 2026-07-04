'use client';

import styles from './styles.module.css';

import { useState } from 'react';
import { TIPOS_SER } from 'types-nora-api';

import { useContexto__PaginaGameDesignerSeres__Cadastro } from 'Contextos/Contexto__PaginaGameDesignerSeres__Cadastro/contexto';
import { Componente_Selecionador__BaseSer } from 'Componentes/Selecionadores/Componente_Selecionador__BaseSer/Componente_Selecionador__BaseSer';

const OPCOES_TIPOS_SER = Object.values(TIPOS_SER).sort((a, b) => a.id - b.id);

export default function SPA__PaginaGameDesignerSeres__Cadastro() {
    const { formularioNovoSer, ehSerUnico, ehSerJogavel, serJogavel, setSerJogavel, idNivel, setIdNivel, ehSemClasse, setEhSemClasse, niveis, idBaseSerSelecionada, nomeBaseSerSelecionada, selecionaBaseSer, limpaBaseSer, podeSalvar, salvar } = useContexto__PaginaGameDesignerSeres__Cadastro();
    const [selecionandoBase, setSelecionandoBase] = useState(false);

    if (selecionandoBase) return (
        <Componente_Selecionador__BaseSer
            idInicial={idBaseSerSelecionada}
            aoConfirmar={(idBaseSer, nome) => { selecionaBaseSer(idBaseSer, nome); setSelecionandoBase(false); }}
            aoCancelar={() => setSelecionandoBase(false)}
        />
    );

    return (
        <section className={styles.recipiente_cadastro}>
            <div className={styles.painel_formulario}>
                <header className={styles.cabecalho_formulario}>
                    <h2>Novo Ser</h2>
                </header>

                <div className={styles.formulario}>
                    <label className={styles.campo}>
                        <span>Tipo Ser</span>
                        <select value={formularioNovoSer.valores.idTipoSer} onChange={evento => formularioNovoSer.setCampo('idTipoSer', evento.target.value)} disabled={formularioNovoSer.salvando}>
                            {OPCOES_TIPOS_SER.map(tipoSer => <option key={tipoSer.id} value={String(tipoSer.id)}>{tipoSer.nome}</option>)}
                        </select>
                        {formularioNovoSer.erro('idTipoSer') && <small className={styles.erro_campo}>{formularioNovoSer.erro('idTipoSer')}</small>}
                    </label>

                    <label className={styles.campo}>
                        <span>Nome</span>
                        <input type="text" {...formularioNovoSer.input('nome')} />
                        {formularioNovoSer.erro('nome') && <small className={styles.erro_campo}>{formularioNovoSer.erro('nome')}</small>}
                    </label>

                    {ehSerUnico && (
                        <label className={styles.campo}>
                            <span>Ser Jogável?</span>
                            <input type="checkbox" checked={serJogavel} onChange={evento => setSerJogavel(evento.target.checked)} disabled={formularioNovoSer.salvando} />
                        </label>
                    )}

                    {ehSerJogavel && (
                        <label className={styles.campo}>
                            <span>Nível</span>
                            <select value={idNivel === null ? '' : String(idNivel)} onChange={evento => setIdNivel(evento.target.value === '' ? null : Number(evento.target.value))} disabled={formularioNovoSer.salvando}>
                                <option value="">Selecione um nível</option>
                                {niveis.map(nivel => <option key={nivel.id} value={String(nivel.id)}>{nivel.nomeVisualizacao}</option>)}
                            </select>
                        </label>
                    )}

                    {ehSerJogavel && (
                        <label className={styles.campo}>
                            <span>Sem Classe? (criatura)</span>
                            <input type="checkbox" checked={ehSemClasse} onChange={evento => setEhSemClasse(evento.target.checked)} disabled={formularioNovoSer.salvando} />
                        </label>
                    )}

                    {ehSerJogavel && (
                        <label className={styles.campo}>
                            <span>Base de Ser (opcional — herda os membros)</span>
                            <div className={styles.linha_base}>
                                <span>{nomeBaseSerSelecionada ?? 'Nenhuma'}</span>
                                <button type="button" onClick={() => setSelecionandoBase(true)} disabled={formularioNovoSer.salvando}>Selecionar Base</button>
                                {idBaseSerSelecionada !== null && <button type="button" onClick={limpaBaseSer} disabled={formularioNovoSer.salvando}>Remover</button>}
                            </div>
                        </label>
                    )}
                </div>

                <footer className={styles.rodape_formulario}>
                    <button type="button" className={styles.botao_salvar} onClick={salvar} disabled={!podeSalvar}>{formularioNovoSer.salvando ? 'Salvando...' : 'Salvar Ser'}</button>
                </footer>
            </div>
        </section>
    );
};
