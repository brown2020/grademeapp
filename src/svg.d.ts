import type { StaticImageData } from "next/image";

declare module "*.svg" {
  const content: StaticImageData;
  export default content;
}
