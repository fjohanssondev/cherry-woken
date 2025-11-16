import type { MenuItemDish } from "@/types";
import { createContext, useContext, useState } from "react";

type OrdersContextType = {
  orders: MenuItemDish[];
  setOrders: React.Dispatch<React.SetStateAction<MenuItemDish[]>>;
};

export const OrdersContext = createContext<OrdersContextType | null>(null);

interface OrdersProviderProps {
  children: React.ReactNode;
}

function OrdersProvider({ children }: OrdersProviderProps) {
  const [orders, setOrders] = useState<MenuItemDish[]>([]);

  return (
    <OrdersContext.Provider value={{ orders, setOrders }}>
      {children}
    </OrdersContext.Provider>
  );
}

function useOrders() {
  const context = useContext(OrdersContext);

  if (!context) {
    throw new Error("useOrders must be used within OrdersProvider");
  }

  return context;
}

export { OrdersProvider, useOrders };
