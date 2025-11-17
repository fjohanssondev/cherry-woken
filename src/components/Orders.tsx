import { useOrders } from "@/context/orders";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { useIsMobile } from "../hooks/useMobile";
import { ShoppingBasket } from "lucide-react";
import { useEffect, useState } from "react";

function Orders() {
  const { orders, setOrders } = useOrders();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = orders.reduce((sum, curr) => {
    return sum + Number(curr.price.slice(0, -3));
  }, 0);

  const handleDeleteOrders = () => {
    setOrders([]);
    localStorage.setItem("orders", JSON.stringify([]));
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      {isMobile ? (
        <Drawer>
          <DrawerTrigger asChild className="fixed bottom-5 right-5">
            <Button className="w-11 h-11" size="icon" variant="default">
              <ShoppingBasket />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Beställning</DrawerTitle>
              <DrawerDescription>
                Här kan du se de rätter som du har lagt till. De sparas även om
                du stänger ner webbsidan och öppnar den vid ett senare
                tillfälle.
              </DrawerDescription>
            </DrawerHeader>
            <div className="grid flex-1 auto-rows-min gap-2 px-4 overflow-auto">
              <p className="font-medium">
                {orders.length > 0
                  ? "Rätter"
                  : "Du har inte lagt till några rätter"}
              </p>
              <ul className="flex flex-col space-y-2">
                {orders
                  .sort((a, b) => Number(a.id) - Number(b.id))
                  .map((order) => (
                    <li className="text-sm text-neutral-800" key={order.id}>
                      {order.id}. {order.name}
                    </li>
                  ))}
              </ul>
            </div>
            <DrawerFooter>
              <p className="mb-4 font-medium">Total kostnad: {total}kr</p>
              <Button onClick={handleDeleteOrders} variant="default">
                Rensa beställning
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Stäng fönster</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <div>
          <div className="flex items-center">
            <h2 className="font-medium text-lg">Beställning</h2>
            <Button
              onClick={handleDeleteOrders}
              className="ml-auto"
              variant="outline"
            >
              Rensa
            </Button>
          </div>
          <ul className="flex flex-col space-y-2 mt-2">
            {orders
              .sort((a, b) => Number(a.id) - Number(b.id))
              .map((order) => (
                <li key={order.id}>
                  {order.id}. {order.name} - {order.price}
                </li>
              ))}
          </ul>
          <p className="mt-4 font-medium">Total kostnad: {total}kr</p>
        </div>
      )}
    </>
  );
}

export { Orders };
