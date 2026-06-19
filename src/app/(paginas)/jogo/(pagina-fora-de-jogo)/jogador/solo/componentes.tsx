'use client';

import styles from './styles.module.css';

import { useEffect, useMemo, useState } from 'react';
import { EstruturaMissoesJogaveis, EventosApiRest, PAGINAS, type CatalogoMissaoJogavelResumo } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';
import CatalogoDeMissoes from 'Componentes/ElementosDeJogo/CatalogoDeMissoes/CatalogoDeMissoes';
import { ControladorSlot } from 'Layouts/ControladorSlot';
import JogoRouteGuard from '../../../JogoRouteGuard';

export default function PaginaModoSolo_Conteiner() {
    const [estrutura, setEstrutura] = useState<EstruturaMissoesJogaveis | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [idMissaoSelecionada, setIdMissaoSelecionada] = useState<number | null>(null);

    useEffect(() => {
        async function carregarEstrutura(): Promise<void> {
            setCarregando(true);
            setErro(null);

            try {
                const resposta = await NoraApi.RestGET(EventosApiRest.GET.MissoesJogaveis.estrutura, {}, { mensagemErro: 'Não foi possível carregar as Missões do Modo Solo.' });
                setEstrutura(resposta);
            } catch {
                setErro('Não foi possível carregar as Missões do Modo Solo.');
            } finally {
                setCarregando(false);
            }
        };

        void carregarEstrutura();
    }, []);

    const catalogosDisponiveis = useMemo<readonly CatalogoMissaoJogavelResumo[]>(() => {
        if (!estrutura) return [];

        return estrutura.catalogos.filter(catalogo => catalogo.ativo).map(catalogo => ({ ...catalogo, missoes: catalogo.missoes.filter(missao => missao.ativo) }));
    }, [estrutura]);

    const idsMissoesDisponiveis = useMemo<readonly number[]>(() => montaIdsMissoesDisponiveis(catalogosDisponiveis), [catalogosDisponiveis]);

    useEffect(() => {
        if (idsMissoesDisponiveis.length === 0) {
            if (idMissaoSelecionada !== null) setIdMissaoSelecionada(null);
            return;
        }

        if (!idsMissoesDisponiveis.includes(idMissaoSelecionada ?? 0)) setIdMissaoSelecionada(idsMissoesDisponiveis[0]);
    }, [idsMissoesDisponiveis, idMissaoSelecionada]);

    return (
        <ControladorSlot pagina={PAGINAS.jogo.jogador.solo} embrulho={JogoRouteGuard}>
            <main className={styles.pagina_modo_solo}>
                {erro && <div className={styles.erro}>{erro}</div>}
                <section className={styles.secao_detalhamento} aria-hidden="true" />
                <section className={styles.secao_catalogo}><CatalogoDeMissoes catalogos={catalogosDisponiveis} idMissaoSelecionada={idMissaoSelecionada} carregando={carregando} aoSelecionarMissao={missao => setIdMissaoSelecionada(missao.id)} /></section>
            </main>
        </ControladorSlot>
    );
};

function montaIdsMissoesDisponiveis(catalogos: readonly CatalogoMissaoJogavelResumo[]): readonly number[] {
    const idsMissoes: number[] = [];

    catalogos.forEach(catalogo => {
        catalogo.missoes.forEach(missao => {
            idsMissoes.push(missao.id);
        });
    });

    return idsMissoes;
};
