/**
 * APPLICATION FOR ANTICIPATORY BAIL
 * ───────────────────────────────────
 * Category : Criminal Law Pleading
 * Court    : Sessions Judge, Delhi
 * Statute  : Section 482 of the Bharatiya Nagarik Suraksha Sanhita, 2023
 *            (formerly Section 438 of the Code of Criminal Procedure, 1973)
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * Anticipatory bail is a unique Indian legal concept — it allows a person
 * who apprehends arrest to obtain bail BEFORE being arrested. This is
 * distinct from "regular bail" which is sought AFTER arrest.
 *
 * Key structural elements:
 *   - FIR details (number, sections, police station) appear prominently
 *   - The body must establish: (a) false implication, (b) no flight risk,
 *     (c) willingness to cooperate with investigation
 *   - The prayer asks for release "in the event of arrest" (conditional)
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
        reference: "bail-paras",
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
        // ─── Court Header ───
        centeredBold("IN THE COURT OF SESSIONS JUDGE", 26),
        centeredBold("(DISTRICT ________), ________ COURT, DELHI", 24),
        spacer,

        // ─── Application Number ───
        centeredBold("ANTICIPATORY BAIL APPLICATION NO. ________ OF 20__", 24),
        spacer,

        // ─── Parties ───
        legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
          { alignment: AlignmentType.CENTER }),

        legalPara([new TextRun({ text: "X ________", bold: true })]),
        legalPara([new TextRun("S/o ________")]),
        legalPara([new TextRun("R/o ________")]),
        legalPara(
          [new TextRun({ text: "\u2026 APPLICANT", bold: true })],
          { alignment: AlignmentType.RIGHT }
        ),

        centeredBold("VERSUS"),
        spacer,

        legalPara([new TextRun({ text: "STATE", bold: true })]),
        legalPara(
          [new TextRun({ text: "\u2026 RESPONDENT / COMPLAINANT", bold: true })],
          { alignment: AlignmentType.RIGHT }
        ),

        spacer,

        // ─── FIR Details Block ───
        // In criminal applications, the FIR details are displayed prominently
        // so the court can immediately identify the case context.
        // Using top/bottom borders on the first and last paragraph to frame
        // the block (paragraph borders in docx-js support top/bottom/between,
        // but NOT left/right — those are only valid on table cells).
        new Paragraph({
          spacing: { after: 60 },
          border: {
            top: { style: BorderStyle.SINGLE, size: 2, color: "333333", space: 4 },
          },
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "FIR NO. ________ OF 20__", bold: true, size: 22 }),
          ],
        }),
        new Paragraph({
          spacing: { after: 60 },
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "UNDER SECTION ________ BNS", bold: true, size: 22 }),
          ],
        }),
        new Paragraph({
          spacing: { after: 120 },
          border: {
            bottom: { style: BorderStyle.SINGLE, size: 2, color: "333333", space: 4 },
          },
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "POLICE STATION: ________", bold: true, size: 22 }),
          ],
        }),

        spacer,

        // ─── Title ───
        centeredBold("APPLICATION FOR THE GRANT OF ANTICIPATORY BAIL", 24),
        centeredBold("UNDER SECTION 482 OF THE BHARATIYA NAGARIK", 22),
        centeredBold("SURAKSHA SANHITA, 2023", 22),
        spacer,

        legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
          { alignment: AlignmentType.CENTER }),
        spacer,

        // ─── Body ───
        // The numbered paragraphs must systematically build the case
        // for why anticipatory bail should be granted.

        new Paragraph({
          numbering: { reference: "bail-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the Applicant is aged ________ years, residing at ________, Delhi. The Applicant is a respectable person of his locality and is a peace-loving citizen."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "bail-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the Applicant has been falsely implicated in the above-mentioned FIR. The Applicant is innocent and has not committed any offence whatsoever."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "bail-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the brief facts giving rise to the present application are as follows: ________"
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "bail-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the police has registered a false FIR against the Applicant. A bare perusal of the said FIR reveals that the complainant has manipulated the facts and has falsely implicated the Applicant. The Applicant is, in fact, the victim at the hands of the Complainant."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "bail-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the FIR registered against the Applicant is absolutely false and incorrect. The Applicant is not at all involved in the alleged offence and has been falsely implicated."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "bail-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the Applicant apprehends that he may be arrested in pursuance of the aforesaid false and fictitious complaint."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "bail-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the police officials have visited the premises of the Applicant in his absence and there is every likelihood of his being arrested in the instant case."
            ),
          ],
        }),

        // The next three paragraphs address the standard bail criteria:
        // cooperation, no flight risk, clean antecedents

        new Paragraph({
          numbering: { reference: "bail-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({ text: "That the Applicant undertakes to join the investigation as and when directed to do so.", bold: false }),
          ],
        }),

        new Paragraph({
          numbering: { reference: "bail-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the Applicant is a permanent resident of Delhi and there is no chance of his absconding in case he is granted anticipatory bail."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "bail-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the Applicant has never been involved in any criminal case except the present one."
            ),
          ],
        }),

        spacer,

        // ─── Prayer ───
        // The prayer in anticipatory bail is CONDITIONAL — "in the event of arrest"
        centeredBold("PRAYER:", 26),
        spacer,

        legalPara([
          new TextRun(
            "It is, therefore, most respectfully prayed that the Applicant be released on bail "
          ),
          new TextRun({ text: "in the event of his arrest ", bold: true, underline: {} }),
          new TextRun(
            "and appropriate directions in this regard may please be sent to the concerned Investigating Officer / S.H.O. Any other order(s) which this Hon'ble Court may deem fit and proper on the facts and circumstances of this case may also be passed."
          ),
        ]),

        spacer,
        spacer,

        // ─── Signature Block ───
        new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun("Place: ________"),
            new TextRun("\tApplicant"),
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

        legalPara(
          [
            new TextRun({ text: "[Note: ", bold: true, italics: true }),
            new TextRun({ text: "To be supported by affidavit]", italics: true }),
          ],
          { alignment: AlignmentType.CENTER }
        ),
      ],
    },
  ],
});
