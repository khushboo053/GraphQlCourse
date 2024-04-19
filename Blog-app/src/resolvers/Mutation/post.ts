import { Post, Prisma } from "@prisma/client";
import { Context } from "../../index";
import { CanUserMutatePost } from "../../utils/canUserMutatePost";

interface PostArgs {
  post: {
    title?: string;
    content?: string;
  };
}

interface PostPayLoadType {
  userErrors: {
    message: string;
  }[];
  post: Post | Prisma.Prisma__PostClient<Post> | null;
}

export const postResolvers = {
  postCreate: async (
    _: any,
    { post }: PostArgs,
    { prisma, userInfo }: Context
  ): Promise<PostPayLoadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "Forbidden Access (Unauthenticated)",
          },
        ],
        post: null,
      };
    }

    const { title, content } = post;
    if (!title || !content) {
      return {
        userErrors: [
          {
            message: "You should provide both a title and contents",
          },
        ],
        post: null,
      };
    }

    return {
      userErrors: [],
      post: prisma.post.create({
        data: {
          title,
          content,
          authorId: userInfo.userId,
        },
      }),
    };
  },

  postUpdate: async (
    _: any,
    { post, postId }: { postId: string; post: PostArgs["post"] },
    { prisma, userInfo }: Context
  ): Promise<PostPayLoadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "Forbidden Access (Unauthenticated)",
          },
        ],
        post: null,
      };
    }

    const error = await CanUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });

    if (error) return error;

    const { title, content } = post;

    if (!title && !content) {
      return {
        userErrors: [
          {
            message: "Need to have atleast 1 field to update",
          },
        ],
        post: null,
      };
    }

    const existingPost = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    if (!existingPost) {
      return {
        userErrors: [
          {
            message: "Post does not exist",
          },
        ],
        post: null,
      };
    }

    let payLoadToUpdate = {
      title,
      content,
    };

    // let payLoadToUpdate = {
    //   ...(title ? { title } : {}),
    //   ...(content ? { content } : {}),
    // };

    if (!title) delete payLoadToUpdate.title;
    if (!content) delete payLoadToUpdate.content;

    return {
      userErrors: [],
      post: prisma.post.update({
        data: {
          ...payLoadToUpdate,
        },
        where: {
          id: Number(postId),
        },
      }),
    };
  },

  postDelete: async (
    _: any,
    { postId }: { postId: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayLoadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "Forbidden Access (Unauthenticated)",
          },
        ],
        post: null,
      };
    }

    const error = await CanUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });

    if (error) return error;

    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    if (!post) {
      return {
        userErrors: [
          {
            message: "Post does not exist",
          },
        ],
        post: null,
      };
    }

    await prisma.post.delete({
      where: {
        id: Number(postId),
      },
    });

    return {
      userErrors: [],
      post,
    };
  },

  postPublish: async (
    _: any,
    { postId }: { postId: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayLoadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "Forbidden Access (Unauthenticated)",
          },
        ],
        post: null,
      };
    }

    const error = await CanUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });

    if (error) return error;

    return {
      userErrors: [],
      post: prisma.post.update({
        where: {
          id: Number(postId),
        },
        data: {
          published: true,
        },
      }),
    };
  },

  postUnpublish: async (
    _: any,
    { postId }: { postId: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayLoadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "Forbidden Access (Unauthenticated)",
          },
        ],
        post: null,
      };
    }

    const error = await CanUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });

    if (error) return error;

    return {
      userErrors: [],
      post: prisma.post.update({
        where: {
          id: Number(postId),
        },
        data: {
          published: false,
        },
      }),
    };
  },
};
