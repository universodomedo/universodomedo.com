// #region Imports
import style from "./style.module.css";
import { useState } from "react";

import { TooltipProps } from 'Types/classes/index.ts';

import PopoverComponente from 'Recursos/Componentes/Popover/page.tsx';
import Tooltip from 'Recursos/Componentes/Tooltip/page.tsx';
import Modal from "Recursos/Componentes/ModalDialog/page.tsx";
// #endregion

const page = ({ mostrarEtiquetas = true, quantidadeAgrupada, props, onClick }: { mostrarEtiquetas:boolean, quantidadeAgrupada:number, props: TooltipProps, onClick?: () => void }) => {
    const [openDetalhes, setOpenDetalhes] = useState(false);

    const icone = () => {
        return (
            <div className={style.embrulho_icone}>
                {mostrarEtiquetas && (<h3>{props.caixaInformacao.principal.titulo}</h3>)}
                <Tooltip content={props.caixaInformacao.principal.titulo}>
                    <div className={style.icones_itens}>
                        <img src={`data:image/svg+xml;base64,${props.iconeCustomizado!.svg}`} />
                        {/* <img src={`data:image/svg+xml;base64,${props.iconeCustomizado!.svg}`} onClick={onClick} /> */}
                        {quantidadeAgrupada > 1 && (
                            <span className={style.quantidade_agrupada}>{`x${props.numeroUnidades}`}</span>
                        )}
                    </div>
                </Tooltip>
            </div>
        );
    }

    const conteudo = (close: () => void) => {
        return (
            <div className={style.conteudo_popover}>
                <h2>{props.caixaInformacao.principal.titulo}</h2>
                <div className={style.acoes}>
                    <Modal open={openDetalhes} onOpenChange={(isOpen) => {setOpenDetalhes(isOpen); if (!isOpen) close();}}>
                    {/* <Modal open={openDetalhes} onOpenChange={setOpenDetalhes}> */}
                        <Modal.Button>
                            Detalhes
                        </Modal.Button>

                        <Modal.Content title={`Detalhes - ${props.caixaInformacao.principal.titulo}`}>
                            <ConteudoDetalhes props={props} />
                        </Modal.Content>
                    </Modal>
                </div>
            </div>
        );
    }
    
    return (
        <PopoverComponente trigger={icone} content={conteudo} />
    );
}

const ConteudoDetalhes = ({ props }: { props: TooltipProps }) => {
    return (
        <div className={style.container_caixa_informacao}>
        {/* <div className={style.container_caixa_informacao} style={{ border: `2px ${props.corTooltip.corPrimaria} solid` }}> */}
            {props.caixaInformacao.detalhes.cabecalho && (
                <div className={style.cabecalho_caixa_informacao}>
                    {props.caixaInformacao.detalhes.cabecalho.map((item, index) => {
                        // if (item.tipo === 'titulo')
                        //     return (<span key={index} className={style.titulo} style={{ background: `linear-gradient(0deg, ${props.corTooltip.corSecundaria}, ${props.corTooltip.corPrimaria}, ${props.corTooltip.corSecundaria}) text`, WebkitTextFillColor: 'transparent', WebkitTextStroke: `.4px ${props.corTooltip.corTerciaria}` }}>{item.conteudo}</span>);
                        if (item.tipo === 'subtitulo')
                            return (<span key={index} className={style.subtitulo}>{item.conteudo}</span>);
                    })}
                </div>
            )}

            {props.caixaInformacao.detalhes.corpo && (
                <div className={style.corpo_caixa_informacao}>
                    {props.caixaInformacao.detalhes.corpo.map((item, index) => {
                        if (item.tipo === 'texto')
                            return (<p style={{color:item.cor}} key={index}>{item.conteudo}</p>);
                        if (item.tipo === 'separacao')
                            return (<p key={index} className={style.separador}>{item.conteudo}</p>);
                    })}
                </div>
            )}
        </div>
    );
}

export default page;