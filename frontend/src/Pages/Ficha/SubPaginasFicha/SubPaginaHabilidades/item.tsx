// #region Imports
import style from 'Recursos/EstilizacaoCompartilhada/detalhes_popover.module.css';
import { useState } from 'react';

import { Habilidade } from 'Types/classes/index.ts';
import { useContextoAbaHabilidades } from './contexto.tsx';

import PopoverComponente from 'Recursos/Componentes/Popover/page.tsx';
import Tooltip from 'Recursos/Componentes/Tooltip/page.tsx';
import Modal from "Recursos/Componentes/ModalDialog/page.tsx";
// #endregion

const page = ({ habilidade }: { habilidade: Habilidade }) => {
    const [openDetalhes, setOpenDetalhes] = useState(false);

    const { mostrarEtiquetas } = useContextoAbaHabilidades();

    const icone = () => {
        return (
            <div className={style.embrulho_icone}>
                {mostrarEtiquetas && (<h3>{habilidade.nomeExibicao}</h3>)}
                <Tooltip content={habilidade.nomeExibicao}>
                    <div
                        className={`${style.icone}`}
                        style={{
                            backgroundImage: `url(data:image/svg+xml;base64,${habilidade.svg})`,
                            backgroundColor: '#FFFFFF',
                        }}
                    />
                </Tooltip>
            </div>
        );
    }

    const conteudo = (close: () => void) => {
        return (
            <div className={style.conteudo_popover}>
                <h2>{habilidade.nomeExibicao}</h2>
                <div className={style.acoes}>
                    <Modal open={openDetalhes} onOpenChange={(isOpen) => {setOpenDetalhes(isOpen); if (!isOpen) close();}}>
                    {/* <Modal open={openDetalhes} onOpenChange={setOpenDetalhes}> */}
                        <Modal.Button>
                            Detalhes
                        </Modal.Button>

                        <Modal.Content title={`Detalhes - ${habilidade.nomeExibicao}`}>
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