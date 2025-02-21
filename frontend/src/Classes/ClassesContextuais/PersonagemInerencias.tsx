// #region Imports
import React, { createContext, useContext } from "react";

import { Habilidade, OpcoesSelecionadasExecucaoAcao } from "Classes/ClassesTipos/index.ts";
import { useClasseContextualPersonagemInventario } from "Classes/ClassesContextuais/PersonagemInventario.tsx";
import { useClasseContextualPersonagemEstatisticasBuffaveis } from "Classes/ClassesContextuais/PersonagemEstatisticasBuffaveis.tsx";
import { useClasseContextualPersonagemModificadores } from "Classes/ClassesContextuais/PersonagemModificadores.tsx";
import { useClasseContextualPersonagem } from "Classes/ClassesContextuais/Personagem.tsx";

import { PaginaDadosPreviosSacar, PaginaDadosDinamicosSacar } from 'Componentes/IconeAcaoExecutavel/BlocosTextoAcaoEspecifica/PaginaDadosSacar.tsx';
import { PaginaDadosDinamicosGuardar } from 'Componentes/IconeAcaoExecutavel/BlocosTextoAcaoEspecifica/PaginaDadosGuardar.tsx';
import { PaginaDadosDinamicosEquipar } from 'Componentes/IconeAcaoExecutavel/BlocosTextoAcaoEspecifica/PaginaDadosEquipar.tsx';
import { PaginaDadosDinamicosDesequipar } from 'Componentes/IconeAcaoExecutavel/BlocosTextoAcaoEspecifica/PaginaDadosDesequipar.tsx';
// #endregion

interface ClasseContextualPersonagemInerenciasProps {
    habilidadesInerentes: Habilidade[];
};

export const PersonagemInerencias = createContext<ClasseContextualPersonagemInerenciasProps | undefined>(undefined);

export const PersonagemInerenciasProvider = ({ children }: { children: React.ReactNode; }) => {
    const { equiparItem } = useClasseContextualPersonagem();
    const { inventario } = useClasseContextualPersonagemInventario();
    const { empunhaItem, desempunharItem } = useClasseContextualPersonagemEstatisticasBuffaveis();
    const { adicionarModificador } = useClasseContextualPersonagemModificadores();

    const habilidadesInerentes: Habilidade[] = [
        {
            nome: 'Sacar Item',
            svg: 'PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHg9IjM0MSIgeT0iMjkxIiBpZD0ic3ZnXzIiIHN0cm9rZS13aWR0aD0iMCIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5UZXN0ZSAxPC90ZXh0PgogIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwIiB4PSI1MyIgeT0iMTA5IiBpZD0ic3ZnXzMiIGZvbnQtc2l6ZT0iMTQwIiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPkE8L3RleHQ+CjwvZz4KPC9zdmc+',
            dadosAcoes: [
                {
                    nome: 'Sacar Item',
                    tipoAcaoEspecifica: 'Sacar Item',
                    dadosCarregadosPreviamente: <PaginaDadosPreviosSacar />,
                    dadosCarregadosNoChangeOption: function (opcoesSelecionadas: OpcoesSelecionadasExecucaoAcao) {
                        if (opcoesSelecionadas['itemParaSacar'] === undefined) return <></>;

                        const itemSelecionado = inventario.itens.find(item => item.codigoUnico === opcoesSelecionadas['itemParaSacar'])!;
                        return <PaginaDadosDinamicosSacar item={itemSelecionado} />;
                    },
                    validaExecucao: function (opcoesSelecionadas: OpcoesSelecionadasExecucaoAcao) {
                        if (opcoesSelecionadas['itemParaSacar'] === undefined) return false;

                        const itemSelecionado = inventario.itens.find(item => item.codigoUnico === opcoesSelecionadas['itemParaSacar'])!;
                        return (itemSelecionado.comportamentoEmpunhavel !== undefined && itemSelecionado.comportamentoEmpunhavel.extremidadeLivresSuficiente && itemSelecionado.comportamentoEmpunhavel.custoEmpunhar.podeSerPago);
                    },
                    executarAcaoEspecifica: function (opcoesSelecionadas: OpcoesSelecionadasExecucaoAcao) {
                        const itemSelecionado = inventario.itens.find(item => item.codigoUnico === opcoesSelecionadas['itemParaSacar'])!;
                        itemSelecionado.comportamentoEmpunhavel!.custoEmpunhar.aplicaCusto(opcoesSelecionadas);

                        empunhaItem(itemSelecionado);
                    },
                },
            ],
        },
        {
            nome: 'Guardar Item',
            svg: 'PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHg9IjM0MSIgeT0iMjkxIiBpZD0ic3ZnXzIiIHN0cm9rZS13aWR0aD0iMCIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5UZXN0ZSAxPC90ZXh0PgogIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwIiB4PSI1MyIgeT0iMTA5IiBpZD0ic3ZnXzMiIGZvbnQtc2l6ZT0iMTQwIiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPkE8L3RleHQ+CjwvZz4KPC9zdmc+',
            dadosAcoes: [
                {
                    nome: 'Guardar Item',
                    tipoAcaoEspecifica: 'Guardar Item',
                    dadosCarregadosPreviamente: <></>,
                    dadosCarregadosNoChangeOption: function (opcoesSelecionadas: OpcoesSelecionadasExecucaoAcao) {
                        if (opcoesSelecionadas['itemParaGuardar'] === undefined) return <></>;

                        const itemSelecionado = inventario.itens.find(item => item.codigoUnico === opcoesSelecionadas['itemParaGuardar'])!;
                        return <PaginaDadosDinamicosGuardar item={itemSelecionado} />;
                    },
                    validaExecucao: function (opcoesSelecionadas: OpcoesSelecionadasExecucaoAcao) {
                        if (opcoesSelecionadas['itemParaGuardar'] === undefined) return false;

                        const itemSelecionado = inventario.itens.find(item => item.codigoUnico === opcoesSelecionadas['itemParaGuardar'])!;
                        return (itemSelecionado.comportamentoEmpunhavel !== undefined && itemSelecionado.comportamentoEmpunhavel.custoEmpunhar.podeSerPago);
                    },
                    executarAcaoEspecifica: function (opcoesSelecionadas: OpcoesSelecionadasExecucaoAcao) {
                        const itemSelecionado = inventario.itens.find(item => item.codigoUnico === opcoesSelecionadas['itemParaGuardar'])!;
                        itemSelecionado.comportamentoEmpunhavel!.custoEmpunhar.aplicaCusto(opcoesSelecionadas);

                        desempunharItem(itemSelecionado);
                    },
                },
            ],
        },
        {
            nome: 'Equipar Item',
            svg: 'PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHg9IjM0MSIgeT0iMjkxIiBpZD0ic3ZnXzIiIHN0cm9rZS13aWR0aD0iMCIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5UZXN0ZSAxPC90ZXh0PgogIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwIiB4PSI1MyIgeT0iMTA5IiBpZD0ic3ZnXzMiIGZvbnQtc2l6ZT0iMTQwIiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPkE8L3RleHQ+CjwvZz4KPC9zdmc+',
            dadosAcoes: [
                {
                    nome: 'Equipar Item',
                    tipoAcaoEspecifica: 'Equipar Item',
                    dadosCarregadosPreviamente: <></>,
                    dadosCarregadosNoChangeOption: function (opcoesSelecionadas: OpcoesSelecionadasExecucaoAcao) {
                        if (opcoesSelecionadas['itemParaEquipar'] === undefined) return <></>;

                        const itemSelecionado = inventario.itens.find(item => item.codigoUnico === opcoesSelecionadas['itemParaEquipar'])!;
                        return <PaginaDadosDinamicosEquipar item={itemSelecionado} />;
                    },
                    validaExecucao: function (opcoesSelecionadas: OpcoesSelecionadasExecucaoAcao) {
                        if (opcoesSelecionadas['itemParaEquipar'] === undefined) return false;

                        const itemSelecionado = inventario.itens.find(item => item.codigoUnico === opcoesSelecionadas['itemParaEquipar'])!;
                        return (itemSelecionado.comportamentoEquipavel !== undefined && itemSelecionado.comportamentoEquipavel.custoEquipar.podeSerPago);
                    },
                    executarAcaoEspecifica: function (opcoesSelecionadas: OpcoesSelecionadasExecucaoAcao) {
                        const itemSelecionado = inventario.itens.find(item => item.codigoUnico === opcoesSelecionadas['itemParaEquipar'])!;
                        itemSelecionado.comportamentoEquipavel?.custoEquipar.aplicaCusto(opcoesSelecionadas);

                        equiparItem(itemSelecionado);

                        if (itemSelecionado.modificadores !== undefined) itemSelecionado.modificadores.filter(modificador => modificador.tipoModificador.tipo === 'Passivo' && modificador.tipoModificador.requisito === 'Equipar').forEach(modificador => adicionarModificador(modificador));

                        desempunharItem(itemSelecionado);
                    },
                },
            ],
        },
        {
            nome: 'Desequipar Item',
            svg: 'PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHg9IjM0MSIgeT0iMjkxIiBpZD0ic3ZnXzIiIHN0cm9rZS13aWR0aD0iMCIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5UZXN0ZSAxPC90ZXh0PgogIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwIiB4PSI1MyIgeT0iMTA5IiBpZD0ic3ZnXzMiIGZvbnQtc2l6ZT0iMTQwIiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPkE8L3RleHQ+CjwvZz4KPC9zdmc+',
            dadosAcoes: [
                {
                    nome: 'Desequipar Item',
                    tipoAcaoEspecifica: 'Desequipar Item',
                    dadosCarregadosPreviamente: <></>,
                    dadosCarregadosNoChangeOption: function (opcoesSelecionadas: OpcoesSelecionadasExecucaoAcao) {
                        if (opcoesSelecionadas['itemParaDesequipar'] === undefined) return <></>;

                        const itemSelecionado = inventario.itens.find(item => item.codigoUnico === opcoesSelecionadas['itemParaDesequipar'])!;
                        return <PaginaDadosDinamicosDesequipar item={itemSelecionado} />;
                    },
                    validaExecucao: function (opcoesSelecionadas: OpcoesSelecionadasExecucaoAcao) {
                        if (opcoesSelecionadas['itemParaDesequipar'] === undefined) return false;

                        const itemSelecionado = inventario.itens.find(item => item.codigoUnico === opcoesSelecionadas['itemParaDesequipar'])!;
                        return (itemSelecionado.comportamentoEquipavel !== undefined && itemSelecionado.comportamentoEmpunhavel !== undefined && itemSelecionado.comportamentoEmpunhavel.extremidadeLivresSuficiente && itemSelecionado.comportamentoEquipavel.custoEquipar.podeSerPago);
                    },
                    executarAcaoEspecifica: function (opcoesSelecionadas: OpcoesSelecionadasExecucaoAcao) {
                        const itemSelecionado = inventario.itens.find(item => item.codigoUnico === opcoesSelecionadas['itemParaDesequipar'])!;
                        itemSelecionado.comportamentoEquipavel?.custoEquipar.aplicaCusto(opcoesSelecionadas);

                        desempunharItem(itemSelecionado);
                    },
                },
            ],
        },
    ];

    return (
        <PersonagemInerencias.Provider value={{ habilidadesInerentes }}>
            {children}
        </PersonagemInerencias.Provider>
    );
}

export const useClasseContextualPersonagemInerencias = (): ClasseContextualPersonagemInerenciasProps => {
    const context = useContext(PersonagemInerencias);
    if (!context) throw new Error('useClasseContextualPersonagemInerencias precisa estar dentro de uma ClasseContextual de PersonagemInerencias');
    return context;
};