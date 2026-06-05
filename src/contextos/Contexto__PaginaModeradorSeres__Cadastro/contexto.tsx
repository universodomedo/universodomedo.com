'use client';

import { createContext, useContext, useMemo, useRef, useState } from 'react';
import type { DTO__CREATE__Ser } from 'types-nora-api';

import useFormularioCreate, { defineFormularioCreate, type FormularioCreateEstado } from 'Hooks/useFormularioCreate';
import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { criaSer } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { Contexto__PaginaModeradorSeres__Props } from '../Contexto__PaginaModeradorSeres/contexto';
import SPA__PaginaModeradorSeres__Cadastro from 'Conteineres/PaginaModeradorSeres/paginas/SPA__PaginaModeradorSeres__Cadastro/SPA__PaginaModeradorSeres__Cadastro';
import { alternaCapacidadeMembroCadastroSer, atualizaNomeMembroCadastroSer, criaMembroCadastroSer, membrosCadastroSerSaoValidos, montaPayloadMembrosCadastroSer, type MembroCadastroSer } from './membroCadastroSer';
type FormularioNovoSer = Pick<DTO__CREATE__Ser, 'nome'>;
const FORMULARIO_CREATE_SER = defineFormularioCreate<FormularioNovoSer>({
    valoresIniciais: { nome: '' },
    campos: {
        nome: { tipo: 'text', label: 'Nome', obrigatorio: true, maxLength: 120, placeholder: 'Ex: Cachorro Domesticado' },
    },
});
interface Contexto__PaginaModeradorSeres__Cadastro__Props {
    formularioNovoSer: FormularioCreateEstado<FormularioNovoSer>;
    membros: readonly MembroCadastroSer[];
    capacidadesInatas: ReturnType<typeof useListagemCapacidadesInatas>;
    podeSalvarSer: boolean;
    mensagemValidacaoMembros: string | null;
    adicionaMembro: () => void;
    removeMembro: (idLocal: number) => void;
    atualizaNomeMembro: (idLocal: number, nome: string) => void;
    alternaCapacidadeMembro: (idLocal: number, idCapacidade: number) => void;
    salvar: () => Promise<void>;
};

type PropsProvider = {
    cancelaCadastro: Contexto__PaginaModeradorSeres__Props['cancelaCadastro'];
    concluiCadastro: Contexto__PaginaModeradorSeres__Props['concluiCadastro'];
};
const Contexto__PaginaModeradorSeres__Cadastro = createContext<Contexto__PaginaModeradorSeres__Cadastro__Props | undefined>(undefined);
export const useContexto__PaginaModeradorSeres__Cadastro = (): Contexto__PaginaModeradorSeres__Cadastro__Props => {
    const context = useContext(Contexto__PaginaModeradorSeres__Cadastro);
    if (!context) throw new Error('useContexto__PaginaModeradorSeres__Cadastro precisa estar dentro de um Contexto__PaginaModeradorSeres__Cadastro');
    return context;
};
export const Contexto__PaginaModeradorSeres__Cadastro__Provider = ({ cancelaCadastro, concluiCadastro }: PropsProvider) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Novo Ser', fecharProps: { tipo: 'acao', executar: cancelaCadastro, tituloTooltip: 'Voltar para Listagem' } });

    const capacidadesInatas = useListagemCapacidadesInatas();
    const proximoIdMembroRef = useRef(2);
    const [membros, setMembros] = useState<readonly MembroCadastroSer[]>([criaMembroCadastroSer(1)]);
    const membrosSaoValidos = useMemo(() => membrosCadastroSerSaoValidos(membros), [membros]);

    const formularioNovoSer = useFormularioCreate(FORMULARIO_CREATE_SER, async valores => {
        await criaSer({ nome: valores.nome, membros: montaPayloadMembrosCadastroSer(membros) });
        concluiCadastro();
    });
    const podeSalvarSer = formularioNovoSer.podeSalvar && membrosSaoValidos && capacidadesInatas.registros.length > 0;
    const mensagemValidacaoMembros = obtemMensagemValidacaoMembros(membros, capacidadesInatas.registros.length);
    function adicionaMembro(): void {
        const idLocal = proximoIdMembroRef.current;
        proximoIdMembroRef.current += 1;
        setMembros(membrosAtuais => [...membrosAtuais, criaMembroCadastroSer(idLocal)]);
    };
    function removeMembro(idLocal: number): void { setMembros(membrosAtuais => membrosAtuais.filter(membro => membro.idLocal !== idLocal)); };
    function atualizaNomeMembro(idLocal: number, nome: string): void { setMembros(membrosAtuais => atualizaNomeMembroCadastroSer(membrosAtuais, idLocal, nome)); };
    function alternaCapacidadeMembro(idLocal: number, idCapacidade: number): void { setMembros(membrosAtuais => alternaCapacidadeMembroCadastroSer(membrosAtuais, idLocal, idCapacidade)); };
    async function salvar(): Promise<void> { if (podeSalvarSer) await formularioNovoSer.salvar(); };

    return (
        <Contexto__PaginaModeradorSeres__Cadastro.Provider value={{ formularioNovoSer, membros, capacidadesInatas, podeSalvarSer, mensagemValidacaoMembros, adicionaMembro, removeMembro, atualizaNomeMembro, alternaCapacidadeMembro, salvar }}>
            <SPA__PaginaModeradorSeres__Cadastro />
        </Contexto__PaginaModeradorSeres__Cadastro.Provider>
    );
};
function obtemMensagemValidacaoMembros(membros: readonly MembroCadastroSer[], totalCapacidades: number): string | null {
    if (totalCapacidades < 1) return 'Cadastre ao menos uma Capacidade Inata antes de criar Seres.';
    if (membros.length < 1) return 'Adicione ao menos um membro.';
    if (membros.some(membro => membro.nome.trim().length < 1)) return 'Todos os membros precisam de nome.';
    if (membros.some(membro => membro.capacidadesIds.length < 1)) return 'Cada membro precisa de ao menos uma Capacidade Inata.';

    return null;
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