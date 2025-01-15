// #region Imports
import style from 'Pages/Shop/style.module.css';

import { useContextoArma } from 'Pages/Shop/PaginasSecundarias/Armas/contextoArma.tsx';

import { renderizarObjetoDadosCaracteristicasArmas } from 'Types/classes/index.ts';
// #endregion

const page = ({ mostraCaracteristicas = false }: { mostraCaracteristicas?: boolean }) => {
    const { idBaseArmaSelecionada, listaDadosArma, caracteristicasSelecionadas } = useContextoArma();

    return (
        <div className={`${style.visualizador_arma} ${!mostraCaracteristicas ? style.visualizador_sem_crescer : ''}`}>
            {idBaseArmaSelecionada > 0 && (
                <div className={style.dados_arma}>
                    {listaDadosArma.map((dadosArma, index) => {
                        if (dadosArma.tipo === 'titulo') {
                            return (
                                <div key={index} className={style.linha_titulo}>
                                    <span className={style.titulo_dado_arma}>{dadosArma.titulo}</span>
                                </div>
                            );
                        } else if (dadosArma.tipo === 'par') {
                            return (
                                <div key={index} className={style.linha_nome_e_valor}>
                                    <span className={style.nome_dado_arma}>{dadosArma.nome}</span>
                                    <span className={style.valor_dado_arma}>{dadosArma.valor}</span>
                                </div>
                            );
                        } else if (dadosArma.tipo === 'details') {
                            return (
                                <div key={index} className={style.linha_details}>
                                    <details>
                                        <summary>{dadosArma.summary}</summary>
                                        <div className={style.detalhes}>
                                            <>
                                                {dadosArma.itens.map((itemDadoArma, indexItem) => (
                                                    <p key={indexItem}>{itemDadoArma}</p>
                                                ))}
                                            </>
                                        </div>
                                    </details>
                                </div>
                            );
                        }
                    })}
                </div>
            )}

            {mostraCaracteristicas && (
                <div className={style.dados_arma}>
                    <h2>Características Selecionadas</h2>
                    {caracteristicasSelecionadas.length === 0 ? (
                        <>
                            <h2>Selecione do painel abaixo</h2>
                        </>
                    ) : (
                        <div className={style.lista_caracteristicas_selecionadas}>
                            <h2>Dados da Arma</h2>
                            {caracteristicasSelecionadas.map((caracteristicaSelecionada, index) => {
                                const dadosCaracteristica = renderizarObjetoDadosCaracteristicasArmas(caracteristicaSelecionada.dadosCaracteristicaNaBase!.dadosCaracteristicasArmas);

                                return (
                                    <div key={index} className={style.linha_caracteristica_selecionada}>
                                        <details>
                                            <summary>{caracteristicaSelecionada.nome}</summary>
                                            <ul>
                                                {dadosCaracteristica.map((dado, indexDado) => (
                                                    <li key={indexDado}>{dado}</li>
                                                ))}
                                            </ul>
                                        </details>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default page;