import type { Meta, StoryObj } from "@storybook/vue3";
import { ref } from "vue";
import Dropdown from "./Dropdown.vue";

const meta = {
  title: "Components/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  argTypes: {
    modelValue: { control: "text" },
    options: { control: "object" },
    placeholder: { control: "text" },
    isFullWidth: { control: "boolean" },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { Dropdown },
    setup() {
      const selected = ref(args.modelValue);
      return { args, selected };
    },
    template: `
      <div class="min-h-50">
        <Dropdown v-bind="args" v-model="selected" />
      </div>
    `,
  }),
  args: {
    options: ["Cesena", "Bologna", "Rimini"],
    modelValue: "Cesena",
    isFullWidth: false,
  },
};

export const FullWidth: Story = {
  render: (args) => ({
    components: { Dropdown },
    setup() {
      const selected = ref(args.modelValue);
      return { args, selected };
    },
    template: `
      <div class="min-h-50">
        <Dropdown v-bind="args" v-model="selected" />
      </div>
    `,
  }),
  args: {
    options: ["Option A", "Option B", "Option C"],
    modelValue: "",
    placeholder: "Choose an option...",
    isFullWidth: true,
  },
};
