// #region Imports
import { createContext, ReactNode, useContext, useState } from 'react';

import { dadosItem, Item, novoItemPorDadosItem, RLJ_Ficha2 } from 'Types/classes/index.ts';
import { getPersonagemFromContext, getIdFichaNoLocalStorageFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto.tsx';

import PaginaArmas from './PaginasSecundarias/Armas/page.tsx';
import PaginaCategorias from './PaginasSecundarias/Categorias/page.tsx';
import PaginaComponentes from './PaginasSecundarias/Componentes/page.tsx';
import PaginaConsumiveis from './PaginasSecundarias/Consumiveis/page.tsx';
import PaginaEquipamentos from './PaginasSecundarias/Equipamentos/page.tsx';
import PaginaMochilas from './PaginasSecundarias/Mochilas/page.tsx';
import PaginaUtensilios from './PaginasSecundarias/Utensilios/page.tsx';
import PaginaVestimentas from './PaginasSecundarias/Vestimentas/page.tsx';
// #endregion

interface ContextoLojaProps {
    idPaginaAberta: number;
    mudarPagina: (idPagina: number) => void;
    paginas: { [key: number]: ReactNode };
    adicionarItem: (dadosItem: dadosItem, quantidade?: number) => void;
    removeItem: (item: Item, indexItem: number) => void;
}

export const ContextoLoja = createContext<ContextoLojaProps | undefined>(undefined);

export const useContextoLoja = (): ContextoLojaProps => {
    const context = useContext(ContextoLoja);

    if (!context) {
        throw new Error('useContextoLoja precisa estar dentro de um ContextoLoja');
    }

    return context;
};

export const ContextoLojaProvider = ({ children }: { children: React.ReactNode }) => {
    const [idPaginaAberta, setIdPaginaAberta] = useState(0);

    const paginas = {
        0: <PaginaCategorias />,
        1: <PaginaComponentes />,
        2: <PaginaEquipamentos />,
        3: <PaginaVestimentas />,
        4: <PaginaUtensilios />,
        5: <PaginaMochilas />,
        6: <PaginaConsumiveis />,
        7: <PaginaArmas />,
    };

    const mudarPagina = (idPagina: number) => {
        setIdPaginaAberta(idPagina);
    };

    const adicionarItem = (dadosItem: dadosItem, quantidade: number = 1) => {
        const personagem = getPersonagemFromContext();

        const categoriaDosItemAdicionados = dadosItem.categoria;
        const quantidadeDeItensDaCategoriaAtual = personagem.inventario.numeroItensCategoria(categoriaDosItemAdicionados);
        const quantidadeDeItensDaCategoriaNova = quantidadeDeItensDaCategoriaAtual + quantidade;

        if (quantidadeDeItensDaCategoriaNova > personagem.estatisticasBuffaveis.gerenciadorEspacoCategoria.maximoItensCategoria(categoriaDosItemAdicionados)) {
            alert(`Limite de Itens Categoria ${categoriaDosItemAdicionados} excedido`);
            return;
        }

        const cargaMaxima = personagem.estatisticasBuffaveis.espacoInventario.espacoTotal;
        const cargaInventarioAtual = personagem.inventario.espacosUsados;
        const cargaInventarioNova = cargaInventarioAtual + (dadosItem.peso * quantidade);

        if (cargaInventarioNova > (cargaMaxima * 2)) {
            alert('Dobro do Limite de Capacidade de Carga está sendo excedido');
            return;
        }

        if (cargaInventarioAtual <= cargaMaxima && cargaInventarioNova > cargaMaxima) {
            const confirmou = window.confirm('O Limite de Capacidade de Carga está sendo excedido, deixando o personagem em sobrepeso. Deseja continuar?');

            if (!confirmou) return;
        }
        
        for (let i = 0; i < quantidade; i++) {
            personagem.inventario.adicionarItemNoInventario(
                novoItemPorDadosItem(dadosItem, true)
            );
        }

        mudarPagina(0);
    };

    const removeItem = (item: Item, indexItem: number) => {

        item.removeDoInventario();

        const dadosFicha = localStorage.getItem('dadosFicha');
        const idFichaNoLocalStorage = getIdFichaNoLocalStorageFromContext();

        if (dadosFicha) {
            const fichas: RLJ_Ficha2[] = JSON.parse(dadosFicha);
            const fichaRemovendo = fichas[idFichaNoLocalStorage] || { inventario: [] };

            if (fichaRemovendo.inventario && indexItem >= 0 && indexItem < fichaRemovendo.inventario.length) {
                fichaRemovendo.inventario.splice(indexItem, 1);
            }

            fichas[idFichaNoLocalStorage] = fichaRemovendo;
            localStorage.setItem('dadosFicha', JSON.stringify(fichas));
        }
    };

    return (
        <ContextoLoja.Provider value={{ idPaginaAberta, mudarPagina, paginas, adicionarItem, removeItem }}>
            {children}
        </ContextoLoja.Provider>
    );
}