import type { Preview } from "@storybook/vue3-vite";
// @ts-ignore
import "../src/style.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {},
  },
};

export default preview;
