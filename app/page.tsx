import { companies } from "@/app/constants/experience";

export default function Home() {
  return (
    <div className="animate-fade-in">
      <section className="mb-12">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-black">joshua</h1>
        <p className="text-lg leading-7 text-slate-600 max-w-2xl">software engineer intern, cpf board</p>
      </section>

      <section className="mt-12">
        <h2 className="mb-6 text-sm font-bold tracking-widest uppercase text-black">experience</h2>
        <ul className="space-y-6">
          {companies.map((exp) => (
            <li key={exp.id} className="flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-4">
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                <span className="text-[15px] font-semibold text-black">{exp.company}</span>
                <span className="hidden md:block text-slate-300">/</span>
                <span className="text-[14px] text-slate-600">{exp.position}</span>
              </div>
              <time className="text-[12px] font-mono text-slate-500 whitespace-nowrap">{exp.timeline}</time>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
