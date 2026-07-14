'use client';

import styles from './styles.module.css';

import { useMemo } from 'react';

import { Componente_Selecionador } from 'Componentes/Selecionadores/Componente_Selecionador/Componente_Selecionador';
import { ListagemCompostaModoExibicao, type ListagemCompostaListagem } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import type { ElementoDoMapaJogavel } from 'Funcionalidades/MapaJogavel/mapaJogavel.helpers';

type Props = {
    elementos: readonly ElementoDoMapaJogavel[];
    carregando: boolean;
    aoConfirmar: (elemento: ElementoDoMapaJogavel) => void;
    aoCancelar: () => void;
};

// Seleção de UM elemento do mapa (objeto autorado no Editor 3D) pra virar interagível — instância do Componente_Selecionador
// com fonte local (a cena do mapa já carregada); card = nome + dimensões derivadas do bbox.
export default function SPA__PaginaGameDesignerConfiguracaoPartida__Editor__SelecaoElementoMapa({ elementos, carregando, aoConfirmar, aoCancelar }: Props) {
    const listagem: ListagemCompostaListagem<ElementoDoMapaJogavel> = useMemo(() => ({ registros: elementos, carregando: carregando ? 'Carregando o mapa' : null, erro: null, mensagemListaVazia: 'Nenhum elemento disponível — todos os objetos do mapa já viraram interagíveis (ou o mapa está vazio).' }), [elementos, carregando]);

    return (
        <Componente_Selecionador
            listagem={listagem}
            obterIdRegistro={elemento => elemento.idLocal}
            modoExibicao={ListagemCompostaModoExibicao.GRADE}
            itensPorLinha={3}
            renderizarItem={elemento => (
                <div className={styles.item_elemento}>
                    <span className={styles.nome}>{elemento.nome}</span>
                    <small className={styles.dimensoes}>{(elemento.larguraMilimetros / 1000).toFixed(1)}m × {(elemento.alturaMilimetros / 1000).toFixed(1)}m × {(elemento.profundidadeMilimetros / 1000).toFixed(1)}m</small>
                </div>
            )}
            aoConfirmar={aoConfirmar}
            aoCancelar={aoCancelar}
            textoConfirmar="Usar este elemento"
        />
    );
};
