import { expect, test } from "vitest";
import { Configuration, DefaultApi } from "../client-sdk";
import setupServer, { type ServerTestContext } from "./run_server";

setupServer();

test<ServerTestContext>("says hello", async ({ address }) => {
  const client = new DefaultApi(new Configuration({ basePath: address }));
  expect(await client.sayHello({ name: "my_name" })).toEqual("Hello my_name");
});