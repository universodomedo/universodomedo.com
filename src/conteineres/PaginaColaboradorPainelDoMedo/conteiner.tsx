'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaColaboradorPainelDoMedo__Props, Contexto__PaginaColaboradorPainelDoMedo__Provider, useContexto__PaginaColaboradorPainelDoMedo } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';
import SPA__PaginaColaboradorPainelDoMedo__ListagemObjetivos from 'Conteineres/PaginaColaboradorPainelDoMedo/paginas/SPA__PaginaColaboradorPainelDoMedo__ListagemObjetivos/SPA__PaginaColaboradorPainelDoMedo__ListagemObjetivos';
import SPA__PaginaColaboradorPainelDoMedo__CadastroObjetivo from 'Conteineres/PaginaColaboradorPainelDoMedo/paginas/SPA__PaginaColaboradorPainelDoMedo__CadastroObjetivo/SPA__PaginaColaboradorPainelDoMedo__CadastroObjetivo';
import SPA__PaginaColaboradorPainelDoMedo__Quadro from 'Conteineres/PaginaColaboradorPainelDoMedo/paginas/SPA__PaginaColaboradorPainelDoMedo__Quadro/SPA__PaginaColaboradorPainelDoMedo__Quadro';
import SPA__PaginaColaboradorPainelDoMedo__Fluxograma from 'Conteineres/PaginaColaboradorPainelDoMedo/paginas/SPA__PaginaColaboradorPainelDoMedo__Fluxograma/SPA__PaginaColaboradorPainelDoMedo__Fluxograma';

export function Conteiner__PaginaColaboradorPainelDoMedo() {
    return (
        <Contexto__PaginaColaboradorPainelDoMedo__Provider>
            <Conteiner__PaginaColaboradorPainelDoMedo__Interno />
        </Contexto__PaginaColaboradorPainelDoMedo__Provider>
    );
};

export const Conteiner__PaginaColaboradorPainelDoMedo__Interno = criaConteiner<PropsConteiner__PaginaColaboradorPainelDoMedo>({ useEstado, resolveSaida });

type PropsConteiner__PaginaColaboradorPainelDoMedo = Contexto__PaginaColaboradorPainelDoMedo__Props;

function resolveSaida(props: PropsConteiner__PaginaColaboradorPainelDoMedo): SaidaConteiner {
    if (props.pagina === 'cadastroObjetivo') return criaSaidaConteiner(SPA__PaginaColaboradorPainelDoMedo__CadastroObjetivo, {});
    if (props.pagina === 'quadro') return criaSaidaConteiner(SPA__PaginaColaboradorPainelDoMedo__Quadro, {});
    if (props.pagina === 'fluxograma') return criaSaidaConteiner(SPA__PaginaColaboradorPainelDoMedo__Fluxograma, {});
    return criaSaidaConteiner(SPA__PaginaColaboradorPainelDoMedo__ListagemObjetivos, {});
};

function useEstado(): PropsConteiner__PaginaColaboradorPainelDoMedo { return useContexto__PaginaColaboradorPainelDoMedo(); };
