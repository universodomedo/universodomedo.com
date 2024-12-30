// #region Imports
import style from 'Pages/Shop/style.module.css';

import { useContextoArma } from 'Pages/Shop/PaginasSecundarias/Armas/contextoArma.tsx';

import { renderizarObjetoDadosCaracteristicasArmas } from 'Types/classes/index.ts';
// #endregion

const page = ({ mostraCaracteristicas = false }: { mostraCaracteristicas?: boolean }) => {
    const { idBaseArmaSelecionada, listaDadosArma, caracteristicasSelecionadas } = useContextoArma();

    return (
        <div className={style.visualizador_arma}>
            {idBaseArmaSelecionada > 0 && (
                <div className={style.dados_arma}>
                    {listaDadosArma.map((dadosArma, index) => (
                        <div key={index} className={style.linha_dado_arma}>
                            <span className={style.nome_dado_arma}>{dadosArma.nome}</span>
                            <span className={style.valor_dado_arma}>{dadosArma.valor}</span>
                        </div>
                    ))}
                </div>
            )}

            {mostraCaracteristicas && (
                <div className={style.dados_arma}>
                    {caracteristicasSelecionadas.length === 0 ? (
                        <>
                            <h2>Nenhuma Característica Selecionada</h2>
                            <h2>Selecione do painel abaixo</h2>
                        </>
                    ) : (
                        <div className={style.lista_caracteristicas_selecionadas}>
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