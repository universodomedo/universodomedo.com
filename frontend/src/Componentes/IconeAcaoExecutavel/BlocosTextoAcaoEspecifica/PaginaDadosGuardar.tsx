import style from 'Recursos/EstilizacaoCompartilhada/detalhes_popover.module.css';

import { Item } from 'Classes/ClassesTipos/index.ts';

const PaginaDadosGuardar = ({ item }: { item: Item }) => {
    const empunhavel = item.comportamentoEmpunhavel!;

    return (
        <>
            <p className={`${style.texto} ${!empunhavel.custoEmpunhar.podeSerPago ? 'cor_mensagem_erro' : ''}`}>Custos para Sacar: {empunhavel.custoEmpunhar.descricaoListaPreco}</p>
            {empunhavel.custoEmpunhar.podeSerPago && (
                <p className={style.texto}>{`Vai gastar ${empunhavel.custoEmpunhar.resumoPagamento}`}</p>
            )}
        </>
    );
}

export default PaginaDadosGuardar;