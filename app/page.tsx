import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { PlayersGrid } from "@/components/players-grid";
import { PracticalInfo } from "@/components/practical-info";
import { Prizes } from "@/components/prizes";
import { RegistrationForm } from "@/components/registration-form";
import { getValidatedJoueurs } from "@/lib/inscriptions";

// Rendu dynamique : la home affiche des inscriptions Firestore + URLs signées
// qui expirent, donc pas de prerendering statique au build ni d'ISR figée.
export const dynamic = "force-dynamic";

export default async function Home() {
  const joueurs = await getValidatedJoueurs();

  return (
    <main>
      <Hero />
      <Prizes />
      <PracticalInfo />

      <section id="inscription" className="bg-white px-6 py-16 sm:py-20">
        <h2 className="mb-10 text-center font-display text-4xl text-kings-blue-dark sm:text-5xl">
          Inscris-toi maintenant
        </h2>
        <RegistrationForm />
      </section>

      <PlayersGrid joueurs={joueurs} />
      <Footer />
    </main>
  );
}
