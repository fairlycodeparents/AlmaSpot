import type { Meta, StoryObj } from "@storybook/vue3";
import { fn } from "storybook/test";
import ChatInput from "../ChatInput.vue";

const meta = {
  title: "Components/ChatInput",
  component: ChatInput,
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: {
    onSend: fn(),
  },
} satisfies Meta<typeof ChatInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Type your message...",
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithLongText: Story = {
  args: {
    placeholder:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla imperdiet enim nisi, at finibus " +
      "libero aliquet eget. Sed sed magna cursus, suscipit nunc at, interdum mauris. Vivamus malesuada sem eu metus " +
      "sagittis, id iaculis dolor dapibus. Sed eget rutrum arcu. Nulla volutpat dui ut sapien pellentesque suscipit. " +
      "Praesent placerat erat ut justo imperdiet, at vulputate odio facilisis. Nullam in massa vel nulla bibendum " +
      "tincidunt. Sed feugiat, mauris eget fringilla maximus, eros massa pretium dolor, vel vestibulum risus turpis " +
      "a sapien. Vivamus consequat libero eget nisl placerat, in venenatis magna laoreet. Duis congue condimentum " +
      "lorem vel accumsan. Cras egestas vulputate arcu eget efficitur. Interdum et malesuada fames ac ante ipsum " +
      "primis in faucibus.",
  },
};
