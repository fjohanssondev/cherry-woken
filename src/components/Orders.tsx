import { useOrders } from "@/context/orders";
import { Button } from "@/components/ui/button";

function Orders() {
  const { orders, setOrders } = useOrders();

  if (orders.length < 1) return null;

  const total = orders.reduce((sum, curr) => {
    return sum + Number(curr.price.slice(0, -3));
  }, 0);

  const handleDeleteOrders = () => {
    setOrders([]);
    localStorage.setItem("orders", JSON.stringify([]));
  };

  return (
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
  );
}

export { Orders };
