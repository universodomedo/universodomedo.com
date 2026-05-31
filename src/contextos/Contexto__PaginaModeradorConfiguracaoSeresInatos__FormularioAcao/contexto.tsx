'use client';

import { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import type { CategoriaAcaoInata, DTO__CREATE__AcaoInata, OpcoesAcoesInatasDto, ParametroEditavelAcaoInata } from 'types-nora-api';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { criaAcaoInata, editaAcaoInata as editaAcaoInataBackend, obtemOpcoesAcoesInatas } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { toast } from 'Hooks/useToast';
import SPA__PaginaModeradorConfiguracaoSeresInatos__FormularioAcao from 'Conteineres/PaginaModeradorConfiguracaoSeresInatos/paginas/SPA__PaginaModeradorConfiguracaoSeresInatos__FormularioAcao/SPA__PaginaModeradorConfiguracaoSeresInatos__FormularioAcao';
import type { FormularioAcaoInata, ParametroAcaoFormulario } from 'Contextos/Contexto__PaginaModeradorConfiguracaoSeresInatos/contexto';
import type { RegistroAcaoInata } from 'Contextos/Contexto__PaginaModeradorConfiguracaoSeresInatos/listagens';

interface Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioAcao__Props {
    acaoInicial: RegistroAcaoInata | null;
    aoVoltar: () => void;
};

interface Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioAcao__Valor {
    formularioAcao: FormularioAcaoInata;
    setFormularioAcao: Dispatch<SetStateAction<FormularioAcaoInata>>;
    opcoesAcoes: OpcoesAcoesInatasDto | null;
    aoVoltar: () => void;
    adicionaParametroAcao: () => void;
    atualizaParametroAcao: (idFormulario: number, parametro: ParametroAcaoFormulario) => void;
    removeParametroAcao: (idFormulario: number) => void;
    salvaAcao: () => Promise<void>;
};

const Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioAcao = createContext<Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioAcao__Valor | undefined>(undefined);

export const useContexto__PaginaModeradorConfiguracaoSeresInatos__FormularioAcao = (): Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioAcao__Valor => {
    const context = useContext(Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioAcao);
    if (!context) throw new Error('useContexto__PaginaModeradorConfiguracaoSeresInatos__FormularioAcao precisa estar dentro de um Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioAcao');
    return context;
};

export const Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioAcao__Provider = (props: Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioAcao__Props) => {
    useConfigurarLayoutContextualizado({ subtitulo: props.acaoInicial ? props.acaoInicial.nome : 'Nova Ação Inata', fecharProps: { tipo: 'acao', executar: props.aoVoltar, tituloTooltip: 'Voltar para Listagem' } });

    const [opcoesAcoes, setOpcoesAcoes] = useState<OpcoesAcoesInatasDto | null>(null);
    const [formularioAcao, setFormularioAcao] = useState<FormularioAcaoInata>(() => criaFormularioAcao(props.acaoInicial, 'outra'));
    const [proximoIdParametro, setProximoIdParametro] = useState(() => formularioAcao.parametros.length + 1);

    useEffect(() => {
        obtemOpcoesAcoesInatas().then(opcoes => {
            setOpcoesAcoes(opcoes);
            setFormularioAcao(formularioAtual => formularioAtual.id === null && formularioAtual.categoria === 'outra' ? { ...formularioAtual, categoria: resolveCategoriaDefault(opcoes) } : formularioAtual);
        }).catch(() => setOpcoesAcoes(null));
    }, []);

    function adicionaParametroAcao(): void {
        const idFormulario = proximoIdParametro;
        setProximoIdParametro(idAtual => idAtual + 1);
        setFormularioAcao(formularioAtual => ({ ...formularioAtual, parametros: [...formularioAtual.parametros, { idFormulario, chave: '', nome: '', unidade: '', obrigatorio: true }] }));
    };

    function atualizaParametroAcao(idFormulario: number, parametro: ParametroAcaoFormulario): void {
        setFormularioAcao(formularioAtual => ({ ...formularioAtual, parametros: formularioAtual.parametros.map(parametroAtual => parametroAtual.idFormulario === idFormulario ? parametro : parametroAtual) }));
    };

    function removeParametroAcao(idFormulario: number): void {
        setFormularioAcao(formularioAtual => ({ ...formularioAtual, parametros: formularioAtual.parametros.filter(parametro => parametro.idFormulario !== idFormulario) }));
    };

    async function salvaAcao(): Promise<void> {
        try {
            if (formularioAcao.id === null) await criaAcaoInata(montaPayloadAcao(formularioAcao));
            else await editaAcaoInataBackend({ ...montaPayloadAcao(formularioAcao), idAcaoInata: formularioAcao.id });

            await toast.sucesso(formularioAcao.id === null ? 'Ação inata criada' : 'Ação inata atualizada', formularioAcao.nome.trim());
            props.aoVoltar();
        } catch {
            await toast.erro('Falha ao salvar ação inata', 'Confira os campos e tente novamente.');
        }
    };

    return (
        <Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioAcao.Provider value={{ formularioAcao, setFormularioAcao, opcoesAcoes, aoVoltar: props.aoVoltar, adicionaParametroAcao, atualizaParametroAcao, removeParametroAcao, salvaAcao }}>
            <SPA__PaginaModeradorConfiguracaoSeresInatos__FormularioAcao />
        </Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioAcao.Provider>
    );
};

function resolveCategoriaDefault(opcoesAcoes: OpcoesAcoesInatasDto | null): CategoriaAcaoInata { return opcoesAcoes?.categorias[0]?.chave ?? 'outra'; };

function criaFormularioAcao(acaoInicial: RegistroAcaoInata | null, categoriaDefault: CategoriaAcaoInata): FormularioAcaoInata {
    if (!acaoInicial) return { id: null, nome: '', descricao: '', categoria: categoriaDefault, parametros: [] };

    return {
        id: acaoInicial.id,
        nome: acaoInicial.nome,
        descricao: acaoInicial.descricao,
        categoria: acaoInicial.categoria,
        parametros: acaoInicial.parametros.itens.map((parametro, index) => ({ idFormulario: index + 1, chave: parametro.chave, nome: parametro.nome, unidade: parametro.unidade ?? '', obrigatorio: parametro.obrigatorio })),
    };
};

function montaPayloadAcao(formulario: FormularioAcaoInata): DTO__CREATE__AcaoInata {
    const parametros: ParametroEditavelAcaoInata[] = formulario.parametros.map(parametro => ({ chave: parametro.chave.trim(), nome: parametro.nome.trim(), unidade: parametro.unidade.trim() || null, obrigatorio: parametro.obrigatorio }));

    return { nome: formulario.nome.trim(), descricao: formulario.descricao.trim(), categoria: formulario.categoria, parametros };
};