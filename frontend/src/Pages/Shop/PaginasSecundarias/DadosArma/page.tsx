// #region Imports
import style from 'Pages/Shop/style.module.css';

import { useContextoArma } from 'Pages/Shop/PaginasSecundarias/Armas/contextoArma.tsx';
// #endregion

const page = () => {
    const { idBaseArmaSelecionada } = useContextoArma();

    return (
        <>
            {idBaseArmaSelecionada > 0 && (
                <div className={style.dados_arma}>
                    <div className={style.linha_dado_arma}>
                        <span className={style.nome_dado_arma}>Nome 1</span>
                        <span className={style.valor_dado_arma}>Valor 1</span>
                    </div>
                    <div className={style.linha_dado_arma}>
                        <span className={style.nome_dado_arma}>Nome 2</span>
                        <span className={style.valor_dado_arma}>Valor 2</span>
                    </div>
                    <div className={style.linha_dado_arma}>
                        <span className={style.nome_dado_arma}>+ Refinada</span>
                    </div>
                </div>
            )}
        </>
    );
};

export default page;