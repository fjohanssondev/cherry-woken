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

  const handleCheckItem = (item: MenuItemDish) => {
    setOrders((prev) => {
      if (prev.some((el) => el.id === item.id)) {
        return prev.filter((p) => p.id !== item.id);
      } else {
        return [...prev, item];
      }
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

                      return (
                        <li key={item.id}>
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-3 flex-1">
                              {/* <Checkbox
            checked={selectedItems.has(item.id)}
            onCheckedChange={(checked) => 
              handleCheckChange(item.id, checked as boolean)
            }
          /> */}
                              <span>
                                {item.showId && `${item.id}. `}
                                {item.name}
                              </span>
                            </div>
                            {item.price && (
                              <span className="font-medium">{item.price}</span>
                            )}
                          </div>

                          {item.subItems && item.subItems.length > 0 && (
                            <ul className="ml-11 mt-2 space-y-1 text-sm text-neutral-600">
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
