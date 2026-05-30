/**
 * WRIT PETITION UNDER ARTICLE 226 OF THE CONSTITUTION OF INDIA
 * ───────────────────────────────────────────────────────────────
 * Category : Constitutional Law Pleading
 * Court    : High Court of Delhi
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * Article 226 empowers High Courts to issue writs (mandamus, certiorari,
 * habeas corpus, prohibition, quo warranto) for enforcement of
 * fundamental rights and for any other purpose. This template shows
 * the standard writ petition format with:
 *   - Case header with position-of-parties table
 *   - Grounds of challenge
 *   - Multi-part prayer (mandamus + certiorari)
 */

const {
  Document, Paragraph, TextRun,
  Table, TableRow, TableCell,
  AlignmentType, TabStopType, TabStopPosition,
  Footer, PageNumber, PageBreak,
  BorderStyle, WidthType, ShadingType, LevelFormat
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

// Table border style for parties table
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: "000000" };
const borders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };

/** Helper to create a table cell with standard margins */
function tCell(text, width, opts = {}) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [
      new Paragraph({
        alignment: opts.align || AlignmentType.LEFT,
        children: [new TextRun({ text, bold: opts.bold || false, size: 22, font: "Times New Roman" })],
      }),
    ],
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
        reference: "writ-paras",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        // Roman numerals for prayer sub-items
        reference: "prayer-roman",
        levels: [{
          level: 0, format: LevelFormat.LOWER_ROMAN, text: "(%1)",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        // Uppercase letters for grounds
        reference: "grounds",
        levels: [{
          level: 0, format: LevelFormat.UPPER_LETTER, text: "%1.",
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
        // ─── Court Header ───
        centeredBold("IN THE HIGH COURT OF DELHI AT NEW DELHI", 26),
        centeredBold("(EXTRAORDINARY CIVIL WRIT JURISDICTION)", 22),
        spacer,
        centeredBold("WRIT PETITION (CIVIL) NO. ________ OF 20__", 24),
        spacer,

        // ─── Parties ───
        legalPara([new TextRun("In the matter of:")]),

        // Petitioner
        legalPara([new TextRun({ text: "Sh. ________", bold: true })]),
        legalPara([new TextRun("S/o ________")]),
        legalPara([new TextRun("R/o ________")]),
        legalPara(
          [new TextRun({ text: "\u2026 PETITIONER", bold: true })],
          { alignment: AlignmentType.RIGHT }
        ),

        centeredBold("VERSUS"),
        spacer,

        // Respondents
        legalPara([
          new TextRun({ text: "1. ", bold: true }),
          new TextRun("Union of India / State of ________"),
        ]),
        legalPara([new TextRun("   Through the Secretary,")]),
        legalPara([new TextRun("   Ministry / Department of ________,")]),
        legalPara([new TextRun("   New Delhi.")]),
        spacer,
        legalPara([
          new TextRun({ text: "2. ", bold: true }),
          new TextRun("________"),
        ]),
        legalPara([new TextRun("   ________")]),
        legalPara(
          [new TextRun({ text: "\u2026 RESPONDENTS", bold: true })],
          { alignment: AlignmentType.RIGHT }
        ),

        spacer,

        // ─── Title ───
        centeredBold("WRIT PETITION UNDER ARTICLE 226 OF THE", 24),
        centeredBold("CONSTITUTION OF INDIA", 24),
        spacer,

        legalPara([
          new TextRun({ text: "To,", bold: true }),
        ]),
        legalPara([new TextRun("The Hon'ble Chief Justice and His Companion Justices of")]),
        legalPara([new TextRun("the High Court of Delhi at New Delhi.")]),

        spacer,

        // ─── Body ───
        centeredBold("MOST RESPECTFULLY SHOWETH:", 24),
        spacer,

        new Paragraph({
          numbering: { reference: "writ-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the petitioner is filing the present Writ Petition under Article 226 of the Constitution of India seeking a writ of mandamus / certiorari / any other appropriate writ, order or direction thereby quashing the impugned order / notification / action dated ________ passed / taken by the Respondent No. ________."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "writ-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the brief facts giving rise to the present petition are as follows: ________"
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "writ-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the impugned order / action is arbitrary, illegal, and in violation of the fundamental rights of the petitioner guaranteed under Articles 14, 19, and 21 of the Constitution of India."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "writ-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the petitioner has not filed any similar petition before this Hon'ble Court or before the Hon'ble Supreme Court of India or before any other Court."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "writ-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the petitioner has no other efficacious remedy other than to file the present petition."
            ),
          ],
        }),

        spacer,

        // ─── Grounds ───
        centeredBold("GROUNDS", 26),
        spacer,

        new Paragraph({
          numbering: { reference: "grounds", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "Because the impugned order / action is passed / taken without affording any opportunity of hearing to the petitioner and is, therefore, in gross violation of the principles of natural justice."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "grounds", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "Because the impugned order / action is arbitrary, unreasonable, and violative of Article 14 of the Constitution of India."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "grounds", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "Because the impugned order / action is contrary to the statutory provisions and the settled law laid down by the Hon'ble Supreme Court of India."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "grounds", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "Because the respondents have acted in a manner which is mala fide and without due application of mind."
            ),
          ],
        }),

        spacer,

        // ─── Prayer ───
        centeredBold("PRAYER", 26),
        spacer,

        legalPara([
          new TextRun("In view of the foregoing, it is most respectfully prayed that this Hon'ble Court may kindly be pleased to:"),
        ]),

        new Paragraph({
          numbering: { reference: "prayer-roman", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "issue a writ of mandamus and / or any other appropriate writ, order and / or direction in the nature thereof, thereby directing the Respondents to ________;"
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "prayer-roman", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "issue a writ of certiorari and / or any other appropriate writ, order and / or direction in the nature thereof, thereby quashing the impugned order / notification dated ________;"
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "prayer-roman", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "pass any other order as may be deemed fit and proper under the facts and circumstances of the case in favour of the petitioner and against the respondents."
            ),
          ],
        }),

        spacer,

        // ─── Closing ───
        centeredBold("AND FOR THIS ACT OF KINDNESS, THE PETITIONER", 22),
        centeredBold("SHALL EVER REMAIN GRATEFUL.", 22),

        spacer,
        spacer,

        // ─── Signature Block ───
        new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun("New Delhi"),
            new TextRun("\tPetitioner"),
          ],
        }),
        new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun("Dated: ________"),
            new TextRun("\tThrough"),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun("Advocates")],
        }),

        spacer,
        spacer,

        legalPara(
          [
            new TextRun({ text: "[NOTE: ", bold: true, italics: true }),
            new TextRun({ text: "To be supported by an affidavit]", italics: true }),
          ],
          { alignment: AlignmentType.CENTER }
        ),
      ],
    },
  ],
});
