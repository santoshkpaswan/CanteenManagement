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
    id: 'navigation',
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
        id: 'order',
        title: 'order',
        type: 'item',
        url: '/canteen/order',
        icon: 'feather icon-shopping-cart'
      },
      {
        id: 'orderitem',
        title: 'order item',
        type: 'item',
        url: '/canteen/order-item',
        icon: 'feather icon-shopping-cart'
      }
    ]
  },

  // {
  //   id: 'request-status',
  //   title: 'Action Request',
  //   type: 'group',
  //   icon: 'icon-group',
  //   children: [
  //     {
  //       id: 'review_access_request',
  //       title: 'Review Access Request',
  //       type: 'item',
  //       url: '/request/approval',
  //       icon: 'feather icon-inbox'
  //     },
  //     {
  //       id: 'action_access_implement',
  //       title: 'Action Access Implement',
  //       type: 'item',
  //       url: '/request/implementation',
  //       icon: 'feather icon-activity'
  //     },
  //     {
  //       id: 'action_access_termination',
  //       title: 'Action Access Termination',
  //       type: 'item',
  //       url: '/temination/access',
  //       icon: 'feather icon-sidebar'
  //     }
  //   ]
  // }
];
