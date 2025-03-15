import { obtemDadosMinhaPagina } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';

import MinhaPaginaComDados from './page-dados.tsx';

export default async function MinhaPagina() {
    const respostaDadosMinhaPagina = await obtemDadosMinhaPagina();

    if (!respostaDadosMinhaPagina.sucesso || !respostaDadosMinhaPagina.dados) return <div>Erro ao carregar usuário</div>;

    return <MinhaPaginaComDados dadosMinhaPagina={respostaDadosMinhaPagina.dados} />
};