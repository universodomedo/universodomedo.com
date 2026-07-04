'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { EventosApiRest } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';
import { useListagemCapacidadesInatas } from 'Hooks/useListagemCapacidadesInatas';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerBasesSer__Props } from '../Contexto__PaginaGameDesignerBasesSer/contexto';
import SPA__PaginaGameDesignerBasesSer__EdicaoMembros from 'Conteineres/PaginaGameDesignerBasesSer/paginas/SPA__PaginaGameDesignerBasesSer__EdicaoMembros/SPA__PaginaGameDesignerBasesSer__EdicaoMembros';
import { adicionaAcaoMembroEditor, alternaCapacidadeMembroEditor, atualizaCapacidadeAcaoMembroEditor, atualizaDanoAcaoMembroEditor, atualizaNomeAcaoMembroEditor, atualizaNomeMembroEditor, membroEditorVazio, membrosEditorDePersistidos, membrosEditorSaoValidos, montaInputMembrosEditor, obtemMensagemValidacaoMembrosEditor, removeAcaoMembroEditor, type MembroEditor } from 'Contextos/Contexto__PaginaGameDesignerSeres__EditarMembros/membrosSerJogavelEditor';

interface Contexto__PaginaGameDesignerBasesSer__EdicaoMembros__Props {
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
    atualizaDanoAcaoMembro: (idLocal: number, idLocalAcao: number, dano: number | '') => void;
    salvar: () => Promise<void>;
};

type PropsProvider = {
    idBaseSer: number;
    voltaParaListagem: Contexto__PaginaGameDesignerBasesSer__Props['voltaParaListagem'];
};

const Contexto__PaginaGameDesignerBasesSer__EdicaoMembros = createContext<Contexto__PaginaGameDesignerBasesSer__EdicaoMembros__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerBasesSer__EdicaoMembros = (): Contexto__PaginaGameDesignerBasesSer__EdicaoMembros__Props => {
    const context = useContext(Contexto__PaginaGameDesignerBasesSer__EdicaoMembros);
    if (!context) throw new Error('useContexto__PaginaGameDesignerBasesSer__EdicaoMembros precisa estar dentro de um Contexto__PaginaGameDesignerBasesSer__EdicaoMembros');
    return context;
};

export const Contexto__PaginaGameDesignerBasesSer__EdicaoMembros__Provider = ({ idBaseSer, voltaParaListagem }: PropsProvider) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Membros da Base', fecharProps: { tipo: 'acao', executar: voltaParaListagem, tituloTooltip: 'Voltar para Listagem' } });

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
                const dados = await NoraApi.RestGET(EventosApiRest.GET.BasesSer.obter, { idBaseSer }, { mensagemErro: 'Não foi possível carregar a Base de Ser.' });
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
    }, [idBaseSer]);

    const mensagemValidacao = obtemMensagemValidacaoMembrosEditor(membros, capacidadesInatas.registros);
    const podeSalvar = !salvando && membrosEditorSaoValidos(membros, capacidadesInatas.registros) && capacidadesInatas.registros.length > 0;

    function adicionaMembro(): void { setMembros(membrosAtuais => [...membrosAtuais, membroEditorVazio(proximoIdLocalRef.current++)]); };
    function removeMembro(idLocal: number): void { setMembros(membrosAtuais => membrosAtuais.filter(membro => membro.idLocal !== idLocal)); };
    function atualizaNomeMembro(idLocal: number, nome: string): void { setMembros(membrosAtuais => atualizaNomeMembroEditor(membrosAtuais, idLocal, nome)); };
    function alternaCapacidadeMembro(idLocal: number, idCapacidade: number): void { setMembros(membrosAtuais => alternaCapacidadeMembroEditor(membrosAtuais, idLocal, idCapacidade)); };
    function adicionaAcaoMembro(idLocal: number): void { setMembros(membrosAtuais => adicionaAcaoMembroEditor(membrosAtuais, idLocal, proximoIdLocalAcaoRef.current++)); };
    function removeAcaoMembro(idLocal: number, idLocalAcao: number): void { setMembros(membrosAtuais => removeAcaoMembroEditor(membrosAtuais, idLocal, idLocalAcao)); };
    function atualizaNomeAcaoMembro(idLocal: number, idLocalAcao: number, nome: string): void { setMembros(membrosAtuais => atualizaNomeAcaoMembroEditor(membrosAtuais, idLocal, idLocalAcao, nome)); };
    function atualizaCapacidadeAcaoMembro(idLocal: number, idLocalAcao: number, idCapacidadeInata: number): void { setMembros(membrosAtuais => atualizaCapacidadeAcaoMembroEditor(membrosAtuais, idLocal, idLocalAcao, idCapacidadeInata)); };
    function atualizaDanoAcaoMembro(idLocal: number, idLocalAcao: number, dano: number | ''): void { setMembros(membrosAtuais => atualizaDanoAcaoMembroEditor(membrosAtuais, idLocal, idLocalAcao, dano)); };

    async function salvar(): Promise<void> {
        if (!podeSalvar) return;
        setSalvando(true);

        try {
            await NoraApi.RestPOST(EventosApiRest.POST.BasesSer.salvarMembros, { idBaseSer, membros: montaInputMembrosEditor(membros) }, { mensagemErro: 'Não foi possível salvar os membros da Base de Ser.' });
            voltaParaListagem();
        } finally {
            setSalvando(false);
        }
    };

    return (
        <Contexto__PaginaGameDesignerBasesSer__EdicaoMembros.Provider value={{ membros, capacidadesInatas, carregando, salvando, podeSalvar, mensagemValidacao, adicionaMembro, removeMembro, atualizaNomeMembro, alternaCapacidadeMembro, adicionaAcaoMembro, removeAcaoMembro, atualizaNomeAcaoMembro, atualizaCapacidadeAcaoMembro, atualizaDanoAcaoMembro, salvar }}>
            <SPA__PaginaGameDesignerBasesSer__EdicaoMembros />
        </Contexto__PaginaGameDesignerBasesSer__EdicaoMembros.Provider>
    );
};
