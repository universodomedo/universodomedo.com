// #region Imports
import { createContext, ReactNode, useContext, useState } from 'react';

import { DadosItemSemIdentificador, Item } from 'Classes/ClassesTipos/index.ts';

import { useClasseContextualPersonagemEstatisticasBuffaveis } from 'Classes/ClassesContextuais/PersonagemEstatisticasBuffaveis';
import { useClasseContextualPersonagemInventario } from 'Classes/ClassesContextuais/PersonagemInventario';

import PaginaArmas from 'Paginas/Loja/Armas/pagina.tsx';
import PaginaCategorias from 'Paginas/Loja/Categorias/pagina.tsx';
import PaginaComponentes from 'Paginas/Loja/Componentes/pagina.tsx';
import PaginaConsumiveis from 'Paginas/Loja/Consumiveis/pagina.tsx';
import PaginaEquipamentos from 'Paginas/Loja/Equipamentos/pagina.tsx';
import PaginaMochilas from 'Paginas/Loja/Mochilas/pagina.tsx';
import PaginaUtensilios from 'Paginas/Loja/Utensilios/pagina.tsx';
import PaginaVestimentas from 'Paginas/Loja/Vestimentas/pagina.tsx';
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

    const { capacidadeDeCarga, espacosCategoria } = useClasseContextualPersonagemEstatisticasBuffaveis();
    const { inventario } = useClasseContextualPersonagemInventario();

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

    const mudarPagina = (idPagina: number) => { setIdPaginaAberta(idPagina); };

    const adicionarItem = (dadosItem: DadosItemSemIdentificador, quantidade: number = 1) => {
        const valorCategoriaSendoAdicionada = dadosItem.categoria;
        const categoriaSendoAdicionada = espacosCategoria.find(categoria => categoria.refTipoCategoria.valorCategoria === valorCategoriaSendoAdicionada);
        const quantidadeAtualDeItensDaCategoriaSendoAdicionada = inventario.numeroItensCategoria(valorCategoriaSendoAdicionada);
        const quantidadeAtualizadaDeItensDaCategoriaSendoAdicionada = quantidadeAtualDeItensDaCategoriaSendoAdicionada + quantidade;

        const cargaAtual = inventario.espacosUsados;
        const capacidadeMaximaSemSobrepeso = capacidadeDeCarga.capacidadeTotal;
        const capacidadeMaximaEmSobrepeso = capacidadeMaximaSemSobrepeso * 2;
        const cargaSendoAdicionada = dadosItem.peso * quantidade;
        const cargaAtualizada = cargaAtual + cargaSendoAdicionada;


        if (categoriaSendoAdicionada && (quantidadeAtualizadaDeItensDaCategoriaSendoAdicionada > categoriaSendoAdicionada.maximoDeItensDessaCategoria)) {
            alert(`Limite de Itens Categoria ${valorCategoriaSendoAdicionada} excedido`);
            return;
        }

        if (cargaAtualizada > capacidadeMaximaEmSobrepeso) {
            alert('Dobro do Limite de Capacidade de Carga está sendo excedido');
            return;
        }

        if (cargaAtual <= capacidadeMaximaSemSobrepeso && cargaAtualizada > capacidadeMaximaSemSobrepeso) {
            const confirmou = window.confirm('O Limite de Capacidade de Carga está sendo excedido, deixando o personagem em Sobrepeso. Deseja continuar?');

            if (!confirmou) return;
        }

        for (let i = 0; i < quantidade; i++) {
            inventario.adicionarItem(dadosItem);
        }

        mudarPagina(0);
    };

    const removeItem = (item: Item, indexItem: number) => {

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