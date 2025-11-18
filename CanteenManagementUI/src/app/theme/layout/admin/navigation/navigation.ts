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
    id: 'canteen',
    title: 'CANTEEN MANAGEMENT',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'foodday',
        title: 'Day',
        type: 'item',
        url: '/canteen/food-day',
        icon: 'feather icon-sun'
      },
      {
        id: 'foodmenuitem',
        title: 'Menu item',
        type: 'item',
        url: '/canteen/food-menu-item',
        icon: 'feather icon-users'
      },
      {
        id: 'foodmenuitemprice',
        title: 'Menu item Price',
        type: 'item',
        url: '/canteen/food-menu-item-price',
        icon: 'feather icon-thumbs-up'
      },
      {
        id: 'daywisefoodmenuitem',
        title: 'Day wise menu item',
        type: 'item',
        url: '/canteen/day-wise-food-menu-item',
        icon: 'feather icon-settings'
      },
      {
        id: 'canteennotice',
        title: 'Notice',
        type: 'item',
        url: '/canteen/canteen-notice',
        icon: 'feather icon-file-text'
      },
       {
        id: 'orderitem',
        title: 'Order item',
        type: 'item',
        url: '/canteen/order-item',
        icon: 'feather icon-shopping-cart'
      },
      {
        id: 'orderhistory',
        title: 'Order history',
        type: 'item',
        url: '/canteen/order-history',
        icon: 'feather icon-briefcase'
      },
      {
        id: 'adminorder',
        title: 'Order',
        type: 'item',
        url: '/canteen/admin-order',
       icon: 'feather icon-bell'
      }
    ]
  },
];
