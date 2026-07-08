'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { EventosApiRest, type OrigemEstruturaSerJogavel, type TipoControlabilidadeSer } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerNovoSer__Props } from '../Contexto__PaginaGameDesignerNovoSer/contexto';
import SPA__PaginaGameDesignerNovoSer__Cadastro from 'Conteineres/PaginaGameDesignerNovoSer/paginas/SPA__PaginaGameDesignerNovoSer__Cadastro/SPA__PaginaGameDesignerNovoSer__Cadastro';

interface Contexto__PaginaGameDesignerNovoSer__Cadastro__Props {
    tipo: TipoControlabilidadeSer | null;
    nome: string;
    origemEstrutura: OrigemEstruturaSerJogavel | null;
    salvando: boolean;
    podeSalvar: boolean;
    setTipo: (tipo: TipoControlabilidadeSer | null) => void;
    setNome: (nome: string) => void;
    setOrigemEstrutura: (origem: OrigemEstruturaSerJogavel | null) => void;
    criar: () => Promise<void>;
};

type PropsProvider = {
    cancelaCadastro: Contexto__PaginaGameDesignerNovoSer__Props['voltaParaListagem'];
    concluiCadastro: Contexto__PaginaGameDesignerNovoSer__Props['concluiCadastro'];
};

const Contexto__PaginaGameDesignerNovoSer__Cadastro = createContext<Contexto__PaginaGameDesignerNovoSer__Cadastro__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerNovoSer__Cadastro = (): Contexto__PaginaGameDesignerNovoSer__Cadastro__Props => {
    const context = useContext(Contexto__PaginaGameDesignerNovoSer__Cadastro);
    if (!context) throw new Error('useContexto__PaginaGameDesignerNovoSer__Cadastro precisa estar dentro de um Contexto__PaginaGameDesignerNovoSer__Cadastro');
    return context;
};

export const Contexto__PaginaGameDesignerNovoSer__Cadastro__Provider = ({ cancelaCadastro, concluiCadastro }: PropsProvider) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Novo Ser', fecharProps: { tipo: 'acao', executar: cancelaCadastro, tituloTooltip: 'Voltar para Listagem' } });

    const [tipo, setTipo] = useState<TipoControlabilidadeSer | null>(null);
    const [nome, setNome] = useState<string>('');
    const [origemEstrutura, setOrigemEstrutura] = useState<OrigemEstruturaSerJogavel | null>(null);
    const [salvando, setSalvando] = useState<boolean>(false);

    const podeSalvar = tipo !== null && (tipo === 'nao_jogavel' ? nome.trim().length > 0 : origemEstrutura !== null) && !salvando;

    const criar = useCallback(async (): Promise<void> => {
        if (tipo === null) return;
        setSalvando(true);
        try {
            await NoraApi.RestPOST(EventosApiRest.POST.SerRegistro.criar, {
                tipo,
                nome: tipo === 'nao_jogavel' ? nome.trim() : null,
                origemEstrutura: tipo === 'jogavel' ? origemEstrutura : null,
            }, { mensagemErro: 'Não foi possível criar o Ser.' });
            concluiCadastro();
        } finally {
            setSalvando(false);
        }
    }, [tipo, nome, origemEstrutura, concluiCadastro]);

    return (
        <Contexto__PaginaGameDesignerNovoSer__Cadastro.Provider value={{ tipo, nome, origemEstrutura, salvando, podeSalvar, setTipo, setNome, setOrigemEstrutura, criar }}>
            <SPA__PaginaGameDesignerNovoSer__Cadastro />
        </Contexto__PaginaGameDesignerNovoSer__Cadastro.Provider>
    );
};
