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
    title: "aa",
    cateId:"",
    categories: [
      {
        title: "aa",
        cateId: "ddd",
      },
    ],
  },
];
