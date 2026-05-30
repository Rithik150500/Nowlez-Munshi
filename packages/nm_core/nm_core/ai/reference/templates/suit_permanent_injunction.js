/**
 * SUIT FOR PERMANENT INJUNCTION
 * ──────────────────────────────
 * Category : Civil Pleading
 * Court    : Senior Civil Judge, Delhi
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * This template follows the standard Indian court format:
 *   - A4 paper with Times New Roman (the Indian court standard font)
 *   - Court header → Case title (parties) → Body → Prayer → Verification
 *   - Numbered paragraphs with legal indentation
 */

const {
  Document, Paragraph, TextRun,
  AlignmentType, TabStopType, TabStopPosition,
  Header, Footer, PageNumber, PageBreak,
  HeadingLevel, BorderStyle, LevelFormat
} = require("docx");

// ───── Reusable helpers ─────

/** Standard paragraph with Indian legal spacing (1.5 line, 6pt after) */
function legalPara(children, opts = {}) {
  return new Paragraph({
    spacing: { after: 120, line: 360 }, // 1.5 line spacing
    alignment: AlignmentType.JUSTIFIED,
    ...opts,
    children,
  });
}

/** Bold + centered court-style heading */
function courtHeading(text, size = 24) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [new TextRun({ text, bold: true, size, font: "Times New Roman" })],
  });
}

/** Blank spacer line */
const spacer = new Paragraph({ spacing: { after: 120 }, children: [] });

// ───── Document Construction ─────

module.exports = new Document({
  // Indian courts use Times New Roman as the standard font
  styles: {
    default: {
      document: {
        run: { font: "Times New Roman", size: 24 }, // 12pt
      },
    },
  },

  // Numbered paragraphs for the plaint body
  numbering: {
    config: [
      {
        reference: "plaint-paras",
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: "%1.",
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: { indent: { left: 720, hanging: 360 } },
              run: { bold: true },
            },
          },
        ],
      },
      {
        reference: "prayer-items",
        levels: [
          {
            level: 0,
            format: LevelFormat.LOWER_LETTER,
            text: "(%1)",
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
          // A4 paper — standard for Indian courts
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, bottom: 1440, left: 1800, right: 1440 },
        },
      },
      // Page numbers in footer
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
        courtHeading("IN THE COURT OF SENIOR CIVIL JUDGE", 26),
        courtHeading("(DISTRICT ________), ________ COURT, DELHI", 24),

        spacer,

        // ─── Case Number ───
        legalPara(
          [new TextRun({ text: "SUIT NO. ________ OF 20__", bold: true, size: 24 })],
          { alignment: AlignmentType.CENTER }
        ),

        spacer,

        // ─── Parties Block ───
        legalPara(
          [new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
          { alignment: AlignmentType.CENTER }
        ),

        // Plaintiff details
        legalPara([new TextRun("Sh. ________")]),
        legalPara([new TextRun("S/o ________")]),
        legalPara([new TextRun("R/o ________")]),
        legalPara(
          [new TextRun({ text: "\u2026 PLAINTIFF", bold: true })],
          { alignment: AlignmentType.RIGHT }
        ),

        // Versus
        legalPara(
          [new TextRun({ text: "VERSUS", bold: true, size: 26 })],
          { alignment: AlignmentType.CENTER, spacing: { before: 200, after: 200 } }
        ),

        // Defendant details
        legalPara([new TextRun({ text: "1. ", bold: true }), new TextRun("Sh. ________")]),
        legalPara([new TextRun("   S/o ________")]),
        legalPara([new TextRun("   R/o ________")]),
        legalPara([new TextRun({ text: "2. ", bold: true }), new TextRun("Sh. ________")]),
        legalPara([new TextRun("   S/o ________")]),
        legalPara([new TextRun("   R/o ________")]),
        legalPara(
          [new TextRun({ text: "\u2026 DEFENDANTS", bold: true })],
          { alignment: AlignmentType.RIGHT }
        ),

        spacer,

        // ─── Title of the Suit ───
        courtHeading("SUIT FOR PERMANENT INJUNCTION", 28),

        spacer,

        // ─── Body ───
        legalPara(
          [new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
          { alignment: AlignmentType.CENTER }
        ),

        spacer,

        // Numbered paragraphs of the plaint
        new Paragraph({
          numbering: { reference: "plaint-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the plaintiff is the permanent resident of the above-mentioned address in property bearing no. ________ for the last many years and is living with ________ as a tenant."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "plaint-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the plaintiff is a tenant in respect of the above said property bearing no. ________ consisting of two rooms for rent of Rs. ________ per month excluding electricity and water charges under the tenancy of late Sh. ________ who died on ________ (date)."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "plaint-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the plaintiff spent a huge amount on the construction of the two rooms in the above said premises at the request of Late Sh. ________ and was assured by him to adjust the said rent. The plaintiff has the necessary documents/proofs of material for construction of rooms in the above said property."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "plaint-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That at present the plaintiff is having the possession of the premises and has the necessary documents/record regarding possession, but the above said defendants are intended to disturb the peaceful physical possession of the plaintiff of the above said premises."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "plaint-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That on ________ (date) the above said defendants came to the above said premises of the plaintiff and threatened the plaintiff to vacate the tenanted premises immediately, otherwise the plaintiff would have to face dire consequences."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "plaint-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the plaintiff has no other efficacious remedy except to approach this Hon'ble Court for seeking relief of injunction against the defendants from interfering in the peaceful possession of the premises."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "plaint-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the cause of action arose on different dates when the defendants threatened the plaintiff to vacate the premises and further to dispossess him from the above premises forcibly and illegally. The cause of action still subsists as the threat of the defendants to dispossess the plaintiff continues."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "plaint-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "The value of this suit for the purposes of court fee and jurisdiction is Rs. ________ on which court fee of Rs. ________ is paid."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "plaint-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "This Hon'ble Court has jurisdiction to entertain this suit because the said premises is situated within the territorial jurisdiction of this Hon'ble Court."
            ),
          ],
        }),

        spacer,

        // ─── Prayer ───
        courtHeading("PRAYER", 26),

        legalPara([
          new TextRun(
            "It is, therefore, most respectfully prayed that this Hon'ble Court may be pleased to:"
          ),
        ]),

        new Paragraph({
          numbering: { reference: "prayer-items", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "pass the decree for Permanent Injunction in favour of the plaintiff and against the defendants thereby restraining the defendants, their representatives, employees, agents etc. from dispossessing the plaintiff forcibly and illegally from the premises and also from interfering in the peaceful possession of the above said premises."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "prayer-items", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun("award cost of the suit in favour of the Plaintiff and against the Defendants;"),
          ],
        }),

        new Paragraph({
          numbering: { reference: "prayer-items", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "pass such other and further order(s) as may be deemed fit and proper on the facts and in the circumstances of this case."
            ),
          ],
        }),

        spacer,
        spacer,

        // ─── Signature Block using Tab Stops ───
        new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun("Place: ________"),
            new TextRun("\tPlaintiff"),
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

        // ─── Verification ───
        courtHeading("VERIFICATION", 24),

        legalPara([
          new TextRun(
            "Verified at Delhi on this ________ of ________ 20__ that the contents of paras 1 to __ of the plaint are true to my knowledge, those of paras __ to __ are true on information received and believed to be true and the last para is the humble prayer to this Hon'ble Court."
          ),
        ]),

        spacer,

        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "Plaintiff", bold: true })],
        }),

        spacer,
        spacer,

        legalPara(
          [
            new TextRun({ text: "[NOTE: ", bold: true, italics: true }),
            new TextRun({ text: "This plaint has to be supported by an affidavit]", italics: true }),
          ],
          { alignment: AlignmentType.CENTER }
        ),
      ],
    },
  ],
});
