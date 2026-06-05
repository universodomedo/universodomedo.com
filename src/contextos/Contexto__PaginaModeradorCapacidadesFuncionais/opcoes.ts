import { useCallback, useEffect, useState } from 'react';
import type { OpcoesCadastroCapacidadeFuncionalDto, TipoParametroFuncionalCapacidade } from 'types-nora-api';

import { obtemOpcoesCadastroCapacidadeFuncional } from 'Uteis/ApiConsumer/ConsumerMiddleware';

export function useOpcoesCadastroCapacidadeFuncional() {
    const [opcoes, setOpcoes] = useState<OpcoesCadastroCapacidadeFuncionalDto | null>(null);
    const [carregandoOpcoes, setCarregandoOpcoes] = useState<string | null>('Carregando opções do cadastro');
    const [erroOpcoes, setErroOpcoes] = useState<string | null>(null);

    useEffect(() => {
        let ativo = true;

        obtemOpcoesCadastroCapacidadeFuncional()
            .then(opcoesRecebidas => {
                if (!ativo) return;
                setOpcoes(opcoesRecebidas);
                setErroOpcoes(null);
            })
            .catch(error => {
                if (!ativo) return;
                setErroOpcoes(error instanceof Error ? error.message : 'Falha ao carregar opções do cadastro.');
            })
            .finally(() => {
                if (ativo) setCarregandoOpcoes(null);
            });

        return () => { ativo = false; };
    }, []);

    const primeiroTipoParametro = useCallback((): TipoParametroFuncionalCapacidade | null => opcoes?.tiposParametrosFuncionais[0]?.key ?? null, [opcoes]);
    const normalizaTipoParametro = useCallback((tipo: string): TipoParametroFuncionalCapacidade | null => opcoes?.tiposParametrosFuncionais.find(opcao => opcao.key === tipo)?.key ?? null, [opcoes]);

    return { opcoes, carregandoOpcoes, erroOpcoes, primeiroTipoParametro, normalizaTipoParametro };
};
