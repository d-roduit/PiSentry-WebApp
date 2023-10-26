'use client';

import React, { useRef } from 'react';
import { useSnapCarousel } from 'react-snap-carousel';
import { usePrevious } from '@/helpers/CustomHooks.js';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';

export default function Carousel({ items, renderItem, onItemChange }) {
    const {
        scrollRef,
        pages,
        activePageIndex,
        prev,
        next,
        goTo,
        snapPointIndexes
    } = useSnapCarousel();

    const itemsRefs = useRef([]);

    const previousPageIndex = usePrevious(activePageIndex);

    const setItemRef = (itemIndex) => (itemRef) => (itemsRefs.current[itemIndex] = itemRef);

    const renderItemsNavigator = () => (
        <div className="hidden md:flex md:justify-center md:items-center py-2">
            <div className="flex justify-center items-center">
                <button onClick={prev}>
                    <FaAngleLeft className="mr-2 cursor-pointer text-gray-800" />
                </button>
                {pages.map((_, i) => (
                    <button
                        key={i}
                        className={`w-3 h-3 bg-gray-400 rounded-full mx-2 my-1 transition-colors hover:bg-gray-500 ${activePageIndex === i ? 'bg-gray-800': ''}`}
                        onClick={() => {
                            if (previousPageIndex === i) return;
                            onItemChange(
                                {
                                    item: items[previousPageIndex],
                                    index: previousPageIndex,
                                    domElement: itemsRefs.current[previousPageIndex]
                                },
                                {
                                    item: items[activePageIndex],
                                    index: i,
                                    domElement: itemsRefs.current[i]
                                }
                            );
                            goTo(i);
                        }}
                    />
                ))}
                <button onClick={next}>
                    <FaAngleRight className="ml-2 cursor-pointer text-gray-800" />
                </button>
            </div>
        </div>
    );

    const hasSeveralItems = items.length > 1;

    return (
        <div>
            <ul className="relative flex overflow-auto snap-mandatory snap-x" ref={scrollRef}>
                {items.map((item, mapIndex) => (
                    <li key={mapIndex} className="w-full flex-shrink-0 snap-start">
                        {renderItem({ item, itemRef: setItemRef(mapIndex) })}
                    </li>
                ))}
            </ul>
            {hasSeveralItems && renderItemsNavigator()}
        </div>
    );
}
