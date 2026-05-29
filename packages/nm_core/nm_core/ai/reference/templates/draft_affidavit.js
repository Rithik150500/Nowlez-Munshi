/**
 * DRAFT AFFIDAVIT (Supporting a Suit under Order XXXVII CPC)
 * ─────────────────────────────────────────────────────────────
 * Category : Civil Pleading — Supporting Document
 * Court    : District Judge, Delhi
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * Affidavits are sworn statements that support virtually every court
 * filing in Indian courts. This template shows the standard structure:
 *   Header → Parties → Affidavit Body → Deponent → Verification
 */

const {
  Document, Paragraph, TextRun,
  AlignmentType, TabStopType, TabStopPosition,
  Footer, PageNumber, LevelFormat
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

  // Numbered paragraphs for affidavit statements
  numbering: {
    config: [
      {
        reference: "affidavit-paras",
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: "%1.",
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: { indent: { left: 720, hanging: 360 } },
            },
          },
        ],
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
        // ─── Title ───
        centeredBold("DRAFT AFFIDAVIT", 28),
        spacer,

        // ─── Court Header ───
        centeredBold("IN THE COURT OF DISTRICT JUDGE (DISTRICT ________), ________ COURT, DELHI"),
        spacer,

        // ─── Case Number ───
        centeredBold("SUIT NO. ________ OF 20__"),
        legalPara(
          [new TextRun({ text: "(SUIT UNDER ORDER XXXVII OF THE CODE OF CIVIL PROCEDURE, 1908)", italics: true })],
          { alignment: AlignmentType.CENTER }
        ),
        spacer,

        // ─── Parties ───
        centeredBold("IN THE MATTER OF:"),

        // Plaintiff
        legalPara([new TextRun({ text: "M/s ABC Pvt. Ltd.", bold: true })]),
        legalPara([new TextRun("A Company Incorporated Under The")]),
        legalPara([new TextRun("Companies Act, Having Its Registered Office")]),
        legalPara([new TextRun("At New Delhi.")]),
        legalPara([new TextRun("Through its Director")]),
        legalPara([new TextRun("Sh. ________")]),
        legalPara(
          [new TextRun({ text: "\u2026 PLAINTIFF", bold: true })],
          { alignment: AlignmentType.RIGHT }
        ),

        // Versus
        centeredBold("VERSUS"),
        spacer,

        // Defendant
        legalPara([new TextRun({ text: "M/s XYZ Ltd.", bold: true })]),
        legalPara([new TextRun("A Company Incorporated Under The")]),
        legalPara([new TextRun("Companies Act, Having Its Registered")]),
        legalPara([new TextRun("Office At Delhi")]),
        legalPara([new TextRun("Through its Director")]),
        legalPara([new TextRun("Sh. ________")]),
        legalPara(
          [new TextRun({ text: "\u2026 DEFENDANT", bold: true })],
          { alignment: AlignmentType.RIGHT }
        ),

        spacer,

        // ─── Affidavit Title Line ───
        new Paragraph({
          spacing: { after: 120, line: 360 },
          children: [
            new TextRun({ text: "AFFIDAVIT OF ", bold: true, underline: {} }),
            new TextRun({ text: "Sh. ________, S/o ________, Aged About ________ Years, R/o ________", underline: {} }),
            new TextRun({ text: " in the capacity of the Director of M/s ABC Pvt. Ltd.", bold: true, underline: {} }),
          ],
        }),

        spacer,

        // ─── Affidavit Body ───
        legalPara([
          new TextRun(
            "I, ________ the deponent hereinabove do hereby solemnly affirm and state hereunder:"
          ),
        ]),

        spacer,

        // Numbered statements
        new Paragraph({
          numbering: { reference: "affidavit-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "I say that I am the Authorized Representative / Director of the Plaintiff and I am aware of the facts and circumstances of the present suit based upon the records of the Plaintiff maintained in the ordinary course of business and I am duly authorized and competent to swear and file the present suit and affidavit."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "affidavit-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "I say that the accompanying Suit has been drafted and filed by my counsel upon my instructions and the contents of the same are true and correct."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "affidavit-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun("I say that the documents filed along with plaint are true copies of originals."),
          ],
        }),

        spacer,
        spacer,

        // ─── Deponent Signature ───
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { after: 60 },
          children: [new TextRun({ text: "DEPONENT", bold: true, size: 24 })],
        }),

        spacer,
        spacer,

        // ─── Verification ───
        centeredBold("VERIFICATION:", 24),

        spacer,

        legalPara([
          new TextRun(
            "I, ________, do hereby verify on this ________ day of ________ 20__ at Delhi that the contents of the above said affidavit are true and correct to my knowledge and information and nothing material has been concealed therefrom."
          ),
        ]),

        spacer,
        spacer,

        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "DEPONENT", bold: true })],
        }),
      ],
    },
  ],
});
