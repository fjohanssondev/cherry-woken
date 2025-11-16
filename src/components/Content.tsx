import type { CollectionEntry } from "astro:content";
import { parseMenuMarkdown } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Checkbox } from "@/components/ui/checkbox";
import { useOrders } from "@/context/orders";
import type { MenuItemDish } from "@/types";

interface Props {
  menu: CollectionEntry<"menu">[];
}

function Content({ menu }: Props) {
  const { orders, setOrders } = useOrders();

  const handleCheckChange = (item: MenuItemDish) => {
    setOrders((prev) => {
      const newOrders = prev.some((el) => el.id === item.id)
        ? prev.filter((p) => p.id !== item.id)
        : [...prev, item];

      localStorage.setItem("orders", JSON.stringify(newOrders));
      return newOrders;
    });
  };

  return (
    <Container className="px-0!">
      <div className="flex flex-col gap-8 mt-8">
        {menu
          .sort((a, b) => a.data.order - b.data.order)
          .map(({ data, body }) => {
            const items = body ? parseMenuMarkdown(body) : [];
            return (
              <section key={data.id} id={data.id}>
                <h2 className="font-medium text-lg">{data.title}</h2>
                <div className="menu-content mt-3">
                  <ul className="flex flex-col space-y-2 mt-3">
                    {items.map((item) => {
                      if (item.type === "header") {
                        return (
                          <h3
                            key={item.id}
                            className="font-medium text-base mb-2 not-first:mt-2"
                          >
                            {item.name}
                          </h3>
                        );
                      }

                      const isChecked = orders.some(
                        (order) => order.id === item.id
                      );

                      return (
                        <li key={item.id}>
                          <div
                            onClick={() => handleCheckChange(item)}
                            className="w-full py-1 text-left cursor-pointer"
                          >
                            <div className="flex justify-between items-start space-x-8">
                              <div className="flex items-center gap-3 flex-1">
                                <Checkbox
                                  checked={isChecked}
                                  onClick={(e) => e.stopPropagation()}
                                  className="pointer-events-none"
                                />
                                <span>
                                  {item.showId && `${item.id}. `}
                                  {item.name}
                                </span>
                              </div>
                              {item.price && (
                                <span className="font-medium">
                                  {item.price}
                                </span>
                              )}
                            </div>
                          </div>

                          {item.subItems && item.subItems.length > 0 && (
                            <ul className="ml-4 mt-2 space-y-1 text-sm text-neutral-600">
                              {item.subItems.map((subItem, idx) => (
                                <li key={idx}>- {subItem}</li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </section>
            );
          })}
      </div>
    </Container>
  );
}

export { Content };
