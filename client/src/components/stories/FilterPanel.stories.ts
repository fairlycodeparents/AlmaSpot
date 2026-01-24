import type { Meta, StoryObj } from "@storybook/vue3";
import { fn } from "storybook/test";
import FilterPanel from "../FilterPanel.vue";

const meta: Meta<typeof FilterPanel> = {
  title: "Components/FilterPanel",
  component: FilterPanel,
  tags: ["autodocs"],
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Controlla la visibilità del pannello",
    },
    availableTypes: {
      control: "object",
      description: "Lista delle opzioni per il tipo di stanza",
    },
    availableSites: {
      control: "object",
      description: "Lista delle opzioni per la sede",
    },
    currentType: {
      control: "text",
      description: "Valore inizialmente selezionato per il Tipo",
    },
    currentSite: {
      control: "text",
      description: "Valore inizialmente selezionato per la Sede",
    },
    onClose: { action: "close event triggered" },
    onApply: { action: "apply event triggered" },
  },
  args: {
    availableTypes: ["Qualsiasi", "Aula", "Laboratorio"],
    availableSites: ["Qualsiasi", "Via dell'Università", "Piazza Aldo Moro"],
    onClose: fn(),
    onApply: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof FilterPanel>;

export const Open: Story = {
  args: {
    isOpen: true,
    currentType: "Qualsiasi",
    currentSite: "Qualsiasi",
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    currentType: "Qualsiasi",
    currentSite: "Qualsiasi",
  },
};

export const PreSelected: Story = {
  args: {
    isOpen: true,
    currentType: "Laboratorio",
    currentSite: "Via dell'Università",
  },
};
