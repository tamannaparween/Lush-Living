
import { useState } from 'react'
import { ArrowLeft, ArrowRight, Leaf } from 'lucide-react'

const slides = [
  {
    image: '/images/storefront/carousel-plants-1.jpg',
    eyebrow: 'Bring nature closer',
    title: 'Make Your Home a Little Greener',
    description:
      'Discover beautiful plants that bring freshness and life to your everyday spaces.',
  },
  {
    image: '/images/storefront/carousel-plants-2.jpg',
    eyebrow: 'Find your green companion',
    title: 'A Plant for Every Corner',
    description:
      'Explore lovely indoor plants and create your own peaceful green corner.',
  },
  {
    image: '/images/storefront/carousel-plants-3.jpg',
    eyebrow: 'Grow at your own pace',
    title: 'Little Plants, Big Happiness',
    description:
      'Start your gardening journey with beautiful succulents and easy-care plants.',
  },
]

export function StorefrontCarousel() {
  const [activeSlide, setActiveSlide] = useState(0)

  const showPrevious = () => {
    setActiveSlide((current) =>
        current === 0 ? slides.length - 1 : current - 1,
    )
  }

  const showNext = () => {
    setActiveSlide((current) =>
        current === slides.length - 1 ? 0 : current + 1,
    )
  }

  const currentSlide = slides[activeSlide]

  return (
    <section
      aria-label="Featured plant collection"
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="relative isolate flex min-h-[420px] items-center overflow-hidden rounded-3xl bg-[#193D25] sm:min-h-[480px]">
        {slides.map((slide, index) => (
          <img
            key={slide.image}
            src={slide.image}
            alt="Beautiful green plants"
            aria-hidden={activeSlide !== index}
            className={`absolute inset-0 -z-20 size-full object-cover transition-all duration-700 ease-in-out ${
              activeSlide === index
                ? 'scale-100 opacity-100'
                : 'scale-110 opacity-0'
            }`}
          />
        ))}

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#142D1D]/90 via-[#193D25]/65 to-transparent" />

        <div
          key={currentSlide.image}
          className="max-w-2xl px-8 py-16 text-white animate-in fade-in slide-in-from-right-6 duration-500 sm:px-14 sm:py-20"
          style={{
            animationName: 'fadeSlide',
            animationDuration: '500ms',
            animationTimingFunction: 'ease-out',
          }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
            <Leaf className="size-4" />
            {currentSlide.eyebrow}
          </span>

          <h2 className="mt-6 text-4xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {currentSlide.title}
          </h2>

          <p className="mt-5 max-w-lg text-base leading-7 text-white/85 sm:text-lg">
            {currentSlide.description}
          </p>

          <a
            href="#featured"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-[#285B35] transition hover:bg-[#EAF0E4]"
          >
            Explore Plants
            <ArrowRight className="size-5" />
          </a>
        </div>

        <button
          type="button"
          onClick={showPrevious}
          aria-label="Previous slide"
          className="absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-green-900 shadow-md transition hover:bg-white sm:left-5 sm:size-12"
        >
          <ArrowLeft className="size-5" />
        </button>

        <button
          type="button"
          onClick={showNext}
          aria-label="Next slide"
          className="absolute top-1/2 right-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-green-900 shadow-md transition hover:bg-white sm:right-5 sm:size-12"
        >
          <ArrowRight className="size-5" />
        </button>


      </div>
    </section>
  )
}