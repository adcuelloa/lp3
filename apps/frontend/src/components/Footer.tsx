export default function Footer() {
  return (
    <footer className="bg-espresso relative mt-24">
      <div className="bg-primary h-0.75 w-full" />

      <svg
        className="absolute right-0 left-0 block"
        width="100%"
        height="48"
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fill: "var(--color-background)", top: "-1px" }}
        aria-hidden="true"
      >
        <path d="M0,0 L0,20 C480,60 960,0 1440,40 L1440,0 Z" />
      </svg>

      <div className="mx-auto max-w-5xl px-6 py-14">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <span
            className="text-[10px] font-semibold tracking-[0.3em] text-white/30 uppercase"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Created by
          </span>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {["Andrés Cuello", "Robert Coha", "Diego Safar"].map((name) => (
              <span
                key={name}
                className="text-sm font-medium tracking-wide text-white/60"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {name}
              </span>
            ))}
          </div>
          <p
            className="mt-4 text-[10px] tracking-wider text-white/20 uppercase"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Feline Adoption Center · 2025
          </p>
        </div>
      </div>
    </footer>
  );
}
