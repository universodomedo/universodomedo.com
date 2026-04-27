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
    const { respostaSessaoGraphql, respostaSessaoGraphqlBasica, respostaSessaoGraphqlV2Basica, respostaSessaoGraphqlV2Resumo, respostaTesteRest, carregando, erro } = useContextoTesteGraphql();

    return (
        <>
            <h1>Testando GraphQL</h1>

            {carregando && <p>Carregando API...</p>}

            {erro && <p>Erro: {erro}</p>}

            {respostaSessaoGraphql && <p>Resposta Sessão GraphQL: {respostaSessaoGraphql}</p>}

            {respostaSessaoGraphqlBasica && <p>Resposta Sessão GraphQL Básica: {respostaSessaoGraphqlBasica}</p>}

            {respostaSessaoGraphqlV2Basica && <p>Resposta Sessão GraphQL V2 Básica: {respostaSessaoGraphqlV2Basica}</p>}

            {respostaSessaoGraphqlV2Resumo && <p>Resposta Sessão GraphQL V2 Resumo: {respostaSessaoGraphqlV2Resumo}</p>}

            {respostaTesteRest && <p>Resposta REST: {respostaTesteRest}</p>}
        </>
    );
};