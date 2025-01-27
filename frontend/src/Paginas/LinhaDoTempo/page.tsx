// #region Imports
import style from './style.module.css';
import React from 'react';
// #endregion

interface TimelineProps {
    chapters: Chapter[];
}

interface Chapter {
    title: string;
    anoInicio: number | null; // null representa início indefinido (???)
    anoFim: number | null;   // null representa fim indefinido (???)
}

const Pagina: React.FC<TimelineProps> = ({ chapters }) => {
    const processedChapters = React.useMemo(() => {
        const result: Chapter[] = [];
        let ultimoAno: number | null = null;

        chapters.forEach((chapter, index) => {
            if (ultimoAno !== null && chapter.anoInicio && chapter.anoInicio > ultimoAno) {
                result.push({
                    title: '???',
                    anoInicio: ultimoAno,
                    anoFim: chapter.anoInicio,
                });
            }

            result.push(chapter);
            ultimoAno = chapter.anoFim;
        });

        // Adiciona "???" para anos após o último capítulo, se necessário
        if (ultimoAno !== null) {
            result.push({
                title: '???',
                anoInicio: ultimoAno,
                anoFim: null,
            });
        }

        return result;
    }, [chapters]);

    return (
        <div className={style.timelineContainer}>
            <div className={style.timeline}>
                {processedChapters.map((chapter, index) => (
                    <div
                        key={index}
                        className={style.chapter}
                        style={{
                            flex: chapter.anoFim && chapter.anoInicio
                                ? `0 0 ${chapter.anoFim - chapter.anoInicio}fr`
                                : '0 0 auto',
                        }}
                    >
                        <span className={style.chapterTitle}>{chapter.title}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default Pagina;