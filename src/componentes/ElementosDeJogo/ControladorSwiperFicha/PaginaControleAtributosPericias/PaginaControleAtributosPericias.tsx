import styles from './styles.module.css';

import { AtributoFichaDto, PericiaFichaDto } from 'types-nora-api';
import textoFormatadoParaVisualizacao from 'Uteis/UteisTexto/textoFormatadoParaVisualizacao';
import Tooltip from 'Componentes/Elementos/Tooltip/Tooltip';
import adicionaSinalEmNumeroParaExibicao from 'Uteis/UteisTexto/adicionaSinalEmNumeroParaExibicao';

import { useContextoFichaPersonagem } from "Contextos/ContextoFichaPersonagem/contexto";
import { useContextoControleAtributosPericias } from 'Contextos/ContextosControladorSwiperFicha/ContextoControleAtributosPericias/contexto';

export default function PaginaControleAtributosPericias() {
    const { ficha } = useContextoFichaPersonagem();

    return (
        <div className={styles.atributos_personagem}>
            {(ficha?.atributos || []).map((atributoPersonagem, index) => (
                <AreaAtributo key={index}
                    atributoPersonagem={atributoPersonagem}
                    periciasPersonagem={(ficha?.pericias || []).filter(periciaPersonagem => periciaPersonagem.pericia.atributo.id === atributoPersonagem.atributo.id)}
                />
            ))}
        </div>
    );
};

function AreaAtributo({ atributoPersonagem, periciasPersonagem }: { atributoPersonagem: AtributoFichaDto, periciasPersonagem: PericiaFichaDto[] }) {
    const { abreviar } = useContextoControleAtributosPericias();
    const atributoPorExtenso = textoFormatadoParaVisualizacao(abreviar ? atributoPersonagem.atributo.nomeAbreviado : atributoPersonagem.atributo.nome);

    return (
        <div className={`${styles.atributo_personagem} ${styles[atributoPersonagem.atributo.nomeAbreviado]}`}>
            <Tooltip>
                <Tooltip.Trigger>
                    <h3 className={styles.nome_atributo}>{`${atributoPorExtenso} [${atributoPersonagem.valorTotal}]`}</h3>
                </Tooltip.Trigger>

                <Tooltip.Content>
                    <TooltipAtributo atributoPersonagem={atributoPersonagem} />
                </Tooltip.Content>
            </Tooltip>

            <div className={styles.pericias_personagem}>
                {periciasPersonagem.map((periciaPersonagem, index) => (
                    <AreaPericia key={index} periciaPersonagem={periciaPersonagem} />
                ))}
            </div>
        </div>
    );
}

function AreaPericia({ periciaPersonagem }: { periciaPersonagem: PericiaFichaDto }) {
    const { abreviar } = useContextoControleAtributosPericias();
    const periciaPorExtenso = textoFormatadoParaVisualizacao(abreviar ? periciaPersonagem.pericia.nomeAbreviado : periciaPersonagem.pericia.nome);

    return (
        <div className={styles.pericia_personagem}>
            <Tooltip>
                <Tooltip.Trigger>
                    <button className={styles.botao_pericia} onClick={() => {() => {console.log(`clicou para realizar teste de ${periciaPersonagem.pericia.nome}`)}}}>{periciaPorExtenso}</button>
                    {/* <button className={styles.botao_pericia} onClick={() => { periciaPersonagem.realizarTeste(); }}>{periciaPorExtenso}</button> */}
                </Tooltip.Trigger>

                <Tooltip.Content>
                    <TooltipPericia periciaPersonagem={periciaPersonagem} />
                </Tooltip.Content>
            </Tooltip>

            <h3 className={styles.pericia_valor}>
                <span style={{ color: periciaPersonagem.patentePericia.cor }}>{periciaPersonagem.patentePericia.nome.slice(0, 1)}</span>
                {periciaPersonagem.valorEfeito !== 0 && (
                    <span style={{ color: periciaPersonagem.valorEfeito > 0 ? '#83EF83' : '#E98282' }}>
                        {` ${adicionaSinalEmNumeroParaExibicao(periciaPersonagem.valorEfeito)}`}
                    </span>
                )}
            </h3>
        </div>
    );
}

function TooltipAtributo({ atributoPersonagem }: { atributoPersonagem: AtributoFichaDto }) {
    return (
        <>
            <h2>{atributoPersonagem.atributo.nome}</h2>
            <p>{atributoPersonagem.atributo.descricao}</p>

            {/* verificando se existe algum bonus além do valor natural */}
            {atributoPersonagem.detalhesValor.length > 0 && (
                <>
                    <h2>Detalhes do Total: {atributoPersonagem.valorTotal}</h2>
                    {atributoPersonagem.detalhesValor.map((detalheValor, index) => (
                        <p key={index}>{detalheValor}</p>
                    ))}
                </>
            )}
        </>
    );
}

function TooltipPericia({ periciaPersonagem }: { periciaPersonagem: PericiaFichaDto }) {
    return (
        <>
            <h1>{periciaPersonagem.pericia.nome}</h1>
            <p>{periciaPersonagem.pericia.descricao}</p>

            {/* verificando se existe algum bonus além da patente */}
            {periciaPersonagem.detalhesValor.length > 0 && (
                <>
                    <h2>Detalhes do Total: {periciaPersonagem.valorTotal}</h2>
                    {periciaPersonagem.detalhesValor.map((detalheValor, index) => (
                        <p key={index}>{detalheValor}</p>
                    ))}
                </>
            )}
        </>
    );
}