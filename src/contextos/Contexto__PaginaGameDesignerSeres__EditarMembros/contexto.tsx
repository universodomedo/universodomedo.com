'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { EventosApiRest } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';
import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import SPA__PaginaGameDesignerSeres__EditarMembros from 'Conteineres/PaginaGameDesignerSeres/paginas/SPA__PaginaGameDesignerSeres__EditarMembros/SPA__PaginaGameDesignerSeres__EditarMembros';
import { adicionaAcaoMembroEditor, alternaCapacidadeMembroEditor, atualizaCapacidadeAcaoMembroEditor, atualizaNomeAcaoMembroEditor, atualizaNomeMembroEditor, membroEditorVazio, membrosEditorDePersistidos, membrosEditorSaoValidos, montaInputMembrosEditor, obtemMensagemValidacaoMembrosEditor, removeAcaoMembroEditor, type MembroEditor } from './membrosSerJogavelEditor';

interface Contexto__PaginaGameDesignerSeres__EditarMembros__Props {
    membros: readonly MembroEditor[];
    capacidadesInatas: ReturnType<typeof useListagemCapacidadesInatas>;
    carregando: boolean;
    salvando: boolean;
    podeSalvar: boolean;
    mensagemValidacao: string | null;
    adicionaMembro: () => void;
    removeMembro: (idLocal: number) => void;
    atualizaNomeMembro: (idLocal: number, nome: string) => void;
    alternaCapacidadeMembro: (idLocal: number, idCapacidade: number) => void;
    adicionaAcaoMembro: (idLocal: number) => void;
    removeAcaoMembro: (idLocal: number, idLocalAcao: number) => void;
    atualizaNomeAcaoMembro: (idLocal: number, idLocalAcao: number, nome: string) => void;
    atualizaCapacidadeAcaoMembro: (idLocal: number, idLocalAcao: number, idCapacidadeInata: number) => void;
    salvar: () => Promise<void>;
    voltar: () => void;
};

type PropsProvider = {
    fkSerId: number;
    voltar: () => void;
};

const Contexto__PaginaGameDesignerSeres__EditarMembros = createContext<Contexto__PaginaGameDesignerSeres__EditarMembros__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerSeres__EditarMembros = (): Contexto__PaginaGameDesignerSeres__EditarMembros__Props => {
    const context = useContext(Contexto__PaginaGameDesignerSeres__EditarMembros);
    if (!context) throw new Error('useContexto__PaginaGameDesignerSeres__EditarMembros precisa estar dentro de um Contexto__PaginaGameDesignerSeres__EditarMembros');
    return context;
};

export const Contexto__PaginaGameDesignerSeres__EditarMembros__Provider = ({ fkSerId, voltar }: PropsProvider) => {
    const capacidadesInatas = useListagemCapacidadesInatas();
    const proximoIdLocalRef = useRef(1);
    const proximoIdLocalAcaoRef = useRef(1);
    const [membros, setMembros] = useState<readonly MembroEditor[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        let ativo = true;

        async function carrega(): Promise<void> {
            const proximoIdLocal = (): number => { const id = proximoIdLocalRef.current; proximoIdLocalRef.current += 1; return id; };
            const proximoIdLocalAcao = (): number => { const id = proximoIdLocalAcaoRef.current; proximoIdLocalAcaoRef.current += 1; return id; };

            try {
                const dados = await NoraApi.RestGET(EventosApiRest.GET.SeresJogaveisMembros.obter, { fkSerId }, { mensagemErro: 'Não foi possível carregar os membros do Ser.' });
                if (!ativo) return;

                const membrosCarregados = membrosEditorDePersistidos(dados.membros, proximoIdLocal, proximoIdLocalAcao);
                setMembros(membrosCarregados.length > 0 ? membrosCarregados : [membroEditorVazio(proximoIdLocal())]);
            } catch {
                if (ativo) setMembros([membroEditorVazio(proximoIdLocal())]);
            } finally {
                if (ativo) setCarregando(false);
            }
        };

        void carrega();

        return () => { ativo = false; };
    }, [fkSerId]);

    const mensagemValidacao = obtemMensagemValidacaoMembrosEditor(membros, capacidadesInatas.registros.length);
    const podeSalvar = !salvando && membrosEditorSaoValidos(membros) && capacidadesInatas.registros.length > 0;

    function adicionaMembro(): void { setMembros(membrosAtuais => [...membrosAtuais, membroEditorVazio(proximoIdLocalRef.current++)]); };
    function removeMembro(idLocal: number): void { setMembros(membrosAtuais => membrosAtuais.filter(membro => membro.idLocal !== idLocal)); };
    function atualizaNomeMembro(idLocal: number, nome: string): void { setMembros(membrosAtuais => atualizaNomeMembroEditor(membrosAtuais, idLocal, nome)); };
    function alternaCapacidadeMembro(idLocal: number, idCapacidade: number): void { setMembros(membrosAtuais => alternaCapacidadeMembroEditor(membrosAtuais, idLocal, idCapacidade)); };
    function adicionaAcaoMembro(idLocal: number): void { setMembros(membrosAtuais => adicionaAcaoMembroEditor(membrosAtuais, idLocal, proximoIdLocalAcaoRef.current++)); };
    function removeAcaoMembro(idLocal: number, idLocalAcao: number): void { setMembros(membrosAtuais => removeAcaoMembroEditor(membrosAtuais, idLocal, idLocalAcao)); };
    function atualizaNomeAcaoMembro(idLocal: number, idLocalAcao: number, nome: string): void { setMembros(membrosAtuais => atualizaNomeAcaoMembroEditor(membrosAtuais, idLocal, idLocalAcao, nome)); };
    function atualizaCapacidadeAcaoMembro(idLocal: number, idLocalAcao: number, idCapacidadeInata: number): void { setMembros(membrosAtuais => atualizaCapacidadeAcaoMembroEditor(membrosAtuais, idLocal, idLocalAcao, idCapacidadeInata)); };

    async function salvar(): Promise<void> {
        if (!podeSalvar) return;
        setSalvando(true);

        try {
            await NoraApi.RestPOST(EventosApiRest.POST.SeresJogaveisMembros.salvar, { fkSerId, membros: montaInputMembrosEditor(membros) }, { mensagemErro: 'Não foi possível salvar os membros do Ser.' });
            voltar();
        } finally {
            setSalvando(false);
        }
    };

    return (
        <Contexto__PaginaGameDesignerSeres__EditarMembros.Provider value={{ membros, capacidadesInatas, carregando, salvando, podeSalvar, mensagemValidacao, adicionaMembro, removeMembro, atualizaNomeMembro, alternaCapacidadeMembro, adicionaAcaoMembro, removeAcaoMembro, atualizaNomeAcaoMembro, atualizaCapacidadeAcaoMembro, salvar, voltar }}>
            <SPA__PaginaGameDesignerSeres__EditarMembros />
        </Contexto__PaginaGameDesignerSeres__EditarMembros.Provider>
    );
};

function useListagemCapacidadesInatas() {
    return useNoraGraphQLListagem('CapacidadeInata', {
        select: ['id', 'nome'],
        camposFiltroConsulta: ['nome'],
        camposFiltroVisualizacao: ['nome'],
        itensPorPagina: 100,
        carregando: 'Buscando Capacidades Inatas',
        mensagemErro: 'Houve um erro recuperando as Capacidades Inatas',
        mensagemListaVazia: 'Nenhuma capacidade inata cadastrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma capacidade inata encontrada com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { nome: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};