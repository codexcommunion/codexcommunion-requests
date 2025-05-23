import { FC } from "react";

interface Props {
  onReset: () => void;
}

export const ResetChat: FC<Props> = ({ onReset }) => {
  return (
      <button
        className="text-sm sm:text-base text-neutral-900 font-semibold rounded-lg px-4 py-2 bg-neutral-200 hover:bg-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-300"
        onClick={() => onReset()}
      >
        Clear Chat
      </button>
  );
};
;