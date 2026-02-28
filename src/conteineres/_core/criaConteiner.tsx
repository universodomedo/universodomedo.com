'use client';

import { ComponentType } from 'react';

/*
Arquitetura do pattern de Conteiner (Fluxo)

Este helper existe para padronizar "conteineres" de fluxo da aplicação.
Um conteiner NÃO é uma página visual e NÃO é um contexto.
Ele é o entrypoint de uma feature/fluxo no client, responsável por:

1) Obter o estado bruto da feature (via hooks, WS, API, etc.)
2) Rotear/decidir qual branch/subfluxo deve ser renderizado
3) Retornar um componente final (<Pagina />) já parametrizado

A separação de responsabilidades esperada é:

- useEstado:
  Concentra hooks e aquisição de estado bruto do fluxo.
  Ex.: useState, hooks de websocket, chamadas de hooks customizados etc.

- resolveComponente:
  Recebe os dados retornados por useEstado e decide qual componente React
  será renderizado (normalmente um Provider de contexto específico de branch).

- Páginas/Contextos específicos:
  Ficam fora do conteiner. O conteiner só orquestra o fluxo.
*/

/*
Uso esperado (padrão obrigatório para novos conteineres)

1) Defina o tipo de props/estado bruto do conteiner
   type PropsConteiner__X = { ... };

2) Crie a função useEstado()
   - Deve retornar exatamente PropsConteiner__X
   - Deve concentrar a lógica de hooks do conteiner

3) Crie a função resolveComponente(props)
   - Recebe PropsConteiner__X
   - Retorna um ComponentType (branch já decidido)

4) Exporte o conteiner com criaConteiner(...)
   export const Conteiner__X = criaConteiner<PropsConteiner__X>({ useEstado, resolveComponente });

Exemplo resumido:

type PropsConteiner__Exemplo = { ativo: boolean };

function useEstado(): PropsConteiner__Exemplo {
    return { ativo: true };
}

function resolveComponente(props: PropsConteiner__Exemplo): ComponentType {
    return props.ativo ? ComponenteAtivo : ComponenteInativo;
}

export const Conteiner__Exemplo = criaConteiner<PropsConteiner__Exemplo>({ useEstado, resolveComponente });
*/

type DefinicaoConteiner<TProps> = {
    useEstado: () => TProps;
    resolveComponente: (props: TProps) => ComponentType;
};

export function criaConteiner<TProps>({ useEstado, resolveComponente }: DefinicaoConteiner<TProps>) {
    return function Conteiner() {
        const props = useEstado();
        const Pagina = resolveComponente(props);

        return <Pagina />;
    };
};