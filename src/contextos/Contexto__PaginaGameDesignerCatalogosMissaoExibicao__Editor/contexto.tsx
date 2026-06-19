'use client';

import { createContext, useContext } from 'react';
import { EventosApiRest, type PAYLOAD__SalvarCatalogoMissaoExibicao } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';
import useFormularioCreate, { defineFormularioCreate, type FormularioCreateEstado } from 'Hooks/useFormularioCreate';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Props } from '../Contexto__PaginaGameDesignerCatalogosMissaoExibicao/contexto';
import SPA__PaginaGameDesignerCatalogosMissaoExibicao__Editor from 'Conteineres/PaginaGameDesignerCatalogosMissaoExibicao/paginas/SPA__PaginaGameDesignerCatalogosMissaoExibicao__Editor/SPA__PaginaGameDesignerCatalogosMissaoExibicao__Editor';

type FormularioCatalogoMissaoExibicao = {
    readonly ativo: boolean;
    readonly ordem: string;
};

type PropsProvider = {
    catalogoSelecionado: Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Props['catalogoSelecionado'];
    exibicaoSelecionada: Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Props['exibicaoSelecionada'];
    voltarParaListagem: Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Props['voltarParaListagem'];
    concluiSalvamento: Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Props['concluiSalvamento'];
};

interface Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Editor__Props {
    catalogoSelecionado: NonNullable<PropsProvider['catalogoSelecionado']>;
    formularioCatalogoMissaoExibicao: FormularioCreateEstado<FormularioCatalogoMissaoExibicao>;
    voltarParaListagem: () => void;
};

const Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Editor = createContext<Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Editor__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerCatalogosMissaoExibicao__Editor = (): Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Editor__Props => {
    const context = useContext(Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Editor);
    if (!context) throw new Error('useContexto__PaginaGameDesignerCatalogosMissaoExibicao__Editor precisa estar dentro de um Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Editor');
    return context;
};

export const Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Editor__Provider = ({ catalogoSelecionado, exibicaoSelecionada, voltarParaListagem, concluiSalvamento }: PropsProvider) => {
    if (!catalogoSelecionado) throw new Error('Catálogo de Missão obrigatório para configurar exibição.');

    useConfigurarLayoutContextualizado({ subtitulo: `Exibição: ${catalogoSelecionado.nome}`, fecharProps: { tipo: 'acao', executar: voltarParaListagem, tituloTooltip: 'Voltar para Listagem' } });

    const formularioCatalogoMissaoExibicao = useFormularioCatalogoMissaoExibicao(catalogoSelecionado.id, exibicaoSelecionada, concluiSalvamento);

    return (
        <Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Editor.Provider value={{ catalogoSelecionado, formularioCatalogoMissaoExibicao, voltarParaListagem }}>
            <SPA__PaginaGameDesignerCatalogosMissaoExibicao__Editor />
        </Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Editor.Provider>
    );
};

function useFormularioCatalogoMissaoExibicao(fkCatalogosMissaoId: number, exibicaoSelecionada: PropsProvider['exibicaoSelecionada'], concluiSalvamento: () => void): FormularioCreateEstado<FormularioCatalogoMissaoExibicao> {
    const definicao = defineFormularioCreate<FormularioCatalogoMissaoExibicao>({
        valoresIniciais: { ativo: exibicaoSelecionada?.ativo ?? false, ordem: String(exibicaoSelecionada?.ordem ?? 0) },
        campos: {
            ativo: { tipo: 'checkbox', label: 'Ativo' },
            ordem: { tipo: 'text', label: 'Ordem', obrigatorio: true, placeholder: 'Ex: 0' },
        },
    });

    return useFormularioCreate(definicao, async valores => {
        const payload: PAYLOAD__SalvarCatalogoMissaoExibicao = { fkCatalogosMissaoId, ativo: valores.ativo, ordem: parseInteiroNaoNegativo(valores.ordem) };
        await NoraApi.RestPOST(EventosApiRest.POST.CatalogosMissaoExibicao.salvar, payload, { mensagemErro: 'Não foi possível salvar a exibição do Catálogo de Missão.' });
        concluiSalvamento();
    });
};

function parseInteiroNaoNegativo(valor: string): number {
    const numero = Number(valor);
    if (!Number.isInteger(numero) || numero < 0) throw new Error('Ordem inválida.');

    return numero;
};
