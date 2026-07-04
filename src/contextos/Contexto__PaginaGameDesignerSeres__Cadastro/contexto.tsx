'use client';

import { createContext, useContext, useState } from 'react';
import { EventosApiRest, TIPOS_SER, type ObjetoCache, type PAYLOAD__CriarSerRegistroComDetalhe } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';
import useFormularioCreate, { defineFormularioCreate, type FormularioCreateEstado } from 'Hooks/useFormularioCreate';
import { useCache } from 'Redux/hooks/useCache';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerSeres__Props } from '../Contexto__PaginaGameDesignerSeres/contexto';
import SPA__PaginaGameDesignerSeres__Cadastro from 'Conteineres/PaginaGameDesignerSeres/paginas/SPA__PaginaGameDesignerSeres__Cadastro/SPA__PaginaGameDesignerSeres__Cadastro';

type FormularioNovoSer = {
    readonly idTipoSer: string;
    readonly nome: string;
};

const FORMULARIO_CREATE_SER_REGISTRO = defineFormularioCreate<FormularioNovoSer>({
    valoresIniciais: { idTipoSer: String(TIPOS_SER.SER_UNICO.id), nome: '' },
    campos: {
        idTipoSer: { tipo: 'text', label: 'Tipo Ser', obrigatorio: true },
        nome: { tipo: 'text', label: 'Nome', obrigatorio: true, maxLength: 120, placeholder: 'Ex: Investigador Sem Nome' },
    },
});

interface Contexto__PaginaGameDesignerSeres__Cadastro__Props {
    formularioNovoSer: FormularioCreateEstado<FormularioNovoSer>;
    ehSerUnico: boolean;
    ehSerJogavel: boolean;
    serJogavel: boolean;
    setSerJogavel: (jogavel: boolean) => void;
    idNivel: number | null;
    setIdNivel: (idNivel: number | null) => void;
    ehSemClasse: boolean;
    setEhSemClasse: (ehSemClasse: boolean) => void;
    niveis: ObjetoCache['niveis'];
    idBaseSerSelecionada: number | null;
    nomeBaseSerSelecionada: string | null;
    selecionaBaseSer: (idBaseSer: number, nome: string) => void;
    limpaBaseSer: () => void;
    podeSalvar: boolean;
    salvar: () => Promise<void>;
};

type PropsProvider = {
    cancelaCadastro: Contexto__PaginaGameDesignerSeres__Props['voltaParaListagem'];
    concluiCadastro: Contexto__PaginaGameDesignerSeres__Props['concluiCadastro'];
};

const Contexto__PaginaGameDesignerSeres__Cadastro = createContext<Contexto__PaginaGameDesignerSeres__Cadastro__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerSeres__Cadastro = (): Contexto__PaginaGameDesignerSeres__Cadastro__Props => {
    const context = useContext(Contexto__PaginaGameDesignerSeres__Cadastro);
    if (!context) throw new Error('useContexto__PaginaGameDesignerSeres__Cadastro precisa estar dentro de um Contexto__PaginaGameDesignerSeres__Cadastro');
    return context;
};

export const Contexto__PaginaGameDesignerSeres__Cadastro__Provider = ({ cancelaCadastro, concluiCadastro }: PropsProvider) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Novo Ser', fecharProps: { tipo: 'acao', executar: cancelaCadastro, tituloTooltip: 'Voltar para Listagem' } });

    const cache = useCache();
    const [serJogavel, setSerJogavel] = useState(false);
    const [idNivel, setIdNivel] = useState<number | null>(null);
    const [ehSemClasse, setEhSemClasse] = useState(false);
    const [idBaseSerSelecionada, setIdBaseSerSelecionada] = useState<number | null>(null);
    const [nomeBaseSerSelecionada, setNomeBaseSerSelecionada] = useState<string | null>(null);

    const formularioNovoSer = useFormularioCreate(FORMULARIO_CREATE_SER_REGISTRO, async valores => {
        const idTipoSer = Number(valores.idTipoSer);
        const ehJogavel = idTipoSer === TIPOS_SER.SER_UNICO.id ? serJogavel : true;
        const payload: PAYLOAD__CriarSerRegistroComDetalhe = { idTipoSer, nome: valores.nome, serJogavel: idTipoSer === TIPOS_SER.SER_UNICO.id ? serJogavel : undefined, idNivel: ehJogavel && idNivel !== null ? idNivel : undefined, ehSemClasse: ehJogavel ? ehSemClasse : undefined };
        const criado = await NoraApi.RestPOST(EventosApiRest.POST.SerRegistro.criarComDetalhe, payload, { mensagemErro: 'Não foi possível criar o Ser.' });
        if (ehJogavel && idBaseSerSelecionada !== null) {
            const base = await NoraApi.RestGET(EventosApiRest.GET.BasesSer.obter, { idBaseSer: idBaseSerSelecionada }, { mensagemErro: 'Não foi possível carregar a Base de Ser selecionada.' });
            await NoraApi.RestPOST(EventosApiRest.POST.SeresJogaveisMembros.salvar, { fkSerId: criado.id, membros: base.membros }, { mensagemErro: 'Não foi possível herdar os membros da Base de Ser.' });
        }
        concluiCadastro();
    });

    const idTipoSerAtual = Number(formularioNovoSer.valores.idTipoSer);
    const ehSerUnico = idTipoSerAtual === TIPOS_SER.SER_UNICO.id;
    const ehSerJogavel = ehSerUnico ? serJogavel : true;
    const niveis = cache.pronto ? cache.niveis : [];
    const podeSalvar = formularioNovoSer.podeSalvar && (!ehSerJogavel || idNivel !== null);

    function selecionaBaseSer(idBaseSer: number, nome: string): void { setIdBaseSerSelecionada(idBaseSer); setNomeBaseSerSelecionada(nome); };
    function limpaBaseSer(): void { setIdBaseSerSelecionada(null); setNomeBaseSerSelecionada(null); };

    async function salvar(): Promise<void> { if (podeSalvar) await formularioNovoSer.salvar(); };

    return (
        <Contexto__PaginaGameDesignerSeres__Cadastro.Provider value={{ formularioNovoSer, ehSerUnico, ehSerJogavel, serJogavel, setSerJogavel, idNivel, setIdNivel, ehSemClasse, setEhSemClasse, niveis, idBaseSerSelecionada, nomeBaseSerSelecionada, selecionaBaseSer, limpaBaseSer, podeSalvar, salvar }}>
            <SPA__PaginaGameDesignerSeres__Cadastro />
        </Contexto__PaginaGameDesignerSeres__Cadastro.Provider>
    );
};
