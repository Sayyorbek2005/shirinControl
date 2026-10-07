import { printReport } from "../utils/reports";
import Icon from "./Icon";

export default function PdfButton({
  report,
  label = "PDF / Chop etish",
}) {
  return (
    <button
      type="button"
      className="button secondary"
      onClick={() => printReport(report)}
    >
      <Icon name="download" size={17} />
      {label}
    </button>
  );
}