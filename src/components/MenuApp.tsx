import { OrdersProvider } from "@/context/orders";
import { Orders } from "@/components/Orders";
import { Content } from "@/components/Content";
import type { CollectionEntry } from "astro:content";

interface AppProps {
  menu: CollectionEntry<"menu">[];
}

function MenuApp({ menu }: AppProps) {
  return (
    <OrdersProvider>
      <section>
        <Orders />
      </section>
      <section className="my-8">
        <Content menu={menu} />
      </section>
    </OrdersProvider>
  );
}

export { MenuApp };
