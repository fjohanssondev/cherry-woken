import { useOrders } from "@/context/orders";

function Orders() {
  const { orders } = useOrders();
  return <div>Orders: {JSON.stringify(orders)}</div>;
}

export { Orders };
