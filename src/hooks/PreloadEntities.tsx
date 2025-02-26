'use client';

import { useQuery } from '@tanstack/react-query';
import { CarregaInformacoesIniciais } from 'Servicos/CarregaInformacoesIniciais.ts';

export function PreloadEntities() {
    useQuery({
        queryKey: ['allEntities'],
        queryFn: CarregaInformacoesIniciais,
    });

    return null;
}