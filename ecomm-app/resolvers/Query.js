exports.Query = {
    hello: (parent, args, context) => {
      return "World!";
      // return null;
    },
    products: (parent, {filter}, {db}) => {
        let filteredProducts = db.products;

        if(filter) {
            const { onSale, avgRating } = filter
            if (onSale) {
                filteredProducts = filteredProducts.filter(product => {
                    return product.onSale;
                })
            }
            if ([1,2,3,4,5].includes(avgRating)) {
                filteredProducts = filteredProducts.filter(product => {
                    let sumRating = 0
                    let noOfReviews = 0;

                    db.reviews.forEach(review => {
                        if (review.productId === product.id) {
                            sumRating += review.rating
                            noOfReviews++;
                        }
                    })
                    const avgProductRating = sumRating/noOfReviews

                    return avgProductRating >= avgRating
                })
            }
        }
        return filteredProducts;
    },
    product: (parent, {id}, {db}) => {
        return db.products.find((product) => product.id === id);
    //   const productId = args.id;
    //   const product = products.find((product) => product.id === id);

    //   if (!product) {
    //     return null;
    //   }
    //   return product;
    },
    categories: (parent, args, {db}) => db.categories,
    category: (parent, {id}, {db}) => {
    //   const { id } = args;
      return db.categories.find((category) => category.id === id);
    },
}