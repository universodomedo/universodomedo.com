import style from 'Recursos/EstilizacaoCompartilhada/detalhes_popover.module.css';

import { Item, pluralize } from 'Classes/ClassesTipos/index.ts';

const PaginaDadosSacar = ({ item }: { item: Item }) => {
    const empunhavel = item.comportamentoEmpunhavel!;

    return (
        <>
            <p className={`${style.texto} ${!empunhavel.custoEmpunhar.podeSerPago ? 'cor_mensagem_erro' : ''}`}>Custos para Sacar: {empunhavel.custoEmpunhar.descricaoListaPreco}</p>
            <p className={`${style.texto} ${!empunhavel.extremidadeLivresSuficiente ? 'cor_mensagem_erro' : ''}`}>{`${pluralize(empunhavel.extremidadesNecessarias, 'Extremidade')} para Empunhar: ${empunhavel.extremidadesNecessarias}`}</p>
            {empunhavel.custoEmpunhar.podeSerPago && (
                <p className={style.texto}>{`Vai gastar ${empunhavel.custoEmpunhar.resumoPagamento}`}</p>
            )}
        </>
    );
}

export default PaginaDadosSacar;