import { Leaf, Sprout } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import { LoginForm } from "@/routes/login/-components/login-form";

export const Route = createFileRoute("/login/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="grid min-h-screen grid-cols-1 bg-[#FAFAF6] lg:grid-cols-2">
      <style>{`
        @keyframes login-image-reveal {
          0% {
            filter: blur(18px);
            transform: scale(1.08);
            opacity: 0.65;
          }
          100% {
            filter: blur(0);
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes login-content-reveal {
          0% {
            opacity: 0;
            transform: translateY(18px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .login-image-animation,
          .login-content-animation {
            animation: none !important;
          }
        }
      `}</style>

      {/* Left Botanical Panel */}
      <section className="relative isolate flex min-h-[360px] flex-col justify-between overflow-hidden bg-[#123B28] px-7 py-8 text-white sm:px-10 sm:py-10 lg:min-h-screen lg:px-12 lg:py-12">
        {/* Background Image */}
        <div
          aria-hidden="true"
          className="login-image-animation absolute inset-0 -z-20 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/storefront/about-plants.jpg')",
            animation: "login-image-reveal 1.5s ease-out both",
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#062719]/85 via-[#0B3825]/65 to-[#062719]/90" />

        {/* Brand */}
        <div
          className="login-content-animation flex items-center gap-3"
          style={{
            animation: "login-content-reveal 0.8s ease-out 0.2s both",
          }}
        >
          <div className="flex size-11 items-center justify-center rounded-xl bg-[#F0F4E9] text-[#193D25]">
            <Leaf className="size-6" />
          </div>

          <span className="text-2xl font-bold tracking-tight">
            Lush Living
            <span className="text-[#B7D99D]">.</span>
          </span>
        </div>

        {/* Hero Content */}
        <div
          className="login-content-animation my-12 max-w-xl"
          style={{
            animation: "login-content-reveal 0.9s ease-out 0.4s both",
          }}
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#D8EBCB] backdrop-blur-sm">
            <Sprout className="size-4" />A little more green
          </span>

          <h1 className="text-4xl leading-[1.12] font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Bring nature
            <br />
            <span className="font-serif font-medium italic text-[#B7D99D]">
              closer to home.
            </span>
          </h1>

          <p className="mt-6 max-w-md text-sm leading-7 text-white/80 sm:text-base">
            Discover beautiful plants and thoughtful essentials to make every
            corner of your space feel alive.
          </p>
        </div>

        {/* Bottom Text */}
        <div
          className="login-content-animation flex items-center gap-2 text-sm text-white/80"
          style={{
            animation: "login-content-reveal 0.8s ease-out 0.6s both",
          }}
        >
          <Sprout className="size-5 text-[#B7D99D]" />
          <span>Grown with care, always.</span>
        </div>
      </section>

      {/* Right Login Panel */}
      <section className="flex min-h-[600px] items-center justify-center px-5 py-14 sm:px-10 lg:min-h-screen lg:px-12">
        <div
          className="login-content-animation w-full max-w-md"
          style={{
            animation: "login-content-reveal 0.8s ease-out 0.3s both",
          }}
        >
          {/* Form Heading */}
          <div className="mb-9">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#668A62]">
              Welcome back
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#193D25] sm:text-4xl">
              Let's grow together.
            </h2>

            <p className="mt-3 text-sm leading-6 text-stone-500 sm:text-base">
              Sign in to continue your journey with Lush Living.
            </p>
          </div>

          <LoginForm />

          <p className="mt-9 text-center text-xs text-stone-400">
            Grown with care, always. <span className="text-[#668A62]">♥</span>
          </p>
        </div>
      </section>
    </main>
  );
}
