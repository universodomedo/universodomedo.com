'use client';

import { createContext, useContext } from 'react';
import { EventosApiRest, type PAYLOAD__SalvarMissaoExibicao } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';
import useFormularioCreate, { defineFormularioCreate, type FormularioCreateEstado } from 'Hooks/useFormularioCreate';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerMissoesExibicao__Props } from '../Contexto__PaginaGameDesignerMissoesExibicao/contexto';
import SPA__PaginaGameDesignerMissoesExibicao__Editor from 'Conteineres/PaginaGameDesignerMissoesExibicao/paginas/SPA__PaginaGameDesignerMissoesExibicao__Editor/SPA__PaginaGameDesignerMissoesExibicao__Editor';

type FormularioMissaoExibicao = {
    readonly fkCatalogosMissaoId: string;
    readonly ativo: boolean;
    readonly ordem: string;
};

type PropsProvider = {
    missaoSelecionada: Contexto__PaginaGameDesignerMissoesExibicao__Props['missaoSelecionada'];
    detalheSelecionado: Contexto__PaginaGameDesignerMissoesExibicao__Props['detalheSelecionado'];
    exibicaoSelecionada: Contexto__PaginaGameDesignerMissoesExibicao__Props['exibicaoSelecionada'];
    listagemCatalogosMissao: Contexto__PaginaGameDesignerMissoesExibicao__Props['listagemCatalogosMissao'];
    voltarParaListagem: Contexto__PaginaGameDesignerMissoesExibicao__Props['voltarParaListagem'];
    concluiSalvamento: Contexto__PaginaGameDesignerMissoesExibicao__Props['concluiSalvamento'];
};

interface Contexto__PaginaGameDesignerMissoesExibicao__Editor__Props {
    missaoSelecionada: NonNullable<PropsProvider['missaoSelecionada']>;
    detalheSelecionado: PropsProvider['detalheSelecionado'];
    listagemCatalogosMissao: PropsProvider['listagemCatalogosMissao'];
    formularioMissaoExibicao: FormularioCreateEstado<FormularioMissaoExibicao>;
    voltarParaListagem: () => void;
};

const Contexto__PaginaGameDesignerMissoesExibicao__Editor = createContext<Contexto__PaginaGameDesignerMissoesExibicao__Editor__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerMissoesExibicao__Editor = (): Contexto__PaginaGameDesignerMissoesExibicao__Editor__Props => {
    const context = useContext(Contexto__PaginaGameDesignerMissoesExibicao__Editor);
    if (!context) throw new Error('useContexto__PaginaGameDesignerMissoesExibicao__Editor precisa estar dentro de um Contexto__PaginaGameDesignerMissoesExibicao__Editor');
    return context;
};

export const Contexto__PaginaGameDesignerMissoesExibicao__Editor__Provider = ({ missaoSelecionada, detalheSelecionado, exibicaoSelecionada, listagemCatalogosMissao, voltarParaListagem, concluiSalvamento }: PropsProvider) => {
    if (!missaoSelecionada) throw new Error('Missão obrigatória para configurar exibição.');

    useConfigurarLayoutContextualizado({ subtitulo: `Exibição da Missão #${missaoSelecionada.id}`, fecharProps: { tipo: 'acao', executar: voltarParaListagem, tituloTooltip: 'Voltar para Listagem' } });

    const formularioMissaoExibicao = useFormularioMissaoExibicao(missaoSelecionada.id, exibicaoSelecionada, listagemCatalogosMissao, concluiSalvamento);

    return (
        <Contexto__PaginaGameDesignerMissoesExibicao__Editor.Provider value={{ missaoSelecionada, detalheSelecionado, listagemCatalogosMissao, formularioMissaoExibicao, voltarParaListagem }}>
            <SPA__PaginaGameDesignerMissoesExibicao__Editor />
        </Contexto__PaginaGameDesignerMissoesExibicao__Editor.Provider>
    );
};

function useFormularioMissaoExibicao(fkMissoesId: number, exibicaoSelecionada: PropsProvider['exibicaoSelecionada'], listagemCatalogosMissao: PropsProvider['listagemCatalogosMissao'], concluiSalvamento: () => void): FormularioCreateEstado<FormularioMissaoExibicao> {
    const primeiroCatalogo = listagemCatalogosMissao.registros[0];
    const definicao = defineFormularioCreate<FormularioMissaoExibicao>({
        valoresIniciais: { fkCatalogosMissaoId: String(exibicaoSelecionada?.fkCatalogosMissaoId ?? primeiroCatalogo?.id ?? ''), ativo: exibicaoSelecionada?.ativo ?? false, ordem: String(exibicaoSelecionada?.ordem ?? 0) },
        campos: {
            fkCatalogosMissaoId: { tipo: 'text', label: 'Catálogo de Missão', obrigatorio: true },
            ativo: { tipo: 'checkbox', label: 'Ativo' },
            ordem: { tipo: 'text', label: 'Ordem', obrigatorio: true, placeholder: 'Ex: 0' },
        },
    });

    return useFormularioCreate(definicao, async valores => {
        const payload: PAYLOAD__SalvarMissaoExibicao = { fkMissoesId, fkCatalogosMissaoId: parseInteiroPositivo(valores.fkCatalogosMissaoId, 'Catálogo de Missão'), ativo: valores.ativo, ordem: parseInteiroNaoNegativo(valores.ordem) };
        await NoraApi.RestPOST(EventosApiRest.POST.MissoesExibicao.salvar, payload, { mensagemErro: 'Não foi possível salvar a exibição da Missão.' });
        concluiSalvamento();
    });
};

function parseInteiroPositivo(valor: string, nomeCampo: string): number {
    const numero = Number(valor);
    if (!Number.isInteger(numero) || numero <= 0) throw new Error(`${nomeCampo} inválido.`);

    return numero;
};

function parseInteiroNaoNegativo(valor: string): number {
    const numero = Number(valor);
    if (!Number.isInteger(numero) || numero < 0) throw new Error('Ordem inválida.');

    return numero;
};
