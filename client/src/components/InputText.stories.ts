import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { fn } from "storybook/test";
import InputText from "./InputText.vue";

const meta = {
  title: "Components/InputText",
  component: InputText,
  tags: ["autodocs"],
  argTypes: {
    modelValue: {
      control: "text",
      description: "Il valore del campo di testo (v-model)",
    },
    label: {
      control: "text",
      description: "L'etichetta sopra l'input",
    },
    placeholder: {
      control: "text",
      description: "Il testo segnaposto",
    },
    type: {
      control: "select",
      options: ["text", "password", "email", "number"],
      description: "Il tipo di input",
    },
  },
  args: {
    "onUpdate:modelValue": fn(),
  },
} satisfies Meta<typeof InputText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Email: Story = {
  args: {
    label: "Email",
    placeholder: "Inserisci la tua email istituzionale",
    modelValue: "",
    type: "text",
  },
};

export const Password: Story = {
  args: {
    label: "Password",
    placeholder: "••••••••",
    modelValue: "",
    type: "password",
  },
};
