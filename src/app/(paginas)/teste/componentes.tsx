'use client';

import { ContextoTesteGraphql__Provider, useContextoTesteGraphql } from "Contextos/ContextoTesteGraphql/contexto";

export default function PageTesteGraphql_Client() {
    return (
        <ContextoTesteGraphql__Provider>
            <PageTesteGraphql_Contexto />
        </ContextoTesteGraphql__Provider>
    );
};

function PageTesteGraphql_Contexto() {
    const { respostaSessaoGraphql, respostaSessaoGraphqlBasica, respostaTesteRest, carregando, erro } = useContextoTesteGraphql();

    return (
        <>
            <h1>Testando GraphQL</h1>

            {carregando && <p>Carregando API...</p>}

            {erro && <p>Erro: {erro}</p>}

            {respostaSessaoGraphql && <p>Resposta Sessão GraphQL: {respostaSessaoGraphql}</p>}

            {respostaSessaoGraphqlBasica && <p>Resposta Sessão GraphQL Básica: {respostaSessaoGraphqlBasica}</p>}

            {respostaTesteRest && <p>Resposta REST: {respostaTesteRest}</p>}
        </>
    );
};