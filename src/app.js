// Import the Express framework which provides the routing and middleware
// primitives used to build the HTTP API. Express is a minimal and flexible
// web application framework for Node.js. We use require() because this
// project uses CommonJS modules rather than ES modules.
const express = require("express");

// cookie-parser middleware parses Cookie header and populates req.cookies
// with an object keyed by cookie names. This is useful for applications
// that store session identifiers or authentication tokens in cookies.
// Note: ensure sensitive cookies are set with HttpOnly and Secure flags
// to reduce XSS/CSRF attack surface.
const cookieParser = require("cookie-parser");

// Import the router that handles authentication-related endpoints.
// Keeping routes in separate modules follows separation of concerns and
// makes the app easier to reason about and test. The filename suggests
// it exports an Express Router handling paths like login/register, etc.
const authRouter = require("./routes/auth.routes");

// Import the router that handles post-related endpoints (e.g. create/read
// posts). As with authRouter, this should be an Express Router instance
// defined in a separate file to keep this main app file small.
const postRouter = require("./routes/post.routes");

// Create the main Express application instance. This object is the central
// piece to which middleware and routers are attached. It is lightweight
// and the cost of creating one instance is negligible (O(1) time and memory).
const app = express();

// Built-in middleware to parse incoming requests with JSON payloads and
// make the resulting object available on req.body. This is required for
// APIs that accept application/json. Complexity: O(n) where n is body size.
// Edge cases: large bodies should be limited (via limit option) to avoid
// excessive memory usage or DoS. Consider adding express.json({ limit: '1mb' })
// if the app will be exposed to the public.
app.use(express.json());

// Attach cookie parser middleware so handlers can access cookies via
// req.cookies. This middleware performs lightweight parsing; memory usage
// is proportional to the number of cookies. Be cautious of untrusted
// cookie values and validate/sanitize usage where necessary.
app.use(cookieParser());

// Mount the authentication router under the /api/auth path. All routes
// defined in authRouter will be prefixed with /api/auth. This keeps URL
// namespaces logical and avoids route collisions. Example: authRouter's
// POST /login becomes POST /api/auth/login.
app.use("/api/auth", authRouter);

// Mount the posts router under the /api/posts path. This isolates post
// related endpoints and makes it easy to add middleware (e.g. auth check)
// to this path only in the future.
app.use("/api/posts", postRouter);

// Export the configured Express app so it can be imported by the server
// bootstrap (e.g. bin/www or index.js) where the HTTP server is created
// and the app is bound to a port. Exporting the app rather than creating
// the server here makes testing easier (you can import the app in tests
// and avoid binding to a network port).
module.exports = app;
