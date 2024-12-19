// #region Imports
import style from './style.module.css';
import { useState, useEffect } from 'react';

import { RLJ_Ficha2 } from 'Types/classes/index.ts';
import { ContextoLojaProvider, useContextoLoja } from 'Pages/Shop/contexto.tsx';
import { ContextoFichaProvider, getPersonagemFromContext, useContextoFicha, useContextBridge } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto.tsx';

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
    const location = useLocation();
    const navigate = useNavigate();

    const { personagem } = useContextoFicha();

    const indexFicha = location.state?.indexFicha;
    const quantidadeItemsCat1 = personagem.inventario.items.filter(item => item.categoria === 1).length || 0;
    const cargaInventario = personagem.inventario.espacosUsados;

    const { idPaginaAberta, mudarPagina, paginas } = useContextoLoja();

    useEffect(() => {
        // atualizaInventario();
    }, []);

    const atualizaInventario = () => {
        // const dadosFicha = localStorage.getItem('dadosFicha');

        // if (dadosFicha) {
        //     const fichas: RLJ_Ficha2[] = JSON.parse(dadosFicha);
        //     setFichaAtual(fichas[indexFicha] || { inventario: [] });
        // }
    };

    const removeItem = (index: number) => {
        const dadosFicha = localStorage.getItem('dadosFicha');

        if (dadosFicha) {
            const fichas: RLJ_Ficha2[] = JSON.parse(dadosFicha);
            const fichaRemovendo = fichas[indexFicha] || { inventario: [] };

            if (fichaRemovendo.inventario && index >= 0 && index < fichaRemovendo.inventario.length) {
                fichaRemovendo.inventario.splice(index, 1);
            }

            fichas[indexFicha] = fichaRemovendo;
            localStorage.setItem('dadosFicha', JSON.stringify(fichas));
            atualizaInventario();
        }
    };

    return (
        <div className={style.shopping}>
            <h1>Shopping</h1>

            <div className={style.div_geral}>
                <div className={style.div_inventario}>
                    <h2>Inventário Atual</h2>

                    <div className={style.dados_inventario}>
                        <p>Capacidade de Carga: {cargaInventario}/{personagem.estatisticasBuffaveis.espacoInventario.espacoTotal}</p>
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
                                        <FontAwesomeIcon className={style.remove_item} title={'Remover Item'} icon={faTrash} onClick={() => { removeItem(index) }} />
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