declare namespace YT {
    interface Player {
        playVideo(): void;
        pauseVideo(): void;
        stopVideo(): void;
        setVolume(volume: number): void;
        getVolume(): number;
        mute(): void;
        unMute(): void;
        getPlayerState(): PlayerState;
        getCurrentTime(): number;
    };

    type PlayerState = -1 | 0 | 1 | 2 | 3 | 5;

    interface PlayerOptions {
        videoId?: string;
        width?: number | string;
        height?: number | string;
        playerVars?: PlayerVars;
        events?: PlayerEvents;
    };

    interface PlayerVars {
        autoplay?: 0 | 1;
        loop?: 0 | 1;
        controls?: 0 | 1 | 2;
        disablekb?: 0 | 1;
        fs?: 0 | 1;
        modestbranding?: 0 | 1;
        rel?: 0 | 1;
        enablejsapi?: 0 | 1;
    };

    interface PlayerEvents {
        onReady?(event: { target: Player }): void;
        onStateChange?(event: { target: Player; data: PlayerState }): void;
        onError?(event: { target: Player; data: number }): void;
    };
};

declare var YT: {
    Player: new (elementId: string | HTMLElement, options: YT.PlayerOptions) => YT.Player
    PlayerState: {
        UNSTARTED: -1;
        ENDED: 0;
        PLAYING: 1;
        PAUSED: 2;
        BUFFERING: 3;
        CUED: 5;
    };
};