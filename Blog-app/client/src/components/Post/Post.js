import React from "react";
import "./Post.css";
import { gql, useMutation } from "@apollo/client";

const POST_PUBLISH = gql`
  mutation postPublish($postId: ID!) {
    postPublish(postId: $postId) {
      post {
        title
      }
      userErrors {
        message
      }
    }
  }
`;

const POST_UNPUBLISH = gql`
  mutation postUnpublish($postId: ID!) {
    postUnPublish(postId: $postId) {
      post {
        title
      }
      userErrors {
        message
      }
    }
  }
`;

export default function Post({
  title,
  content,
  date,
  user,
  published,
  id,
  isMyProfile,
}) {
  const [PostPublish, { data, loading }] = useMutation(POST_PUBLISH);
  const [PostUnpublish, { data: unPublishData, loading: unPublishLoading }] =
    useMutation(POST_UNPUBLISH);

  const formatedDate = new Date(Number(date));
  return (
    <div
      className="Post"
      style={published === false ? { backgroundColor: "hotpink" } : {}}
    >
      {isMyProfile && published === false && (
        <p
          className="Post__publish"
          onClick={() => {
            PostPublish({
              variables: { postId: id },
            });
          }}
        >
          Publish
        </p>
      )}
      {isMyProfile && published === true && (
        <p
          className="Post__publish"
          onClick={() => {
            PostUnpublish({
              variables: { postId: id },
            });
          }}
        >
          Unpublish
        </p>
      )}
      <div className="Post__header-container">
        <h2>{title}</h2>
        <h4>
          Created At {`${formatedDate}`.split(" ").splice(0, 3).join(" ")} by{" "}
          {user}
        </h4>
      </div>
      <p>{content}</p>
    </div>
  );
}
