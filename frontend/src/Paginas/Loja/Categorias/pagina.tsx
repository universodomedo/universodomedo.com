import style from 'Paginas/Loja/style.module.css';

import { useContextoLoja } from 'Contextos/ContextoLoja/contexto.tsx';

const pagina = () => {
    const { mudarPagina } = useContextoLoja();

    return (
        <>
            <div className={style.botoes_itens}>
                <button onClick={() => { mudarPagina(1) }} className={style.botao_categoria_item}>Componentes</button>
                <button onClick={() => { mudarPagina(2) }} className={style.botao_categoria_item}>Equipamentos</button>
                <button onClick={() => { mudarPagina(6) }} className={style.botao_categoria_item}>Consumíveis</button>
                <button onClick={() => { mudarPagina(7) }} className={style.botao_categoria_item}>Armas</button>
            </div>
        </>
    );
}

export default pagina;