import React from 'react';

export default function PlayerSpotify({ urlSufixo, className }: { urlSufixo: string; className?: string; }) {
    const episodeId = urlSufixo.split('?')[0];

    if (!episodeId) return null;

    return (
        <iframe
            src={`https://open.spotify.com/embed/episode/${episodeId}`}
            title="Spotify podcast player"
            allow="encrypted-media"
            style={{
                width: '100%',
                height: '80px',
                border: 'none',
                display: 'block',
                borderRadius: '8px',
            }}
            className={className}
        />
    );
}