import { useEffect, useState } from "react";
import { IconBrandGithub } from "@tabler/icons-react";

type HeroSectionProps = {
  onStart: () => void;
};

export default function HeroSection({ onStart }: HeroSectionProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className={`absolute top-24 left-0 right-0 z-20 flex flex-col items-center justify-center text-center px-6 py-16 sm:py-24
        bg-white/80 backdrop-blur-md text-gray-900 transition-all duration-700
        ${visible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}`}
    >


      <h1 className="text-4xl sm:text-5xl font-bold mb-6">
        Share Your Vision.<br className="hidden sm:inline" /> We'll Help Make It Real.
      </h1>

      <p className="text-lg sm:text-xl max-w-2xl mb-4 text-gray-700">
        Have an idea for a tool, digital resource, or software project that could serve the Church?
        This chat will help you express it—clearly and simply.
      </p>

      <p className="max-w-xl text-base sm:text-lg mb-4 text-gray-600">
        If you’re technical and prefer GitHub, you can connect directly here:
      </p>

      <a
        href="https://github.com/codexcommunion"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-800 underline"
      >
        <IconBrandGithub className="h-5 w-5" />
        github.com/codexcommunion
      </a>

      <p className="max-w-xl text-base sm:text-lg mb-8 text-gray-600">
        Otherwise, you can explain your request for a new idea through a chat interface. It's okay if it's messy, the AI tool will help guide and refine the details before saving it.
        We are using a very cost-efficient AI model, so it might take a few seconds for replies to appear, and the AI might get a little confused—so thank you for your patience 🙏
      </p>

      <div className="bg-gray-100 text-gray-800 rounded-md p-4 mb-8 text-left max-w-lg w-full shadow-sm">
        <p className="font-medium mb-2 text-sm uppercase tracking-wide text-gray-500">Consider these tips on how to start the conversation...</p>
        <ul className="list-disc list-inside text-sm leading-relaxed space-y-1">
          <li>“I wish there was an app that helped parishes manage events.”</li>
          <li>“I’m a catechist and I need better ways to organize lesson plans.”</li>
          <li>“Could we build a digital archive for handwritten prayer journals?”</li>
          <li>“I just want a reminder tool for holy days and feast days.”</li>
        </ul>
        <p className="mt-2 text-gray-600 italic">
            If the AI gets confused, try explaining your idea in one message—or reset the chat and try again.
        </p>
      </div>

      <button
        onClick={onStart}
        className="px-6 py-3 rounded-lg text-lg font-medium bg-black text-white hover:bg-gray-800 transition shadow-md"
      >
        Start Chatting
      </button>
    </section>
  );
}
