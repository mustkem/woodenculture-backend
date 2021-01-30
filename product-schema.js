const projectSchema = {
  products:[{
    "title":"",
    "description":"",
    "features":[
      {"title":"","desc":""}
    ],
    "images":[{"url":""}],
    "categories":[
      {"id":"vanilla"}
    ]
  }],
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
