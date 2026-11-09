import { Leaf, Sprout } from "lucide-react";

export function StorefrontAbout() {
  return (
    <section className="overflow-hidden bg-[#FAFAF6] py-16 md:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-0 px-4 sm:px-6 md:grid-cols-2 md:gap-10 lg:gap-16 lg:px-8">
        {/* Plant Image */}
        <div className="relative">
          <img
            src="/images/storefront/about-plants.jpg"
            alt="Beautiful indoor plants creating a fresh living space"
            className="h-[360px] w-full rounded-3xl object-cover shadow-lg transition-opacity duration-700 ease-in-out md:h-[420px] md:opacity-100"
          />

          {/* Mobile image fade overlay */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-transparent via-[#FAFAF6]/60 to-[#FAFAF6] transition-opacity duration-700 md:hidden" />

          {/* Floating badge */}
          <div className="absolute top-4 right-3 flex items-center gap-3 rounded-2xl bg-white/95 p-3 shadow-lg sm:right-5 md:top-auto md:right-5 md:bottom-5">
            <div className="flex size-11 items-center justify-center rounded-full bg-[#EEF3E9]">
              <Sprout className="size-6 text-[#52764A]" />
            </div>

            <div>
              <p className="font-semibold text-[#193D25]">Grow with nature</p>
              <p className="text-xs text-stone-500">Create your green space</p>
            </div>
          </div>
        </div>

        {/* About Content */}
        <div className="relative z-10 -mt-28 px-3 pb-2 transition-[margin] duration-700 ease-in-out md:mt-0 md:px-0 md:pb-0">
          <div className="rounded-3xl bg-[#FAFAF6]/80 p-5 backdrop-blur-[2px] md:rounded-none md:bg-transparent md:p-0 md:backdrop-blur-none">
            <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-widest text-green-700 uppercase">
              <Leaf className="size-4" />
              About Lush Living
            </span>

            <h2 className="mt-4 text-3xl leading-tight font-bold text-[#193D25] md:text-4xl">
              Bringing a Little More Green Into Your Life
            </h2>

            <p className="mt-6 text-base leading-7 text-stone-600">
              At Lush Living, we believe that plants make every space feel more
              welcoming, peaceful and alive. Our collection brings together
              beautiful plants and gardening essentials to help you create your
              own green sanctuary.
            </p>

            <p className="mt-4 text-base leading-7 text-stone-600">
              Whether you are starting your first plant collection or adding to
              an existing garden, we are here to make your journey with nature a
              little easier and more enjoyable.
            </p>

            <a
              href="#categories"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#285B35] px-7 py-3 font-semibold text-white transition hover:bg-[#1D4729]"
            >
              Discover Our Collection
              <Leaf className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
