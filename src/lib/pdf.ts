// ================= PDF GENERATION =================

/**
 * Generate a PDF from a DOM element using html2canvas + jsPDF.
 * Dynamically imports bundled NPM modules with fallback to window.print().
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

  // Temporarily hide elements with 'print-hide' class
  const hiddenElements = el.querySelectorAll(".print-hide") as NodeListOf<HTMLElement>;
  hiddenElements.forEach((element) => (element.style.display = "none"));

  try {
    let html2canvasFn: any = (window as any).html2canvas;
    if (!html2canvasFn) {
      try {
        const mod = await import("html2canvas");
        html2canvasFn = mod.default || mod;
      } catch (err) {
        console.warn("Could not load html2canvas module:", err);
      }
    }

    let jsPDFClass: any = (window as any).jspdf?.jsPDF || (window as any).jsPDF;
    if (!jsPDFClass) {
      try {
        const mod = await import("jspdf");
        jsPDFClass = mod.jsPDF || mod.default;
      } catch (err) {
        console.warn("Could not load jsPDF module:", err);
      }
    }

    if (!html2canvasFn || !jsPDFClass) {
      console.warn("PDF library missing, triggering native window.print() fallback.");
      window.print();
      hiddenElements.forEach((element) => (element.style.display = ""));
      return true;
    }

    const canvas = await html2canvasFn(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const w = 210; // A4 width in mm
    const h = (canvas.height * w) / canvas.width;

    const pdf = new jsPDFClass("p", "mm", [w, Math.max(297, h)]) as any;
    pdf.addImage(imgData, "PNG", 0, 0, w, h);
    pdf.save(`${filename}.pdf`);

    // Restore hidden elements
    hiddenElements.forEach((element) => (element.style.display = ""));
    return true;
  } catch (err) {
    console.error("PDF generation failed, triggering print fallback:", err);
    hiddenElements.forEach((element) => (element.style.display = ""));
    window.print();
    return true;
  }
}
