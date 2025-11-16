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

function Orders() {
  const { orders, setOrders } = useOrders();
  const isMobile = useIsMobile();

  if (orders.length < 1) return null;

  const total = orders.reduce((sum, curr) => {
    return sum + Number(curr.price.slice(0, -3));
  }, 0);

  const handleDeleteOrders = () => {
    setOrders([]);
    localStorage.setItem("orders", JSON.stringify([]));
  };

  return (
    <>
      {isMobile ? (
        <Drawer>
          <DrawerTrigger asChild className="fixed bottom-5 right-5">
            <Button size="icon" variant="default">
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
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
              <p className="font-medium">Rätter</p>
              <ul className="flex flex-col space-y-2">
                {orders.map((order) => (
                  <li key={order.id}>
                    {order.id}. {order.name} - {order.price}
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-medium">Total kostnad: {total}kr</p>
            </div>
            <DrawerFooter>
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
            {orders.map((order) => (
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
