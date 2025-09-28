'use client';

import { pluralize } from 'Uteis/UteisTexto/pluralize';
import styles from '../styles.module.css';

import { EtapaGanhoEvolucao_Classes, EtapaGanhoEvolucao_ValorMaxAtributo, EtapaGanhoEvolucao_Estatisticas, EtapaGanhoEvolucao_HabilidadesEspeciais, EtapaGanhoEvolucao_Atributos, EtapaGanhoEvolucao_Pericias, EtapaGanhoEvolucao_HabilidadesParanormais, EtapaGanhoEvolucao_HabilidadesElementais, GanhosEvolucao, useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';
import Link from 'next/link';

export default function ResumoInicial() {
    const { ganhos } = useContextoEdicaoFicha();

    const listaPaginas = [
        { tipo: EtapaGanhoEvolucao_Classes, componente: <SecaoClasses /> },
        { tipo: EtapaGanhoEvolucao_ValorMaxAtributo, componente: <SecaoValorMaxAtributo /> },
        { tipo: EtapaGanhoEvolucao_Estatisticas, componente: <SecaoEstatisticas /> },
        { tipo: EtapaGanhoEvolucao_Atributos, componente: <SecaoAtributos /> },
        { tipo: EtapaGanhoEvolucao_Pericias, componente: <SecaoPericias /> },
        { tipo: EtapaGanhoEvolucao_HabilidadesEspeciais, componente: <SecaoHabilidadesEspeciais /> },
        { tipo: EtapaGanhoEvolucao_HabilidadesParanormais, componente: <SecaoHabilidadesParanormais /> },
        { tipo: EtapaGanhoEvolucao_HabilidadesElementais, componente: <SecaoHabilidadesElementais /> }
    ];

    return (
        <div id={styles.recipiente_resumo_inicial}>
            <div className={styles.recipiente_resumo_inicial_etapa}><SecaoCriandoPersonagem /></div>
            {ganhos.classeSelecionadaNessaEvolucao && (<div className={styles.recipiente_resumo_inicial_etapa}><SecaoClasseEscolhida /></div>)}
            {listaPaginas.map((pagina, index) =>
                ganhos.etapas.some(etapa => etapa instanceof pagina.tipo)
                    ? <div key={index} className={styles.recipiente_resumo_inicial_etapa}>{pagina.componente}</div>
                    : null
            )}
        </div>
    );
};

function SecaoCriandoPersonagem() {
    return (
        <p>Para informações, visite <Link href={'/dicas/comecando'} target={'_blank'}>Criação de Personagem</Link> e <Link href={'/dicas/evoluindo'} target={'_blank'}>Evoluindo seu Personagem</Link> </p>
    );
}

function SecaoClasseEscolhida() {
    const { ganhos } = useContextoEdicaoFicha();

    return (
        <>
            <Link href={'/definicoes/Classes'} target={'_blank'}><h2>Classes</h2></Link>

            <p>Você selecionou a Classe <Link href={`/definicoes/Classes/${ganhos.classeSelecionadaNessaEvolucao?.nome}`} target={'_blank'}>{ganhos.classeSelecionadaNessaEvolucao?.nome}</Link></p>
        </>
    )
}

function SecaoClasses() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaClasses = ganhos.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_Classes)!;

    return (
        <>
            <Link href={'/definicoes/Classes'} target={'_blank'}><h2>{etapaClasses.tituloEtapa}</h2></Link>

            <p>Nessa etapa, você vai selecionar a <Link href={'/definicoes/Classes'} target={'_blank'}>Classe</Link> do seu Personagem</p>
        </>
    );
};

function SecaoValorMaxAtributo() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaValorMaxAtributo = ganhos.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_ValorMaxAtributo)!;

    return (
        <>
            <h2>{etapaValorMaxAtributo.tituloEtapa}</h2>

            <p>Seus Atributos podem agora ser elevados até o valor {etapaValorMaxAtributo.valorMaximoNovo}</p>
        </>
    );
};

function SecaoEstatisticas() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaEstatisticas = ganhos.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_Estatisticas)!;

    return (
        <>
            <Link href={'definicoes/EstatisticasDanificaveis'} target={'_blank'}><h2>{etapaEstatisticas.tituloEtapa}</h2></Link>

            {GanhosEvolucao.dadosReferencia.estatisticasDanificaveis.map(estatisticaDanificavel => {
                const ganho = etapaEstatisticas.dadosGanhoAgrupados.find(ganhoEstatistica => ganhoEstatistica.idEstatistica === estatisticaDanificavel.id)?.valorAumento;

                if (ganho === 0) return;

                return (
                    <div key={estatisticaDanificavel.id} className={styles.recipiente_elementos_etapa}>
                        <h4>{estatisticaDanificavel.nome}</h4>
                        <p>Ganho de {ganho} pontos</p>
                    </div>
                );
            })}
        </>
    );
};

function SecaoHabilidadesEspeciais() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaHabilidadesEspeciais = ganhos.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_HabilidadesEspeciais)!;

    return (
        <>
            <Link href={'definicoes/HabilidadesEspeciais'} target={'_blank'}><h2>{etapaHabilidadesEspeciais.tituloEtapa}</h2></Link>

            <div className={styles.recipiente_informacoes_secao_etapa_evolucao}>
                <p>Seus Pontos Disponíveis de Habilidade Especial <strong>aumentam em {etapaHabilidadesEspeciais.quantidadeDePontosAumento} Pontos</strong></p>
            </div>
        </>
    );
};


function SecaoAtributos() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaAtributos = ganhos.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_Atributos)!;

    return (
        <>
            <Link href={'definicoes/Atributos'} target={'_blank'}><h2>{etapaAtributos.tituloEtapa}</h2></Link>

            <div className={styles.recipiente_informacoes_secao_etapa_evolucao}>
                <p>Seus Atributos podem variar de {etapaAtributos.valorMinAtributo} até {etapaAtributos.valorMaxAtributo}</p>
                {etapaAtributos.obtemNumeroPontosGanho > 0 && (
                    <p><strong>{etapaAtributos.obtemNumeroPontosGanho} {pluralize(etapaAtributos.obtemNumeroPontosGanho, 'Ponto')}</strong> para distribuir entre seus Atributos</p>
                )}
                {etapaAtributos.obtemNumeroPontosTroca > 0 && (
                    <p><strong>{etapaAtributos.obtemNumeroPontosTroca} {pluralize(etapaAtributos.obtemNumeroPontosTroca, 'Ponto')}</strong> {pluralize(etapaAtributos.obtemNumeroPontosTroca, 'Opcional', 'Opcionais')} para trocar entre seus Atributos</p>
                )}
            </div>
        </>
    );
};

function SecaoPericias() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaPericias = ganhos.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_Pericias)!;
    const temPericiasLivres = etapaPericias.pontosDeGanhoLivre.length > 0 || etapaPericias.pontosDeTrocaLivre.length > 0;

    return (
        <>
            <Link href={'definicoes/Pericias'} target={'_blank'}><h2>{etapaPericias.tituloEtapa}</h2></Link>

            <div className={`${styles.recipiente_informacoes_secao_etapa_evolucao} ${styles.etapa_com_divisoes}`}>
                {GanhosEvolucao.dadosReferencia.patentes.sort((a, b) => a.id - b.id).map(patente => {
                    const numeroPontosGanhoParaPatente = etapaPericias.obtemNumeroPontosGanhoParaPatente(patente);
                    const numeroPontosTrocaParaPatente = etapaPericias.obtemNumeroTrocasGanhoParaPatente(patente);

                    if (numeroPontosGanhoParaPatente === 0 && numeroPontosTrocaParaPatente === 0) return;

                    const patenteAnteriorAoPonto = GanhosEvolucao.dadosReferencia.patentes.find(patenteAnterior => patenteAnterior.id === (patente.id - 1));

                    return (
                        <div key={patente.id} className={styles.recipiente_elementos_etapa}>
                            <h4>Perícias {pluralize(2, patente.nome)}</h4>
                            {numeroPontosGanhoParaPatente > 0 && (<p><strong>{numeroPontosGanhoParaPatente} {pluralize(numeroPontosGanhoParaPatente, 'Ponto')}</strong> para melhorar {pluralize(numeroPontosGanhoParaPatente, 'Perícia')} <strong style={{ color: patenteAnteriorAoPonto?.cor }}>{pluralize(numeroPontosGanhoParaPatente, patenteAnteriorAoPonto!.nome)}</strong> para <strong style={{ color: patente?.cor }}>{patente.nome}</strong></p>)}
                            {numeroPontosTrocaParaPatente > 0 && (<p><strong>{numeroPontosTrocaParaPatente} {pluralize(numeroPontosTrocaParaPatente, 'Ponto')} {pluralize(numeroPontosTrocaParaPatente, 'Opcional', 'Opcionais')}</strong> para trocar {pluralize(numeroPontosTrocaParaPatente, 'Perícia')} <strong style={{ color: patente?.cor }}>{patente.nome}</strong></p>)}
                        </div>
                    );
                })}
                {temPericiasLivres && (() => {
                    const ganhoPericiasLivres = etapaPericias.pontosDeGanhoLivre.length;
                    const trocasLivres = etapaPericias.pontosDeTrocaLivre.length;

                    return (
                        <>
                            {ganhoPericiasLivres > 0 && (
                                <div className={styles.recipiente_elementos_etapa}>
                                    <h4>Perícias Livres</h4>
                                    <p><strong>{ganhoPericiasLivres} {pluralize(ganhoPericiasLivres, 'Ponto')} {pluralize(ganhoPericiasLivres, 'Livre')}</strong> para melhor Perícias em uma Patente qualquer</p>
                                </div>
                            )}

                            {trocasLivres > 0 && (
                                <div className={styles.recipiente_elementos_etapa}>
                                    <h4>Trocas Livres</h4>
                                    <p><strong>{trocasLivres} {pluralize(trocasLivres, 'Troca')} {pluralize(trocasLivres, 'Livre')}</strong> entre Perícias de mesma Patente</p>
                                </div>
                            )}
                        </>
                    );
                })()}
            </div>
        </>
    );
};

function SecaoHabilidadesParanormais() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaHabilidadesParanormais = ganhos.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_HabilidadesParanormais)!;

    return (
        <>
            <Link href={'definicoes/HabilidadesParanormais'} target={'_blank'}><h2>{etapaHabilidadesParanormais.tituloEtapa}</h2></Link>

            <div className={styles.recipiente_informacoes_secao_etapa_evolucao}>
                <p>Seus Pontos Disponíveis de Habilidade Paranormal <strong>aumentam em {etapaHabilidadesParanormais.quantidadeDePontosAumento} Pontos</strong></p>
            </div>
        </>
    );
};

function SecaoHabilidadesElementais() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaHabilidadesElementais = ganhos.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_HabilidadesElementais)!;

    return (
        <>
            <Link href={'definicoes/HabilidadesParanormais'} target={'_blank'}><h2>{etapaHabilidadesElementais.tituloEtapa}</h2></Link>

            <div className={styles.recipiente_informacoes_secao_etapa_evolucao}>
                <p>Seus Pontos Disponíveis de Habilidade Elemental <strong>aumentam em {etapaHabilidadesElementais.quantidadeDePontosAumento} {pluralize(etapaHabilidadesElementais.quantidadeDePontosAumento, 'Ponto')}</strong></p>
            </div>
        </>
    );
};