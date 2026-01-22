import type { Meta, StoryObj } from "@storybook/vue3";
import AlertCard from "../AlertCard.vue";

const meta: Meta<typeof AlertCard> = {
  title: "Components/AlertCard",
  component: AlertCard,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    intro: { control: "text" },
    message: { control: "text" },
    timeSlot: { control: "text" },
  },
  parameters: {
    backgrounds: {
      default: "light",
    },
  },
};

export default meta;

type Story = StoryObj<typeof AlertCard>;

export const InvalidPlan: Story = {
  args: {
    title: "Attenzione!",
    intro: "C’è stato un problema con il tuo piano:",
    message: "Una nuova attività si sovrappone al tuo studio delle",
    timeSlot: "17:00-18:00",
  },
};

export const Default: Story = {};
