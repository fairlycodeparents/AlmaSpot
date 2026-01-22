import type { Meta, StoryObj } from "@storybook/vue3";
import Dropdown from "./Dropdown.vue";
import { ref, watch } from "vue";

type OptionObj = { label: string; value: string };

const getSmartDateOptions = (): OptionObj[] => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // @ts-ignore
  const toISO = (d: Date): string => d.toISOString().split("T")[0];

  return [
    { label: "Oggi", value: toISO(today) },
    { label: "Domani", value: toISO(tomorrow) },
  ];
};

const generateTimeSlots = () => {
  return Array.from({ length: 13 }, (_, i) => {
    const hour = (i + 8).toString().padStart(2, "0");
    return `${hour}:00`;
  });
};

const meta = {
  title: "Components/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  argTypes: {
    modelValue: { control: "text" },
    isFullWidth: { control: "boolean" },
    placeholder: { control: "text" },
    options: { control: "object" },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const renderTemplate = (args: any) => ({
  components: { Dropdown },
  setup() {
    const selected = ref(args.modelValue || "");

    watch(
      () => args.modelValue,
      (newVal) => {
        selected.value = newVal;
      },
    );

    return { args, selected };
  },
  template: `
    <div class="p-2 bg-gray-50 min-h-40 flex flex-col items-start gap-6">
      <Dropdown
          v-bind="args"
          v-model="selected"
      />
      
      <span class="font-mono">{{ selected || '(vuoto)' }}</span>
    </div>
  `,
});

export const Locations: Story = {
  render: renderTemplate,
  args: {
    options: ["Cesena", "Bologna", "Forlì", "Rimini", "Ravenna"],
    placeholder: "Seleziona Campus",
    modelValue: "",
    isFullWidth: true,
  },
};

export const DateSelection: Story = {
  render: renderTemplate,
  args: {
    options: getSmartDateOptions(),
    placeholder: "Scegli Giorno",
    modelValue: "",
    isFullWidth: false,
  },
};

export const TimeSelection: Story = {
  render: renderTemplate,
  args: {
    options: generateTimeSlots(),
    placeholder: "Ora Inizio",
    modelValue: "09:00",
    isFullWidth: false,
  },
};
