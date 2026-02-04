import styles from './styles.module.css';

import TituloSecao from 'Componentes/ElementosVisuais/TituloSecao/TituloSecao';
import ScrollingTag from '../ScrollingTag/ScrollingTag';
import { getImageUrlCdn } from 'Uteis/ImagemLoader/ImagemLoader';

export default function PaginaAterrissagem_SecaoTags() {
	return (
		<div className={styles.recipiente_tags}>
			<TituloSecao primeiraLetra='C' corpo='ONHEÇ' ultimaLetra='A'/>
			<ScrollingTag classNameExterno={styles.direita_esquerda} direcao={'direita-esquerda'} urlImagem={getImageUrlCdn('RecursosPublicos/imagem_especial_artista/9c90d4e5-9958-4bca-8258-080c0713aeea.webp')} conteudoTexto={{titulo: 'Assistir Aventuras', texto: 'Acompanhe nossas aventuras já gravadas.'}} />
			<ScrollingTag classNameExterno={styles.esquerda_direita} direcao={'esquerda-direita'} urlImagem={getImageUrlCdn('RecursosPublicos/imagem_especial_artista/77594cb7-710c-441f-ad4f-593d20dd2404.webp')} conteudoTexto={{titulo: 'Comunidade', texto: 'Forme alianças na batalha contra o paranormal através de nossa comunidade do Discord.'}} />
		</div>
	);
};