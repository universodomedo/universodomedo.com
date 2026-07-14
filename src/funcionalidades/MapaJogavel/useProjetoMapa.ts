'use client';

import { useEffect, useState } from 'react';
import type { Projeto3DMinimoPersistido } from 'types-nora-api';

import { consultaProjetoMapa3D } from './mapaJogavel.api';

// Cache de módulo por id com REVALIDAÇÃO a cada montagem: o mesmo mapa é consumido por várias superfícies na mesma
// sessão (miniaturas, preview, seletor de posição, sala de jogo) — montagens simultâneas dividem UMA consulta (emVoo),
// mas toda montagem nova reconsulta o banco. Servir só o cache deixava edição feita no Editor 3D invisível até F5
// (bug real: cubo novo no mapa não aparecia no preview nem na Partida).
type EntradaCacheProjetoMapa = {
    resultado: Projeto3DMinimoPersistido | null;
    temResultado: boolean;
    emVoo: Promise<Projeto3DMinimoPersistido | null> | null;
};

const cachePorIdProjeto = new Map<number, EntradaCacheProjetoMapa>();

function entradaDoCache(idProjeto: number): EntradaCacheProjetoMapa {
    const existente = cachePorIdProjeto.get(idProjeto);
    if (existente) return existente;
    const nova: EntradaCacheProjetoMapa = { resultado: null, temResultado: false, emVoo: null };
    cachePorIdProjeto.set(idProjeto, nova);
    return nova;
};

function revalidaProjetoMapa(idProjeto: number): Promise<Projeto3DMinimoPersistido | null> {
    const entrada = entradaDoCache(idProjeto);
    if (entrada.emVoo) return entrada.emVoo;
    const consulta = consultaProjetoMapa3D(idProjeto)
        .then(projeto => {
            entrada.resultado = projeto;
            entrada.temResultado = true;
            entrada.emVoo = null;
            return projeto;
        })
        .catch(() => {
            // Falha de revalidação não descarta a última versão conhecida — melhor mapa de ontem que tela vazia.
            entrada.emVoo = null;
            return entrada.temResultado ? entrada.resultado : null;
        });
    entrada.emVoo = consulta;
    return consulta;
};

// Projeto 3D do mapa por id (null/ausente = sem mapa). Devolve também o carregando p/ a superfície decidir o placeholder;
// com cache aquecido a superfície mostra a última versão IMEDIATAMENTE e troca pela fresca quando a revalidação chega.
export function useProjetoMapa(idProjeto: number | null | undefined): { projetoMapa: Projeto3DMinimoPersistido | null; carregandoMapa: boolean } {
    const [projetoMapa, setProjetoMapa] = useState<Projeto3DMinimoPersistido | null>(null);
    const [carregandoMapa, setCarregandoMapa] = useState(idProjeto != null);

    useEffect(() => {
        if (idProjeto == null) { setProjetoMapa(null); setCarregandoMapa(false); return; }
        let ativo = true;
        const entrada = entradaDoCache(idProjeto);
        if (entrada.temResultado) { setProjetoMapa(entrada.resultado); setCarregandoMapa(false); }
        else setCarregandoMapa(true);
        void revalidaProjetoMapa(idProjeto).then(projeto => { if (ativo) { setProjetoMapa(projeto); setCarregandoMapa(false); } });
        return () => { ativo = false; };
    }, [idProjeto]);

    return { projetoMapa, carregandoMapa };
};
