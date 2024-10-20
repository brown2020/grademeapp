import logo from "@/app/assets/grade512.png";
import SupportPage from "@/components/SupportPage";

export default function page() {
  return (
    <SupportPage
      companyName="Grade.me"
      companyEmail="info@ignitechannel.com"
      companyAddress={"30765 Pacific Coast Hwy #354"}
      companyLocation={"Malibu, CA"}
      updatedAt={"September 1, 2024"}
      companyLogo={logo}
    />
  );
}
