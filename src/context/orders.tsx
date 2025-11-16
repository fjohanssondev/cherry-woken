import { createContext, useState } from "react";

export const OrdersContext = createContext<string[] | null>(null);

interface OrdersProviderProps {
  children: React.ReactNode;
}

function OrdersProvider({ children }: OrdersProviderProps) {
  const [orders, setOrders] = useState<string[]>([]);

  return (
    <OrdersContext.Provider value={orders}>{children}</OrdersContext.Provider>
  );
}

export { OrdersProvider };
