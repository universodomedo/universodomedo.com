'use client';

import { createContext, useContext, useMemo } from 'react';

import { useContexto__PaginaColaboradorPainelDoMedo, Contexto__PaginaColaboradorPainelDoMedo__Props } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';
import SPA__PaginaColaboradorPainelDoMedo__PermissoesObjetivo from 'Conteineres/PaginaColaboradorPainelDoMedo/paginas/SPA__PaginaColaboradorPainelDoMedo__PermissoesObjetivo/SPA__PaginaColaboradorPainelDoMedo__PermissoesObjetivo';

type ObjetivoItem = Contexto__PaginaColaboradorPainelDoMedo__Props['objetivos']['registros'][number];

type PermitidoObjetivo = { permissaoId: number; usuarioId: number; username: string };

interface Contexto__PaginaColaboradorPainelDoMedo__PermissoesObjetivo__Props {
    objetivo: ObjetivoItem;
    permitidos: readonly PermitidoObjetivo[];
    idsExcluidos: readonly number[];
    salvando: boolean;
    conceder: (fkUsuariosId: number) => Promise<void>;
    revogar: (permissaoId: number) => Promise<void>;
    voltar: () => void;
};

const Contexto__PaginaColaboradorPainelDoMedo__PermissoesObjetivo = createContext<Contexto__PaginaColaboradorPainelDoMedo__PermissoesObjetivo__Props | undefined>(undefined);

export const useContexto__PaginaColaboradorPainelDoMedo__PermissoesObjetivo = (): Contexto__PaginaColaboradorPainelDoMedo__PermissoesObjetivo__Props => {
    const context = useContext(Contexto__PaginaColaboradorPainelDoMedo__PermissoesObjetivo);
    if (!context) throw new Error('useContexto__PaginaColaboradorPainelDoMedo__PermissoesObjetivo precisa estar dentro do seu Provider');
    return context;
};

// Operacao de foco unico: gerir quem (alem do criador) pode CRIAR CARTOES neste objetivo. So o criador chega aqui (botao gated) e o backend reforca.
export const Contexto__PaginaColaboradorPainelDoMedo__PermissoesObjetivo__Provider = () => {
    const { objetivos, operacaoObjetivo, salvando, permissoesObjetivos, concedePermissaoObjetivo, revogaPermissaoObjetivo, fecharOperacaoObjetivo } = useContexto__PaginaColaboradorPainelDoMedo();

    const objetivo = objetivos.registros.find(item => item.id === operacaoObjetivo?.objetivoId) ?? null;

    const permitidos = useMemo<PermitidoObjetivo[]>(() => {
        if (!objetivo) return [];
        return permissoesObjetivos.registros.filter(p => p.fkObjetivosId === objetivo.id).map(p => ({ permissaoId: p.id, usuarioId: p.fkUsuariosId, username: p.usuario.username }));
    }, [objetivo, permissoesObjetivos.registros]);

    if (!objetivo) return <p style={{ color: '#7c7565', padding: '1em' }}>Objetivo não encontrado. Use o fechar do cabeçalho para voltar.</p>;

    // Criador ja pode por natureza; permitidos existentes nao sao oferecidos de novo no dropdown.
    const idsExcluidos = [objetivo.fkUsuariosCriacaoId, ...permitidos.map(p => p.usuarioId)];
    const conceder = async (fkUsuariosId: number) => { await concedePermissaoObjetivo(objetivo.id, fkUsuariosId); };
    const revogar = async (permissaoId: number) => { await revogaPermissaoObjetivo(permissaoId); };

    return (
        <Contexto__PaginaColaboradorPainelDoMedo__PermissoesObjetivo.Provider value={{ objetivo, permitidos, idsExcluidos, salvando, conceder, revogar, voltar: fecharOperacaoObjetivo }}>
            <SPA__PaginaColaboradorPainelDoMedo__PermissoesObjetivo />
        </Contexto__PaginaColaboradorPainelDoMedo__PermissoesObjetivo.Provider>
    );
};
