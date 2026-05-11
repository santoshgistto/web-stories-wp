// Stub: react-dom/server.browser is pulled in transitively by
// @googleforcreators/react (via its renderToStaticMarkup export). The player
// never calls it, but loading the real module triggers a React/ReactDOM
// version-mismatch check at init time — Next 16 uses a canary react
// internally for the app-pages-browser bundle while react-dom remains on the
// declared version. Aliasing this entry to the stub below sidesteps the
// check without affecting the actual rendering path.
//
// Anyone who genuinely needs server-side rendering should call this from a
// build target that doesn't go through Next's app router.

const unsupported = () => {
  throw new Error(
    "react-dom/server is not available in the @googleforcreators/story-player browser runtime"
  );
};

module.exports = {
  renderToStaticMarkup: unsupported,
  renderToString: unsupported,
  default: unsupported,
};
