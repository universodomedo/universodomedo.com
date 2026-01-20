import styles from './styles.module.css';

import ScrollingTag from '../ScrollingTag/ScrollingTag';

export default function SecaoTags() {
	return (
		<div className={styles.recipiente_tags}>
			<ScrollingTag classNameExterno={styles.direita_esquerda} direcao={'direita-esquerda'} urlImagem={'/imagensFigma/capa-assistir.png'} conteudoTexto={{titulo: 'Assistir Aventuras', texto: 'Acompanhe nossas aventuras já gravadas.'}} />

			<ScrollingTag classNameExterno={styles.esquerda_direita} direcao={'esquerda-direita'} urlImagem={'/imagensFigma/comunidade-capa.png'} conteudoTexto={{titulo: 'Comunidade', texto: 'Forme alianças na batalha contra o paranormal através de nossa comunidade do Discord.'}} />
		</div>
	);
};