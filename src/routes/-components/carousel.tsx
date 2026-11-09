import { useEffect, useState } from 'react'

const slides = [
  '/images/storefront/carousel-plants-1.jpg',
  '/images/storefront/carousel-plants-2.jpg',
  '/images/storefront/carousel-plants-3.jpg',
]

export function StorefrontCarousel() {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) =>
        current === slides.length - 1 ? 0 : current + 1,
      )
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Background Images */}
      {slides.map((image, index) => (
        <img
          key={image}
          src={image}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 size-full object-cover transition-all duration-700 ease-in-out ${
            activeSlide === index
              ? 'scale-100 opacity-100'
              : 'scale-110 opacity-0'
          }`}
        />
      ))}

      {/* Dark Green Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#142D1D]/85 via-[#193D25]/45 to-[#193D25]/5" />
    </div>
  )
}