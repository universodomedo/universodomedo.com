// #region Imports
import style from 'Pages/Shop/style.module.css';

import { useContextoLoja } from 'Pages/Shop/contexto.tsx';
// #endregion

const page = () => {
    const { mudarPagina } = useContextoLoja();

    return (
        <>
            <h2>Adicionar novos Itens</h2>
            <div className={style.botoes_itens}>
                <button onClick={() => { mudarPagina(1) }} className={style.botao_categoria_iteem}>Componentes</button>
                <button onClick={() => { mudarPagina(2) }} className={style.botao_categoria_iteem}>Equipamentos</button>
                <button onClick={() => { mudarPagina(6) }} className={style.botao_categoria_iteem}>Consumíveis</button>
                <button onClick={() => { mudarPagina(7) }} className={style.botao_categoria_iteem}>Armas</button>
            </div>
        </>
    );
}

export default page;



