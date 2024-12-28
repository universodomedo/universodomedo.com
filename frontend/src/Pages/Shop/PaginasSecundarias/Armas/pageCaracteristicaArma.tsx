// #region Imports
import style from 'Pages/Shop/style.module.css';

import { useContextoArma } from 'Pages/Shop/PaginasSecundarias/Armas/contextoArma.tsx';

import DadosArma from 'Pages/Shop/PaginasSecundarias/DadosArma/page.tsx';
// #endregion

const page = () => {
    const { adicionar, idBaseArmaSelecionada, mudarPaginaArma, selecionarBaseArma } = useContextoArma();

    return (
        <>
            <div className={style.area_tipo_item}>
                <h2>Adicionar Características na Arma</h2>

                <DadosArma />
            </div>
            <div className={style.area_botao_tipo_item}>
                <button onClick={() => { mudarPaginaArma(0) }}>Mudar Arma</button>
                <button onClick={adicionar} disabled={idBaseArmaSelecionada <= 0} className={style.botao_adicionar}>Adicionar</button>
            </div>
        </>
    );
}
export default page;