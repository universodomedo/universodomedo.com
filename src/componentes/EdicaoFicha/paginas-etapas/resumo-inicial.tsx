'use client';

import { pluralize } from 'Uteis/UteisTexto/pluralize';
import styles from '../styles.module.css';

import { EtapaGanhoEvolucao_Classes, EtapaGanhoEvolucao_ValorMaxAtributo, EtapaGanhoEvolucao_Estatisticas, EtapaGanhoEvolucao_HabilidadesEspeciais, EtapaGanhoEvolucao_Atributos, EtapaGanhoEvolucao_Pericias, EtapaGanhoEvolucao_MelhoriasRituais, EtapaGanhoEvolucao_Rituais, EtapaGanhoEvolucao_HabilidadesParanormais, EtapaGanhoEvolucao_HabilidadesElementais, GanhosEvolucao, useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';
import Link from 'next/link';

export default function ResumoInicial() {
    const { ganhos } = useContextoEdicaoFicha();

    return (
        <>
            {ganhos.etapas.some(etapa => etapa instanceof EtapaGanhoEvolucao_Classes) && <SecaoClasses />}
            {ganhos.etapas.some(etapa => etapa instanceof EtapaGanhoEvolucao_ValorMaxAtributo) && <SecaoValorMaxAtributo />}
            {ganhos.etapas.some(etapa => etapa instanceof EtapaGanhoEvolucao_Estatisticas) && <SecaoEstatisticas />}
            {ganhos.etapas.some(etapa => etapa instanceof EtapaGanhoEvolucao_HabilidadesEspeciais) && <SecaoHabilidadesEspeciais />}
            {ganhos.etapas.some(etapa => etapa instanceof EtapaGanhoEvolucao_Atributos) && <SecaoAtributos />}
            {ganhos.etapas.some(etapa => etapa instanceof EtapaGanhoEvolucao_Pericias) && <SecaoPericias />}
            {ganhos.etapas.some(etapa => etapa instanceof EtapaGanhoEvolucao_MelhoriasRituais) && <SecaoMelhoriasRituais />}
            {ganhos.etapas.some(etapa => etapa instanceof EtapaGanhoEvolucao_Rituais) && <SecaoRituais />}
            {ganhos.etapas.some(etapa => etapa instanceof EtapaGanhoEvolucao_HabilidadesParanormais) && <SecaoHabilidadesParanormais />}
            {ganhos.etapas.some(etapa => etapa instanceof EtapaGanhoEvolucao_HabilidadesElementais) && <SecaoHabilidadesElementais />}
        </>
    );
};

function SecaoClasses() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaClasses = ganhos.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_Classes)!;

    return (
        <>
            <h2>{etapaClasses.tituloEtapa}</h2>

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

            <p>Seus Atributos podem agora ser elevador até o valor {etapaValorMaxAtributo.valorMaximoNovo}</p>
        </>
    );
};

function SecaoEstatisticas() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaEstatisticas = ganhos.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_Estatisticas)!;

    return (
        <>
            <h2>{etapaEstatisticas.tituloEtapa}</h2>
        </>
    );
};

function SecaoHabilidadesEspeciais() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaHabilidadesEspeciais = ganhos.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_HabilidadesEspeciais)!;

    return (
        <>
            <h2>{etapaHabilidadesEspeciais.tituloEtapa}</h2>

            <p>Seus Pontos Disponíveis de Habilidade Especial aumentam em {etapaHabilidadesEspeciais.quantidadeDePontosAumento} Pontos</p>
        </>
    );
};


function SecaoAtributos() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaAtributos = ganhos.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_Atributos)!;

    return (
        <>
            <h2>{etapaAtributos.tituloEtapa}</h2>

            <div className={styles.recipiente_informacoes_secao_etapa_evolucao}>
                <p>Seus Atributos podem variar de {etapaAtributos.valorMinAtributo} até {etapaAtributos.valorMaxAtributo}</p>
                {etapaAtributos.obtemNumeroPontosGanho > 0 && (
                    <p>{etapaAtributos.obtemNumeroPontosGanho} {pluralize(etapaAtributos.obtemNumeroPontosGanho, 'Ponto')} para distribuir entre seus Atributos</p>
                )}
                {etapaAtributos.obtemNumeroPontosTroca > 0 && (
                    <p>{etapaAtributos.obtemNumeroPontosTroca} {pluralize(etapaAtributos.obtemNumeroPontosTroca, 'Ponto')} {pluralize(etapaAtributos.obtemNumeroPontosTroca, 'Opcional', 'Opcionais')} para trocar entre seus Atributos</p>
                )}
            </div>
        </>
    );
};

function SecaoPericias() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaPericias = ganhos.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_Pericias)!;

    return (
        <>
            <h2>{etapaPericias.tituloEtapa}</h2>

            <div className={styles.recipiente_informacoes_secao_etapa_evolucao}>
                {GanhosEvolucao.dadosReferencia.patentes.map(patente => {
                    const numeroPontosParaPatente = etapaPericias.obtemNumeroPontosGanhoPorPatente(patente);
                    if (numeroPontosParaPatente === 0) return;
                    
                    const patenteAnteriorAoPonto = GanhosEvolucao.dadosReferencia.patentes.find(patenteAnterior => patenteAnterior.id === (patente.id - 1));

                    return (
                        <div key={patente.id} className={styles.recipiente_patente_pericia}>
                            <h3>Perícias {pluralize(2, patente.nome)}</h3>
                            <p>{numeroPontosParaPatente} {pluralize(numeroPontosParaPatente, 'Ponto')} para melhorar Perícias {pluralize(2, patenteAnteriorAoPonto!.nome)} para {patente.nome}</p>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

function SecaoMelhoriasRituais() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaMelhoriasRituais = ganhos.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_MelhoriasRituais)!;

    return (
        <>
            <h2>{etapaMelhoriasRituais.tituloEtapa}</h2>
        </>
    );
};

function SecaoRituais() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaRituais = ganhos.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_Rituais)!;

    return (
        <>
            <h2>{etapaRituais.tituloEtapa}</h2>
        </>
    );
};

function SecaoHabilidadesParanormais() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaHabilidadesParanormais = ganhos.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_HabilidadesParanormais)!;

    return (
        <>
            <h2>{etapaHabilidadesParanormais.tituloEtapa}</h2>
        </>
    );
};

function SecaoHabilidadesElementais() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaHabilidadesElementais = ganhos.etapas.find(etapa => etapa instanceof EtapaGanhoEvolucao_HabilidadesElementais)!;

    return (
        <>
            <h2>{etapaHabilidadesElementais.tituloEtapa}</h2>
        </>
    );
};