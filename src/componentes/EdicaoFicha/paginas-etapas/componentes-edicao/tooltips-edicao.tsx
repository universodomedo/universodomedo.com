import styles from '../../styles.module.css';

import { GanhosEvolucao, useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';
import { AtributoDto, EstatisticaDanificavelDto, PatentePericiaDto, PericiaDto } from 'types-nora-api';
import Tooltip from 'Componentes/Elementos/Tooltip/Tooltip';
import { ReactNode } from 'react';

export function TooltipEvolucao_EstatisticaComGanhoPorAtributo({ estatisticaDanificavel, exibeDetalhesAtributos = true, children }: { estatisticaDanificavel: EstatisticaDanificavelDto; exibeDetalhesAtributos?: boolean; children: ReactNode }) {
    const { ganhos } = useContextoEdicaoFicha();

    return (
        <Tooltip>
            <Tooltip.Trigger>
                {children}
            </Tooltip.Trigger>

            <Tooltip.Content propsLink={{ href:`definicoes/EstatisticasDanificaveis/${estatisticaDanificavel.nome}` }}>
                <h1>{estatisticaDanificavel.nome}</h1>
                <p>{estatisticaDanificavel.descricao}</p>
                <h2>Ganhos de {estatisticaDanificavel.nomeAbreviado}: [+{ganhos.valorTotalGanhadoPorEstatistica(estatisticaDanificavel).toFixed(1)}]</h2>
                {exibeDetalhesAtributos && GanhosEvolucao.dadosReferencia.atributos.map(atributo => {
                    const valorDessaEstatisticaPorEsseAtributo = ganhos.valorEstatisticaPorAtributo(estatisticaDanificavel, atributo);

                    if (valorDessaEstatisticaPorEsseAtributo <= 0) return;

                    return (
                        <p key={atributo.id}>{`${atributo.nomeAbreviado}: +${valorDessaEstatisticaPorEsseAtributo.toFixed(1)}`}</p>
                    );
                })}
            </Tooltip.Content>
        </Tooltip>
    );
};

export function TooltipEvolucao_Atributo({ atributo, infoGanhoEstatistica = false, children }: { atributo: AtributoDto; infoGanhoEstatistica?: boolean; children: ReactNode }) {
    const { ganhos } = useContextoEdicaoFicha();

    return (
        <Tooltip>
            <Tooltip.Trigger>
                {children}
            </Tooltip.Trigger>

            <Tooltip.Content propsLink={{ href:`definicoes/Atributos/${atributo.nome}` }}>
                <h1>{atributo.nome}</h1>
                <p>{atributo.descricao}</p>
                {infoGanhoEstatistica && (
                    <div>
                        {ganhos.ganhosEstatisticasPorAtributo.map(ganhoEstatistica => ganhoEstatistica.ganhosPorAtributo.filter(ganhoPorAtributo => ganhoPorAtributo.atributo.id === atributo.id).map(ganhoPorAtributo => (
                            <p key={`${ganhoEstatistica.estatisticaDanificavel.id}:${ganhoPorAtributo.atributo.id}`} className={styles.ganhos_estatistica_por_atributo}>+ {ganhoPorAtributo.valorPorUnidade.toFixed(1)} {ganhoEstatistica.estatisticaDanificavel.nomeAbreviado} por Ponto Atribuído</p>
                        )))}
                    </div>
                )}
            </Tooltip.Content>
        </Tooltip>
    );
};

export function TooltipEvolucao_Pericia({ pericia, children, conteudoAdicional  }: { pericia: PericiaDto, children: ReactNode, conteudoAdicional?: ReactNode }) {
    return (
        <Tooltip>
            <Tooltip.Trigger>
                {children}
            </Tooltip.Trigger>

            <Tooltip.Content propsLink={{ href:`definicoes/Pericias/${pericia.nome}` }}>
                <h2>{pericia.nome}</h2>
                <p>{pericia.descricao}</p>
                {conteudoAdicional}
            </Tooltip.Content>
        </Tooltip>
    );
};

export function TooltipEvolucao_PatentePericia({ patentePericia, children }: { patentePericia: PatentePericiaDto, children: ReactNode }) {
    return (
        <Tooltip>
            <Tooltip.Trigger>
                {children}
            </Tooltip.Trigger>

            <Tooltip.Content propsLink={{ href:`definicoes/PatentesPericia/${patentePericia.nome}` }}>
                <h2>{patentePericia.nome}</h2>
                <p>{patentePericia.descricao}</p>
            </Tooltip.Content>
        </Tooltip>
    );
};

export function TooltipEvolucao_PontosDePericiaLivreNessaPericia({ conteudo, children }: { conteudo: ReactNode, children: ReactNode }) {
    return (
        <Tooltip>
            <Tooltip.Trigger>
                {children}
            </Tooltip.Trigger>

            <Tooltip.Content>
                <h2>Pontos de Perícia Livre</h2>
                <p>Esse ganho especial de Evolução de Perícia pode ser usado para evoluir entre quaisquer Patentes e só podem sofrer troca utilizando Trocas Livres</p>
                {conteudo}
            </Tooltip.Content>
        </Tooltip>
    );
};