// direcao: o sentido que o item vai seguir
// urlImagemExterna: caminho da imagem que vai ser inserida na parte de fora do item
// urlImagemInterna: caminho da imagem que vai ser inserida na parte de dentro do item
// conteudoTexto: conteudo que vai ser escrito na parte de dentro do item

type ScrollingTagProps = {
	direcao: 'esquerda-direita' | 'direita-esquerda';
	urlImagemExterna: string;
	urlImagemInterna: string;
	conteudoTexto: string;
};


export default function ScrollingTag({ direcao, urlImagemExterna, urlImagemInterna, conteudoTexto}: ScrollingTagProps) {
	return (
		<div className={styles.recipiente_individual_scrolling_tag}>
			{/* to do */}
		</div>
	);
};