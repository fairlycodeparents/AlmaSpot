import type { Meta, StoryObj } from "@storybook/vue3";
import ScheduleCard from "./ScheduleCard.vue";

const meta: Meta<typeof ScheduleCard> = {
  title: "Components/ScheduleCard",
  component: ScheduleCard,
  tags: ["autodocs"],
  argTypes: {
    startTime: { control: "text" },
    endTime: { control: "text" },
    roomName: { control: "text" },
    campusName: { control: "text" },
    address: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof ScheduleCard>;

export const Default: Story = {
  args: {
    startTime: "17:00",
    endTime: "18:00",
    roomName: "Aula 3.1",
    campusName: "Campus Cesena",
    address: "Via dell’Università, 50, Cesena",
  },
};

export const LongContent: Story = {
  args: {
    startTime: "09:00",
    endTime: "13:00",
    roomName: "LABORATORIO MORFOLOGICO NAVILE",
    campusName: "Campus Bologna",
    address: "Via della Beverara, 123",
  },
};
