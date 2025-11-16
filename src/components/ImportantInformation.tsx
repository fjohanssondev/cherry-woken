import hours from "../data/opening-hours.json";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "./ui/button";

function ImportantInformation() {
  const today = new Date().getDay();

  console.log(today);
  console.log(hours);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Viktig information</Button>
      </TooltipTrigger>
      <TooltipContent className="bg-neutral-100 text-black">
        <div className="flex flex-col space-y-2">
          <p className="italic text-sm">
            Notera att denna sida inte ägs eller underhålls av Cherry Woken.
            Information kan vara felaktig.
          </p>
          <p className="italic text-sm">
            Innehåll senast kontrollerad: 2025-11-16
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export { ImportantInformation };
