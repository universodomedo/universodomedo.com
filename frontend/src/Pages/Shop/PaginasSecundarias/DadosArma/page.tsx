// #region Imports
import style from 'Pages/Shop/style.module.css';

import { useContextoArma } from 'Pages/Shop/PaginasSecundarias/Armas/contextoArma.tsx';
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
                            {dadosArma.valor !== undefined && (
                                <span className={style.valor_dado_arma}>{dadosArma.valor}</span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {mostraCaracteristicas && (
                <div className={style.dados_arma}>
                    {listaDadosArma.map((dadosArma, index) => (
                        <div key={index} className={style.linha_dado_arma}>
                            <span className={style.nome_dado_arma}>{dadosArma.nome}</span>
                            {dadosArma.valor !== undefined && (
                                <span className={style.valor_dado_arma}>{dadosArma.valor}</span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default page;