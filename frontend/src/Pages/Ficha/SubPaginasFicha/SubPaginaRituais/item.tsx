// #region Imports
import style from 'Recursos/EstilizacaoCompartilhada/detalhes_popover.module.css';
import { useState } from 'react';

import { Ritual } from 'Types/classes/index.ts';
import { useContextoAbaRituais } from './contexto.tsx';

import PopoverComponente from 'Recursos/Componentes/Popover/page.tsx';
import Tooltip from 'Recursos/Componentes/Tooltip/page.tsx';
import Modal from "Recursos/Componentes/ModalDialog/page.tsx";
// #endregion

const page = ({ ritual }: { ritual: Ritual }) => {
    const [openDetalhes, setOpenDetalhes] = useState(false);

    const { mostrarEtiquetas } = useContextoAbaRituais();

    const icone = () => {
        return (
            <div className={style.embrulho_icone}>
                {mostrarEtiquetas && (<h3>{ritual.nomeExibicao}</h3>)}
                <Tooltip content={ritual.nomeExibicao}>
                    <div
                        className={`${style.icone}`}
                        style={{
                            backgroundImage: `url(data:image/svg+xml;base64,${ritual.svg})`,
                            backgroundColor: ritual.refElemento.cores.corPrimaria,
                        }}
                    />
                </Tooltip>
            </div>
        );
    }

    const conteudo = (close: () => void) => {
        return (
            <div className={style.conteudo_popover}>
                <h2>{ritual.nomeExibicao}</h2>
                <div className={style.acoes}>
                    <Modal open={openDetalhes} onOpenChange={(isOpen) => {setOpenDetalhes(isOpen); if (!isOpen) close();}}>
                    {/* <Modal open={openDetalhes} onOpenChange={setOpenDetalhes}> */}
                        <Modal.Button>
                            Detalhes
                        </Modal.Button>

                        <Modal.Content title={`Detalhes - ${ritual.nomeExibicao}`}>
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