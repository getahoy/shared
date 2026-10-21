import { writeFileSync } from "node:fs";
import { tailwindThemeCss, uniwindThemeCss } from "../dist/index.mjs";

writeFileSync(new URL("../dist/tailwind.css", import.meta.url), `${tailwindThemeCss()}\n`);
writeFileSync(new URL("../dist/uniwind.css", import.meta.url), `${uniwindThemeCss()}\n`);
