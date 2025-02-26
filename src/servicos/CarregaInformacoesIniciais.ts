import CustomApiCall, { Atributo, Pericia } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';

const api = new CustomApiCall();

type AllEntities = {
    atributos: Atributo[];
    pericias: Pericia[];
};

export const CarregaInformacoesIniciais = async (): Promise<AllEntities> => {
    const [atributosResponse, periciasResponse] = await Promise.all([
        api.obterAtributos(),
        api.obterPericias(),
    ]);

    const atributos = atributosResponse.sucesso ? atributosResponse.dados : [];
    const pericias = periciasResponse.sucesso ? periciasResponse.dados : [];

    return {
        atributos,
        pericias,
    };
};