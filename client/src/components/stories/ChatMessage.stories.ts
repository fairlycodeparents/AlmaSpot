import type { Meta, StoryObj } from "@storybook/vue3";
import { fn } from "storybook/test";
import ChatMessage from "../ChatMessage.vue";

const meta = {
  title: "Components/ChatMessage",
  component: ChatMessage,
  tags: ["autodocs"],
  argTypes: {
    text: { control: "text" },
    avatar: { control: "text" },
    isMine: { control: "boolean" },
    callToAction: { control: "object" },
  },
} satisfies Meta<typeof ChatMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Received: Story = {
  args: {
    text: "Hello! How can I help you?",
    avatar: "https://i.pravatar.cc/150?img=32",
    isMine: false,
  },
};

export const Sent: Story = {
  args: {
    text: "I would like to know the status of my request.",
    avatar: "https://i.pravatar.cc/150?img=11",
    isMine: true,
  },
};

export const WithCTA: Story = {
  args: {
    text: "To proceed, you must confirm your details.",
    avatar: "https://i.pravatar.cc/150?img=32",
    isMine: false,
    callToAction: {
      label: "Data Confirmation",
      action: fn(),
      icon: {
        src: "/icons/arrow-right.svg",
        alt: "Right arrow icon",
      },
    },
  },
};

export const LongText: Story = {
  args: {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    avatar: "https://i.pravatar.cc/150?img=32",
    isMine: false,
  },
};

export const WithoutAvatar: Story = {
  args: {
    text: "This message has no avatar.",
    isMine: true,
  },
};
