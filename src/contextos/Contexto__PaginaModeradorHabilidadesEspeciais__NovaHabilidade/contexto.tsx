'use client';

import { createContext, useContext } from 'react';
import type { DTO__CREATE__HabilidadeEspecial, PropriedadesHabilidadeEspecial } from 'types-nora-api';

import useFormularioCreate, { defineFormularioCreate, type FormularioCreateEstado } from 'Hooks/useFormularioCreate';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { criaHabilidadeEspecial } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { Contexto__PaginaModeradorHabilidadesEspeciais__Props } from '../Contexto__PaginaModeradorHabilidadesEspeciais/contexto';
import SPA__PaginaModeradorHabilidadesEspeciais__NovaHabilidade from 'Conteineres/PaginaModeradorHabilidadesEspeciais/paginas/SPA__PaginaModeradorHabilidadesEspeciais__NovaHabilidade/SPA__PaginaModeradorHabilidadesEspeciais__NovaHabilidade';

type FormularioNovaHabilidadeEspecial = {
    nome: string;
    descricao: string;
    custoPontosHabilidadeEspecial: string;
    tipoComportamento: PropriedadesHabilidadeEspecial['tipo'];
    valorBonus: string;
};

const FORMULARIO_CREATE_HABILIDADE_ESPECIAL = defineFormularioCreate<FormularioNovaHabilidadeEspecial>({
    valoresIniciais: { nome: '', descricao: '', custoPontosHabilidadeEspecial: '', tipoComportamento: 'sem_efeito_runtime', valorBonus: '3' },
    campos: {
        nome: { tipo: 'text', label: 'Nome', obrigatorio: true, maxLength: 120, placeholder: 'Ex: Estudo Reforçado' },
        descricao: { tipo: 'textarea', label: 'Descrição', obrigatorio: true, maxLength: 2000, placeholder: 'Descreva objetivamente o que esta habilidade possibilita.' },
        custoPontosHabilidadeEspecial: { tipo: 'text', label: 'Custo em Pontos', obrigatorio: true, placeholder: 'Ex: 10' },
        tipoComportamento: { tipo: 'text', label: 'Comportamento', obrigatorio: true },
        valorBonus: { tipo: 'text', label: 'Valor do Bônus', obrigatorio: true, placeholder: 'Ex: 3' },
    },
});

interface Contexto__PaginaModeradorHabilidadesEspeciais__NovaHabilidade__Props {
    formularioNovaHabilidade: FormularioCreateEstado<FormularioNovaHabilidadeEspecial>;
    custoEhValido: boolean;
    bonusEhValido: boolean;
    podeSalvar: boolean;
    salvar: () => Promise<void>;
};

type PropsProvider = {
    cancelaCriacao: Contexto__PaginaModeradorHabilidadesEspeciais__Props['cancelaCriacao'];
    concluiCriacao: Contexto__PaginaModeradorHabilidadesEspeciais__Props['concluiCriacao'];
};

const Contexto__PaginaModeradorHabilidadesEspeciais__NovaHabilidade = createContext<Contexto__PaginaModeradorHabilidadesEspeciais__NovaHabilidade__Props | undefined>(undefined);

export const useContexto__PaginaModeradorHabilidadesEspeciais__NovaHabilidade = (): Contexto__PaginaModeradorHabilidadesEspeciais__NovaHabilidade__Props => {
    const context = useContext(Contexto__PaginaModeradorHabilidadesEspeciais__NovaHabilidade);
    if (!context) throw new Error('useContexto__PaginaModeradorHabilidadesEspeciais__NovaHabilidade precisa estar dentro de um Contexto__PaginaModeradorHabilidadesEspeciais__NovaHabilidade');
    return context;
};

export const Contexto__PaginaModeradorHabilidadesEspeciais__NovaHabilidade__Provider = ({ cancelaCriacao, concluiCriacao }: PropsProvider) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Nova Habilidade Especial', fecharProps: { tipo: 'acao', executar: cancelaCriacao, tituloTooltip: 'Voltar para Listagem' } });

    const formularioNovaHabilidade = useFormularioNovaHabilidade(concluiCriacao);
    const custoEhValido = ehCustoHabilidadeEspecialValido(formularioNovaHabilidade.valores.custoPontosHabilidadeEspecial);
    const bonusEhValido = ehBonusHabilidadeEspecialValido(formularioNovaHabilidade.valores.tipoComportamento, formularioNovaHabilidade.valores.valorBonus);
    const podeSalvar = custoEhValido && bonusEhValido && formularioNovaHabilidade.podeSalvar;

    async function salvar(): Promise<void> {
        if (!podeSalvar) return;

        await formularioNovaHabilidade.salvar();
    };

    return (
        <Contexto__PaginaModeradorHabilidadesEspeciais__NovaHabilidade.Provider value={{ formularioNovaHabilidade, custoEhValido, bonusEhValido, podeSalvar, salvar }}>
            <SPA__PaginaModeradorHabilidadesEspeciais__NovaHabilidade />
        </Contexto__PaginaModeradorHabilidadesEspeciais__NovaHabilidade.Provider>
    );
};

function useFormularioNovaHabilidade(concluiCriacao: () => void): FormularioCreateEstado<FormularioNovaHabilidadeEspecial> {
    return useFormularioCreate(FORMULARIO_CREATE_HABILIDADE_ESPECIAL, async payload => {
        if (!ehCustoHabilidadeEspecialValido(payload.custoPontosHabilidadeEspecial)) return;
        if (!ehBonusHabilidadeEspecialValido(payload.tipoComportamento, payload.valorBonus)) return;

        const payloadCreate: DTO__CREATE__HabilidadeEspecial = {
            nome: payload.nome,
            descricao: payload.descricao,
            custoPontosHabilidadeEspecial: Number(payload.custoPontosHabilidadeEspecial),
            propriedades: montaPropriedadesHabilidadeEspecial(payload.tipoComportamento, payload.valorBonus),
        };
        await criaHabilidadeEspecial(payloadCreate);
        concluiCriacao();
    });
};

function ehCustoHabilidadeEspecialValido(custoInformado: string): boolean {
    const custo = Number(custoInformado);

    return custoInformado.trim().length > 0 && Number.isInteger(custo) && custo >= 1;
};

function ehBonusHabilidadeEspecialValido(tipoComportamento: PropriedadesHabilidadeEspecial['tipo'], valorInformado: string): boolean {
    if (tipoComportamento === 'sem_efeito_runtime') return true;

    const valor = Number(valorInformado);

    return valorInformado.trim().length > 0 && Number.isInteger(valor) && valor >= 1;
};

function montaPropriedadesHabilidadeEspecial(tipoComportamento: PropriedadesHabilidadeEspecial['tipo'], valorInformado: string): PropriedadesHabilidadeEspecial {
    if (tipoComportamento === 'modificador_parametrizado_teste_pericia_valor_maximo') {
        return {
            tipo: 'modificador_parametrizado_teste_pericia_valor_maximo',
            valor: Number(valorInformado),
            argumento: { tipo: 'pericia' },
            multiplicidade: 'por_argumento',
        };
    };

    return { tipo: 'sem_efeito_runtime' };
};
