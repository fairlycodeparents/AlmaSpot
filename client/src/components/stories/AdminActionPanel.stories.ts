import type { Meta, StoryObj } from "@storybook/vue3";
import AdminActionPanel from "../AdminActionPanel.vue";
import { fn } from "storybook/test";

const meta = {
  title: "Components/AdminActionPanel",
  component: AdminActionPanel,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    onSubmit: fn(),
  },
} satisfies Meta<typeof AdminActionPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    () => ({
      template: `
        <div class="min-h-screen bg-brand flex flex-col justify-end">
          <div class="flex-1 flex items-center justify-center text-base-background opacity-50 pb-20">
          </div>
          <story />
        </div>
      `,
    }),
  ],
};

export const Isolated: Story = {
  decorators: [
    () => ({
      template: `
        <div class="min-h-screen bg-ui-card flex items-center justify-center p-4">
          <div class="w-full max-w-md">
             <story />
          </div>
        </div>
      `,
    }),
  ],
};
