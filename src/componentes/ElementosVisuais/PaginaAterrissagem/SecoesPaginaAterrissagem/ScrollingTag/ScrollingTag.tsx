import styles from './styles.module.css';

import RecipienteArquivoInterno from 'Uteis/ImagemLoader/RecipienteArquivoInterno';
import { carregaArquivoInterno } from 'Uteis/ImagemLoader/ImagemLoader';

// direcao: o sentido que o item vai seguir
// urlImagemExterna: caminho da imagem que vai ser inserida na parte de fora do item
// urlImagemInterna: caminho da imagem que vai ser inserida na parte de dentro do item
// conteudoTexto: conteudo que vai ser escrito na parte de dentro do item
//Variáveis do componente controladas por variáveis CSS externas.

type ScrollingTagProps = {
	direcao: 'esquerda-direita' | 'direita-esquerda';
	urlImagem: string;
	conteudoTexto: { titulo: string, texto: string };
	classNameExterno?: string;
};

export default function ScrollingTag({ direcao, urlImagem, conteudoTexto, classNameExterno }: ScrollingTagProps) {
	return (
		<div className={`${styles.recipiente_individual_scrolling_tag} ${direcao == 'esquerda-direita' ? styles.esquerda_direita : styles.direita_esquerda} ${classNameExterno ?? ''} `}>
			<div className={styles.recipiente_porta_bmk}>
				<RecipienteArquivoInterno arquivo={'PAGINA_ATERRISSAGEM__MARCA_PAGINA__DETALHE_BORDA'} className={styles.detalhe_porta_bmk} />
				<RecipienteArquivoInterno arquivo={'PAGINA_ATERRISSAGEM__MARCA_PAGINA__BASE'} className={styles.recipiente_porta_marcador} />
				<div className={styles.mascara_anexo} style={{ ['--vetor-etiqueta' as never]: `url("${carregaArquivoInterno({ arquivo: 'PAGINA_ATERRISSAGEM__MARCA_PAGINA__VETOR' })}")` }}>
					<div className={styles.filtro_bmk}></div>
					<img className={styles.recipiente_imagem_anexo} src={urlImagem} alt="#" />
				</div>
			</div>

			<a href="#">
				<div className={styles.recipiente_marca_pagina}>
					<RecipienteArquivoInterno arquivo={'PAGINA_ATERRISSAGEM__MARCA_PAGINA'} />

					<div className={styles.recipiente_textos}>
						<h3 >{conteudoTexto.titulo}</h3>
						<p >{conteudoTexto.texto}</p>
					</div>
				</div>
			</a>
		</div>
	);
};