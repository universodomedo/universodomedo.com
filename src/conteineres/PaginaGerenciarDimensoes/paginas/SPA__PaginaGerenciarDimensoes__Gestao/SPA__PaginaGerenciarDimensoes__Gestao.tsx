'use client';

import { useState, type FormEvent } from 'react';
import styles from './styles.module.css';

import { type Contexto__PaginaGerenciarDimensoes__Props } from 'Contextos/Contexto__PaginaGerenciarDimensoes/contexto';

export default function SPA__PaginaGerenciarDimensoes__Gestao({ dimensoes, carregando, erro, criar }: Contexto__PaginaGerenciarDimensoes__Props) {
    const [nome, setNome] = useState('');
    const [salvando, setSalvando] = useState(false);

    async function submeter(evento: FormEvent) {
        evento.preventDefault();
        const limpo = nome.trim();
        if (limpo.length === 0 || salvando) return;
        setSalvando(true);
        const ok = await criar(limpo);
        setSalvando(false);
        if (ok) setNome('');
    };

    return (
        <div className={styles.pagina}>
            <form className={styles.form} onSubmit={submeter}>
                <input className={styles.input} value={nome} onChange={evento => setNome(evento.target.value)} placeholder="Nova dimensão (ex.: Desespero, Letalidade, Gore)" />
                <button className={styles.botao} type="submit" disabled={salvando || nome.trim().length === 0}>Adicionar</button>
            </form>

            {erro ? <p className={styles.erro}>{erro}</p> : null}

            <ul className={styles.lista}>
                {dimensoes.map(dimensao => <li key={dimensao.id} className={styles.item}>{dimensao.nome}</li>)}
            </ul>

            {!carregando && dimensoes.length === 0 ? <p className={styles.vazio}>Nenhuma dimensão cadastrada ainda.</p> : null}
        </div>
    );
};
