import style from 'Paginas/Loja/style.module.css';

import { ContextoLojaProvider, useContextoLoja } from 'Contextos/ContextoLoja/contexto.tsx';


const Pagina = () => {
    return (
        <ContextoLojaProvider>
            <PageComContexto />
        </ContextoLojaProvider>
    );
};

const PageComContexto = () => {
    const { idPaginaAberta, paginas, removeItem } = useContextoLoja();

    return (
        <div className={style.recipiente_loja}>
            <h1>Loja</h1>
            <div className={style.recipiente_conteudo_tipo_item}>
                {paginas[idPaginaAberta] || <p>Página não encontrada</p>}
            </div>
        </div>
    );
};

export default Pagina;