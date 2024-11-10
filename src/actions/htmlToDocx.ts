// app/actions/htmlToDocx.ts
'use server';

import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { parse, HTMLElement } from 'node-html-parser';

export async function htmlToDocx(htmlContent: string): Promise<string> {
  const root = parse(htmlContent);
  const sections: { children: Paragraph[] }[] = [];

  // Function to recursively process HTML nodes with type checks and nesting support
  const processNode = (node: HTMLElement): TextRun | Paragraph | null => {
    if (!node.tagName) {
      // Text nodes
      return new TextRun(node.text || "");
    }

    switch (node.tagName.toUpperCase()) {
      case 'P':
        // Create a paragraph with children TextRuns
        const paragraphChildren = Array.from(node.childNodes)
          .map(child => processNode(child as HTMLElement))
          .filter((child): child is TextRun => child instanceof TextRun);

        return new Paragraph({
          children: paragraphChildren,
          spacing: { after: 200 },
        });

      case 'STRONG':
        // Inline bold text
        return new TextRun({
          text: node.innerText,
          bold: true,
        });

      case 'EM':
        // Inline italic text
        return new TextRun({
          text: node.innerText,
          italics: true,
        });

      case 'U':
        // Inline underline text
        return new TextRun({
          text: node.innerText,
          underline: {},
        });

      case 'H1':
        // Heading 1
        return new Paragraph({
          children: [new TextRun({ text: node.innerText, bold: true, size: 48 })],
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 },
        });

      case 'H2':
        // Heading 2
        return new Paragraph({
          children: [new TextRun({ text: node.innerText, bold: true, size: 36 })],
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200 },
        });

      case 'H3':
        // Heading 3
        return new Paragraph({
          children: [new TextRun({ text: node.innerText, bold: true, size: 30 })],
          heading: HeadingLevel.HEADING_3,
          spacing: { after: 200 },
        });

      case 'UL':
        // Unordered List
        return new Paragraph({
          children: [new TextRun({ text: node.innerText })],
          bullet: { level: 0 },
        });

      case 'OL':
        // Ordered List
        return new Paragraph({
          children: [new TextRun({ text: node.innerText })],
          numbering: { reference: "numbered", level: 0 },
        });

      default:
        // Default case for unsupported tags
        return new TextRun(node.innerText);
    }
  };

  // Process each child node of the root
  const paragraphs = root.childNodes
    .filter((child): child is HTMLElement => child instanceof HTMLElement)
    .map((child) => processNode(child))
    .filter((paragraph): paragraph is Paragraph => paragraph instanceof Paragraph); // Filter Paragraphs only

  sections.push({ children: paragraphs });

  const doc = new Document({ sections });
  const buffer = await Packer.toBuffer(doc);
  return Buffer.from(buffer).toString('base64');
}
