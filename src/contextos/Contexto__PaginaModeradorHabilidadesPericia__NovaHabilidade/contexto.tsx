'use client';

import { createContext, useContext, useState } from 'react';
import type { DTO__CREATE__HabilidadePericia } from 'types-nora-api';

import useFormularioCreate, { defineFormularioCreate, type FormularioCreateEstado } from 'Hooks/useFormularioCreate';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { criaHabilidadePericia } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { Contexto__PaginaModeradorHabilidadesPericia__Props } from '../Contexto__PaginaModeradorHabilidadesPericia/contexto';
import SPA__PaginaModeradorHabilidadesPericia__NovaHabilidade from 'Conteineres/PaginaModeradorHabilidadesPericia/paginas/SPA__PaginaModeradorHabilidadesPericia__NovaHabilidade/SPA__PaginaModeradorHabilidadesPericia__NovaHabilidade';

type FormularioNovaHabilidadePericia = Pick<DTO__CREATE__HabilidadePericia, 'nome' | 'descricao'>;

const FORMULARIO_CREATE_HABILIDADE_PERICIA = defineFormularioCreate<FormularioNovaHabilidadePericia>({
    valoresIniciais: { nome: '', descricao: '' },
    campos: {
        nome: { tipo: 'text', label: 'Nome', obrigatorio: true, maxLength: 120, placeholder: 'Ex: Identificar sinais de ritual' },
        descricao: { tipo: 'textarea', label: 'Descrição', obrigatorio: true, maxLength: 2000, placeholder: 'Descreva objetivamente o que esta habilidade possibilita.' },
    },
});

interface Contexto__PaginaModeradorHabilidadesPericia__NovaHabilidade__Props {
    pericias: Contexto__PaginaModeradorHabilidadesPericia__Props['pericias'];
    patentes: Contexto__PaginaModeradorHabilidadesPericia__Props['patentes'];
    idPericiaSelecionada: number | null;
    idPatentePericiaSelecionada: number | null;
    selecionaPericia: (idPericia: number | null) => void;
    selecionaPatentePericia: (idPatentePericia: number | null) => void;
    formularioNovaHabilidade: FormularioCreateEstado<FormularioNovaHabilidadePericia>;
    podeSalvar: boolean;
    salvar: () => Promise<void>;
};

type PropsProvider = {
    pericias: Contexto__PaginaModeradorHabilidadesPericia__NovaHabilidade__Props['pericias'];
    patentes: Contexto__PaginaModeradorHabilidadesPericia__NovaHabilidade__Props['patentes'];
    cancelaCriacao: Contexto__PaginaModeradorHabilidadesPericia__Props['cancelaCriacao'];
    concluiCriacao: Contexto__PaginaModeradorHabilidadesPericia__Props['concluiCriacao'];
};

const Contexto__PaginaModeradorHabilidadesPericia__NovaHabilidade = createContext<Contexto__PaginaModeradorHabilidadesPericia__NovaHabilidade__Props | undefined>(undefined);

export const useContexto__PaginaModeradorHabilidadesPericia__NovaHabilidade = (): Contexto__PaginaModeradorHabilidadesPericia__NovaHabilidade__Props => {
    const context = useContext(Contexto__PaginaModeradorHabilidadesPericia__NovaHabilidade);
    if (!context) throw new Error('useContexto__PaginaModeradorHabilidadesPericia__NovaHabilidade precisa estar dentro de um Contexto__PaginaModeradorHabilidadesPericia__NovaHabilidade');
    return context;
};

export const Contexto__PaginaModeradorHabilidadesPericia__NovaHabilidade__Provider = ({ pericias, patentes, cancelaCriacao, concluiCriacao }: PropsProvider) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Nova Habilidade de Perícia', fecharProps: { tipo: 'acao', executar: cancelaCriacao, tituloTooltip: 'Voltar para Listagem' } });

    const [idPericiaSelecionada, setIdPericiaSelecionada] = useState<number | null>(null);
    const [idPatentePericiaSelecionada, setIdPatentePericiaSelecionada] = useState<number | null>(null);
    const formularioNovaHabilidade = useFormularioNovaHabilidade(idPericiaSelecionada, idPatentePericiaSelecionada, concluiCriacao);
    const podeSalvar = idPericiaSelecionada !== null && idPatentePericiaSelecionada !== null && formularioNovaHabilidade.podeSalvar;

    async function salvar(): Promise<void> {
        if (!podeSalvar) return;

        await formularioNovaHabilidade.salvar();
    };

    return (
        <Contexto__PaginaModeradorHabilidadesPericia__NovaHabilidade.Provider value={{ pericias, patentes, idPericiaSelecionada, idPatentePericiaSelecionada, selecionaPericia: setIdPericiaSelecionada, selecionaPatentePericia: setIdPatentePericiaSelecionada, formularioNovaHabilidade, podeSalvar, salvar }}>
            <SPA__PaginaModeradorHabilidadesPericia__NovaHabilidade />
        </Contexto__PaginaModeradorHabilidadesPericia__NovaHabilidade.Provider>
    );
};

function useFormularioNovaHabilidade(idPericia: number | null, idPatentePericia: number | null, concluiCriacao: () => void): FormularioCreateEstado<FormularioNovaHabilidadePericia> {
    return useFormularioCreate(FORMULARIO_CREATE_HABILIDADE_PERICIA, async payload => {
        if (idPericia === null || idPatentePericia === null) return;

        const payloadCreate: DTO__CREATE__HabilidadePericia = { idPericia, idPatentePericia, nome: payload.nome, descricao: payload.descricao };
        await criaHabilidadePericia(payloadCreate);
        concluiCriacao();
    });
};