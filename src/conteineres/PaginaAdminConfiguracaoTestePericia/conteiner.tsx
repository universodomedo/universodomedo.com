'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaAdminConfiguracaoTestePericia__Props, Contexto__PaginaAdminConfiguracaoTestePericia__Provider, useContexto__PaginaAdminConfiguracaoTestePericia } from 'Contextos/Contexto__PaginaAdminConfiguracaoTestePericia/contexto';
import { Contexto__PaginaAdminConfiguracaoTestePericia__Edicao__Provider } from 'Contextos/Contexto__PaginaAdminConfiguracaoTestePericia__Edicao/contexto';

export function Conteiner__PaginaAdminConfiguracaoTestePericia() {
    return (
        <Contexto__PaginaAdminConfiguracaoTestePericia__Provider>
            <Conteiner__PaginaAdminConfiguracaoTestePericia__Interno />
        </Contexto__PaginaAdminConfiguracaoTestePericia__Provider>
    );
};

export const Conteiner__PaginaAdminConfiguracaoTestePericia__Interno = criaConteiner<PropsConteiner__PaginaAdminConfiguracaoTestePericia>({ useEstado, resolveSaida });

type PropsConteiner__PaginaAdminConfiguracaoTestePericia = Contexto__PaginaAdminConfiguracaoTestePericia__Props;

function resolveSaida(props: PropsConteiner__PaginaAdminConfiguracaoTestePericia): SaidaConteiner {
    return criaSaidaConteiner(Contexto__PaginaAdminConfiguracaoTestePericia__Edicao__Provider, { estado: props });
};

function useEstado(): PropsConteiner__PaginaAdminConfiguracaoTestePericia { return useContexto__PaginaAdminConfiguracaoTestePericia(); };
