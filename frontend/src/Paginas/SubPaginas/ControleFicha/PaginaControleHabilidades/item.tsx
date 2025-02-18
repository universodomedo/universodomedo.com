// #region Imports
import style from 'Recursos/EstilizacaoCompartilhada/detalhes_popover.module.css';
import { useState } from 'react';

import { Habilidade } from 'Classes/ClassesTipos/index.ts'
import { useContextoControleHabilidades } from 'Contextos/ContextoControleHabilidades/contexto.tsx';

import PopoverComponente from 'Componentes/Popover/pagina.tsx';
import Tooltip from 'Componentes/Tooltip/pagina.tsx';
import Modal from 'Componentes/ModalDialog/pagina.tsx';
// #endregion

const page = ({ habilidade }: { habilidade: Habilidade }) => {
    const [openDetalhes, setOpenDetalhes] = useState(false);

    const { mostrarEtiquetas } = useContextoControleHabilidades();

    const icone = () => {
        return (
            <div className={style.embrulho_icone}>
                {mostrarEtiquetas && (<h3>{habilidade.nome}</h3>)}
                <Tooltip>
                    <Tooltip.Trigger>
                        <div className={`${style.icone}`} style={{ backgroundImage: `url(data:image/svg+xml;base64,${habilidade.svg})`, backgroundColor: '#FFFFFF', }} />
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        <h3>{habilidade.nome}</h3>
                    </Tooltip.Content>
                </Tooltip>
            </div>
        );
    }

    const conteudo = (close: () => void) => {
        return (
            <div className={style.conteudo_popover}>
                <h2>{habilidade.nome}</h2>
                <div className={style.acoes}>
                    <Modal open={openDetalhes} onOpenChange={(isOpen) => { setOpenDetalhes(isOpen); if (!isOpen) close(); }}>
                        {/* <Modal open={openDetalhes} onOpenChange={setOpenDetalhes}> */}
                        <Modal.Button>
                            Detalhes
                        </Modal.Button>

                        <Modal.Content title={`Detalhes - ${habilidade.nome}`}>
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