import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  onShowInstructions?: () => void;
  showInstructions?: boolean;
};

export default function Layout({ children, onShowInstructions, showInstructions }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 text-gray-800">
     <header className="bg-white text-gray-900 shadow-sm sticky top-0 z-30">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-6 px-4">
        <div className="flex items-center gap-3">
          <img
            src="/CxC_logo.png"
            alt="CodexCommunion Logo"
            className="h-12 w-12 rounded-full object-cover ring-1 ring-yellow-400"
          />
          <span className="text-3xl font-semibold tracking-tight">
            CodexCommunion Requests
          </span>
        </div>

        {onShowInstructions && (
          <button
            onClick={onShowInstructions}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            {showInstructions ? "Hide Instructions" : "Show Instructions"}
          </button>
        )}
      </div>
    </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-white border-t border-neutral-300 px-4 py-3 shadow-inner">
        <div className="max-w-3xl mx-auto text-sm text-neutral-500 text-center">
          &copy; {new Date().getFullYear()} CodexCommunion. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
