import { env } from "@/constants/env";

export default function Footer() {
  return (
    <footer className="w-full p-2">
      <div className="text-center text-xs sm:text-sm text-white/50 py-1">
        Built by{" "}
        <a
          href={env.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-white/80 transition-colors"
        >
          Michael Méndez
        </a>
      </div>
    </footer>
  );
}
