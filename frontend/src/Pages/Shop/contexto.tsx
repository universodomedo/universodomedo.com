// #region Imports
import { createContext, ReactNode, useContext, useState } from 'react';

import { dadosItem, novoItemPorDadosItem } from 'Types/classes/index.ts';
import { getPersonagemFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto.tsx';

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
    adicionarItem: (dadosItem: dadosItem, quantidade: number) => void;
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

    const mudarPagina = (idPagina: number) => {
        setIdPaginaAberta(idPagina);
    };

    return (
        <ContextoLoja.Provider value={{ idPaginaAberta, mudarPagina, paginas, adicionarItem }}>
            {children}
        </ContextoLoja.Provider>
    );
}