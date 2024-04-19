const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    hello: String!
    noOfAnimals: Int
    price: Float
    isCool: Boolean
    fruits: [String!]!
  }
`;

const resolvers = {
  Query: {
    hello: (parent, args, context) => {
      return "World!";
      // return null;
    },
    noOfAnimals: () => {
        return 100;
    },
    price: () => {
        return 24678.245789;
    },
    isCool: () => {
        return true
    },
    fruits: () => {
        return  ['Apple', 'Banana']
        // return null
    },
    }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
server.listen().then(({ url }) => {
  console.log(`Server is running at port: ${url}`);
});
