'use client';

import { ContextoTesteGraphql__Provider, useContextoTesteGraphql } from 'Contextos/ContextoTesteGraphql/contexto';

export default function PageTesteGraphql_Client() {
    return (
        <ContextoTesteGraphql__Provider>
            <PageTesteGraphql_Contexto />
        </ContextoTesteGraphql__Provider>
    );
};

function PageTesteGraphql_Contexto() {
    const { respostaSessaoGraphql, respostaSessoesGraphql, respostaSessoesGraphqlOr, respostaSessoesGraphqlOffset, respostaSessoesGraphqlOperadores, respostaSessoesGraphqlRange, respostaErroEsperadoGraphql, respostaTesteRest, carregando, erro, testaErroEsperadoGraphql } = useContextoTesteGraphql();

    return (
        <>
            <h1>Testando GraphQL</h1>

            {carregando && <p>Carregando API...</p>}

            {erro && <p>Erro: {erro}</p>}

            {respostaSessaoGraphql && <p>Resposta Sessão GraphQL: {respostaSessaoGraphql}</p>}

            {respostaSessoesGraphql && <p>Resposta Sessões GraphQL: {respostaSessoesGraphql}</p>}

            {respostaSessoesGraphqlOr && <p>Resposta Sessões GraphQL OR: {respostaSessoesGraphqlOr}</p>}

            {respostaSessoesGraphqlOffset && <p>Resposta Sessões GraphQL Offset: {respostaSessoesGraphqlOffset}</p>}

            {respostaSessoesGraphqlOperadores && <p>Resposta Sessões GraphQL Operadores: {respostaSessoesGraphqlOperadores}</p>}

            {respostaSessoesGraphqlRange && <p>Resposta Sessões GraphQL Range: {respostaSessoesGraphqlRange}</p>}

            <button type="button" onClick={() => testaErroEsperadoGraphql().catch(() => undefined)}>Testar erro esperado GraphQL</button>

            {respostaErroEsperadoGraphql && <p>Resposta Erro Esperado GraphQL: {respostaErroEsperadoGraphql}</p>}

            {respostaTesteRest && <p>Resposta REST: {respostaTesteRest}</p>}
        </>
    );
};