/**
 * CONSUMER COMPLAINT UNDER SECTION 35 OF THE CONSUMER PROTECTION ACT, 2019
 * ─────────────────────────────────────────────────────────────────────────────
 * Category : Other Miscellaneous Pleadings
 * Forum    : District Consumer Disputes Redressal Commission, Delhi
 * Statute  : Consumer Protection Act, 2019 (Section 35)
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * Consumer complaints have a UNIQUE terminology compared to civil suits
 * or criminal complaints:
 *   - The aggrieved person is the "COMPLAINANT" (not plaintiff)
 *   - The service provider is the "OPPOSITE PARTY" (not defendant/accused)
 *   - The forum is a "COMMISSION" (not a court)
 *
 * Pecuniary jurisdiction (value-based forum selection):
 *   District Commission  — Up to Rs. 50 Lakh
 *   State Commission     — Rs. 50 Lakh to Rs. 2 Crore
 *   National Commission  — Above Rs. 2 Crore
 *
 * The complaint must establish "deficiency in service" or "defective goods"
 * and the prayer typically includes: compensation, refund, and costs.
 */

const {
  Document, Paragraph, TextRun,
  AlignmentType, TabStopType, TabStopPosition,
  Footer, PageNumber, LevelFormat, BorderStyle
} = require("docx");

// ───── Helpers ─────

function legalPara(children, opts = {}) {
  return new Paragraph({
    spacing: { after: 120, line: 360 },
    alignment: AlignmentType.JUSTIFIED,
    ...opts,
    children,
  });
}

function centeredBold(text, size = 24) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [new TextRun({ text, bold: true, size, font: "Times New Roman" })],
  });
}

const spacer = new Paragraph({ spacing: { after: 120 }, children: [] });

// ───── Document ─────

module.exports = new Document({
  styles: {
    default: {
      document: { run: { font: "Times New Roman", size: 24 } },
    },
  },

  numbering: {
    config: [
      {
        reference: "consumer-paras",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        // For the prayer sub-items
        reference: "prayer-items",
        levels: [{
          level: 0, format: LevelFormat.LOWER_LETTER, text: "(%1)",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },

  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, bottom: 1440, left: 1800, right: 1440 },
        },
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ children: ["Page ", PageNumber.CURRENT], size: 18, font: "Times New Roman" }),
              ],
            }),
          ],
        }),
      },
      children: [
        // ─── Forum Header ───
        // Note: Consumer forums are called "COMMISSIONS", not "COURTS"
        centeredBold("BEFORE THE DISTRICT CONSUMER DISPUTES", 24),
        centeredBold("REDRESSAL COMMISSION", 24),
        centeredBold("(DISTRICT ________), DELHI", 24),
        spacer,

        // ─── Case Number ───
        centeredBold("CONSUMER COMPLAINT NO. ________ OF 20__", 24),
        spacer,

        // ─── Parties ───
        // In consumer law: "Complainant" vs "Opposite Party" (not plaintiff/defendant)
        legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
          { alignment: AlignmentType.CENTER }),

        legalPara([new TextRun({ text: "D ________", bold: true })]),
        legalPara([new TextRun("S/o Shri ________")]),
        legalPara([new TextRun("R/o ________")]),
        legalPara(
          [new TextRun({ text: "\u2026 COMPLAINANT", bold: true })],
          { alignment: AlignmentType.RIGHT }
        ),

        centeredBold("VERSUS"),
        spacer,

        legalPara([
          new TextRun({ text: "1. ", bold: true }),
          new TextRun("District Manager, ________"),
        ]),
        legalPara([new TextRun("   ________")]),
        legalPara(
          [new TextRun({ text: "\u2026 OPPOSITE PARTY NO. 1", bold: true })],
          { alignment: AlignmentType.RIGHT }
        ),

        spacer,

        legalPara([
          new TextRun({ text: "2. ", bold: true }),
          new TextRun("Sub-Divisional Officer, ________"),
        ]),
        legalPara([new TextRun("   ________")]),
        legalPara(
          [new TextRun({ text: "\u2026 OPPOSITE PARTY NO. 2", bold: true })],
          { alignment: AlignmentType.RIGHT }
        ),

        spacer,

        // ─── Title ───
        centeredBold("COMPLAINT UNDER SECTION 35 OF THE", 24),
        centeredBold("CONSUMER PROTECTION ACT, 2019", 24),
        spacer,

        legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
          { alignment: AlignmentType.CENTER }),
        spacer,

        // ─── Body ───
        // The body must narrate: the service availed, the deficiency,
        // the efforts to resolve, and the loss/injury suffered.

        new Paragraph({
          numbering: { reference: "consumer-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the Complainant is a consumer / subscriber / purchaser of ________ from the Opposite Party(ies) since ________."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "consumer-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the Complainant availed the services / purchased the goods from the Opposite Party(ies) and paid the requisite charges / consideration of Rs. ________ vide receipt / invoice No. ________ dated ________."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "consumer-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the services rendered / goods supplied by the Opposite Party(ies) were found to be deficient / defective in the following manner: ________"
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "consumer-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the Complainant lodged several complaints with the Opposite Party(ies) on ________ and ________ but the same did not yield any satisfactory result. A written complaint was also submitted on ________ but the Opposite Party(ies) failed to address the grievance."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "consumer-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That on account of dereliction of duty and negligence on the part of the Opposite Party(ies), the Complainant has suffered loss and injury due to deprivation, harassment, mental agony and loss of ________, and is entitled to compensation and refund of excess amount charged."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "consumer-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the Complainant sent a notice to each of the Opposite Parties by registered post on ________ demanding payment of Rs. ________ along with interest, but the Opposite Party(ies) failed to respond to the said notice."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "consumer-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That in support of the above averments and claims, documents have been enclosed along with this complaint."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "consumer-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the cause of action arose on ________ when the deficiency in service / defect in goods was noticed and continues as the Opposite Party(ies) have not remedied the same."
            ),
          ],
        }),

        // Pecuniary jurisdiction — this is what determines WHICH commission
        // has authority to hear the complaint.
        new Paragraph({
          numbering: { reference: "consumer-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the compensation claimed by the Complainant is below Rs. ________ and hence this District Commission has pecuniary jurisdiction to determine and adjudicate upon this consumer dispute."
            ),
          ],
        }),

        spacer,

        // ─── Prayer ───
        // Consumer complaint prayers typically include multiple heads
        // of relief: compensation for deficiency, mental harassment,
        // and costs of litigation.
        centeredBold("PRAYER:", 26),
        spacer,

        legalPara([
          new TextRun(
            "It is, therefore, most respectfully prayed that this Hon'ble Commission may be pleased to:"
          ),
        ]),

        new Paragraph({
          numbering: { reference: "prayer-items", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun("award compensation of Rs. ________ for deficiency in services / defect in goods;"),
          ],
        }),

        new Paragraph({
          numbering: { reference: "prayer-items", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun("award compensation of Rs. ________ for mental harassment and agony;"),
          ],
        }),

        new Paragraph({
          numbering: { reference: "prayer-items", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun("direct the Opposite Party(ies) to refund the excess amount of Rs. ________ along with interest @ ________% p.a. till the date of actual payment;"),
          ],
        }),

        new Paragraph({
          numbering: { reference: "prayer-items", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun("award cost of the complaint in favour of the Complainant and against the Opposite Party(ies); and"),
          ],
        }),

        new Paragraph({
          numbering: { reference: "prayer-items", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun("pass such other and further order(s) as may be deemed fit and proper on the facts and in the circumstances of this case."),
          ],
        }),

        spacer,
        spacer,

        // ─── Signature Block ───
        new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun("Place: ________"),
            new TextRun("\tComplainant"),
          ],
        }),
        new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun("Date: ________"),
            new TextRun("\tThrough"),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun("Advocate")],
        }),

        spacer,
        spacer,

        // ─── Note on pecuniary jurisdiction ───
        legalPara([
          new TextRun({ text: "Note: ", bold: true, italics: true }),
          new TextRun({ text: "An affidavit in support is to be annexed.", italics: true }),
        ]),

        spacer,

        // Jurisdiction guide (helpful reference built into the document)
        legalPara([
          new TextRun({ text: "Pecuniary Jurisdiction for Consumer Complaints:", bold: true, underline: {} }),
        ]),
        legalPara([new TextRun({ text: "District Commission \u2014 Up to Rs. 50 Lakh", italics: true })]),
        legalPara([new TextRun({ text: "State Commission \u2014 Rs. 50 Lakh to Rs. 2 Crore", italics: true })]),
        legalPara([new TextRun({ text: "National Commission \u2014 Above Rs. 2 Crore", italics: true })]),
      ],
    },
  ],
});
