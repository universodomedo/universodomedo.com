import AtributoDetalhes from './AtributoDetalhes';
import PericiaDetalhes from './PericiaDetalhes';

type DefinicaoGenericaProps = {
    tipo: string;
    dados: any;
};

export default function DefinicaoGenerica({ tipo, dados }: DefinicaoGenericaProps) {
    switch (tipo) {
        case 'atributos':
            return <AtributoDetalhes atributo={dados} />;
        case 'pericias':
            return <PericiaDetalhes pericia={dados} />;
        default:
            return <div>Tipo de definição não suportado</div>;
    }
}