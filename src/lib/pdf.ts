// ================= PDF GENERATION =================

/**
 * Generate a PDF from a DOM element using html2canvas + jsPDF (NPM versions).
 * Falls back to a clean print window if libraries are unavailable.
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
      // try window global as last resort
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

    // Capture the element as a canvas
    const canvas = await html2canvasFn(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const A4_W = 210; // mm
    const imgH = (canvas.height * A4_W) / canvas.width;

    const pdf = new jsPDFClass("p", "mm", [A4_W, Math.max(297, imgH)]);
    pdf.addImage(imgData, "PNG", 0, 0, A4_W, imgH);
    pdf.save(`${filename}.pdf`);

    return true;
  } catch (err) {
    console.error("PDF generation error:", err);
    const el2 = document.getElementById(elementId);
    if (el2) printElementFallback(el2, filename);
    return true;
  }
}

/**
 * Opens a clean print window containing only the invoice element's HTML.
 * Avoids printing the app nav/sidebar.
 */
function printElementFallback(el: HTMLElement, _filename: string) {
  const printWindow = window.open("", "_blank", "width=800,height=900");
  if (!printWindow) {
    // If popup blocked, do a minimal page print by hiding everything else
    window.print();
    return;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invoice</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: white; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>${el.outerHTML}</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 500);
}
