import React from 'react';

export default function PlayerYouTube({ urlSufixo, className }: { urlSufixo: string; className?: string; }) {
    const videoId = urlSufixo.split('?')[0];

    if (!videoId) return null;

    const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`;

    return (
        <iframe
            className={className}
            src={embedUrl}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block',
            }}
        />
    );
}