"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Share, Download, Smartphone, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

const SHORTCUT_URL = "https://www.icloud.com/shortcuts/5eea1f1410d34d479f6e32fed6cd1483";

export default function InstallPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4 rounded-xl">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour
          </Button>
        </Link>

        <h1 className="text-2xl font-semibold mb-2">Ajouter des envies rapidement</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Enregistrez des articles depuis n&apos;importe quel site en un tap.
        </p>

        {/* Raccourci iOS */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Le raccourci Envly</h2>

          <a
            href={SHORTCUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-2xl border border-primary/20 bg-primary/5 p-5 mb-4 transition-all hover:border-primary/40 hover:bg-primary/10"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm mb-0.5">Télécharger le raccourci</h3>
                <p className="text-xs text-muted-foreground">
                  S&apos;installe en un tap via l&apos;app Raccourcis.
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
            </div>
          </a>

          <div className="rounded-2xl border border-border/60 bg-card p-5">
            <h3 className="font-medium text-sm mb-4">Comment l&apos;utiliser</h3>
            <ol className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="h-6 w-6 rounded-lg bg-foreground text-background flex items-center justify-center text-xs font-semibold shrink-0">1</span>
                <span>Ouvrez le site d&apos;un article qui vous plaît</span>
              </li>
              <li className="flex gap-3">
                <span className="h-6 w-6 rounded-lg bg-foreground text-background flex items-center justify-center text-xs font-semibold shrink-0">2</span>
                <span>Appuyez sur le bouton <Share className="h-3.5 w-3.5 inline-block mx-0.5 -mt-0.5" /> <strong className="text-foreground">Partager</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="h-6 w-6 rounded-lg bg-foreground text-background flex items-center justify-center text-xs font-semibold shrink-0">3</span>
                <span>Sélectionnez <strong className="text-foreground">+ Envly</strong> dans la liste des actions</span>
              </li>
              <li className="flex gap-3">
                <span className="h-6 w-6 rounded-lg bg-foreground text-background flex items-center justify-center text-xs font-semibold shrink-0">4</span>
                <span>L&apos;article s&apos;ouvre dans Envly avec toutes les infos pré-remplies</span>
              </li>
            </ol>
          </div>
        </section>

        {/* Séparateur */}
        <div className="border-t border-border/60 my-10" />

        {/* PWA */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Installer l&apos;app</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Ajoutez Envly sur votre écran d&apos;accueil pour y accéder comme une app native.
          </p>

          {/* iOS */}
          <div className="rounded-2xl border border-border/60 bg-card p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">iPhone / iPad</h3>
            </div>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="h-5 w-5 rounded-md bg-foreground/10 flex items-center justify-center text-[11px] font-semibold shrink-0">1</span>
                <span>Ouvrez <strong className="text-foreground">envly.fr</strong> dans Safari</span>
              </li>
              <li className="flex gap-3">
                <span className="h-5 w-5 rounded-md bg-foreground/10 flex items-center justify-center text-[11px] font-semibold shrink-0">2</span>
                <span>Appuyez sur <Share className="h-3.5 w-3.5 inline-block mx-0.5 -mt-0.5" /> puis <strong className="text-foreground">Sur l&apos;écran d&apos;accueil</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="h-5 w-5 rounded-md bg-foreground/10 flex items-center justify-center text-[11px] font-semibold shrink-0">3</span>
                <span>Appuyez sur <strong className="text-foreground">Ajouter</strong></span>
              </li>
            </ol>
          </div>

          {/* Android */}
          <div className="rounded-2xl border border-border/60 bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Android</h3>
            </div>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="h-5 w-5 rounded-md bg-foreground/10 flex items-center justify-center text-[11px] font-semibold shrink-0">1</span>
                <span>Ouvrez <strong className="text-foreground">envly.fr</strong> dans Chrome</span>
              </li>
              <li className="flex gap-3">
                <span className="h-5 w-5 rounded-md bg-foreground/10 flex items-center justify-center text-[11px] font-semibold shrink-0">2</span>
                <span>Menu <strong className="text-foreground">⋮</strong> → <strong className="text-foreground">Installer l&apos;application</strong></span>
              </li>
            </ol>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
