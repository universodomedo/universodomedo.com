'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import type { TipoCta } from 'types-nora-api';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import type { Contexto__PaginaDocumentacaoProduto__Props, DestinoCta, RegistroCta, RegistroTipoSecao } from '../Contexto__PaginaDocumentacaoProduto/contexto';
import SPA__PaginaDocumentacaoProduto__Ctas from 'Conteineres/PaginaDocumentacaoProduto/paginas/SPA__PaginaDocumentacaoProduto__Ctas/SPA__PaginaDocumentacaoProduto__Ctas';

export type DestinoTipo = 'pagina' | 'jornada';
export type FormCta = { idEmEdicao: number | null; label: string; tipo: TipoCta; destinoTipo: DestinoTipo; destinoId: number | null; importancia: string };
export type FormTipoSecao = { idEmEdicao: number | null; rotulo: string; ativo: boolean };

const FORM_CTA_INICIAL: FormCta = { idEmEdicao: null, label: '', tipo: 'FIXA', destinoTipo: 'pagina', destinoId: null, importancia: '' };
const FORM_TIPO_INICIAL: FormTipoSecao = { idEmEdicao: null, rotulo: '', ativo: true };

export interface Contexto__PaginaDocumentacaoProduto__Ctas__Props {
    listagemCtas: Contexto__PaginaDocumentacaoProduto__Props['listagemCtas'];
    listagemCtasPersonas: Contexto__PaginaDocumentacaoProduto__Props['listagemCtasPersonas'];
    listagemTiposSecao: Contexto__PaginaDocumentacaoProduto__Props['listagemTiposSecao'];
    listagemPersonas: Contexto__PaginaDocumentacaoProduto__Props['listagemPersonas'];
    listagemPaginas: Contexto__PaginaDocumentacaoProduto__Props['listagemPaginas'];
    listagemJornadas: Contexto__PaginaDocumentacaoProduto__Props['listagemJornadas'];
    formCta: FormCta;
    formTipoSecao: FormTipoSecao;
    salvandoCta: boolean;
    salvandoTipo: boolean;
    erroCta: string | null;
    erroTipo: string | null;
    podeSalvarCta: boolean;
    podeSalvarTipo: boolean;
    setCampoCta: <K extends keyof FormCta>(campo: K, valor: FormCta[K]) => void;
    setCampoTipo: <K extends keyof FormTipoSecao>(campo: K, valor: FormTipoSecao[K]) => void;
    editarCta: (cta: RegistroCta) => void;
    editarTipoSecao: (tipo: RegistroTipoSecao) => void;
    limparFormCta: () => void;
    limparFormTipo: () => void;
    salvarCta: () => Promise<void>;
    salvarTipoSecao: () => Promise<void>;
    publicosDaCta: (idCta: number) => number[];
    nomePersonaPorId: (idPersona: number) => string;
    rotuloDestino: (cta: RegistroCta) => string;
    vincularPublico: (idCta: number, idPersona: number) => Promise<void>;
    desvincularPublico: (idVinculo: number) => Promise<void>;
    idVinculoPublico: (idCta: number, idPersona: number) => number | null;
};

type PropsProvider = Pick<Contexto__PaginaDocumentacaoProduto__Props, 'listagemCtas' | 'listagemCtasPersonas' | 'listagemTiposSecao' | 'listagemPersonas' | 'listagemPaginas' | 'listagemJornadas' | 'criarCta' | 'atualizarCta' | 'vincularCtaPersona' | 'removerCtaPersona' | 'criarTipoSecao' | 'atualizarTipoSecao'> & { fecharCtas: () => void };

const Contexto__PaginaDocumentacaoProduto__Ctas = createContext<Contexto__PaginaDocumentacaoProduto__Ctas__Props | undefined>(undefined);

export const useContexto__PaginaDocumentacaoProduto__Ctas = (): Contexto__PaginaDocumentacaoProduto__Ctas__Props => {
    const context = useContext(Contexto__PaginaDocumentacaoProduto__Ctas);
    if (!context) throw new Error('useContexto__PaginaDocumentacaoProduto__Ctas precisa estar dentro de um Contexto__PaginaDocumentacaoProduto__Ctas');
    return context;
};

export const Contexto__PaginaDocumentacaoProduto__Ctas__Provider = ({ listagemCtas, listagemCtasPersonas, listagemTiposSecao, listagemPersonas, listagemPaginas, listagemJornadas, criarCta, atualizarCta, vincularCtaPersona, removerCtaPersona, criarTipoSecao, atualizarTipoSecao, fecharCtas }: PropsProvider) => {
    const [formCta, setFormCta] = useState<FormCta>(FORM_CTA_INICIAL);
    const [formTipoSecao, setFormTipoSecao] = useState<FormTipoSecao>(FORM_TIPO_INICIAL);
    const [salvandoCta, setSalvandoCta] = useState<boolean>(false);
    const [salvandoTipo, setSalvandoTipo] = useState<boolean>(false);
    const [erroCta, setErroCta] = useState<string | null>(null);
    const [erroTipo, setErroTipo] = useState<string | null>(null);

    // Navegação contextual: título estável (da PÁGINA); subtítulo identifica o catálogo; o X volta pra listagem. Sem botão Voltar no corpo.
    useConfigurarLayoutContextualizado({
        subtitulo: 'CTAs & Seções',
        fecharProps: { tipo: 'acao', executar: fecharCtas, tituloTooltip: 'Voltar para a listagem' },
    });

    const setCampoCta = useCallback(<K extends keyof FormCta>(campo: K, valor: FormCta[K]) => setFormCta(f => ({ ...f, [campo]: valor })), []);
    const setCampoTipo = useCallback(<K extends keyof FormTipoSecao>(campo: K, valor: FormTipoSecao[K]) => setFormTipoSecao(f => ({ ...f, [campo]: valor })), []);

    const editarCta = useCallback((cta: RegistroCta) => setFormCta({ idEmEdicao: cta.id, label: cta.label, tipo: cta.tipo as TipoCta, destinoTipo: cta.fkJornadasId !== null ? 'jornada' : 'pagina', destinoId: cta.fkJornadasId ?? cta.fkPaginasNavegacaoId, importancia: cta.importancia ?? '' }), []);
    const editarTipoSecao = useCallback((tipo: RegistroTipoSecao) => setFormTipoSecao({ idEmEdicao: tipo.id, rotulo: tipo.rotulo, ativo: tipo.ativo }), []);
    const limparFormCta = useCallback(() => setFormCta(FORM_CTA_INICIAL), []);
    const limparFormTipo = useCallback(() => setFormTipoSecao(FORM_TIPO_INICIAL), []);

    const podeSalvarCta = formCta.label.trim().length > 0 && formCta.destinoId !== null && !salvandoCta;
    const podeSalvarTipo = formTipoSecao.rotulo.trim().length > 0 && !salvandoTipo;

    const salvarCta = useCallback(async (): Promise<void> => {
        if (formCta.destinoId === null) return;
        setSalvandoCta(true);
        setErroCta(null);
        try {
            const destino: DestinoCta = { fkPaginasNavegacaoId: formCta.destinoTipo === 'pagina' ? formCta.destinoId : null, fkJornadasId: formCta.destinoTipo === 'jornada' ? formCta.destinoId : null };
            const importancia = formCta.importancia.trim().length > 0 ? formCta.importancia.trim() : null;
            if (formCta.idEmEdicao === null) await criarCta(formCta.label.trim(), formCta.tipo, destino, importancia);
            else await atualizarCta(formCta.idEmEdicao, formCta.label.trim(), formCta.tipo, destino, importancia);
            setFormCta(FORM_CTA_INICIAL);
        } catch (capturado) {
            setErroCta(capturado instanceof Error ? capturado.message : 'Não foi possível salvar a CTA.');
        } finally {
            setSalvandoCta(false);
        }
    }, [formCta, criarCta, atualizarCta]);

    const salvarTipoSecao = useCallback(async (): Promise<void> => {
        setSalvandoTipo(true);
        setErroTipo(null);
        try {
            if (formTipoSecao.idEmEdicao === null) await criarTipoSecao(formTipoSecao.rotulo.trim());
            else await atualizarTipoSecao(formTipoSecao.idEmEdicao, formTipoSecao.rotulo.trim(), formTipoSecao.ativo);
            setFormTipoSecao(FORM_TIPO_INICIAL);
        } catch (capturado) {
            setErroTipo(capturado instanceof Error ? capturado.message : 'Não foi possível salvar o tipo de seção.');
        } finally {
            setSalvandoTipo(false);
        }
    }, [formTipoSecao, criarTipoSecao, atualizarTipoSecao]);

    const publicosDaCta = useCallback((idCta: number): number[] => listagemCtasPersonas.registros.filter(vinculo => vinculo.fkCtasId === idCta).map(vinculo => vinculo.fkPersonasId), [listagemCtasPersonas.registros]);
    const idVinculoPublico = useCallback((idCta: number, idPersona: number): number | null => listagemCtasPersonas.registros.find(vinculo => vinculo.fkCtasId === idCta && vinculo.fkPersonasId === idPersona)?.id ?? null, [listagemCtasPersonas.registros]);
    const nomePersonaPorId = useCallback((idPersona: number): string => listagemPersonas.registros.find(persona => persona.id === idPersona)?.nome ?? `Persona #${idPersona}`, [listagemPersonas.registros]);
    const rotuloDestino = useCallback((cta: RegistroCta): string => {
        if (cta.fkJornadasId !== null) return `Jornada: ${listagemJornadas.registros.find(jornada => jornada.id === cta.fkJornadasId)?.titulo ?? `#${cta.fkJornadasId}`}`;
        if (cta.fkPaginasNavegacaoId !== null) return `Página: ${listagemPaginas.registros.find(pagina => pagina.id === cta.fkPaginasNavegacaoId)?.label ?? `#${cta.fkPaginasNavegacaoId}`}`;
        return 'Sem destino';
    }, [listagemJornadas.registros, listagemPaginas.registros]);

    const vincularPublico = useCallback(async (idCta: number, idPersona: number): Promise<void> => { await vincularCtaPersona(idCta, idPersona); }, [vincularCtaPersona]);
    const desvincularPublico = useCallback(async (idVinculo: number): Promise<void> => { await removerCtaPersona(idVinculo); }, [removerCtaPersona]);

    return (
        <Contexto__PaginaDocumentacaoProduto__Ctas.Provider value={{ listagemCtas, listagemCtasPersonas, listagemTiposSecao, listagemPersonas, listagemPaginas, listagemJornadas, formCta, formTipoSecao, salvandoCta, salvandoTipo, erroCta, erroTipo, podeSalvarCta, podeSalvarTipo, setCampoCta, setCampoTipo, editarCta, editarTipoSecao, limparFormCta, limparFormTipo, salvarCta, salvarTipoSecao, publicosDaCta, nomePersonaPorId, rotuloDestino, vincularPublico, desvincularPublico, idVinculoPublico }}>
            <SPA__PaginaDocumentacaoProduto__Ctas />
        </Contexto__PaginaDocumentacaoProduto__Ctas.Provider>
    );
};