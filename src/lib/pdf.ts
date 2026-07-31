// ================= PRECISION A4 PDF GENERATION ENGINE =================

/**
 * Generate a standard A4 (210mm x 297mm) multi-page PDF from a DOM element using html2canvas + jsPDF.
 * Automatically handles pagination if the document exceeds single-page length.
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

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let html2canvasFn: any = null;

    try {
      const mod = await import("html2canvas");
      html2canvasFn = mod.default || mod;
    } catch {
      const w = window as unknown as Record<string, unknown>;
      if (typeof w["html2canvas"] === "function") {
        html2canvasFn = w["html2canvas"];
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let jsPDFClass: any = null;

    try {
      const mod = await import("jspdf");
      jsPDFClass = mod.jsPDF || mod.default;
    } catch {
      const w = window as unknown as Record<string, unknown>;
      const jspdfNs = w["jspdf"] as Record<string, unknown> | undefined;
      if (jspdfNs && typeof jspdfNs["jsPDF"] === "function") {
        jsPDFClass = jspdfNs["jsPDF"];
      } else if (typeof w["jsPDF"] === "function") {
        jsPDFClass = w["jsPDF"];
      }
    }

    if (!html2canvasFn || !jsPDFClass) {
      console.warn("PDF libraries not available — using print fallback.");
      printElementFallback(el, filename);
      return true;
    }

    // Capture the element as a high-DPI canvas
    const canvas = await html2canvasFn(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      allowTaint: true,
      windowWidth: 1200,
    });

    const imgData = canvas.toDataURL("image/png");

    // Standard A4 dimensions in mm
    const A4_W = 210;
    const A4_H = 297;

    // Calculate total height in mm proportional to canvas aspect ratio
    const imgHeight = (canvas.height * A4_W) / canvas.width;

    const pdf = new jsPDFClass({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    let heightLeft = imgHeight;
    let position = 0;

    // Page 1
    pdf.addImage(imgData, "PNG", 0, position, A4_W, imgHeight, undefined, "FAST");
    heightLeft -= A4_H;

    // Additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, A4_W, imgHeight, undefined, "FAST");
      heightLeft -= A4_H;
    }

    pdf.save(`${filename}.pdf`);
    return true;
  } catch (err) {
    console.error("PDF generation error:", err);
    printElementFallback(el, filename);
    return true;
  }
}

/**
 * Opens a clean print window with standard A4 media rules.
 */
function printElementFallback(el: HTMLElement, filename: string) {
  const printWindow = window.open("", "_blank", "width=900,height=1000");
  if (!printWindow) {
    window.print();
    return;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${filename}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: white; color: #0f172a; padding: 20px; }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>${el.outerHTML}</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 400);
}

