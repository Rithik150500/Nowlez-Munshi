/**
 * AGREEMENT FOR SALE OF IMMOVABLE PROPERTY
 * ──────────────────────────────────────────
 * Category : Conveyancing
 * Statute  : Transfer of Property Act, 1882 (Section 54)
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * This template demonstrates the classical Indian conveyancing format:
 *   - Description → Date & Place → Parties → Recitals (WHEREAS)
 *   - Testatum (NOW IT IS AGREED) → Numbered clauses
 *   - Schedule of Property → Signatures & Witnesses
 *
 * Unlike pleadings (which are court documents), conveyancing documents
 * record transactions between parties and may later be used as evidence.
 */

const {
  Document, Paragraph, TextRun,
  AlignmentType, TabStopType, TabStopPosition,
  Footer, PageNumber, PageBreak,
  BorderStyle, LevelFormat
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

// Horizontal rule styled as a decorative paragraph border
function hrule() {
  return new Paragraph({
    spacing: { after: 200 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: "333333", space: 1 },
    },
    children: [],
  });
}

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
        // Main agreement clauses
        reference: "agreement-clauses",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.",
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
          size: { width: 11906, height: 16838 }, // A4
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
        // ─── Title / Description of the Deed ───
        // In conveyancing, the document always opens with its title in capitals
        centeredBold("AGREEMENT FOR SALE", 32),
        spacer,

        hrule(),

        // ─── Date and Place (written in words to prevent forgery) ───
        legalPara([
          new TextRun({ text: "THIS AGREEMENT ", bold: true }),
          new TextRun("is made at "),
          new TextRun({ text: "________ (Place) ", bold: true }),
          new TextRun("on this "),
          new TextRun({ text: "________ ", bold: true }),
          new TextRun("day of "),
          new TextRun({ text: "________, 20__.", bold: true }),
        ]),

        spacer,

        // ─── Parties to the Deed ───
        // The parties are described with their full identity for legal certainty
        legalPara([new TextRun({ text: "BETWEEN", bold: true, size: 26 })], { alignment: AlignmentType.CENTER }),
        spacer,

        // Party of the First Part — VENDOR
        legalPara([
          new TextRun({ text: "Mr. A", bold: true }),
          new TextRun(", aged ________ years, S/o ________, R/o ________"),
          new TextRun({ text: " (hereinafter referred to as the ", italics: true }),
          new TextRun({ text: "'VENDOR'", bold: true, italics: true }),
          new TextRun({
            text: ", which expression shall, unless repugnant to the context or meaning thereof, mean and include his heirs, executors, administrators and assigns)",
            italics: true,
          }),
          new TextRun(" of the "),
          new TextRun({ text: "FIRST PART", bold: true }),
          new TextRun("."),
        ]),

        spacer,
        legalPara([new TextRun({ text: "AND", bold: true, size: 26 })], { alignment: AlignmentType.CENTER }),
        spacer,

        // Party of the Second Part — VENDEE / PURCHASER
        legalPara([
          new TextRun({ text: "Mr. B", bold: true }),
          new TextRun(", aged ________ years, S/o ________, R/o ________"),
          new TextRun({ text: " (hereinafter referred to as the ", italics: true }),
          new TextRun({ text: "'VENDEE/PURCHASER'", bold: true, italics: true }),
          new TextRun({
            text: ", which expression shall, unless repugnant to the context or meaning thereof, mean and include his heirs, executors, administrators and assigns)",
            italics: true,
          }),
          new TextRun(" of the "),
          new TextRun({ text: "SECOND PART", bold: true }),
          new TextRun("."),
        ]),

        spacer,
        hrule(),

        // ─── Recitals (WHEREAS clauses) ───
        // Recitals set out the background facts: ownership, intention to sell, etc.
        legalPara([
          new TextRun({ text: "WHEREAS ", bold: true }),
          new TextRun(
            "the Vendor is the absolute owner of the property bearing No. ________ admeasuring ________ situated at ________ (hereinafter referred to as "
          ),
          new TextRun({ text: "'the said property'", bold: true }),
          new TextRun(")."),
        ]),

        legalPara([
          new TextRun({ text: "AND WHEREAS ", bold: true }),
          new TextRun(
            "the Vendor has agreed to sell the said property to the Vendee at the price and on the conditions mentioned hereinafter."
          ),
        ]),

        spacer,

        // ─── Testatum (Operative Words) ───
        // The testatum transitions from narrative recitals to operative clauses
        legalPara([
          new TextRun({ text: "NOW IT IS AGREED BETWEEN THE PARTIES AS FOLLOWS:", bold: true, size: 26 }),
        ], { alignment: AlignmentType.CENTER }),

        spacer,

        // ─── Agreement Clauses ───
        // These are the binding operative terms of the agreement

        new Paragraph({
          numbering: { reference: "agreement-clauses", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "The Vendor hereby agrees to sell, transfer and convey the said property in favour of the Vendee."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "agreement-clauses", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the consideration of Rs. ________ is to be paid by the Vendee to the Vendor. Rs. ________ is to be paid at the execution of this agreement as earnest money. Rs. ________ on ________ (date) and lastly Rs. ________ at the time of final sale deed."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "agreement-clauses", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "The Vendor acknowledges the payment of Rs. ________ as earnest money paid in cash / cheque / DD No. ________ drawn on ________ (Bank name and Branch) by Vendee."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "agreement-clauses", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "The Vendor shall make out a marketable title of the said property free from encumbrances and reasonable doubts."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "agreement-clauses", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "The Vendor shall deliver to the Vendee the title deeds relating to the said property in his possession and power on execution of these presents for inspection and investigation of the title by the Vendee or his advocate."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "agreement-clauses", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "The Vendor agrees to apply for, obtain and furnish unto the Vendee all such permissions as may be necessary under the laws for registration of Sale Deed."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "agreement-clauses", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "The Vendor and the Vendee hereby agree that the sale will be completed within six months from the date hereof."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "agreement-clauses", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "All the taxes, levies etc. due and payable against the said property shall be paid by the Vendor till the completion of sale and thereafter it will be the responsibility of the Purchaser. The Vendor shall handover all the tax receipts etc. duly paid to the Vendee at the time of completion of sale."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "agreement-clauses", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "The Vendor agrees to handover actual, physical and vacant possession of the said property unto the Vendee at the time of sale deed."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "agreement-clauses", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the expenses towards the payment of stamp duty, registration charges and all other incidental expenses for agreement for sale and sale deed shall be borne by the Vendee."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "agreement-clauses", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "If the Vendor fails to make out the clear marketable title to the said property as aforesaid then the Vendee will have the right to cancel this agreement by giving at least fifteen days notice to the Vendor and after the expiration of fifteen days the agreement shall stand terminated and the Vendor agrees to return the earnest money to the Vendee."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "agreement-clauses", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "If the Vendee fails to perform his obligations under this agreement within the time stipulated then the Vendor shall be entitled to cancel this agreement by giving at least fifteen days notice in writing to the Vendee. On termination the Vendor will be entitled to forfeit the earnest money paid by the Vendee."
            ),
          ],
        }),

        spacer,
        hrule(),

        // ─── Schedule of Property ───
        // The schedule (or "parcels") precisely identifies the subject-matter
        centeredBold("SCHEDULE OF PROPERTY", 26),
        spacer,

        legalPara([new TextRun("Property bearing No.: ________")]),
        legalPara([new TextRun("Situated at: ________")]),
        legalPara([new TextRun("Admeasuring: ________")]),
        legalPara([new TextRun("Bounded as follows:")]),
        legalPara([new TextRun("   North: ________")]),
        legalPara([new TextRun("   South: ________")]),
        legalPara([new TextRun("   East:  ________")]),
        legalPara([new TextRun("   West:  ________")]),

        spacer,
        hrule(),

        // ─── Testimonium & Signatures ───
        // The testimonium marks the formal close of the deed
        legalPara([
          new TextRun({ text: "IN WITNESS WHEREOF ", bold: true }),
          new TextRun(
            "the parties hereto have signed this agreement on the date and at the place first above written."
          ),
        ]),

        spacer,
        spacer,

        // Signature lines using tab stops for left/right alignment
        new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          spacing: { after: 60 },
          children: [
            new TextRun({ text: "VENDOR", bold: true }),
            new TextRun({ text: "\tVENDEE / PURCHASER", bold: true }),
          ],
        }),

        new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun("(Mr. A)"),
            new TextRun("\t(Mr. B)"),
          ],
        }),

        spacer,
        spacer,

        // Witnesses
        legalPara([new TextRun({ text: "WITNESSES:", bold: true, underline: {} })]),
        spacer,
        legalPara([new TextRun("1. Name: ________")]),
        legalPara([new TextRun("   Address: ________")]),
        legalPara([new TextRun("   Signature: ________")]),
        spacer,
        legalPara([new TextRun("2. Name: ________")]),
        legalPara([new TextRun("   Address: ________")]),
        legalPara([new TextRun("   Signature: ________")]),
      ],
    },
  ],
});
