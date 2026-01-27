import type { Meta, StoryObj } from "@storybook/vue3";
import ActionPanel from "../ActionPanel.vue";
import { fn } from "storybook/test";
import { createPinia, setActivePinia } from "pinia";
import { useParameterStore } from "@/stores/parameter.store";

const withPinia = (story: any) => ({
  components: { story },
  setup() {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useParameterStore();

    store.selectedCampus = "Cesena";
    store.fetchCampuses = async () => {};

    return {};
  },
  template: "<story />",
});

const withBackground = (story: any) => ({
  components: { story },
  template: `
    <div class="bg-brand min-h-[600px] w-full flex flex-col justify-end p-4">
      <div class="flex-1 flex items-center justify-center text-white opacity-50 pb-20">
         Contenuto Background
      </div>
      <story />
    </div>
  `,
});

const meta = {
  title: "Components/ActionPanel",
  component: ActionPanel,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [withPinia, withBackground],
  args: {
    onSubmit: fn(),
  },
} satisfies Meta<typeof ActionPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StudentView: Story = {
  args: {
    isAdmin: false,
  },
};

export const AdminView: Story = {
  args: {
    isAdmin: true,
  },
};

export const AdminAddMode: Story = {
  args: {
    isAdmin: true,
  },
};
