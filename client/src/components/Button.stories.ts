import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { fn } from "storybook/test";
import Button from "./Button.vue";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    action: { action: "clicked" },
    label: { control: "text" },
    icon: { control: "text" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnlyText: Story = {
  args: {
    label: "Cliccami",
    action: fn(),
  },
};

export const WithIcon: Story = {
  args: {
    label: "Next",
    icon: "/icons/arrow-right.svg",
    action: fn(),
  },
};
