import { Context } from "..";
import { userLoader } from "../loaders/userLoader";

interface PostParentType {
  authorId: number;
}

export const Post = {
    user: (parent: PostParentType, __: any, { prisma }: Context) => {
    // return prisma.user.findUnique({
    //   where: {
    //     id: parent.authorId,
    //   },
    // });
    return userLoader.load(parent.authorId)
  },
};