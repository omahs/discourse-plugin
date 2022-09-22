import { isTypeof } from "./is-typeof";

function validate({ threadId, body, csrf }) {
  isTypeof(body, "string");
  isTypeof(csrf, "string");
  isTypeof(threadId, "number");

  if (!(threadId && body && csrf)) {
    throw new Error("Something is missing from params.");
  }

  if (body.length < 20) {
    throw new Error("Body should have at least 20 chars.");
  }
}

/**
 * Post to a topic on discourse
 * @returns
 */
export default function postToTopic({
  /**
   * The topic/thread id
   */
  threadId,
  /**
   * The body content. Must be at least 20 char
   */
  body,
  /**
   * CSRF token provided by the session (`this.session.csrfToken`)
   */
  csrf,
}) {
  validate(...arguments);

  const reqBody = {
    raw: body,
    topic_id: threadId,
  };

  return fetch("/posts.json", {
    credentials: "include",
    headers: {
      "X-CSRF-Token": csrf,
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(reqBody),
    method: "POST",
    mode: "cors",
  }).then((res) => res.json());
}
