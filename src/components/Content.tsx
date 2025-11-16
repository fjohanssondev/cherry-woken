import type { CollectionEntry } from "astro:content";
import { parseMenuMarkdown } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Checkbox } from "@/components/ui/checkbox";
import { useOrders } from "@/context/orders";

interface Props {
  menu: CollectionEntry<"menu">[];
}

function Content({ menu }: Props) {
  const { orders, setOrders } = useOrders();
  const handleCheckItem = (id: string) => {
    setOrders([...orders, id]);
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
                    {items.map((item) => (
                      <li key={item.id}>
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="flex items-center space-x-4">
                              <span>
                                {item.id}. {item.name}
                              </span>
                              <Checkbox
                                checked={orders.includes(item.id)}
                                onCheckedChange={() => handleCheckItem(item.id)}
                              />
                            </div>
                          </div>
                          {item.price && (
                            <span className="font-medium min-w-14">
                              {item.price}
                            </span>
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
                    ))}
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
