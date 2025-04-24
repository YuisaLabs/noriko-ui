interface ComponentInfo {
  name: string;
  path: string;
  description: string;
}

const components: ComponentInfo[] = [
  {
    name: "button",
    path: "/packages/ui/src/components/button.tsx",
    description: "A button component",
  }
]

export { components };
export type { ComponentInfo };
