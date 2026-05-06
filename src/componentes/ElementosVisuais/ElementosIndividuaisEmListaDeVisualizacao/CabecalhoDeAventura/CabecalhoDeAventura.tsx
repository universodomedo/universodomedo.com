'use client';

import styles from './styles.module.css';

import { useState } from 'react';
import { CaminhoArquivoArte, VIEW_GrupoAventuraDetalhado } from 'types-nora-api';

import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';
import { RenderArquivoArteCapa } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';
import Modal from 'Componentes/Elementos/Modal/Modal';
import { Recipiente__Contexto__Modal__ConfiguradorArteCapa__Provider } from 'Contextos/Contexto__Modal__ConfiguradorArteCapa/Contexto__Modal__ConfiguradorArteCapa';

type CabecalhoProps = | { tipo: 'sessao'; caminhoCapaSessao: CaminhoArquivoArte; } | { tipo: 'grupoAventura'; grupoAventura: VIEW_GrupoAventuraDetalhado; };

export function CabecalhoDeAventura(props: CabecalhoProps) { return props.tipo === 'sessao' ? <RenderCabecalhoLegado caminhoArquivoArte={props.caminhoCapaSessao} /> : <RenderCabecalhoLegado caminhoArquivoArte={props.grupoAventura.dadosArteCapa.caminhoArquivoArteCapa} /> };

function RenderCabecalhoLegado({ caminhoArquivoArte }: { caminhoArquivoArte: CaminhoArquivoArte }) {
	return (
		<SecaoDeConteudo className={styles.recipiente_capa_cabecalho_aventura}>
			<RenderArquivoArteCapa caminhoArquivoArte={caminhoArquivoArte} />
		</SecaoDeConteudo>
	);
};

export default function RenderCabecalhoCapa({ caminhoArquivoArte, callbackConfigArteCapa }: { caminhoArquivoArte: CaminhoArquivoArte; callbackConfigArteCapa?: () => void; }) {
	return (
		<SecaoDeConteudo className={styles.recipiente_capa_cabecalho_aventura}>
			<RenderArquivoArteCapa caminhoArquivoArte={caminhoArquivoArte} />

			{callbackConfigArteCapa && <Recipiente__Contexto__Modal__ConfiguradorArteCapa__Provider callbackConfigArteCapa={callbackConfigArteCapa} />}
		</SecaoDeConteudo>
	);
};

export function BotaoConfigurarArteCapa({ openModalConfigurarArteCapa }: { openModalConfigurarArteCapa: () => void; }) { return <button type="button" className={styles.botao_config_arte_capa} onClick={openModalConfigurarArteCapa}>Editar</button> };