import { Navigation } from "@/components/Navigation";
import { Header } from "@/components/Header";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="h-screen bg-background flex w-full overflow-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-md focus:bg-primary focus:text-primary-foreground"
      >
        Skip to main content
      </a>
      <div className="hidden md:block md:h-screen md:overflow-y-auto md:border-r md:border-border/60 bg-background/80 print:hidden">
        <Navigation />
      </div>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="print:hidden">
          <Header />
        </div>
        <main
          id="main-content"
          className="flex-1 w-full px-4 py-4 md:px-6 lg:px-8 overflow-y-auto print:px-0 print:py-0"
          tabIndex={-1}
        >
          <div className="mx-auto max-w-6xl space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
