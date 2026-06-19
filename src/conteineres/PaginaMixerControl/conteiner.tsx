'use client';

import { criaConteiner, criaSaidaConteiner, type SaidaConteiner } from 'Conteineres/_core/criaConteiner';
import { Contexto__PaginaMixerControl__Provider, type Contexto__PaginaMixerControl__Props, useContexto__PaginaMixerControl } from 'Contextos/Contexto__PaginaMixerControl/contexto';
import SPA__PaginaMixerControl__Painel from './paginas/SPA__PaginaMixerControl__Painel/SPA__PaginaMixerControl__Painel';

export function Conteiner__PaginaMixerControl() {
    return (
        <Contexto__PaginaMixerControl__Provider>
            <Conteiner__PaginaMixerControl__Interno />
        </Contexto__PaginaMixerControl__Provider>
    );
};

const Conteiner__PaginaMixerControl__Interno = criaConteiner<PropsConteiner__PaginaMixerControl>({ useEstado, resolveSaida });

type PropsConteiner__PaginaMixerControl = Contexto__PaginaMixerControl__Props;

function resolveSaida(props: PropsConteiner__PaginaMixerControl): SaidaConteiner { return criaSaidaConteiner(SPA__PaginaMixerControl__Painel, props); };

function useEstado(): PropsConteiner__PaginaMixerControl { return useContexto__PaginaMixerControl(); };