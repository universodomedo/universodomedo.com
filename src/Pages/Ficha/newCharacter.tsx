import CustomApiCall from "ApiConsumer/ConsumerMiddleware.tsx";

const NewCharacter = async (id:number) => {
    const teste = new CustomApiCall();
    await teste.carregaTiposDano();
    const novoCharacter = teste.fichaPronta(id);

    return novoCharacter;
}

export default NewCharacter;