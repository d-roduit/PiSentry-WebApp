'use client';

import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.min.css';
import './vjs-pisentry-skin.scss';

export default function VideoPlayer({ options, onReady, afterInstantiation, className }) {
    const playerContainerRef = useRef(null);
    const playerRef = useRef(null);

    useEffect(() => {
        // Make sure Video.js player is only initialized once
        if (!playerRef.current) {
            // The Video.js player needs to be inside the component element for React 18 Strict Mode.
            const playerElement = document.createElement('video-js');

            playerElement.classList.add('vjs-big-play-centered', 'vjs-pisentry-skin');
            playerContainerRef.current.appendChild(playerElement);

            const defaultOptions = {
                fluid: true,
                controls: true,
                playsinline: true,
                bigPlayButton: true,
                liveui: true,
                liveTracker: {
                    trackingThreshold: 5,
                    liveTolerance: 5,
                },
                controlBar: {
                    pictureInPictureToggle: false,
                    fullscreenToggle: true,
                    children: [
                        'progressControl',
                        'playToggle',
                        'currentTimeDisplay',
                        'timeDivider',
                        'durationDisplay',
                        'customControlSpacer',
                        'fullscreenToggle',
                        'liveDisplay',
                        'seekToLive',
                    ],
                },
                userActions: {
                    hotkeys: true,
                },
                suppressNotSupportedError: true,
            };

            const readyCallback = function() {
                // Make sure that if the poster image cannot be loaded, it will not show a broken image placeholder
                const posterImageElement = this.posterImage?.el()?.querySelector('img');
                if (posterImageElement) {
                    posterImageElement.onload = function() {
                        this.style.display = 'block';
                    }
                    posterImageElement.onerror = function() {
                        this.style.display = 'none';
                    }
                }

                onReady && onReady(player);
            };

            const player = playerRef.current = videojs(
                playerElement,
                { ...defaultOptions, ...options },
                readyCallback
            );

            afterInstantiation && afterInstantiation(player);

            // You could update an existing player in the `else` block here
            // on prop change, for example:
        } else {
            const player = playerRef.current;
            player.src(options.sources);
            player.poster(options.poster)
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
