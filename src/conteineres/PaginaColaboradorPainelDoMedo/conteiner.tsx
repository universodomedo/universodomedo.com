'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaColaboradorPainelDoMedo__Props, Contexto__PaginaColaboradorPainelDoMedo__Provider, useContexto__PaginaColaboradorPainelDoMedo } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';
import SPA__PaginaColaboradorPainelDoMedo__Quadro from 'Conteineres/PaginaColaboradorPainelDoMedo/paginas/SPA__PaginaColaboradorPainelDoMedo__Quadro/SPA__PaginaColaboradorPainelDoMedo__Quadro';

export function Conteiner__PaginaColaboradorPainelDoMedo() {
    return (
        <Contexto__PaginaColaboradorPainelDoMedo__Provider>
            <Conteiner__PaginaColaboradorPainelDoMedo__Interno />
        </Contexto__PaginaColaboradorPainelDoMedo__Provider>
    );
};

export const Conteiner__PaginaColaboradorPainelDoMedo__Interno = criaConteiner<PropsConteiner__PaginaColaboradorPainelDoMedo>({ useEstado, resolveSaida });

type PropsConteiner__PaginaColaboradorPainelDoMedo = Contexto__PaginaColaboradorPainelDoMedo__Props;

function resolveSaida(): SaidaConteiner { return criaSaidaConteiner(SPA__PaginaColaboradorPainelDoMedo__Quadro, {}); };

function useEstado(): PropsConteiner__PaginaColaboradorPainelDoMedo { return useContexto__PaginaColaboradorPainelDoMedo(); };
