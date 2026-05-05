import styles from './styles.module.css';

import { CaminhoArquivoArte, VIEW_GrupoAventuraDetalhado } from 'types-nora-api';

import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';
import { RenderArquivoArteCapa } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';

type CabecalhoProps = | { tipo: 'sessao'; caminhoCapaSessao: CaminhoArquivoArte; } | { tipo: 'grupoAventura'; grupoAventura: VIEW_GrupoAventuraDetalhado; };

export function CabecalhoDeAventura(props: CabecalhoProps) { return props.tipo === 'sessao' ? <RenderCabecalhoLegado caminhoArquivoArte={props.caminhoCapaSessao} /> : <RenderCabecalhoLegado caminhoArquivoArte={props.grupoAventura.dadosArteCapa.caminhoArquivoArteCapa} /> };

function RenderCabecalhoLegado({ caminhoArquivoArte }: { caminhoArquivoArte: CaminhoArquivoArte }) {
	return (
		<SecaoDeConteudo id={styles.recipiente_capa_cabecalho_aventura}>
			<RenderArquivoArteCapa caminhoArquivoArte={caminhoArquivoArte} />
		</SecaoDeConteudo>
	);
};

export default function RenderCabecalhoCapa({ caminhoArquivoArte }: { caminhoArquivoArte: CaminhoArquivoArte }) {
	return (
		<SecaoDeConteudo id={styles.recipiente_capa_cabecalho_aventura}>
			<RenderArquivoArteCapa caminhoArquivoArte={caminhoArquivoArte} />
		</SecaoDeConteudo>
	);
};