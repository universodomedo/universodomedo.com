'use client';

import { ComponentType, ReactElement } from 'react';

/*
Arquitetura do pattern de Conteiner (Fluxo)

Este helper existe para padronizar os "conteineres" de fluxo da aplicação.
Um conteiner NÃO é uma página visual e NÃO é um contexto.
Ele é o entrypoint client-side de uma feature/fluxo, responsável por:

1) Obter o estado bruto da feature (hooks, WS, API, etc.)
2) Decidir qual branch/subfluxo deve ser seguido
3) Retornar a saída final do conteiner já pronta para renderização

A separação de responsabilidades esperada é:

- useEstado:
  Concentra hooks e aquisição de estado bruto do fluxo.
  Ex.: useState, hooks de websocket, hooks customizados, etc.

- resolveSaida:
  Recebe o estado bruto retornado por useEstado e decide qual branch final
  do fluxo será renderizada.

- Páginas/Contextos específicos:
  Ficam fora do conteiner. O conteiner apenas orquestra o fluxo.
*/

/*
Uso esperado (padrão obrigatório para novos conteineres)

1) Defina o tipo de estado bruto do conteiner
   type PropsConteiner__X = { ... };

2) Crie a função useEstado()
   - Deve retornar exatamente PropsConteiner__X
   - Deve concentrar a lógica de hooks do conteiner

3) Crie a função resolveSaida(props)
   - Recebe PropsConteiner__X
   - Deve retornar a saída final do conteiner já parametrizada

4) Exporte o conteiner com criaConteiner(...)
   export const Conteiner__X = criaConteiner<PropsConteiner__X>({ useEstado, resolveSaida });

Exemplo resumido:

type PropsConteiner__Exemplo = { ativo: boolean };

function useEstado(): PropsConteiner__Exemplo {
    return { ativo: true };
}

function resolveSaida(props: PropsConteiner__Exemplo) {
    if (props.ativo) return criaSaidaConteiner(ComponenteAtivo, {});
    return criaSaidaConteiner(ComponenteInativo, {});
}

export const Conteiner__Exemplo = criaConteiner<PropsConteiner__Exemplo>({ useEstado, resolveSaida });
*/

export type SaidaConteiner = {
    render: () => ReactElement;
};

type DefinicaoConteiner<TPropsEstado extends object> = {
    useEstado: () => TPropsEstado;
    resolveSaida: (props: TPropsEstado) => SaidaConteiner;
};

export function criaSaidaConteiner<TProps extends object>(Componente: ComponentType<TProps>, props: TProps): SaidaConteiner {
    return { render: () => <Componente {...props} /> };
};

export function criaConteiner<TPropsEstado extends object>({ useEstado, resolveSaida }: DefinicaoConteiner<TPropsEstado>) {
    return function Conteiner() {
        const props = useEstado();
        return resolveSaida(props).render();
    };
};