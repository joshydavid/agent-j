import { companies } from "@/app/constants/experience";

export default function Home() {
  return (
    <div className="animate-fade-in">
      <section className="mb-12">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-black">joshua</h1>
        <p className="text-lg leading-7 text-slate-600 max-w-2xl">software engineer intern, cpf board</p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-sm font-bold tracking-widest uppercase text-black">about</h2>
        <div className="space-y-4 text-[15px] leading-relaxed text-slate-600 max-w-2xl">
          <p>i'm a software engineer building at the intersection of cloud-native infrastructure and agentic ai.</p>
          <p>
            recently i’ve been diving into stateful multi-agent systems and the underlying automation that keeps them
            reliable.
          </p>
          <p>away from the terminal, i'm usually brewing a shot of espresso or at the gym.</p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-6 text-sm font-bold tracking-widest uppercase text-black">experience</h2>
        <ul className="space-y-6">
          {companies.map(({ id, company, position, timeline }) => (
            <li key={id} className="flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-4">
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                <span className="text-[15px] font-semibold text-black">{company}</span>
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
