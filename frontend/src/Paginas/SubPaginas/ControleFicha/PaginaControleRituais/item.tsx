// #region Imports
import style from 'Recursos/EstilizacaoCompartilhada/detalhes_popover.module.css';
import { useState } from 'react';

import { Ritual } from 'Classes/ClassesTipos/index.ts'

import { useContextoControleRituais } from 'Contextos/ContextoControleRituais/contexto.tsx';

import Modal from 'Componentes/ModalDialog/pagina.tsx';
// #endregion

const page = ({ ritual }: { ritual: Ritual }) => {
    const [openDetalhes, setOpenDetalhes] = useState(false);
    const { mostrarEtiquetas } = useContextoControleRituais();

    return (
        <Modal open={openDetalhes} onOpenChange={setOpenDetalhes}>
            <Modal.Button>
                <div className={style.embrulho_icone}>
                    {mostrarEtiquetas && (<h3>{ritual.nome.nomeExibicao}</h3>)}
                    <div className={`${style.icone}`} style={{ backgroundImage: `url(data:image/svg+xml;base64,${ritual.svg})`, backgroundColor: ritual.refElemento.cores.corPrimaria }} />
                </div>
            </Modal.Button>

            <Modal.Content title={`${ritual.nome.nomeExibicao}`}>
                <ConteudoDetalhes ritual={ritual} />
            </Modal.Content>
        </Modal>
    );
}

const ConteudoDetalhes = ({ ritual }: { ritual: Ritual }) => {
    return (
        <>
            <p className={style.texto}>Ritual de {ritual.refElemento.nome}</p>
            <p className={style.texto}>{ritual.refCirculoNivelRitual.nome}</p>

            <p className={style.titulo}>Ações</p>
            {ritual.dadosAcoes.map((acao, index) => (
                <p key={index} className={style.texto}>{acao.nome}</p>
            ))}
        </>
    );
}

export default page;