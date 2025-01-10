export const allMenu = [
  {
    id: "dashboard",
    name: "Tổng quan",
    link: "",
    icon: "dashboard",
  },
  {
    id: 1,
    name: "Tài khoản",
    link: "customers|roles",
    icon: "customer",
    items: [
      {
        id: 1.1,
        name: "Người dùng",
        link: "customers",
        add: "customers/create",
      },
      {
        id: 1.2,
        name: "Vai trò",
        link: "roles",
        add: "roles/create",
      },
    ],
  },
  {
    id: 2,
    name: "Sản phẩm",
    icon: "product",
    link: "products|authors|product-categories",
    items: [
      {
        id: 2.1,
        name: "Nghệ sĩ",
        link: "authors",
        add: "authors/create",
      },
      {
        id: 2.2,
        name: "Tác phẩm",
        link: "products",
        add: "products/create",
      },
      {
        id: 2.3,
        name: "Danh mục",
        link: "product-categories",
        add: "product-categories/create",
      },
    ],
  },
  {
    id: 6,
    name: "Quản lý đơn hàng",
    icon: "ecommerce",
    link: "orders|draft-orders",
    items: [
      {
        id: 6.1,
        name: "Đơn hàng",
        link: "orders",
      },
      // {
      //   id: 6.2,
      //   name: "Giỏ hàng",
      //   link: "draft-orders",
      // },
    ],
  },
  {
    id: 7,
    name: "Tin tức",
    icon: "ecommerce",
    link: "posts|post-categories|post-tags|post-authors",
    items: [
      {
        id: 7.1,
        name: "Bài viết",
        link: "posts",
      },
      {
        id: 7.2,
        name: "Danh mục",
        link: "post-categories",
      },
      {
        id: 7.3,
        name: "Tag",
        link: "post-tags",
      },
      {
        id: 7.4,
        name: "Tác giả",
        link: "post-authors",
      },
    ],
  },
  {
    id: 8,
    name: "Trang",
    icon: "building",
    link: "pages|component-groups|components",
    items: [
      {
        id: 8.1,
        name: "Trang",
        link: "pages",
        add: "pages/create",
      },
      {
        id: 8.2,
        name: "Nhóm thành phần",
        link: "component-groups",
        add: "component-groups/create",
      },
      {
        id: 8.3,
        name: "Thành phần",
        link: "components",
        add: "components/create",
      }
    ]
  },
  {
    id: 3,
    name: "Cấu hình",
    link: "settings|configurations",
    icon: "setting",
    items: [
      {
        id: 3.1,
        name: "Cài đặt chung",
        link: "settings",
        add: "settings/create",
      },
      {
        id: 3.2,
        name: "Cấu hình chung",
        link: "configurations",
      },
    ],
  },
  {
    id: 9,
    name: "Slide",
    link: "slides",
    icon: "slide",
    add: "slides/create",
  },
  {
    id: 4,
    name: "Menus",
    link: "links",
    icon: "link",
    add: "links/create",
  },
  {
    id: 10,
    name: "Tệp tin",
    link: "files",
    icon: "folder",
  },
  {
    id: 5,
    name: "Biểu mẫu",
    icon: "feedback",
    link: "contacts|receive-notifications",
    items: [
      {
        id: 5.1,
        name: "Liên hệ",
        link: "contacts",
        add: "contacts/create",
      },
      {
        id: 5.2,
        name: "Đăng ký nhận tin",
        link: "receive-notifications",
      },
    ],
  },
];
