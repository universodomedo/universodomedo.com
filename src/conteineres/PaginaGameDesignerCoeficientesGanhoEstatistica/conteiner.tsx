'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Props, Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Provider, useContexto__PaginaGameDesignerCoeficientesGanhoEstatistica } from 'Contextos/Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica/contexto';
import { Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Listagem__Provider } from 'Contextos/Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Listagem/contexto';
import { Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Edicao__Provider } from 'Contextos/Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Edicao/contexto';
import { Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Cadastro__Provider } from 'Contextos/Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Cadastro/contexto';

export function Conteiner__PaginaGameDesignerCoeficientesGanhoEstatistica() {
    return (
        <Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Provider>
            <Conteiner__PaginaGameDesignerCoeficientesGanhoEstatistica__Interno />
        </Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Provider>
    );
};

const Conteiner__PaginaGameDesignerCoeficientesGanhoEstatistica__Interno = criaConteiner<Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Props>({ useEstado, resolveSaida });

function resolveSaida(props: Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Props): SaidaConteiner {
    if (props.emCadastro) return criaSaidaConteiner(Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Cadastro__Provider, { cancelaCadastro: props.cancelaCadastro, concluiCadastro: props.concluiCadastro, coeficientesExistentes: props.coeficientesExistentes });
    if (props.coeficienteSelecionado) return criaSaidaConteiner(Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Edicao__Provider, { coeficiente: props.coeficienteSelecionado, voltaParaListagem: props.voltaParaListagem, concluiEdicao: props.concluiEdicao });

    return criaSaidaConteiner(Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Listagem__Provider, { listagemCoeficientes: props.listagemCoeficientes, selecionaCoeficiente: props.selecionaCoeficiente, iniciaCadastro: props.iniciaCadastro });
};

function useEstado(): Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Props { return useContexto__PaginaGameDesignerCoeficientesGanhoEstatistica(); };
