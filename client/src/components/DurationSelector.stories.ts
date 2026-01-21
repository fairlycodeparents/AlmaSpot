import type { Meta, StoryObj } from "@storybook/vue3";
import DurationSelector from "../components/DurationSelector.vue";
import { ref } from "vue";

const meta = {
  title: "Components/DurationSelector",
  component: DurationSelector,
  tags: ["autodocs"],
  argTypes: {
    modelValue: { control: "number" },
    min: { control: "number" },
    max: { control: "number" },
  },
} satisfies Meta<typeof DurationSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: (args) => ({
    components: { DurationSelector },
    setup() {
      const hours = ref(1);
      return { args, hours };
    },
    template: `
      <div class="space-y-4">
        <DurationSelector v-model="hours" :min="args.min" :max="args.max" />
        <p class="text-sm text-gray-500">Valore selezionato: {{ hours }}</p>
      </div>
    `,
  }),
  args: {
    modelValue: 1,
    min: 1,
    max: 10,
  },
};

export const MaxedOut: Story = {
  args: {
    modelValue: 10,
    min: 1,
    max: 10,
  },
};
