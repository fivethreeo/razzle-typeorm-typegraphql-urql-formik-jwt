
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { createConnection } from 'typeorm';
import { buildSchema } from 'type-graphql';
import React from "react";
import express from "express";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { UserResolver } from "./schema/userResolver";
import App from "./App";

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const cssLinksFromAssets = (public_path, assets, entrypoint) => {
  return assets[entrypoint]
    ? assets[entrypoint].css
      ? assets[entrypoint].css
          .map(
            (asset) => `<link rel="stylesheet" href="${public_path}${asset}">`
          )
          .join("")
      : ""
    : "";
};

const jsScriptTagsFromAssets = (
  public_path,
  assets,
  entrypoint,
  extra = ""
) => {
  return assets[entrypoint]
    ? assets[entrypoint].js
      ? assets[entrypoint].js
          .map(
            (asset) => `<script src="${public_path}${asset}"${extra}></script>`
          )
          .join("")
      : ""
    : "";
};

const server = express();

export const renderApp = async (req, res) => {
  const public_path =
    typeof CODESANDBOX_HOST !== "undefined"
      ? `https://${CODESANDBOX_HOST}/`
      : "http://localhost:3001/";

  const context = {};
  const markup = renderToString(
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );

  const html =
    // prettier-ignore
    `<!doctype html>
      <html lang="">
      <head>
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta charSet='utf-8' />
          <title>Welcome to Razzle</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <script type="text/javascript">
            window.PUBLIC_PATH = '${public_path}';
          </script>
          ${cssLinksFromAssets(public_path, assets, 'client')}            
      </head>
      <body>
          <div id="root">${markup}</div>
          <!-- razzle_static_js -->
          ${jsScriptTagsFromAssets(public_path, assets, 'client', ' defer crossorigin')}
      </body>
  </html>`;

  return { html, context };
};

const createserver = async () => {
  const connection = await createConnection();

  const schema = await buildSchema({
    resolvers: [UserResolver]
  });

  const apolloServer = new ApolloServer({ schema });
  let server = express();

  await apolloServer.start()
  
  apolloServer.applyMiddleware({ app: server });

  server = server
    .disable("x-powered-by")
    .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
    .get("/*", async (req, res) => {
      const { html, context } = await renderApp(req, res);

      if (context.url) {
        // Somewhere a `<Redirect>` was rendered
        return res.redirect(301, context.url);
      }

      res.send(html);
    });

  return server;
};

export default createserver();
