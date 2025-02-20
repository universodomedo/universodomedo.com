// #region Imports
import { createContext, ReactNode, useContext, useState } from 'react';

import { DadosItem, DadosItemSemIdentificador, Item } from 'Classes/ClassesTipos/index.ts';
// import { ArgsItem, Item, novoItemPorDadosItem, RLJ_Ficha2 } from 'Types/classes/index.ts';
// import { getPersonagemFromContext, getIdFichaNoLocalStorageFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto.tsx';

import PaginaArmas from 'Paginas/Loja/Armas/pagina.tsx';
import PaginaCategorias from 'Paginas/Loja/Categorias/pagina.tsx';
import PaginaComponentes from 'Paginas/Loja/Componentes/pagina.tsx';
// import PaginaConsumiveis from 'Paginas/Loja/Consumiveis/pagina.tsx';
// import PaginaEquipamentos from 'Paginas/Loja/Equipamentos/pagina.tsx';
// import PaginaMochilas from 'Paginas/Loja/Mochilas/pagina.tsx';
// import PaginaUtensilios from 'Paginas/Loja/Utensilios/pagina.tsx';
// import PaginaVestimentas from 'Paginas/Loja/Vestimentas/pagina.tsx';
// #endregion

interface ContextoLojaProps {
    idPaginaAberta: number;
    mudarPagina: (idPagina: number) => void;
    paginas: { [key: number]: ReactNode };
    adicionarItem: (dadosItem: DadosItemSemIdentificador, quantidade?: number) => void;
    removeItem: (item: Item, indexItem: number) => void;
}

export const ContextoLoja = createContext<ContextoLojaProps | undefined>(undefined);

export const ContextoLojaProvider = ({ children }: { children: React.ReactNode }) => {
    const [idPaginaAberta, setIdPaginaAberta] = useState(0);

    const paginas = {
        0: <PaginaCategorias />,
        1: <PaginaComponentes />,
        // 2: <PaginaEquipamentos />,
        // 3: <PaginaVestimentas />,
        // 4: <PaginaUtensilios />,
        // 5: <PaginaMochilas />,
        // 6: <PaginaConsumiveis />,
        // 7: <PaginaArmas />,
    };

    const mudarPagina = (idPagina: number) => { setIdPaginaAberta(idPagina); };

    const adicionarItem = (dadosItem: DadosItemSemIdentificador, quantidade: number = 1) => {

        // verifica peso dobrado, return

        
        // verifica entrando em sobrepeso, confirm


        // verifica categoria, return


        // adiciona










        // const personagem = getPersonagemFromContext();

        // const categoriaDosItemAdicionados = argsItem.args.categoria;
        // const quantidadeDeItensDaCategoriaAtual = personagem.inventario.numeroItensCategoria(categoriaDosItemAdicionados);
        // const quantidadeDeItensDaCategoriaNova = quantidadeDeItensDaCategoriaAtual + quantidade;

        // if (quantidadeDeItensDaCategoriaNova > personagem.estatisticasBuffaveis.gerenciadorEspacoCategoria.maximoItensCategoria(categoriaDosItemAdicionados)) {
        //     alert(`Limite de Itens Categoria ${categoriaDosItemAdicionados} excedido`);
        //     return;
        // }

        // const cargaMaxima = personagem.estatisticasBuffaveis.espacoInventario.espacoTotal;
        // const cargaInventarioAtual = personagem.inventario.espacosUsados;
        // const cargaInventarioNova = cargaInventarioAtual + (argsItem.args.peso * quantidade);

        // if (cargaInventarioNova > (cargaMaxima * 2)) {
        //     alert('Dobro do Limite de Capacidade de Carga está sendo excedido');
        //     return;
        // }

        // if (cargaInventarioAtual <= cargaMaxima && cargaInventarioNova > cargaMaxima) {
        //     const confirmou = window.confirm('O Limite de Capacidade de Carga está sendo excedido, deixando o personagem em Sobrepeso. Deseja continuar?');

        //     if (!confirmou) return;
        // }
        
        // for (let i = 0; i < quantidade; i++) {
        //     personagem.inventario.adicionarItemNoInventario(
        //         novoItemPorDadosItem(argsItem, true)
        //     );
        // }

        // mudarPagina(0);
    };

    const removeItem = (item: Item, indexItem: number) => {
        // item.removeDoInventario();

        // const dadosFicha = localStorage.getItem('dadosFicha');
        // const idFichaNoLocalStorage = getIdFichaNoLocalStorageFromContext();

        // if (dadosFicha) {
        //     const fichas: RLJ_Ficha2[] = JSON.parse(dadosFicha);
        //     const fichaRemovendo = fichas[idFichaNoLocalStorage] || { inventario: [] };

        //     if (fichaRemovendo.inventario && indexItem >= 0 && indexItem < fichaRemovendo.inventario.length) {
        //         fichaRemovendo.inventario.splice(indexItem, 1);
        //     }

        //     fichas[idFichaNoLocalStorage] = fichaRemovendo;
        //     localStorage.setItem('dadosFicha', JSON.stringify(fichas));
        // }
    };

    return (
        <ContextoLoja.Provider value={{ idPaginaAberta, mudarPagina, paginas, adicionarItem, removeItem }}>
            {children}
        </ContextoLoja.Provider>
    );
}

export const useContextoLoja = (): ContextoLojaProps => {
    const context = useContext(ContextoLoja);
    if (!context) throw new Error('useContextoLoja precisa estar dentro de um ContextoLoja');
    return context;
};