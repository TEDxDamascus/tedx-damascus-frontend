'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const images = [
  '/images/gallery/IMG_20260126_221432_639-01.jpeg',
  '/images/gallery/IMG_20260126_221435_535-01.jpeg',
  '/images/gallery/IMG_20260126_221439_032-01.jpeg',
  '/images/gallery/IMG_20260126_221441_542-01.jpeg',
  '/images/gallery/IMG_20260126_221444_934-01.jpeg',
  '/images/gallery/IMG_20260126_221448_784-01.jpeg',
  '/images/gallery/IMG_20260126_221451_894-01.jpeg',
  '/images/gallery/IMG_20260126_221529_118-01.jpeg',
  '/images/gallery/IMG_20260126_221543_169-01.jpeg',
  '/images/gallery/IMG_20260126_221545_201-01.jpeg',
  '/images/gallery/Screenshot_20260126-221502_Gallery-01.jpeg',
  '/images/gallery/Screenshot_20260126-221513_Gallery-01.jpeg',
];

export function ImageGrid() {
  const [activeImages, setActiveImages] = useState<number[]>([]);

  useEffect(() => {
    const getRandomImages = () => {
      const indices: number[] = [];
      while (indices.length < 4) {
        const randomIndex = Math.floor(Math.random() * 12);
        if (!indices.includes(randomIndex)) {
          indices.push(randomIndex);
        }
      }
      return indices;
    };

    setActiveImages(getRandomImages());

    const interval = setInterval(() => {
      setActiveImages(getRandomImages());
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="absolute inset-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 grid-rows-6 sm:grid-rows-4 lg:grid-rows-3 gap-1 p-1">
        {Array.from({ length: 12 }).map((_, index) => {
          const imageIndex = index % images.length;
          const isActive = activeImages.includes(index);

          return (
            <motion.div
              key={index}
              className="relative w-full h-full overflow-hidden rounded-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className="relative w-full h-full rounded-sm overflow-hidden bg-black"
              >
                <motion.div
                  className="absolute -inset-3 bg-tedx-red blur-2xl"
                  animate={{
                    opacity: isActive ? 0.7 : 0,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut"
                  }}
                />

                <motion.div
                  className="relative w-full h-full"
                  animate={{
                    opacity: isActive ? 1 : 0,
                    scale: isActive ? 1.05 : 1,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut"
                  }}
                >
                  <Image
                    src={images[imageIndex]}
                    alt={`TEDx Damascus ${index + 1}`}
                    fill
                    className="object-cover grayscale"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    priority={index < 4}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <div className="absolute inset-0 bg-black/[0.68]" />
    </>
  );
}
