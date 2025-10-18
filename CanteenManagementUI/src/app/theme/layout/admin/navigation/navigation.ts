export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: NavigationItem[];
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'navigation1',
    title: 'Home',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/user/home',
        icon: 'feather icon-home'
      }
    ]
  },
   {
    id: 'canteen',
    title: 'Canteen',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'foodday',
        title: 'Food Day',
        type: 'item',
        url: '/canteen/food-day',
        icon: 'feather icon-calendar'
      },
      {
        id: 'foodmenuitem',
        title: 'food menu item',
        type: 'item',
        url: '/canteen/food-menu-item',
        icon: 'feather icon-file-text'
      },
      {
        id: 'foodmenuitemprice',
        title: 'food menu item Price',
        type: 'item',
        url: '/canteen/food-menu-item-price',
        icon: 'feather icon-file-text'
      },
      {
        id: 'daywisefoodmenuitem',
        title: 'day wise food menu item',
        type: 'item',
        url: '/canteen/day-wise-food-menu-item',
        icon: 'feather icon-file-text'
      },
       {
        id: 'orderitem',
        title: 'order item',
        type: 'item',
        url: '/canteen/order-item',
        icon: 'feather icon-shopping-cart'
      },
      {
        id: 'orderhistory',
        title: 'order history',
        type: 'item',
        url: '/canteen/order-history',
        icon: 'feather icon-shopping-cart'
      },
      {
        id: 'adminorder',
        title: 'admin order',
        type: 'item',
        url: '/canteen/admin-order',
       icon: 'feather icon-file-text'
      }
    ]
  },
];
