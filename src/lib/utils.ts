import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface MenuItem {
  id: string;
  name: string;
  price?: string;
  subItems?: string[];
}

export function parseMenuMarkdown(markdown: string): MenuItem[] {
  const lines = markdown.split('\n').filter(line => line.trim());
  const items: MenuItem[] = [];
  let currentItem: MenuItem | null = null;

  for (const line of lines) {
    if (line.startsWith('---') || line.startsWith('#') || line.startsWith('import')) {
      continue;
    }

    if (line.includes('<div class="sub">')) {
      continue;
    }
    if (line.includes('</div>')) {
      currentItem = null;
      continue;
    }

    const mainMatch = line.match(/^-\s+(\d+)\\\.\s+(.+?)\s*<span class="price">(.+?)<\/span>/);
    if (mainMatch) {
      currentItem = {
        id: mainMatch[1],
        name: mainMatch[2].trim(),
        price: mainMatch[3],
        subItems: []
      };
      items.push(currentItem);
      continue;
    }

    const subMatch = line.match(/<li>-\s+(.+?)<\/li>/);
    if (subMatch && currentItem) {
      const cleanText = subMatch[1].replace(/<[^>]*>/g, '').trim();
      currentItem.subItems?.push(cleanText);
      continue;
    }
  }

  return items;
}