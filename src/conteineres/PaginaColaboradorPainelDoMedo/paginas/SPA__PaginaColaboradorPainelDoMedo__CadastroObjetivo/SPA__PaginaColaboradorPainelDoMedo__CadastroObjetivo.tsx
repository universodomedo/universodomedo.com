'use client';

import { useState } from 'react';

import styles from './styles.module.css';

import { useContexto__PaginaColaboradorPainelDoMedo } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';

export default function SPA__PaginaColaboradorPainelDoMedo__CadastroObjetivo() {
    const { salvando, criaObjetivo, irParaListagem } = useContexto__PaginaColaboradorPainelDoMedo();

    const [nome, setNome] = useState('');

    const criar = async () => { if (!nome.trim()) return; await criaObjetivo(nome); irParaListagem(); };

    return (
        <section className={styles.cadastro}>
            <header className={styles.cabecalho}>
                <button className={styles.voltar} onClick={irParaListagem}>← Objetivos</button>
                <h2 className={styles.titulo}>Novo objetivo</h2>
            </header>

            <div className={styles.form}>
                <label className={styles.campo}>
                    <span>Nome do objetivo</span>
                    <input value={nome} autoFocus onChange={evento => setNome(evento.target.value)} onKeyDown={evento => { if (evento.key === 'Enter') criar(); }} placeholder="Ex.: Modelos 3D em Sala de Jogo" />
                </label>
                <div className={styles.acoes}>
                    <button className={styles.criar} onClick={criar} disabled={salvando || !nome.trim()}>{salvando ? 'Criando…' : 'Criar objetivo'}</button>
                    <button className={styles.cancelar} onClick={irParaListagem} disabled={salvando}>Cancelar</button>
                </div>
            </div>
        </section>
    );
};
