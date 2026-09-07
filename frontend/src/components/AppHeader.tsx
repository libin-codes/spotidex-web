import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";

export function AppHeader() {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <h1 className="text-base font-xl font-semibold font-mono">Spotidex
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size={"icon"}  >
            <FaGithub/>
          </Button>
        </div>
      </div>
    </header>
  );
}
