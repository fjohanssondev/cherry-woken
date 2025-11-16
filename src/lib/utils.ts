import type { MenuItem, MenuItemDish } from "@/types";

export function parseMenuMarkdown(markdown: string): MenuItem[] {
  const lines = markdown.split('\n').filter(line => line.trim());
  const items: MenuItem[] = [];
  let currentItem: MenuItemDish | null = null;
  let inSubItems = false;
  let itemCounter = 0;

  for (const line of lines) {
    if (line.startsWith('---') || line.startsWith('import')) {
      continue;
    }

    const headerMatch = line.match(/^\*\*(.+?)\*\*$/);
    if (headerMatch) {
      items.push({
        type: 'header',
        id: `header-${itemCounter++}`,
        name: headerMatch[1],
      });
      continue;
    }

    if (line.includes('<div class="sub">')) {
      inSubItems = true;
      continue;
    }
    
    if (line.includes('</div>')) {
      inSubItems = false;
      currentItem = null;
      continue;
    }

    const numberedMatch = line.match(/^-\s+(\d+)\\\.\s+(.+?)\s*<span class="price">(.+?)<\/span>/);
    if (numberedMatch) {
      currentItem = {
        type: 'dish',
        id: numberedMatch[1],
        name: numberedMatch[2].trim(),
        price: numberedMatch[3],
        subItems: [],
        showId: true,
      };
      items.push(currentItem);
      continue;
    }

    const unnumberedMatch = line.match(/^-\s+(.+?)\s*<span class="price">(.+?)<\/span>/);
    if (unnumberedMatch) {
      itemCounter++;
      currentItem = {
        type: 'dish',
        id: `extra-${itemCounter}`,
        name: unnumberedMatch[1].trim(),
        price: unnumberedMatch[2],
        subItems: [],
        showId: false,
      };
      items.push(currentItem);
      continue;
    }

    if (inSubItems) {
      const subMatch = line.match(/<li>-\s+(.+?)<\/li>/);
      if (subMatch && currentItem) {
        const cleanText = subMatch[1].replace(/<[^>]*>/g, '').trim();
        currentItem.subItems?.push(cleanText);
      }
    }
  }

  return items;
}