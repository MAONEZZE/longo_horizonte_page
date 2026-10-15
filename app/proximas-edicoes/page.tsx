import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { EditionsCalendar } from "@/components/sections/EditionsCalendar";
import { BackButton } from "@/components/ui/back-button";

export const metadata: Metadata = {
  title: "Próximas edições · Imersão Alta Cadência",
  description: "Calendário das próximas edições da Imersão Alta Cadência.",
};

export default function ProximasEdicoesPage() {
  return (
    <>
      <Nav />
      <main className="relative pt-28 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <BackButton />
          </div>
          <header className="mb-12 text-center">
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-offwhite mb-4">
              Próximas edições
            </h1>
            <p className="text-current/70 text-lg max-w-2xl mx-auto">
              Confira no calendário as datas das próximas edições da imersão. Os dias
              destacados em verde são as edições confirmadas.
            </p>
          </header>

          <EditionsCalendar />
        </div>
      </main>
    </>
  );
}
