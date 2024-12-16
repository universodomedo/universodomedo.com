// #region Imports
import { createContext, ReactNode, useContext, useState } from 'react';

import { dadosItem, RLJ_Ficha2 } from 'Types/classes/index.ts';

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
        const dadosFicha = localStorage.getItem('dadosFicha');

        if (dadosFicha) {
            const fichas: RLJ_Ficha2[] = JSON.parse(dadosFicha);
            const fichaAtualizada = fichas[indexFicha] || { inventario: [] };

            const novaQuantidadeItemsCat1 = quantidadeItemsCat1 + (dadosItem.categoria * quantidade);

            if (novaQuantidadeItemsCat1 > 2) {
                alert('Limite de itens da categoria 1 excedido');
                return;
            }

            const novaCargaInventario = cargaInventario + (dadosItem.peso * quantidade);

            if (novaCargaInventario > 30) {
                alert('Dobro do Limite de Capacidade de Carga está sendo excedido');
                return;
            }

            if (cargaInventario <= 15 && novaCargaInventario > 15) {
                const confirmou = window.confirm(
                    'O Limite de Capacidade de Carga está sendo excedido, deixando o personagem em sobrepeso. Deseja continuar?'
                );
                if (!confirmou) return;
            }

            fichaAtualizada.inventario = [
                ...(fichaAtualizada.inventario || []),
                ...Array(quantidade).fill(dadosItem),
            ];

            fichas[indexFicha] = fichaAtualizada;
            localStorage.setItem('dadosFicha', JSON.stringify(fichas));
            atualizaInventario();
            mudarPagina(0);
        }
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