"use client";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Generates a PDF from a specified HTML element.
 * @param elementId The ID of the HTML element to capture.
 * @param fileName The name of the PDF file to save.
 */
export const generatePDF = async (elementId: string, fileName: string = "Car-Inspection-Report.pdf") => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Element not found:", elementId);
    return;
  }

  try {
    // Scroll to top to ensure clean capture
    window.scrollTo(0, 0);

    // Temporarily modify styles for clean PDF capture
    const originalStyles = new Map<HTMLElement, string>();
    const stickyElements = element.querySelectorAll('[class*="sticky"], [class*="fixed"]');
    
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
    elementsToHide.forEach((el: any) => el.style.display = originalStyles.get(el) || "");
    stickyElements.forEach((el: any) => {
      if (originalStyles.has(el)) {
        el.style.position = originalStyles.get(el) || "";
      }
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Add subsequent pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    pdf.save(fileName);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
