import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  onShowInstructions?: () => void;
  showInstructions?: boolean;
};

export default function Layout({ children, onShowInstructions, showInstructions }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-incense-smoke-100)] text-[var(--color-liturgical-black-700)]">
     <header role="banner" className="bg-[var(--color-liturgical-white)] text-[var(--color-liturgical-black)] shadow-sm sticky top-0 z-30">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-6 px-4">
        <div className="flex items-center gap-3">
          <img
            src="/CxC_logo.png"
            alt="CodexCommunion Logo"
            className="h-12 w-12 rounded-full object-cover ring-1 ring-[var(--color-liturgical-gold-400)]"
          />
          <span className="text-3xl font-semibold tracking-tight">
            CodexCommunion Requests
          </span>
        </div>

        {onShowInstructions && (
          <button
            onClick={onShowInstructions}
            className="text-sm text-[var(--color-marian-blue-500)] hover:text-[var(--color-immaculate-heart-blue-600)] underline"
          >
            {showInstructions ? "Hide Instructions" : "Show Instructions"}
          </button>
        )}
      </div>
    </header>

      <main role="main" className="flex-1">{children}</main>

    <footer role="contentinfo" className="mt-8 bg-[var(--color-liturgical-white)] border-t border-[var(--color-incense-smoke-400)] px-4 py-3 shadow-inner">
      <div className="max-w-3xl mx-auto text-sm text-[var(--color-incense-smoke-700)] text-center">
        &copy; {new Date().getFullYear()} CodexCommunion. All rights reserved.
      </div>
    </footer>

    </div>
  );
}
