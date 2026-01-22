import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { fn } from "storybook/test";
import Button from "../Button.vue";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    action: { action: "clicked" },
    label: { control: "text" },
    icon: {
      src: { control: "text" },
      alt: { control: "text" },
    },
    isIconRight: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextOnly: Story = {
  args: {
    label: "Counter",
    action: fn(),
  },
};

export const TextAndIcon: Story = {
  args: {
    label: "Next",
    icon: {
      src: "/icons/arrow-right.svg",
      alt: "Right arrow icon",
    },
    action: fn(),
  },
};

export const IconAndText: Story = {
  args: {
    label: "Back",
    icon: {
      src: "/icons/arrow-left.svg",
      alt: "Left arrow icon",
    },
    action: fn(),
    isIconRight: false,
  },
};

export const IconOnly: Story = {
  args: {
    icon: {
      src: "/icons/arrow-right.svg",
      alt: "Right arrow icon",
    },
    action: fn(),
  },
};

export const FullWidth: Story = {
  args: {
    label: "Submit",
    action: fn(),
    isFullWidth: true,
  },
};
