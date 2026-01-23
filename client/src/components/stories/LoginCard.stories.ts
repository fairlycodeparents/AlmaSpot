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
  decorators: [
    () => ({
      template: `
        <div class="flex items-center justify-center min-h-screen bg-brand p-4">
          <div class="w-full max-w-sm">
            <story />
          </div>
        </div>
      `,
    }),
  ],
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
    isRegister: {
      control: "boolean",
      description: "Modalità registrazione (3 campi)",
    },
  },
  args: {
    onLogin: fn(),
    onSignup: fn(),
    onToLogin: fn(),
    onRegisterSubmit: fn(),
    buttonClass: "w-full",
    isRegister: false,
  },
} satisfies Meta<typeof LoginCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoginMode: Story = {
  args: {
    isRegister: false,
    minHeight: "min-h-[200px]",
  },
};

export const RegisterMode: Story = {
  args: {
    isRegister: true,
    minHeight: "min-h-[200px]",
  },
};
