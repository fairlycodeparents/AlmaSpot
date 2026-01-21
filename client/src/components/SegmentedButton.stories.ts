import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { fn } from "storybook/test";
import { ref } from "vue";
import SegmentedButton from "./SegmentedButton.vue";

const meta = {
  title: "Components/SegmentedButton",
  component: SegmentedButton,
  tags: ["autodocs"],
  argTypes: {
    modelValue: {
      control: "text",
      description: "Il valore attualmente selezionato",
    },
    options: {
      control: "object",
      description: "Lista delle opzioni disponibili",
    },
  },
  args: {
    "onUpdate:modelValue": fn(),
  },
} satisfies Meta<typeof SegmentedButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AddSelected: Story = {
  args: {
    modelValue: "add",
    options: [
      {
        label: "Add",
        value: "add",
        icon: {
          src: "https://api.iconify.design/lucide:check.svg",
          alt: "Check",
        },
      },
      { label: "Remove", value: "remove" },
    ],
  },
};

export const RemoveSelected: Story = {
  args: {
    modelValue: "remove",
    options: [
      { label: "Add", value: "add" },
      {
        label: "Remove",
        value: "remove",
        icon: {
          src: "https://api.iconify.design/lucide:check.svg",
          alt: "Check",
        },
      },
    ],
  },
};

export const InteractiveDemo: Story = {
  render: (args) => ({
    components: { SegmentedButton },
    setup() {
      const currentVal = ref(args.modelValue);
      return { args, currentVal };
    },
    template: `
      <div class="p-8 space-y-4">
        <h3 class="text-sm text-gray-500 font-bold uppercase">Anteprima Interattiva</h3>
        
        <SegmentedButton 
          v-model="currentVal" 
          :options="args.options" 
        />

        <div class="mt-4 p-3 bg-gray-100 rounded text-xs font-mono text-gray-600">
          Valore selezionato: <strong>{{ currentVal }}</strong>
        </div>
      </div>
    `,
  }),
  args: {
    modelValue: "add",
    options: [
      {
        label: "Add",
        value: "add",
        action: fn(),
        icon: {
          src: "https://api.iconify.design/lucide:check.svg",
          alt: "Check",
        },
      },
      {
        label: "Remove",
        value: "remove",
        action: fn(),
        icon: {
          src: "https://api.iconify.design/lucide:check.svg",
          alt: "Check",
        },
      },
    ],
  },
};
