const ROOT_URL = process.env.ROOT_URL;
const httpEndpoint = `${ROOT_URL}/graphql`;

export default (context) => {
  var csrfToken = context.$config.csrfToken
  if (process.server) {
    //console.log("req", context.req.headers.cookie);
    csrfToken = context.res.locals.csrfToken
  }
  console.log("apollo", csrfToken);
  return {
    httpEndpoint: httpEndpoint,
    wsEndpoint: `${ROOT_URL.replace(/^http/, 'ws')}/graphql`,
    httpLinkOptions: {
      headers: { "CSRF-Token": csrfToken },
      credentials: 'include'
    }
  };
};
