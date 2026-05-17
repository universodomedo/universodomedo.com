import styles from './styles.moldure.css'
import Image from 'next/image';

type EmblemaMolduraProps = {
    urlEmblemaMoldura: string;
}

export default function EmblemaMoldura(
    {urlEmblemaMoldura} : EmblemaMolduraProps
) {
    return (
        <>
            <div className={styles.recipiente_emblema_moldura}>
                <Image alt='' src={urlEmblemaMoldura} fill unoptimized />
            </div>
        </>
    );
}