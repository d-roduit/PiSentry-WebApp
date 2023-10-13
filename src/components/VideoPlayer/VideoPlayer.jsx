'use client';

import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.min.css';

export default function VideoPlayer({ options, onReady, className }) {
    const playerContainerRef = useRef(null);
    const playerRef = useRef(null);

    useEffect(() => {
        // Make sure Video.js player is only initialized once
        if (!playerRef.current) {
            // The Video.js player needs to be inside the component element for React 18 Strict Mode.
            const playerElement = document.createElement('video-js');

            playerElement.classList.add('vjs-big-play-centered');
            playerContainerRef.current.appendChild(playerElement);

            const defaultOptions = {
                // liveui: true,
                fluid: true,
                controls: true,
                playsinline: true,
                bigPlayButton: true,
                controlBar: {
                    volumePanel: false,
                    currentTimeDisplay: true,
                    timeDivider: true,
                    durationDisplay: true,
                    remainingTimeDisplay: false,
                    // playToggle: false,
                    // remainingTimeDisplay: true,
                    // currentTimeDisplay: false,
                    // timeDivider: false,
                    // durationDisplay: false,
                    // progressControl: {
                    //     seekBar: false
                    // },
                    pictureInPictureToggle: false,
                    fullscreenToggle: true,
                },
                userActions: {
                    hotkeys: true,
                },
            };

            const readyCallback = () => {
                onReady && onReady(player);
            };

            const player = playerRef.current = videojs(
                playerElement,
                { ...defaultOptions, ...options },
                readyCallback
            );

            // You could update an existing player in the `else` block here
            // on prop change, for example:
        } else {
            const player = playerRef.current;
            player.src(options.sources);
        }
    }, [onReady, options, playerContainerRef]);

    // Dispose the Video.js player when the functional component unmounts
    useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef]);

    return (
        <div data-vjs-player className={className}>
            <div ref={playerContainerRef} />
        </div>
    );
}
