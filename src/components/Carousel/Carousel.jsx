'use client';

import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import './splide-pisentry-skin.scss';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import videojs from 'video.js';

export default function Carousel({ items, renderItem, onMoved }) {
    const hasSeveralItems = items.length > 1;

    return (
        <Splide
            hasTrack={false}
            options={{
                arrows: hasSeveralItems,
                pagination: hasSeveralItems,
                classes: {
                    arrows: 'splide__arrows splide__arrows-pisentry',
                    prev: 'splide__arrow--prev splide__arrow--prev-pisentry',
                    next: 'splide__arrow--next splide__arrow--next-pisentry',
                    pagination: 'splide__pagination splide__pagination-pisentry',
                    page: 'splide__pagination__page splide__pagination__page-pisentry'
                }
            }}
            onMoved={onMoved}
        >
            <SplideTrack>
                {items.map((item, mapIndex) => (
                    <SplideSlide key={mapIndex}>
                        {renderItem(item)}
                    </SplideSlide>
                ))}
            </SplideTrack>

            {hasSeveralItems && (
                <div className='hidden md:flex justify-center items-center py-2'>
                    <div className='splide__arrows splide__arrows-pisentry'>
                        <button className='splide__arrow--prev splide__arrow--prev-pisentry'>
                            <FaAngleLeft className="text-gray-800" />
                        </button>
                    </div>

                    <ul className='splide__pagination splide__pagination-pisentry' />

                    <div className='splide__arrows splide__arrows-pisentry'>
                        <button className='splide__arrow--next splide__arrow--next-pisentry'>
                            <FaAngleRight className="text-gray-800" />
                        </button>
                    </div>
                </div>
            )}
        </Splide>
    );
}
