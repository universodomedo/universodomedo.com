// #region Imports
import style from 'Recursos/EstilizacaoCompartilhada/detalhes_popover.module.css';
import { useState } from 'react';

import { Item, pluralize } from 'Classes/ClassesTipos/index.ts'
import { useContextoControleInventario } from 'Contextos/ContextoControleInventario/contexto.tsx';

import Tooltip from 'Componentes/Tooltip/pagina.tsx';
import Modal from 'Componentes/ModalDialog/pagina.tsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandBackFist as faHandBackFistSolid, faVest, faWandSparkles } from '@fortawesome/free-solid-svg-icons';
import { faHandBackFist as faHandBackFistRegular } from '@fortawesome/free-regular-svg-icons';
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
            <div className={style.recipiente_icones}>
                {item.itemEstaEmpunhado ? (
                    <FontAwesomeIcon icon={faHandBackFistSolid} title={'Empunhado'} style={{color: '#92D8F9'}} />
                ) : item.itemEmpunhavel ? (
                    <FontAwesomeIcon icon={faHandBackFistRegular} title={'Empunhavel'} />
                ) : (
                    <FontAwesomeIcon icon={faHandBackFistRegular} title={'Não Empunhavel'} style={{color: '#D76565'}} />
                )}

                {item.itemEstaVestido ? (
                    <FontAwesomeIcon icon={faVest} title={'Vestido'} style={{color: '#92D8F9'}} />
                ) : item.itemVestivel ? (
                    <FontAwesomeIcon icon={faVest} title={'Vestivel'} />
                ) : (
                    <FontAwesomeIcon icon={faVest} title={'Não Vestivel'} style={{color: '#D76565'}} />
                )}

                {item.itemEhComponente && (
                    <FontAwesomeIcon icon={faWandSparkles} title={'Componente'} style={{color: item.comportamentoComponenteRitualistico?.refElemento.cores.corPrimaria}} />
                )}
            </div>

            {item.itemEmpunhavel && (
                <div className={style.bloco_texto}>
                    <p className={style.texto_details}>Custo para Sacar/Guardar: {item.comportamentoEmpunhavel!.custoEmpunhar.descricaoListaPreco}</p>
                    <p className={style.texto_details}>Empunhado com {item.comportamentoEmpunhavel!.extremidadesNecessarias} {pluralize(item.comportamentoEmpunhavel!.extremidadesNecessarias, 'Extremidade')}</p>
                </div>
            )}

            {item.itemVestivel && (
                <div className={style.bloco_texto}>
                    <p className={style.texto_details}>Custo para Vestir/Desvestir: {item.comportamentoVestivel!.custoVestir.descricaoListaPreco}</p>
                </div>
            )}
        </>
    );
}

export default pagina;