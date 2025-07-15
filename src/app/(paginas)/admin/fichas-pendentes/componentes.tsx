'use client';

import styles from './styles.module.css';
import { useEffect, useState } from 'react';

import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import Modal from 'Componentes/Elementos/Modal/Modal';
import { criaFicha, obtemPericiasParaCriacaoFicha } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { useContextoPaginaFichasPendentes } from './contexto';

import { EstadoPendenciaAdministrativaPersonagem, PericiaDto, PersonagemDto } from 'types-nora-api';

import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faUser } from "@fortawesome/free-solid-svg-icons";

export function PaginaPendenciasFichaComDados() {
    const { listaPersonagensComPendencia, abreModalConfiguraFicha } = useContextoPaginaFichasPendentes();

    return (
        <div id={styles.recipiente_fichas_pendentes}>
            {listaPersonagensComPendencia && listaPersonagensComPendencia.map(personagem => (
                <div key={personagem.id} className={styles.recipiente_informacoes_ficha}>
                    <div className={styles.recipiente_avatar_informacoes_ficha_pendencia}>
                        <RecipienteImagem src={personagem.caminhoAvatar} />
                    </div>
                    <div className={styles.recipiente_pendencias_ficha}>
                        <h1>{personagem.informacao?.nome}</h1>
                        {personagem.pendencias.pendeciaUsuario !== '' && (<h2 className={styles.pendencia_usuario}>{personagem.pendencias.pendeciaUsuario}</h2>)}
                        {personagem.pendencias.pendenciaAdmin !== '' && (<h2 className={styles.pendencia_administrador}>{personagem.pendencias.pendenciaAdmin}</h2>)}
                    </div>
                    <SecaoAcoesFichaPendente personagem={personagem} abreModalConfiguracao={() => { abreModalConfiguraFicha(personagem.id) }} />
                </div>
            ))}
        </div>
    );
};

function SecaoAcoesFichaPendente({ personagem, abreModalConfiguracao }: { personagem: PersonagemDto; abreModalConfiguracao: () => void }) {
    return (
        <div className={styles.recipiente_acoes_ficha}>
            {/* {personagem.pendencias.pendenciaAdmin === EstadoPendenciaAdministrativaPersonagem.SEM_CONFIGURACAO_FICHA && (
                <div className={styles.recipiente_icone_acao} onClick={abreModalConfiguracao}>
                    <FontAwesomeIcon icon={faFile} />
                </div>
            )} */}
            {personagem.pendencias.pendenciaAdmin === EstadoPendenciaAdministrativaPersonagem.SEM_AVATAR && (
                <div className={styles.recipiente_icone_acao}>
                    <FontAwesomeIcon icon={faUser} />
                </div>
            )}
        </div>
    );
};

export function ModalCriacaoFicha({ modalEstaAberta, onOpenChange }: { modalEstaAberta: boolean; onOpenChange: (open: boolean) => void }) {
    const { personagemConfigurando } = useContextoPaginaFichasPendentes();

    const [pericias, setPericias] = useState<PericiaDto[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<{value: number, label: string}[]>([]);

    async function carregaPericias() {
        const todasPericias = await obtemPericiasParaCriacaoFicha();

        setPericias(todasPericias);
        setSelectedOptions(todasPericias.map(pericia => ({ value: pericia.id, label: pericia.nomeAbreviado })));
    }

    useEffect(() => {
        if (modalEstaAberta) carregaPericias();
    }, [modalEstaAberta]);

    async function executa() {
        if (!personagemConfigurando) return;
        
        const retorno = await criaFicha(personagemConfigurando.id, selectedOptions.map(option => option.value));

        if (retorno) {
            window.location.reload();
        } else {
            alert('Houve um problema');
        }
    }

    return (
        <Modal open={modalEstaAberta} onOpenChange={onOpenChange}>
            <Modal.Content title={`Configurando Ficha - ${personagemConfigurando?.informacao.nome}`}>
                <Select
                    isMulti
                    options={pericias.map(pericia => ({
                        value: pericia.id,
                        label: pericia.nomeAbreviado
                    }))}
                    value={selectedOptions}
                    onChange={(newValue) => setSelectedOptions([...newValue])}
                    closeMenuOnSelect={false}
                    placeholder="Selecione as perícias..."
                    noOptionsMessage={() => "Nenhuma perícia disponível"}
                />

                <button onClick={executa}>Confirmar</button>
            </Modal.Content>
        </Modal>
    );
};