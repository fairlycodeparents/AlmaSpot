import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { fn } from "storybook/test";
import { ref } from "vue";
import SegmentedButton from "./SegmentedButton.vue";

const meta = {
  title: "Components/SegmentedButton",
  component: SegmentedButton,
  tags: ["autodocs"],
  argTypes: {
    modelValue: { control: "text" },
    options: { control: "object" },
    containerClass: {
      control: "select",
      options: ["w-full", "w-fit", "w-64", "w-full max-w-sm"],
      description: "Larghezza del componente",
    },
  },
  args: {
    "onUpdate:modelValue": fn(),
    containerClass: "w-full",
  },
  decorators: [
    () => ({
      template: '<div class="flex justify-center w-full p-4"><story /></div>',
    }),
  ],
} satisfies Meta<typeof SegmentedButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AddSelected: Story = {
  args: {
    modelValue: "aggiungi",
    options: [
      {
        label: "Aggiungi",
        value: "aggiungi",
        icon: {
          src: "https://api.iconify.design/lucide:check.svg",
          alt: "Check",
        },
      },
      { label: "Rimuovi", value: "rimuovi" },
    ],
  },
};

export const RemoveSelected: Story = {
  args: {
    modelValue: "rimuovi",
    options: [
      { label: "Aggiungi", value: "aggiungi" },
      {
        label: "Rimuovi",
        value: "rimuovi",
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
      <div class="p-8 space-y-4 flex flex-col items-center w-full">
        <h3 class="text-sm text-base-text font-bold uppercase">Anteprima Interattiva</h3>

        <SegmentedButton
          v-model="currentVal"
          :options="args.options"
          :container-class="args.containerClass"
        />

        <div class="mt-4 p-3 bg-gray-100 rounded text-xs font-mono text-base-text">
          Valore selezionato: <strong>{{ currentVal }}</strong>
        </div>
      </div>
    `,
  }),
  args: {
    modelValue: "aggiungi",
    options: [
      {
        label: "Aggiungi",
        value: "aggiungi",
        action: fn(),
        icon: {
          src: "https://api.iconify.design/lucide:check.svg",
          alt: "Check",
        },
      },
      {
        label: "Rimuovi",
        value: "rimuovi",
        action: fn(),
        icon: {
          src: "https://api.iconify.design/lucide:check.svg",
          alt: "Check",
        },
      },
    ],
  },
};
