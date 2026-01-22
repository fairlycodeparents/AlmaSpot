import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { fn } from "storybook/test";
import LoginCard from "../LoginCard.vue";

const meta = {
  title: "Components/LoginCard",
  component: LoginCard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    minHeight: {
      control: "text",
      description: "Altezza minima card",
    },
    buttonClass: {
      control: "select",
      options: ["w-full", "w-fit px-8", "w-1/2", "w-64"],
      description: "Larghezza del bottone Sign In",
    },
  },
  args: {
    onLogin: fn(),
    onSignup: fn(),
    buttonClass: "w-full",
  },
} satisfies Meta<typeof LoginCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultCard: Story = {
  args: {
    minHeight: "min-h-[200px]",
  },
  decorators: [
    () => ({
      template: `
        <div class="flex items-center justify-center min-h-screen bg-brand p-4">
          <story />
        </div>
      `,
    }),
  ],
};
