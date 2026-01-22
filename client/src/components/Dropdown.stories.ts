import type { Meta, StoryObj } from "@storybook/vue3";
import Dropdown from "./Dropdown.vue";
import { ref } from "vue";

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
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const renderTemplate = (args: any) => ({
  components: { Dropdown },
  setup() {
    const selected = ref(args.modelValue || "");
    return { args, selected };
  },
  template: `
    <div class="p-4 bg-gray-50 min-h-37.5">
      <Dropdown
          v-model="selected"
          v-bind="args"
      />

      <div class="mt-4 text-xs text-gray-500">
        Valore reale (Model): <span class="font-mono font-bold">{{ selected || '(vuoto)' }}</span>
      </div>
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
    modelValue: "09:00", // Esempio pre-selezionato
    isFullWidth: false,
  },
};
