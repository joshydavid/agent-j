import { companies } from "@/app/constants/experience";
import Image from "next/image";

export default function Home() {
  return (
    <div className="animate-fade-in">
      <section className="mb-12">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-black">joshua</h1>
        <p className="flex items-center gap-2 text-lg leading-7 text-slate-600 max-w-2xl">
          <span className="relative flex h-2 w-2 translate-y-[1px]">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-300 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-400"></span>
          </span>
          <span>software engineer</span>
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-sm font-bold tracking-widest uppercase text-black">about</h2>
        <div className="space-y-4 text-[15px] leading-relaxed text-slate-600 max-w-2xl">
          <p>
            i&apos;m a software engineer building at the intersection of cloud-native infrastructure and agentic ai.
          </p>
          <p>
            recently i&rsquo;ve been diving into stateful multi-agent systems and the underlying automation that keeps
            them reliable.
          </p>
          <p>away from the terminal, i&apos;m usually brewing a shot of espresso or at the gym.</p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-6 text-sm font-bold tracking-widest uppercase text-black">experience</h2>
        <ul className="space-y-6">
          {companies.map(({ id, company, position, timeline, logo }) => (
            <li key={id} className="flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-4">
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 overflow-hidden rounded-md border border-slate-100 shrink-0">
                    <Image src={logo} alt={`${company} logo`} fill className="object-contain p-1.5" />
                  </div>
                  <span className="text-[15px] font-semibold text-black">{company}</span>
                </div>
                <span className="hidden md:block text-slate-300">/</span>
                <span className="text-[14px] text-slate-600">{position}</span>
              </div>
              <time className="text-[12px] font-mono text-slate-500 whitespace-nowrap">{timeline}</time>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
