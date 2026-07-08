'use client';

import styles from './styles.module.css';

import { useEffect, useMemo, useState } from 'react';
import { EventosApiRest, type CapacidadeSelecionavel } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';
import { Componente_Selecionador } from 'Componentes/Selecionadores/Componente_Selecionador/Componente_Selecionador';
import { ListagemCompostaModoExibicao, type ListagemCompostaListagem } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';

// Seletor de Capacidade — instância do Componente_Selecionador com fonte REST (capacidades selecionáveis = folhas de permissões com path completo). Devolve o registro inteiro via aoConfirmar.
export function Componente_Selecionador__Capacidade({ aoConfirmar, aoCancelar, idInicial = null }: { aoConfirmar: (capacidade: CapacidadeSelecionavel) => void | Promise<void>; aoCancelar?: () => void; idInicial?: number | null; }) {
    const [registros, setRegistros] = useState<readonly CapacidadeSelecionavel[]>([]);
    const [carregando, setCarregando] = useState<string | null>('Buscando Capacidades');
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        let ativo = true;
        NoraApi.RestGET(EventosApiRest.GET.PermissoesItens.capacidadesSelecionaveis, {}, { mensagemErro: 'Não foi possível carregar as Capacidades.' })
            .then(capacidades => { if (ativo) { setRegistros(capacidades); setCarregando(null); } })
            .catch(() => { if (ativo) { setErro('Não foi possível carregar as Capacidades.'); setCarregando(null); } });
        return () => { ativo = false; };
    }, []);

    const listagem: ListagemCompostaListagem<CapacidadeSelecionavel> = useMemo(() => ({ registros, carregando, erro, mensagemListaVazia: 'Nenhuma Capacidade encontrada.' }), [registros, carregando, erro]);

    return (
        <Componente_Selecionador
            listagem={listagem}
            obterIdRegistro={capacidade => capacidade.id}
            modoExibicao={ListagemCompostaModoExibicao.LINHA}
            renderizarItem={capacidade => (
                <div className={styles.item_capacidade}>
                    <strong className={styles.path}>{capacidade.path}</strong>
                    <span className={styles.descricao}>{capacidade.descricao}</span>
                </div>
            )}
            aoConfirmar={capacidade => aoConfirmar(capacidade)}
            aoCancelar={aoCancelar}
            idInicial={idInicial}
            textoConfirmar="Exigir esta capacidade"
        />
    );
};
