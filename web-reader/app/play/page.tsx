import { useTranslations } from "next-intl";
import ClientRenderWrapper from "./ClientRenderWrapper";
import Link from "next/link";

export default function PlayPage() {

  const t = useTranslations("gameMenu");

  const games = [
    { id: 1, name: "Wheel of Lottery", description: "Wheel of winner", url: "/play/wheel-of-lottery" },
  ];

  return (
    <section className="container mx-auto px-4 py-6 space-y-8">
      <ClientRenderWrapper />
      <h1 className="text-3xl font-bold">📝 {t("play_to_earn")}</h1>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t("game_list")}</h2>
        <ul className="space-y-2">
          {games.map((game) => (
            <li key={game.id} className="border rounded p-4 shadow-sm">
              <Link href={game.url} target={`game-play-${game.id}`}>
                <div className="font-medium">{game.name}</div>
                <div className="text-gray-600">{game.description}</div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
