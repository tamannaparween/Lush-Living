import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Leaf, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Aarav Sharma',
    role: 'Plant Enthusiast',
    initials: 'AS',
    review:
      'I love how plants bring life to my home. Finding beautiful greenery for my space feels so exciting!',
  },
  {
    name: 'Priya Verma',
    role: 'Home Gardener',
    initials: 'PV',
    review:
      'Creating my little green corner has been such a refreshing experience. Every plant makes my space feel special.',
  },
  {
    name: 'Riya Mehta',
    role: 'Nature Lover',
    initials: 'RM',
    review:
      'I enjoy exploring different plants and gardening essentials. There is always something lovely to discover.',
  },
  {
    name: 'Kabir Malhotra',
    role: 'Garden Lover',
    initials: 'KM',
    review:
      'Lush Living inspires me to bring more greenery into my home. Exploring plants has become my favorite hobby!',
  },
]

const sliderItems = [
  { ...testimonials[testimonials.length - 1], key: 'last-clone' },
  ...testimonials.map((item) => ({ ...item, key: item.name })),
  { ...testimonials[0], key: 'first-clone' },
]

export function StorefrontTestimonials() {
  const [currentSlide, setCurrentSlide] = useState(1)
  const [transitionEnabled, setTransitionEnabled] = useState(true)

  const activeIndex =
    (currentSlide - 1 + testimonials.length) % testimonials.length

  const showNext = () => {
    setTransitionEnabled(true)
    setCurrentSlide((current) => current + 1)
  }

  const showPrevious = () => {
    setTransitionEnabled(true)
    setCurrentSlide((current) => current - 1)
  }

  const goToSlide = (index: number) => {
    setTransitionEnabled(true)
    setCurrentSlide(index + 1)
  }

  const handleTransitionEnd = (
    event: React.TransitionEvent<HTMLDivElement>,
  ) => {
    if (
        event.target !== event.currentTarget ||
        event.propertyName !== 'transform'
    ) {
        return
    }

    if (currentSlide === testimonials.length + 1) {
        setTransitionEnabled(false)
        setCurrentSlide(1)
    } else if (currentSlide === 0) {
        setTransitionEnabled(false)
        setCurrentSlide(testimonials.length)
    }
  }

  // Re-enable transition after jumping from a cloned slide.
  useEffect(() => {
    if (!transitionEnabled) {
      const frame = window.requestAnimationFrame(() => {
        setTransitionEnabled(true)
      })

      return () => window.cancelAnimationFrame(frame)
    }
  }, [transitionEnabled])

  // Autoplay: wait 6 seconds after every slide change.
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setTransitionEnabled(true)
      setCurrentSlide((current) => current + 1)
    }, 6000)

    return () => window.clearTimeout(timeout)
  }, [currentSlide])

  return (
    <section className="bg-[#FAFAF6] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-widest text-green-700 uppercase">
            <Leaf className="size-4" />
            Kind words
          </span>

          <h2 className="mt-4 text-3xl font-bold text-[#193D25] sm:text-4xl">
            Little Stories, Greener Spaces
          </h2>

          <p className="mt-4 text-stone-600">
            A little inspiration from our plant-loving community.
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl px-2 sm:px-12">
          <div className="overflow-hidden rounded-3xl">
            <div
                className={`flex w-full ${
                    transitionEnabled
                    ? 'transition-transform duration-[800ms] ease-in-out'
                    : ''
                }`}
                style={{
                    transform: `translateX(-${currentSlide * 100}%)`,
                }}
                onTransitionEnd={handleTransitionEnd}
              >
                {sliderItems.map((testimonial) => (
                    <div
                        key={testimonial.key}
                        className="w-full shrink-0"
                    >
                  <article className="flex min-h-[310px] flex-col items-center gap-7 rounded-3xl border border-[#E3EBDD] bg-[#EEF3E9] px-7 py-10 text-[#193D25] sm:min-h-[290px] sm:flex-row sm:gap-10 sm:px-12 sm:py-12">
                    <div className="flex size-28 shrink-0 items-center justify-center bg-[#DCE9D5] text-3xl font-bold tracking-wide text-[#285B35] [clip-path:polygon(50%_0%,75%_7%,93%_25%,100%_50%,93%_75%,75%_93%,50%_100%,25%_93%,7%_75%,0%_50%,7%_25%,25%_7%)] sm:size-36">
                      {testimonial.initials}
                    </div>

                    <div className="relative flex-1">
                      <Quote className="mb-4 size-9 text-[#8BA77D]" />

                      <p className="text-center text-base leading-8 text-stone-600 sm:text-left sm:text-lg">
                        {testimonial.review}
                      </p>

                      <div className="mt-7 border-t border-[#DCE5D5] pt-5 text-center sm:text-left">
                        <h3 className="text-base font-semibold">
                          {testimonial.name}
                        </h3>

                        <p className="mt-1 text-sm text-stone-500">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={showPrevious}
            aria-label="Previous testimonial"
            className="absolute top-1/2 left-0 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#DCE5D5] bg-white text-green-900 shadow-md transition hover:bg-[#EEF3E9] sm:size-11"
          >
            <ArrowLeft className="size-5" />
          </button>

          <button
            type="button"
            onClick={showNext}
            aria-label="Next testimonial"
            className="absolute top-1/2 right-0 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#DCE5D5] bg-white text-green-900 shadow-md transition hover:bg-[#EEF3E9] sm:size-11"
          >
            <ArrowRight className="size-5" />
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.name}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Go to testimonial ${index + 1}`}
              aria-pressed={activeIndex === index}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? 'w-8 bg-[#285B35]'
                  : 'w-2.5 bg-[#C8D5BE] hover:bg-[#8BA77D]'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}