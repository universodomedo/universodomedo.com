// #region Imports
import style from './style.module.css';
import { useState } from 'react';

import { ContextoLojaProvider, useContextoLoja } from 'Pages/Shop/contexto.tsx';
import { ContextoFichaProvider, getPersonagemFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto.tsx';

import { useNavigate, useLocation } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
// #endregion

const page = () => {
    const location = useLocation();
    const indexFicha = location.state?.indexFicha;

    return (
        <ContextoFichaProvider idFichaNoLocalStorage={indexFicha}>
            <ContextoLojaProvider>
                <PageComContexto />
            </ContextoLojaProvider>
        </ContextoFichaProvider>
    )
}

const PageComContexto = () => {
    const [_, setState] = useState({});
    const navigate = useNavigate();
    
    const { idPaginaAberta, paginas, removeItem } = useContextoLoja();

    const personagem = getPersonagemFromContext();
    personagem.carregaOnUpdate(() => setState({}));

    personagem.inventario.items.forEach(item => {
        if (item.buffs.some(buffDoItem => buffDoItem.refBuff.id === 52)) {
            item.vestir();
        }
    });

    return (
        <div className={style.shopping}>
            <h1>Shopping</h1>

            <div className={style.div_geral}>
                <div className={style.div_inventario}>
                    <h2>Inventário Atual</h2>

                    <div className={style.dados_inventario}>
                        <p>Capacidade de Carga: {personagem.inventario.espacosUsados}/{personagem.estatisticasBuffaveis.espacoInventario.espacoTotal}</p>
                        {personagem.estatisticasBuffaveis.gerenciadorEspacoCategoria.espacosCategoria.map((categoria, index) => (
                            <p key={index}>Itens {categoria.nomeCategoria}: {personagem.inventario.numeroItensCategoria(categoria.valorCategoria)}/{personagem.estatisticasBuffaveis.gerenciadorEspacoCategoria.maximoItensCategoria(categoria.valorCategoria)}</p>
                        ))}
                    </div>

                    {personagem.inventario.items.length > 0 ? (
                        <div className={style.embrulho_inventario_atual}>
                            <div className={style.inventario_atual}>
                                {personagem.inventario.items.map((item, index) => (
                                    <div key={index} className={style.linha_item}>
                                        <h3>{item.nomeExibicao}</h3>
                                        {/* <FontAwesomeIcon className={style.remove_item} title={'Remover Item'} icon={faTrash} onClick={() => { item.removeDoInventario(); }} /> */}
                                        <FontAwesomeIcon className={style.remove_item} title={'Remover Item'} icon={faTrash} onClick={() => { removeItem(item, index) }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <h3>Inventário Vazio</h3>
                    )}
                </div>

                <div className={style.div_shopping}>
                    {paginas[idPaginaAberta] || <p>Página não encontrada</p>}
                </div>
            </div>

            <div className={style.linha_botoes}>
                <button onClick={() => { navigate('/pagina-interna'); }}>Fichas</button>
            </div>
        </div>
    );
}

export default page;