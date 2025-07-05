import { useTranslations } from "next-intl";
import ClientRenderWrapper from "./ClientRenderWrapper";
import Link from "next/link";

export default function PlayPage() {
  const t = useTranslations("gameMenu");

  const games = [
    {
      id: 1,
      name: t("lottery"),
      description: t("lottery"),
      url: "/play/wheel-of-lottery",
      icon: (
        <img
          className="w-[32px] h-[32px] md:w-[64px] md:h-[64px]"
          width="64"
          height="64"
          src="https://img.icons8.com/external-microdots-premium-microdot-graphic/64/external-lottery-lifestyle-entertainment-vol3-microdots-premium-microdot-graphic.png"
          alt="external-lottery-lifestyle-entertainment-vol3-microdots-premium-microdot-graphic"
        />
      ),
    },
  ];

  return (
    <section className="container mx-auto px-4 py-6 space-y-8">
      <ClientRenderWrapper />
      <h1 className="text-3xl font-bold">📝 {t("play_to_earn")}</h1>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t("game_list")}</h2>
        <div className="flex flex-wrap gap-4">
          {games.map((game) => (
            <div
              key={game.id}
              className="border border-solid border-yellow-200/50 rounded-md p-4 shadow-sm"
            >
              <Link href={game.url} target={`game-play-${game.id}`}>
                <div className="cursor-pointer flex flex-col justify-center items-center gap-2">
                  {game.icon}
                  <span className="text-[8px]">{game.name}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
