exports.Product = {
  category: ({categoryId}, args, {db}) => {
    // const { sayHello } = context;
    // sayHello();
    // console.log(context);
    // const categoryId = parent.categoryId;
    return db.categories.find((category) => category.id === categoryId);
  },
  reviews: ({id}, args, {db}) => {
    return db.reviews.filter(review => review.productId === id)
  } 
};