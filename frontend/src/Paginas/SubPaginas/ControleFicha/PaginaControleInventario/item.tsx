// #region Imports
import style from 'Recursos/EstilizacaoCompartilhada/detalhes_popover.module.css';
import { useState } from 'react';

import { Item, pluralize } from 'Classes/ClassesTipos/index.ts'
import { useContextoControleInventario } from 'Contextos/ContextoControleInventario/contexto.tsx';

import PopoverComponente from 'Componentes/Popover/pagina.tsx';
import Tooltip from 'Componentes/Tooltip/pagina.tsx';
import Modal from 'Componentes/ModalDialog/pagina.tsx';
// #endregion

const page = ({ item }: { item: Item }) => {
    const [openDetalhes, setOpenDetalhes] = useState(false);

    const { mostrarEtiquetas } = useContextoControleInventario();

    const icone = () => {
        return (
            <div className={style.embrulho_icone}>
                {mostrarEtiquetas && (<h3>{item.nomeExibicao}</h3>)}
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
                        <h3>{item.nomeExibicao}</h3>
                    </Tooltip.Content>
                </Tooltip>
            </div>
        );
    }

    const conteudo = (close: () => void) => {
        return (
            <div className={style.conteudo_popover}>
                <h2>{item.nomeExibicao}</h2>
                <div className={style.acoes}>
                    <Modal open={openDetalhes} onOpenChange={(isOpen) => { setOpenDetalhes(isOpen); if (!isOpen) close(); }}>
                        {/* <Modal open={openDetalhes} onOpenChange={setOpenDetalhes}> */}
                        <Modal.Button>
                            Detalhes
                        </Modal.Button>

                        <Modal.Content title={`Detalhes - ${item.nomeExibicao}`}>
                            <ConteudoDetalhes />
                        </Modal.Content>
                    </Modal>
                </div>
            </div>
        );
    }

    const ConteudoDetalhes = () => {
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
                        <p className={style.texto_details}>Custo do Saque: {item.comportamentos.comportamentoEmpunhavel.precoParaSacarOuGuardar.descricaoCusto}</p>
                        <p className={style.texto_details}>Empunhado com {item.comportamentos.comportamentoEmpunhavel.extremidadesNecessarias} {pluralize(item.comportamentos.comportamentoEmpunhavel.extremidadesNecessarias, 'Extremidade')}</p>
                    </div>
                )}
                {item.itemVestivel && (
                    <div className={style.bloco_texto}>
                        <p className={style.titulo}>Item Vestível</p>
                        <p className={style.texto_details}>Custo de Vestir: {item.comportamentos.comportamentoVestivel.precoParaVestirOuDesvestir.descricaoListaPreco}</p>
                    </div>
                )}
            </>
        );
    }

    return (
        <PopoverComponente trigger={icone} content={conteudo} />
    );
}

export default page;