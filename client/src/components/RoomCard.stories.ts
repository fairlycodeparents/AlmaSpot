import type { Meta, StoryObj } from "@storybook/vue3";
import { fn } from "storybook/test";
import RoomCard from "./RoomCard.vue";

const meta: Meta<typeof RoomCard> = {
  title: "Components/RoomCard",
  component: RoomCard,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    subtitle: { control: "text" },
    buttonIcon: { control: "text" },
    buttonAction: { action: "button clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof RoomCard>;

export const Visualize: Story = {
  args: {
    title: "Aula 2.4",
    subtitle: "Via dell'Università, 50, Cesena",
    buttonIcon: "icons/arrow-right.svg",
    buttonAction: fn(),
  },
};

export const Delete: Story = {
  args: {
    title: "Game As  Lab",
    subtitle: "Aula 2.12 - Via dell'Università, 50, Cesena",
    buttonIcon: "icons/delete.svg",
    buttonAction: fn(),
  },
};
