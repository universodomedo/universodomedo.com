import { Atributo } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';

type AtributoDetalhesProps = {
    atributo: Atributo;
};

export default function AtributoDetalhes({ atributo }: AtributoDetalhesProps) {
    return (
        <div>
            <h1>{atributo.nome}</h1>
            <p>{atributo.descricao}</p>
            <p>Abreviação: {atributo.nomeAbreviado}</p>
        </div>
    );
}