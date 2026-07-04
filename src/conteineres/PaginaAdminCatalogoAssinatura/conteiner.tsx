'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaAdminCatalogoAssinatura__Props, Contexto__PaginaAdminCatalogoAssinatura__Provider, useContexto__PaginaAdminCatalogoAssinatura } from 'Contextos/Contexto__PaginaAdminCatalogoAssinatura/contexto';
import { Contexto__PaginaAdminCatalogoAssinatura__Listagem__Provider } from 'Contextos/Contexto__PaginaAdminCatalogoAssinatura__Listagem/contexto';
import { Contexto__PaginaAdminCatalogoAssinatura__FormularioProduto__Provider } from 'Contextos/Contexto__PaginaAdminCatalogoAssinatura__FormularioProduto/contexto';
import { Contexto__PaginaAdminCatalogoAssinatura__FormularioPasse__Provider } from 'Contextos/Contexto__PaginaAdminCatalogoAssinatura__FormularioPasse/contexto';
import { Contexto__PaginaAdminCatalogoAssinatura__FormularioVinculo__Provider } from 'Contextos/Contexto__PaginaAdminCatalogoAssinatura__FormularioVinculo/contexto';

export function Conteiner__PaginaAdminCatalogoAssinatura() {
    return (
        <Contexto__PaginaAdminCatalogoAssinatura__Provider>
            <Conteiner__PaginaAdminCatalogoAssinatura__Interno />
        </Contexto__PaginaAdminCatalogoAssinatura__Provider>
    );
};

export const Conteiner__PaginaAdminCatalogoAssinatura__Interno = criaConteiner<PropsConteiner__PaginaAdminCatalogoAssinatura>({ useEstado, resolveSaida });

type PropsConteiner__PaginaAdminCatalogoAssinatura = Contexto__PaginaAdminCatalogoAssinatura__Props;

// Fluxo controlado aqui: um formulário de criação/edição ativo → o Formulário da entidade; senão → a Listagem (com abas por seção).
function resolveSaida(props: PropsConteiner__PaginaAdminCatalogoAssinatura): SaidaConteiner {
    if (props.estaEmCriacaoProduto || props.produtoEmEdicao !== null) return criaSaidaConteiner(Contexto__PaginaAdminCatalogoAssinatura__FormularioProduto__Provider, { produtoEmEdicao: props.produtoEmEdicao, salvarNovoProduto: props.salvarNovoProduto, salvarEdicaoProduto: props.salvarEdicaoProduto, definirAtivoProduto: props.definirAtivoProduto, cancelar: props.cancelarFormulario });
    if (props.estaEmCriacaoPasse || props.passeEmEdicao !== null) return criaSaidaConteiner(Contexto__PaginaAdminCatalogoAssinatura__FormularioPasse__Provider, { passeEmEdicao: props.passeEmEdicao, salvarNovoPasse: props.salvarNovoPasse, salvarEdicaoPasse: props.salvarEdicaoPasse, definirAtivoPasse: props.definirAtivoPasse, cancelar: props.cancelarFormulario });
    if (props.estaEmCriacaoVinculo || props.vinculoEmEdicao !== null) return criaSaidaConteiner(Contexto__PaginaAdminCatalogoAssinatura__FormularioVinculo__Provider, { vinculoEmEdicao: props.vinculoEmEdicao, salvarNovoVinculo: props.salvarNovoVinculo, salvarEdicaoVinculo: props.salvarEdicaoVinculo, definirAtivoVinculo: props.definirAtivoVinculo, cancelar: props.cancelarFormulario });
    return criaSaidaConteiner(Contexto__PaginaAdminCatalogoAssinatura__Listagem__Provider, props);
};

function useEstado(): PropsConteiner__PaginaAdminCatalogoAssinatura { return useContexto__PaginaAdminCatalogoAssinatura(); };
