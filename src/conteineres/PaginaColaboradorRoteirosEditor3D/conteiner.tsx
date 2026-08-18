'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaColaboradorRoteirosEditor3D__Props, Contexto__PaginaColaboradorRoteirosEditor3D__Provider, useContexto__PaginaColaboradorRoteirosEditor3D } from 'Contextos/Contexto__PaginaColaboradorRoteirosEditor3D/contexto';
import { Contexto__PaginaColaboradorRoteirosEditor3D__Listagem__Provider } from 'Contextos/Contexto__PaginaColaboradorRoteirosEditor3D__Listagem/contexto';
import { Contexto__PaginaColaboradorRoteirosEditor3D__Cadastro__Provider } from 'Contextos/Contexto__PaginaColaboradorRoteirosEditor3D__Cadastro/contexto';
import { Contexto__PaginaColaboradorRoteirosEditor3D__DetalheValidacao__Provider } from 'Contextos/Contexto__PaginaColaboradorRoteirosEditor3D__DetalheValidacao/contexto';

export function Conteiner__PaginaColaboradorRoteirosEditor3D() {
    return (
        <Contexto__PaginaColaboradorRoteirosEditor3D__Provider>
            <Conteiner__PaginaColaboradorRoteirosEditor3D__Interno />
        </Contexto__PaginaColaboradorRoteirosEditor3D__Provider>
    );
};

export const Conteiner__PaginaColaboradorRoteirosEditor3D__Interno = criaConteiner<PropsConteiner__PaginaColaboradorRoteirosEditor3D>({ useEstado, resolveSaida });

type PropsConteiner__PaginaColaboradorRoteirosEditor3D = Contexto__PaginaColaboradorRoteirosEditor3D__Props;

// Fluxo controlado aqui: detalhe de validação aberto → DetalheValidacao; cadastro ativo → Cadastro; senão → Listagem.
// A montagem dos passos NÃO mora nesta página (acontece no Painel Roteiro, dentro do Editor 3D).
function resolveSaida(props: PropsConteiner__PaginaColaboradorRoteirosEditor3D): SaidaConteiner {
    if (props.detalheValidacao !== null) return criaSaidaConteiner(Contexto__PaginaColaboradorRoteirosEditor3D__DetalheValidacao__Provider, { detalhe: props.detalheValidacao });
    if (props.estaEmCadastro) return criaSaidaConteiner(Contexto__PaginaColaboradorRoteirosEditor3D__Cadastro__Provider, { criarRoteiro: props.criarRoteiro });
    return criaSaidaConteiner(Contexto__PaginaColaboradorRoteirosEditor3D__Listagem__Provider, { listagemRoteiros: props.listagemRoteiros, estaEmCadastro: props.estaEmCadastro, iniciarCadastro: props.iniciarCadastro, removerRoteiro: props.removerRoteiro, resultadosValidacao: props.resultadosValidacao, resumoValidacao: props.resumoValidacao, validandoTodos: props.validandoTodos, validarTodos: props.validarTodos, abrirDetalheValidacao: props.abrirDetalheValidacao });
};

function useEstado(): PropsConteiner__PaginaColaboradorRoteirosEditor3D { return useContexto__PaginaColaboradorRoteirosEditor3D(); };