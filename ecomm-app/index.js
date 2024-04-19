const { ApolloServer } = require('apollo-server')
const { typeDefs } = require('./schema');
const { Query } = require('./resolvers/Query');
const { Category } = require('./resolvers/Category');
const { Product } = require('./resolvers/Product');
const { db } = require('./db');
const { Mutation } = require('./resolvers/Mutation');

const server = new ApolloServer({
    typeDefs,
    resolvers: {
      Query,
      Mutation,
      Category,
      Product
    },
    context: {
      // sayHello: () => console.log('Hello')
     db
    }
});

server.listen().then(({ url }) => {
  console.log(`Server is running at port: ${url}`);
})