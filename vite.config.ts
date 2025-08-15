import { defineConfig } from "vite";

export default defineConfig({
  base: "/lyrics-front-end/",
  build: {
    rollupOptions: {
      input: {
        index: new URL("index.html", import.meta.url).pathname,
        submit: new URL("submit-song.html", import.meta.url).pathname,
        game: new URL("game.html", import.meta.url).pathname,
      },
    },
  },
});
//had to get help from GPT to make this
