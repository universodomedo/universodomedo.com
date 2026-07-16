'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaColaboradorPainelDoMedo__Props, Contexto__PaginaColaboradorPainelDoMedo__Provider, useContexto__PaginaColaboradorPainelDoMedo } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';
import { Contexto__PaginaColaboradorPainelDoMedo__CadastroObjetivo__Provider } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo__CadastroObjetivo/contexto';
import { Contexto__PaginaColaboradorPainelDoMedo__FichaCard__Provider } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo__FichaCard/contexto';
import { Contexto__PaginaColaboradorPainelDoMedo__EdicaoCard__Provider } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo__EdicaoCard/contexto';
import { Contexto__PaginaColaboradorPainelDoMedo__AplicarEtiqueta__Provider } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo__AplicarEtiqueta/contexto';
import { Contexto__PaginaColaboradorPainelDoMedo__CriarEtiqueta__Provider } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo__CriarEtiqueta/contexto';
import { Contexto__PaginaColaboradorPainelDoMedo__AdicionarItemChecklist__Provider } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo__AdicionarItemChecklist/contexto';
import { Contexto__PaginaColaboradorPainelDoMedo__AdicionarDependencia__Provider } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo__AdicionarDependencia/contexto';
import { Contexto__PaginaColaboradorPainelDoMedo__TrancarCartao__Provider } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo__TrancarCartao/contexto';
import { Contexto__PaginaColaboradorPainelDoMedo__EdicaoObjetivo__Provider } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo__EdicaoObjetivo/contexto';
import { Contexto__PaginaColaboradorPainelDoMedo__ExcluirObjetivo__Provider } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo__ExcluirObjetivo/contexto';
import { Contexto__PaginaColaboradorPainelDoMedo__PermissoesObjetivo__Provider } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo__PermissoesObjetivo/contexto';
import SPA__PaginaColaboradorPainelDoMedo__ListagemObjetivos from 'Conteineres/PaginaColaboradorPainelDoMedo/paginas/SPA__PaginaColaboradorPainelDoMedo__ListagemObjetivos/SPA__PaginaColaboradorPainelDoMedo__ListagemObjetivos';
import SPA__PaginaColaboradorPainelDoMedo__Quadro from 'Conteineres/PaginaColaboradorPainelDoMedo/paginas/SPA__PaginaColaboradorPainelDoMedo__Quadro/SPA__PaginaColaboradorPainelDoMedo__Quadro';
import SPA__PaginaColaboradorPainelDoMedo__Fluxograma from 'Conteineres/PaginaColaboradorPainelDoMedo/paginas/SPA__PaginaColaboradorPainelDoMedo__Fluxograma/SPA__PaginaColaboradorPainelDoMedo__Fluxograma';

export function Conteiner__PaginaColaboradorPainelDoMedo() {
    return (
        <Contexto__PaginaColaboradorPainelDoMedo__Provider>
            <Conteiner__PaginaColaboradorPainelDoMedo__Interno />
        </Contexto__PaginaColaboradorPainelDoMedo__Provider>
    );
};

export const Conteiner__PaginaColaboradorPainelDoMedo__Interno = criaConteiner<PropsConteiner__PaginaColaboradorPainelDoMedo>({ useEstado, resolveSaida });

type PropsConteiner__PaginaColaboradorPainelDoMedo = Contexto__PaginaColaboradorPainelDoMedo__Props;

function resolveSaida(props: PropsConteiner__PaginaColaboradorPainelDoMedo): SaidaConteiner {
    if (props.operacaoCard !== null) {
        // Cada operacao do card (que muda composicao / da input) roda em seu proprio Conteiner+Contexto+SPA, com foco unico.
        switch (props.operacaoCard.tipo) {
            case 'editar-titulo': return criaSaidaConteiner(Contexto__PaginaColaboradorPainelDoMedo__EdicaoCard__Provider, {});
            case 'aplicar-etiqueta': return criaSaidaConteiner(Contexto__PaginaColaboradorPainelDoMedo__AplicarEtiqueta__Provider, {});
            case 'criar-etiqueta': return criaSaidaConteiner(Contexto__PaginaColaboradorPainelDoMedo__CriarEtiqueta__Provider, {});
            case 'adicionar-item-checklist': return criaSaidaConteiner(Contexto__PaginaColaboradorPainelDoMedo__AdicionarItemChecklist__Provider, {});
            case 'adicionar-dependencia': return criaSaidaConteiner(Contexto__PaginaColaboradorPainelDoMedo__AdicionarDependencia__Provider, {});
            case 'trancar-cartao': return criaSaidaConteiner(Contexto__PaginaColaboradorPainelDoMedo__TrancarCartao__Provider, {});
        }
    }
    if (props.cardAbertoId !== null) return criaSaidaConteiner(Contexto__PaginaColaboradorPainelDoMedo__FichaCard__Provider, {});
    if (props.operacaoObjetivo !== null) {
        // Operacoes do objetivo (acionadas pela AreaBotoes do quadro): cada processo em SPA propria, foco unico.
        switch (props.operacaoObjetivo.tipo) {
            case 'editar-objetivo': return criaSaidaConteiner(Contexto__PaginaColaboradorPainelDoMedo__EdicaoObjetivo__Provider, {});
            case 'excluir-objetivo': return criaSaidaConteiner(Contexto__PaginaColaboradorPainelDoMedo__ExcluirObjetivo__Provider, {});
            case 'permissoes-objetivo': return criaSaidaConteiner(Contexto__PaginaColaboradorPainelDoMedo__PermissoesObjetivo__Provider, {});
        }
    }
    if (props.pagina === 'cadastroObjetivo') return criaSaidaConteiner(Contexto__PaginaColaboradorPainelDoMedo__CadastroObjetivo__Provider, {});
    if (props.pagina === 'quadro') return criaSaidaConteiner(SPA__PaginaColaboradorPainelDoMedo__Quadro, {});
    if (props.pagina === 'fluxograma') return criaSaidaConteiner(SPA__PaginaColaboradorPainelDoMedo__Fluxograma, {});
    return criaSaidaConteiner(SPA__PaginaColaboradorPainelDoMedo__ListagemObjetivos, {});
};

function useEstado(): PropsConteiner__PaginaColaboradorPainelDoMedo { return useContexto__PaginaColaboradorPainelDoMedo(); };
