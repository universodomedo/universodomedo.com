import PlaceholdersConquistas from '../PlaceholdersConquistas/page';
import TituloCard from '../TituloCard/page';
import styles from './styles.module.css';

export default function CardConquistas() {
    return (
        <>
            <div className={styles.recipiente_conquistas}>
                
                <div className={styles.area_conquistas}>

                    <TituloCard iconeCard='/icone-conquistas.png' tituloCard='Conquistas' />

                    <div className={styles.recipiente_icones_conquistas}>

                        <PlaceholdersConquistas />

                        <PlaceholdersConquistas />

                        <PlaceholdersConquistas />

                    </div>
                </div>
            </div>
        </>
    );
}