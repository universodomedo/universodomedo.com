'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaAdminConfiguracaoPatentesTestePericia__Props, Contexto__PaginaAdminConfiguracaoPatentesTestePericia__Provider, useContexto__PaginaAdminConfiguracaoPatentesTestePericia } from 'Contextos/Contexto__PaginaAdminConfiguracaoPatentesTestePericia/contexto';
import { Contexto__PaginaAdminConfiguracaoPatentesTestePericia__Edicao__Provider } from 'Contextos/Contexto__PaginaAdminConfiguracaoPatentesTestePericia__Edicao/contexto';

export function Conteiner__PaginaAdminConfiguracaoPatentesTestePericia() {
    return (
        <Contexto__PaginaAdminConfiguracaoPatentesTestePericia__Provider>
            <Conteiner__PaginaAdminConfiguracaoPatentesTestePericia__Interno />
        </Contexto__PaginaAdminConfiguracaoPatentesTestePericia__Provider>
    );
};

export const Conteiner__PaginaAdminConfiguracaoPatentesTestePericia__Interno = criaConteiner<PropsConteiner__PaginaAdminConfiguracaoPatentesTestePericia>({ useEstado, resolveSaida });

type PropsConteiner__PaginaAdminConfiguracaoPatentesTestePericia = Contexto__PaginaAdminConfiguracaoPatentesTestePericia__Props;

function resolveSaida(props: PropsConteiner__PaginaAdminConfiguracaoPatentesTestePericia): SaidaConteiner {
    return criaSaidaConteiner(Contexto__PaginaAdminConfiguracaoPatentesTestePericia__Edicao__Provider, { estado: props });
};

function useEstado(): PropsConteiner__PaginaAdminConfiguracaoPatentesTestePericia { return useContexto__PaginaAdminConfiguracaoPatentesTestePericia(); };