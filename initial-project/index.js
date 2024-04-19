const { ApolloServer } = require("apollo-server");

exports.typeDefs = gql`
  type Query {
    cars: [Car!]!
  }

  type Mutation {
    groupDelete(groupId: ID!)
    groupPublish(groupId: ID!)
    groupUnpublish(groupId: ID!)
    groupAddCars(groupId: ID!, carId: ID!)
    groupRemoveCars(groupId: ID!, carId: ID!)
    groupCreate(groupInput: GroupInput!)
    groupUpdate(groupId: ID!, groupInput: GroupInput!): Group
  }

  type GroupUdatePayload {
    userErrors: [UserErrors!]!
    group: Group
  }

  type UserErrors {
    message: String!
    field: [String!]!
  }

  input GroupInput {
    name: String
    image: ImageInput
    description: String
    featureSet:GroupFeatureFields
  }

  input ImageInput {
    url: String
  }

  type Car {
    id: ID!
    color: String!
    make: String!
  }

  type Group {
    id: ID!
    featureSet: GroupFeatureSet
    hasCar(id: ID!): Boolean!
    cars(skip: Int!, take: Int!): [Car!]!
    name: String!
    image: Image
    description: String!
  }

  type Image {
    id: ID!
    url: String!
  }

  type GroupFeatureSet {
    features: [GroupFeatures!]!
    applyFeaturesSeparately: Boolean!
  }

  enum GroupFeatureFields {
    INCLINE_ENGINE
    RED_PAINT
    BLACK_PAINT
  }

  # type ManualGroup {
  #   Image,
  #   [Car]
  # }

  # type AutomaticGroup {
  #   Image,
  #   [Car]
  #   [GroupFeatures]
  # }

  type GroupFeatures {
    feature: GroupFeatureFields
  }

  # type GroupMembership {
  #   Group
  #   Car
  # }
`;

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query: {
      cars: () => [{ id: 1, color: "blue", make: "Toyota" }],
    },
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
