import { ApolloServer } from "apollo-server";
import  { typeDefs } from "./schema"
import { Mutation, Post, Profile, Query, User } from "./resolvers"
import { PrismaClient, Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { getUserFromToken } from "./utils/getUserFromToken";

export const prisma = new PrismaClient()

export interface Context {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
  userInfo: {
    userId: number; 
  } | null;
}

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    Profile,
    Post,
    User
  },
  context: async ({req}: any): Promise<Context> => {
    // console.log({thisIsTheHeaders: req.headers.authorization});
    const userInfo = await getUserFromToken(req.headers.authorization)
    return {
      prisma,
      userInfo,
    };
  }
});

server.listen().then(({ url }) => {
    console.log(`Server listening at port: ${url}`);
}) 