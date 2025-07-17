'use client';

import styles from './styles.module.css';
import { useState } from 'react';

import { useContextoMestreAventuras } from 'Contextos/ContextoMestreAventuras/contexto';
import useScrollable from 'Componentes/ElementosVisuais/ElementoScrollable/useScrollable';
import Link from 'next/link';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import { GrupoAventuraDto } from 'types-nora-api';

export function AventurasMestre_Contexto() {
    const { aventurasFiltradas } = useContextoMestreAventuras();

    const { scrollableProps } = useScrollable({ modo: 'sempreVisivel' });

    return (
        <>
            <h1>Minhas Aventuras</h1>

            <OpcoesBuscaAventuras />

            <div id={styles.recipiente_aventuras_mestre} {...scrollableProps}>
                {aventurasFiltradas!.map(grupo => (
                    <Link key={grupo.id} className={styles.recipiente_item_imagem_aventura_mestre} href={`/mestre/aventura/${grupo.id}`}>
                        <div className={styles.recipiente_imagem_aventura_mestre}>
                            <RecipienteImagem src={grupo.aventura.imagemCapa?.fullPath} />
                        </div>
                        <h4>{grupo.nomeUnicoGrupoAventura}</h4>
                    </Link>
                ))}
            </div>
        </>
    );
};

function OpcoesBuscaAventuras() {
    const { atualizarBusca } = useContextoMestreAventuras();
    const [filtroNome, setFiltroNome] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    const [ordenacaoAtiva, setOrdenacaoAtiva] = useState<'asc' | 'desc' | null>(null);

    const comparadorDatas = (a: GrupoAventuraDto, b: GrupoAventuraDto, direcao: 'asc' | 'desc') => {
        const dataA = a.dataInicio || a.aventura.dataCriacao;
        const dataB = b.dataInicio || b.aventura.dataCriacao;
        const diff = new Date(dataA).getTime() - new Date(dataB).getTime();
        return direcao === 'asc' ? diff : -diff;
    };

    const toggleOrdenacao = () => {
        const novaDirecao = !ordenacaoAtiva ? 'asc' : ordenacaoAtiva === 'asc' ? 'desc' : null;
        setOrdenacaoAtiva(novaDirecao);

        atualizarBusca('ordenacao', novaDirecao ? 'adicionar' : 'remover', {
            comparador: novaDirecao ? (a, b) => comparadorDatas(a, b, novaDirecao) : undefined
        });
    };

    const handleFiltroNome = (termo: string) => {
        setFiltroNome(termo);
        atualizarBusca('filtro', termo ? 'adicionar' : 'remover', { predicado: (grupo) => grupo.nomeUnicoGrupoAventura.toLowerCase().includes(termo.toLowerCase()) });
    };

    const handleFiltroEstado = (estado: string) => {
        setFiltroEstado(estado);
        atualizarBusca('filtro', estado ? 'adicionar' : 'remover', { predicado: (grupo) => grupo.estadoAtual === estado });
    };

    return (
        <div id={styles.recipiente_opcoes_busca}>
            <button onClick={toggleOrdenacao}>Ordenar por Datas {ordenacaoAtiva === 'asc' ? '↑' : ordenacaoAtiva === 'desc' ? '↓' : ''}</button>

            <input value={filtroNome} onChange={(e) => handleFiltroNome(e.target.value)} placeholder="Filtrar por nome..." />

            <select value={filtroEstado} onChange={(e) => handleFiltroEstado(e.target.value)}>
                <option value="">Todos os estados</option>
                <option value="Em Preparo">Em Preparo</option>
                <option value="Em Andamento">Em Andamento</option>
                <option value="Finalizada">Finalizada</option>
            </select>
        </div>
    );
};