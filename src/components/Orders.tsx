import { useOrders } from "@/context/orders";

function Orders() {
  const { orders } = useOrders();

  const total = orders.reduce((sum, curr) => {
    return sum + Number(curr.price.slice(0, -3));
  }, 0);

  return (
    <div>
      <h2 className="font-medium text-lg">Beställning</h2>
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
