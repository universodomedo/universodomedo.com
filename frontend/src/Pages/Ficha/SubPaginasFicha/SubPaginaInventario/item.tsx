// #region Imports
import style from 'Recursos/EstilizacaoCompartilhada/detalhes_popover.module.css';
import { useState } from 'react';

import { Item } from 'Types/classes/index.ts';
import { useContextoAbaInventario } from './contexto.tsx';

import PopoverComponente from 'Recursos/Componentes/Popover/page.tsx';
import Tooltip from 'Recursos/Componentes/Tooltip/page.tsx';
import Modal from "Recursos/Componentes/ModalDialog/page.tsx";
// #endregion

const page = ({ item }: { item: Item }) => {
    const [openDetalhes, setOpenDetalhes] = useState(false);

    const { mostrarEtiquetas } = useContextoAbaInventario();

    const icone = () => {
        return (
            <div className={style.embrulho_icone}>
                {mostrarEtiquetas && (<h3>{item.nomeExibicao}</h3>)}
                <Tooltip content={item.nomeExibicao}>
                    {/* <div
                        className={`${style.icone_item}`}
                        style={{
                            backgroundImage: `url(data:image/svg+xml;base64,${item.svg})`,
                            backgroundColor: '#FFFFFF',
                        }}
                    /> */}
                    <div className={`${style.icone_item}`}>
                        <img src={`data:image/svg+xml;base64,${item.svg}`} />
                        {/* <img src={`data:image/svg+xml;base64,${props.iconeCustomizado!.svg}`} onClick={onClick} /> */}
                        {/* {quantidadeAgrupada > 1 && (
                            <span className={style.quantidade_agrupada}>{`x${props.numeroUnidades}`}</span>
                        )} */}
                    </div>
                </Tooltip>
            </div>
        );
    }

    const conteudo = (close: () => void) => {
        return (
            <div className={style.conteudo_popover}>
                <h2>{item.nomeExibicao}</h2>
                <div className={style.acoes}>
                    <Modal open={openDetalhes} onOpenChange={(isOpen) => {setOpenDetalhes(isOpen); if (!isOpen) close();}}>
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
            
            </>
        );
    }
    
    return (
        <PopoverComponente trigger={icone} content={conteudo} />
    );
}

export default page;