// ================= PDF GENERATION =================

/**
 * Generate a PDF from a DOM element using html2canvas + jsPDF.
 * These libraries are loaded from the page (via CDN or bundled).
 */
export async function generatePdfFromElement(
  elementId: string,
  filename: string
): Promise<boolean> {
  const el = document.getElementById(elementId);
  if (!el) {
    console.error(`Element #${elementId} not found for PDF generation.`);
    return false;
  }

  const html2canvas = (window as any).html2canvas;
  const jsPDFClass = (window as any).jspdf?.jsPDF || (window as any).jsPDF;

  if (!html2canvas) {
    alert("PDF library (html2canvas) not loaded.");
    return false;
  }
  if (!jsPDFClass) {
    alert("PDF library (jsPDF) not loaded.");
    return false;
  }

  // Temporarily hide elements with 'print-hide' class
  const hiddenElements = el.querySelectorAll(".print-hide") as NodeListOf<HTMLElement>;
  hiddenElements.forEach((element) => (element.style.display = "none"));

  try {
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const w = 210; // A4 width in mm
    const h = (canvas.height * w) / canvas.width;

    const pdf = new jsPDFClass("p", "mm", [w, Math.max(297, h)]) as Record<string, unknown>;
    (pdf.addImage as (img: string, fmt: string, x: number, y: number, w: number, h: number) => void)(
      imgData, "PNG", 0, 0, w, h
    );
    (pdf.save as (name: string) => void)(`${filename}.pdf`);

    // Restore hidden elements
    hiddenElements.forEach((element) => (element.style.display = ""));
    return true;
  } catch (err) {
    console.error("PDF generation failed:", err);
    hiddenElements.forEach((element) => (element.style.display = ""));
    return false;
  }
}
