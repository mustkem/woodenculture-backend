const projectSchema = {
  products: [
    {
      title: "aa",
      description: "aa",
      features: [{ title: "a", desc: "a" }],
      images: [{ url: "a" }],
      categories: [{ id: "aa" }],
    },
  ],
  categories: [
    {
      id: "",
      name: "Bedroom",
      products: ["obj"],
    },
  ],
};

/*
a product can be part of multiple categories
many to many relashionship- save id in both docs

main menu is a object with nested data which is used tocreate header
*/

const menu = [
  {
    title: "Bedroom",
    cate:"bedroom",
    categories: [
      {
        title: "Almerah",
        cate:"almerah",
      },
      {
        title: "Double Bed",
        cate:"double-bed",
      }
      
    ],
  },
  {
    title: "Living",
    cate:"living",
    categories: [
      {
        title: "Cabinates",
        cate:"cabinates",
      },
      {
        title: "Tv Tables",
        cate:"tv-tables",
      }
    ],
  },
  {
    title: "Dining",
    cate:"dining",
    categories: [
      {
        title: "Dining Tables",
        cate:"Dining-tables",
      },
      {
        title: "Dining Storage",
        cate:"dining-storage",
      }
    ],
  },
  {
    title: "Office",
    cate:"office",
    categories: [
      {
        title: "File Cabinates",
        cate:"file-cabinates",
      },
    ],
  },
  {
    title: "Decore",
    cate:"decore",
    categories: [
      {
        title: "Scereens and wall Deviders",
        cate:"screen-and-deviders",
      },
    ],
  },
  {
    title: "Floor",
    cate:"floor",
    categories: [
      {
        title: "Mapple Flooring",
        cate:"mapple-flooring",
      },
    ],
  },
];
