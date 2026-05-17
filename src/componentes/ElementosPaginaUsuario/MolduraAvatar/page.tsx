import styles from './styles.module.css'
import Image from 'next/image';

type MolduraAvatarProps = {
 urlMoldura: string,
}

export default function MolduraAvatar({urlMoldura} : MolduraAvatarProps) {
    return (
        <>
            <div className={styles.moldura_avatar}>
                <Image alt='' src={urlMoldura} fill unoptimized />
            </div>
        </>
    );
}