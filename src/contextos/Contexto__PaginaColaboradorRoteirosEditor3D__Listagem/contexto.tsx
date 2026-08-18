'use client';

import { createContext, useContext } from 'react';

import { Contexto__PaginaColaboradorRoteirosEditor3D__Props } from '../Contexto__PaginaColaboradorRoteirosEditor3D/contexto';
import SPA__PaginaColaboradorRoteirosEditor3D__Listagem from 'Conteineres/PaginaColaboradorRoteirosEditor3D/paginas/SPA__PaginaColaboradorRoteirosEditor3D__Listagem/SPA__PaginaColaboradorRoteirosEditor3D__Listagem';

type Contexto__PaginaColaboradorRoteirosEditor3D__Listagem__Props = Pick<Contexto__PaginaColaboradorRoteirosEditor3D__Props, 'listagemRoteiros' | 'estaEmCadastro' | 'iniciarCadastro' | 'removerRoteiro' | 'resultadosValidacao' | 'resumoValidacao' | 'validandoTodos' | 'validarTodos' | 'abrirDetalheValidacao'>;

const Contexto__PaginaColaboradorRoteirosEditor3D__Listagem = createContext<Contexto__PaginaColaboradorRoteirosEditor3D__Listagem__Props | undefined>(undefined);

export const useContexto__PaginaColaboradorRoteirosEditor3D__Listagem = (): Contexto__PaginaColaboradorRoteirosEditor3D__Listagem__Props => {
    const context = useContext(Contexto__PaginaColaboradorRoteirosEditor3D__Listagem);
    if (!context) throw new Error('useContexto__PaginaColaboradorRoteirosEditor3D__Listagem precisa estar dentro de um Contexto__PaginaColaboradorRoteirosEditor3D__Listagem');
    return context;
};

export const Contexto__PaginaColaboradorRoteirosEditor3D__Listagem__Provider = (props: Contexto__PaginaColaboradorRoteirosEditor3D__Listagem__Props) => {
    return (
        <Contexto__PaginaColaboradorRoteirosEditor3D__Listagem.Provider value={props}>
            <SPA__PaginaColaboradorRoteirosEditor3D__Listagem />
        </Contexto__PaginaColaboradorRoteirosEditor3D__Listagem.Provider>
    );
};