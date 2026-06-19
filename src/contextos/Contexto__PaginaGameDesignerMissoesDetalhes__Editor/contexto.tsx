'use client';

import { createContext, useContext } from 'react';
import { EventosApiRest, type PAYLOAD__SalvarMissaoDetalhe } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';
import useFormularioCreate, { defineFormularioCreate, type FormularioCreateEstado } from 'Hooks/useFormularioCreate';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerMissoesDetalhes__Props } from '../Contexto__PaginaGameDesignerMissoesDetalhes/contexto';
import SPA__PaginaGameDesignerMissoesDetalhes__Editor from 'Conteineres/PaginaGameDesignerMissoesDetalhes/paginas/SPA__PaginaGameDesignerMissoesDetalhes__Editor/SPA__PaginaGameDesignerMissoesDetalhes__Editor';

type FormularioMissaoDetalhe = {
    readonly nome: string;
    readonly descricao: string;
};

type PropsProvider = {
    missaoSelecionada: Contexto__PaginaGameDesignerMissoesDetalhes__Props['missaoSelecionada'];
    detalheSelecionado: Contexto__PaginaGameDesignerMissoesDetalhes__Props['detalheSelecionado'];
    voltarParaListagem: Contexto__PaginaGameDesignerMissoesDetalhes__Props['voltarParaListagem'];
    concluiSalvamento: Contexto__PaginaGameDesignerMissoesDetalhes__Props['concluiSalvamento'];
};

interface Contexto__PaginaGameDesignerMissoesDetalhes__Editor__Props {
    missaoSelecionada: NonNullable<PropsProvider['missaoSelecionada']>;
    formularioMissaoDetalhe: FormularioCreateEstado<FormularioMissaoDetalhe>;
    voltarParaListagem: () => void;
};

const Contexto__PaginaGameDesignerMissoesDetalhes__Editor = createContext<Contexto__PaginaGameDesignerMissoesDetalhes__Editor__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerMissoesDetalhes__Editor = (): Contexto__PaginaGameDesignerMissoesDetalhes__Editor__Props => {
    const context = useContext(Contexto__PaginaGameDesignerMissoesDetalhes__Editor);
    if (!context) throw new Error('useContexto__PaginaGameDesignerMissoesDetalhes__Editor precisa estar dentro de um Contexto__PaginaGameDesignerMissoesDetalhes__Editor');
    return context;
};

export const Contexto__PaginaGameDesignerMissoesDetalhes__Editor__Provider = ({ missaoSelecionada, detalheSelecionado, voltarParaListagem, concluiSalvamento }: PropsProvider) => {
    if (!missaoSelecionada) throw new Error('Missão obrigatória para configurar detalhe.');

    useConfigurarLayoutContextualizado({ subtitulo: `Detalhes da Missão #${missaoSelecionada.id}`, fecharProps: { tipo: 'acao', executar: voltarParaListagem, tituloTooltip: 'Voltar para Listagem' } });

    const formularioMissaoDetalhe = useFormularioMissaoDetalhe(missaoSelecionada.id, detalheSelecionado, concluiSalvamento);

    return (
        <Contexto__PaginaGameDesignerMissoesDetalhes__Editor.Provider value={{ missaoSelecionada, formularioMissaoDetalhe, voltarParaListagem }}>
            <SPA__PaginaGameDesignerMissoesDetalhes__Editor />
        </Contexto__PaginaGameDesignerMissoesDetalhes__Editor.Provider>
    );
};

function useFormularioMissaoDetalhe(fkMissoesId: number, detalheSelecionado: PropsProvider['detalheSelecionado'], concluiSalvamento: () => void): FormularioCreateEstado<FormularioMissaoDetalhe> {
    const definicao = defineFormularioCreate<FormularioMissaoDetalhe>({
        valoresIniciais: { nome: detalheSelecionado?.nome ?? '', descricao: detalheSelecionado?.descricao ?? '' },
        campos: {
            nome: { tipo: 'text', label: 'Nome', obrigatorio: true, maxLength: 255, placeholder: 'Ex: A Porta Entre Mundos' },
            descricao: { tipo: 'textarea', label: 'Descrição', obrigatorio: true, maxLength: 4000, placeholder: 'Descrição curta exibida antes de iniciar a missão.' },
        },
    });

    return useFormularioCreate(definicao, async valores => {
        const payload: PAYLOAD__SalvarMissaoDetalhe = { fkMissoesId, nome: valores.nome, descricao: valores.descricao };
        await NoraApi.RestPOST(EventosApiRest.POST.MissoesDetalhes.salvar, payload, { mensagemErro: 'Não foi possível salvar os detalhes da Missão.' });
        concluiSalvamento();
    });
};
