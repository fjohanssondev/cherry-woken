import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "./ui/button";

function OpeningHours() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Öppettider</Button>
      </TooltipTrigger>
      <TooltipContent className="bg-vibrant text-white">
        <div>
          <h2 className="text-sm font-medium mb-2">Öppettider</h2>
          <p className="text-sm">Måndag - Fredag 11.00 - 20.00</p>
          <p className="text-sm mt-1">Lördag - Söndag 12.00 - 20.00</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export { OpeningHours };
