"use client";

/**
 * Generates a PDF from a specified HTML element.
 *
 * jsPDF and html2canvas are loaded dynamically on first call so they are
 * NEVER included in the initial page bundle. This removes ~200 kB gzipped
 * from every page that imports this utility.
 *
 * @param elementId The ID of the HTML element to capture.
 * @param fileName  The name of the PDF file to save.
 */
export const generatePDF = async (
  elementId: string,
  fileName: string = "Car-Inspection-Report.pdf"
) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Element not found:", elementId);
    return;
  }

  try {
    // ── Dynamic imports: downloaded only once, cached by the browser ──────
    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);

    // Scroll to top to ensure clean capture
    window.scrollTo(0, 0);

    // Temporarily modify styles for clean PDF capture
    const originalStyles = new Map<HTMLElement, string>();
    const stickyElements = element.querySelectorAll(
      '[class*="sticky"], [class*="fixed"]'
    );

    // Hide buttons and handle sticky elements
    const elementsToHide = element.querySelectorAll(".no-print");
    elementsToHide.forEach((el: any) => {
      originalStyles.set(el, el.style.display);
      el.style.display = "none";
    });

    stickyElements.forEach((el: any) => {
      if (!el.classList.contains("no-print")) {
        originalStyles.set(el, el.style.position);
        el.style.position = "static";
      }
    });

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    // Restore original styles
    elementsToHide.forEach(
      (el: any) => (el.style.display = originalStyles.get(el) || "")
    );
    stickyElements.forEach((el: any) => {
      if (originalStyles.has(el)) {
        el.style.position = originalStyles.get(el) || "";
      }
    });

    const imgData = canvas.toDataURL("image/png");
    
    // Calculate PDF dimensions - maintain A4 width (210mm) and scale height based on content
    const imgWidth = 210; 
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Initialize jsPDF with custom page size [width, height]
    const pdf = new jsPDF("p", "mm", [imgWidth, imgHeight]);

    // Add the image as a single continuous block
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight, undefined, "FAST");

    pdf.save(fileName);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
