interface BaseItem {
  id: string;
  name: string;
}

export interface MenuItemHeader extends BaseItem {
  type: 'header';
}

export interface MenuItemDish extends BaseItem {
  type: "dish",
  price: string;
  subItems?: string[];
  showId?: boolean;
}

export type MenuItem = MenuItemHeader | MenuItemDish;