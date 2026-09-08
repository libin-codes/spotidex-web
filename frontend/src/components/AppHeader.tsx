import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";

export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b-2">
      <div className="flex w-full items-center gap-2 px-4 lg:gap-2 lg:px-6">
      
        <h1 className="font-bold font-mono">Spotidex</h1> 
      
        <div className="ml-auto flex items-center gap-2">
      
          <Button variant="ghost" size={"icon-lg"} onClick={
            ()=>{
              window.location.href =
                "https://github.com/libin-codes/spotidex-web";
            }
          }>
            <FaGithub />
          </Button>
        </div>
      </div>
    </header>
  );
}
