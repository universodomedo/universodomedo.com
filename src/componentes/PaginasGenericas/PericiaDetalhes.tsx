import { Pericia } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';

type PericiaDetalhesProps = {
    pericia: Pericia;
};

export default function PericiaDetalhes({ pericia }: PericiaDetalhesProps) {
    return (
        <div>
            <h1>{pericia.nome}</h1>
            <p>{pericia.descricao}</p>
            <p>Abreviação: {pericia.nomeAbreviado}</p>
        </div>
    );
}