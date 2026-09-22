import TermsPart1 from "./TermsPart1";
import TermsPart2 from "./TermsPart2";
import TermsPart3 from "./TermsPart3";

type Props = {
  companyName: string;
  companyEmail: string;
  privacyLink: string;
  updatedAt: string;
};

export default function TermsPage(props: Props) {
  return (
    <div className="text-wrapper">
      <TermsPart1 {...props} />
      <TermsPart2 {...props} />
      <TermsPart3 {...props} />
    </div>
  );
}
