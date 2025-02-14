// #region Imports
import style from 'Recursos/EstilizacaoCompartilhada/detalhes_popover.module.css';
import { useState } from 'react';

import { Item, pluralize } from 'Classes/ClassesTipos/index.ts'
import { useContextoControleInventario } from 'Contextos/ContextoControleInventario/contexto.tsx';

import Tooltip from 'Componentes/Tooltip/pagina.tsx';
import Modal from 'Componentes/ModalDialog/pagina.tsx';
// #endregion

const pagina = ({ item }: { item: Item }) => {
    const [openDetalhes, setOpenDetalhes] = useState(false);

    return (
        <Modal open={openDetalhes} onOpenChange={setOpenDetalhes}>
            <Modal.Button>
                <Icone item={item} />
            </Modal.Button>

            <Modal.Content title={`${item.nome.nomeExibicao}`}>
                <ConteudoDetalhes item={item} />
            </Modal.Content>
        </Modal>
    );
}

const Icone = ({ item }: { item: Item }) => {
    const { mostrarEtiquetas } = useContextoControleInventario();

    return (
        <div className={style.embrulho_icone}>
            {mostrarEtiquetas && (<h3>{item.nome.nomeExibicao}</h3>)}
            <Tooltip>
                <Tooltip.Trigger>
                    <div className={`${style.icone_item}`}>
                        <img src={`data:image/svg+xml;base64,${item.svg}`} />
                        {item.quantidadeUnidadesDesseItem > 1 && (
                            <span className={style.quantidade_agrupada}>{`x${item.quantidadeUnidadesDesseItem}`}</span>
                        )}
                    </div>
                </Tooltip.Trigger>
                <Tooltip.Content>
                    <h3>{item.nome.nomeExibicao}</h3>
                </Tooltip.Content>
            </Tooltip>
        </div>
    );
}

const ConteudoDetalhes = ({ item }: { item: Item }) => {
    return (
        <>
            {item.itemEstaEmpunhado && (
                <div className={style.bloco_texto}>
                    <p>Item está Empunhado!</p>
                </div>
            )}
            {item.itemEmpunhavel && (
                <div className={style.bloco_texto}>
                    <p className={style.titulo}>Item Empunhavel</p>
                    <p className={style.texto_details}>Custo do Saque: precisa implementar</p>
                    {/* <p className={style.texto_details}>Custo do Saque: {item.comportamentoEmpunhavel!.precoEmpunhar.descricaoCusto}</p> */}
                    <p className={style.texto_details}>Empunhado com {item.comportamentoEmpunhavel!.extremidadesNecessarias} {pluralize(item.comportamentoEmpunhavel!.extremidadesNecessarias, 'Extremidade')}</p>
                </div>
            )}
            {item.itemVestivel && (
                <div className={style.bloco_texto}>
                    <p className={style.titulo}>Item Vestível</p>
                    <p className={style.texto_details}>Custo de Vestir: precisa implementar</p>
                    {/* <p className={style.texto_details}>Custo de Vestir: {item.comportamentoVestivel!.precoVestir.descricaoListaPreco}</p> */}
                </div>
            )}
        </>
    );
}

export default pagina;