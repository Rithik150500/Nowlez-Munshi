/**
 * COMPLAINT UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881
 * ──────────────────────────────────────────────────────────────────────
 * Category : Criminal Law — Statutory Complaint
 * Court    : Judicial Magistrate First Class (NI Act), Delhi
 * Statute  : Section 138, Negotiable Instruments Act, 1881
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * This is one of the MOST COMMONLY filed criminal complaints in India.
 * Section 138 NI Act criminalises the dishonour of a cheque for
 * insufficiency of funds. The complaint has a STRICT procedural sequence:
 *
 *   1. Cheque presented within validity period → dishonoured
 *   2. Written demand notice sent within 30 days of dishonour
 *   3. Accused fails to pay within 15 days of receiving notice
 *   4. Complaint filed within 1 month of cause of action arising
 *
 * The complaint must demonstrate compliance with ALL four steps.
 * Missing any step makes the complaint non-maintainable.
 *
 * Annexures required:
 *   A — Copy of Lease-deed / underlying transaction document
 *   B — Original dishonoured cheque
 *   C — Bank's returning memo with "Refer to Drawer" endorsement
 *   D — Demand notice sent to accused
 *   E — Postal receipt and UPC of the demand notice
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
        reference: "complaint-paras",
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
        // ─── Court Header ───
        centeredBold("IN THE COURT OF JUDICIAL MAGISTRATE FIRST CLASS (NI ACT)", 22),
        centeredBold("________ COURT, (DISTRICT ________), DELHI", 24),
        spacer,

        // ─── Case Number ───
        centeredBold("CRIMINAL COMPLAINT NO. ________ OF 20__", 24),
        spacer,

        // ─── Parties ───
        // In a Section 138 complaint, the cheque payee is the "Complainant"
        // and the cheque drawer is the "Accused" (not plaintiff/defendant,
        // since this is a criminal proceeding, not civil).
        legalPara([new TextRun({ text: "X ________", bold: true })]),
        legalPara([new TextRun("S/o ________")]),
        legalPara([new TextRun("R/o ________")]),
        legalPara(
          [new TextRun({ text: "\u2026 COMPLAINANT", bold: true })],
          { alignment: AlignmentType.RIGHT }
        ),

        centeredBold("VERSUS"),
        spacer,

        legalPara([new TextRun({ text: "Y ________", bold: true })]),
        legalPara([new TextRun("S/o ________")]),
        legalPara([new TextRun("R/o ________")]),
        legalPara(
          [new TextRun({ text: "\u2026 ACCUSED", bold: true })],
          { alignment: AlignmentType.RIGHT }
        ),

        spacer,

        // ─── Jurisdiction ───
        // Police Station jurisdiction must be specified in criminal complaints
        legalPara([
          new TextRun({ text: "JURISDICTION: ", bold: true }),
          new TextRun("P.S. ________"),
        ]),

        spacer,

        // ─── Title ───
        centeredBold("COMPLAINT UNDER SECTION 138 OF THE", 24),
        centeredBold("NEGOTIABLE INSTRUMENTS ACT, 1881", 24),
        spacer,

        legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
          { alignment: AlignmentType.CENTER }),
        spacer,

        // ─── Body ───
        // Each paragraph methodically establishes the procedural requirements

        // Para 1-2: Establish the underlying transaction relationship
        new Paragraph({
          numbering: { reference: "complaint-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the Complainant is the owner and landlord of flat bearing No. ________, New Delhi."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "complaint-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the Accused is a tenant under the Complainant in respect of flat bearing No. ________, New Delhi at a monthly rent of Rs. ________ for residential purposes w.e.f. ________. True copy of the Lease-deed dated ________ is annexed hereto as "
            ),
            new TextRun({ text: "Annexure \u2013 'A'.", bold: true }),
          ],
        }),

        // Para 3: The cheque — STEP 1 of the statutory procedure
        new Paragraph({
          numbering: { reference: "complaint-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That on ________ the Accused handed over cheque bearing No. ________ dated ________ for Rs. ________ drawn on ________ Bank, New Delhi to the Complainant towards rent of the said premises for the months of ________. The said original cheque is annexed hereto as "
            ),
            new TextRun({ text: "Annexure \u2013 'B'.", bold: true }),
          ],
        }),

        // Para 4: Dishonour — Presentation within validity and dishonour
        new Paragraph({
          numbering: { reference: "complaint-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the Complainant deposited the said cheque in his account with ________ Bank on ________ (date) but the same was dishonoured on presentation with the remarks "
            ),
            new TextRun({ text: "'REFER TO DRAWER'", bold: true }),
            new TextRun(
              ". The original returning memo dated ________ in respect of the said cheque is annexed hereto as "
            ),
            new TextRun({ text: "Annexure \u2013 'C'.", bold: true }),
          ],
        }),

        // Para 5: Demand notice — STEP 2 (within 30 days of dishonour)
        new Paragraph({
          numbering: { reference: "complaint-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That vide letter dated ________, the Complainant called upon the Accused to make the payment of the amount covered by the dishonoured cheque. The said letter was sent to the Accused by Regd. A.D. as well as U.P.C. However, the Accused failed to make the payment of the amount in question to the Complainant."
            ),
          ],
        }),

        // Para 6: Criminal liability — the offence
        new Paragraph({
          numbering: { reference: "complaint-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the cheque in question was returned unpaid because the amount standing to the credit in the Accused's account was insufficient to honour the cheque in question and as such the Accused is liable to be prosecuted and punished under Section 138 of the Negotiable Instruments Act, 1881 as amended up-to-date."
            ),
          ],
        }),

        // Para 7: Compliance — demonstrates all 4 statutory steps
        // This is the MOST CRITICAL paragraph — if any time limit is breached,
        // the complaint becomes non-maintainable.
        new Paragraph({
          numbering: { reference: "complaint-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the Complainant has complied with all the requirements of Section 138 of the Negotiable Instruments Act, 1881 as amended up-to-date, namely:"
            ),
          ],
        }),

        // Compliance sub-points (indented for emphasis)
        legalPara([
          new TextRun({ text: "(a) ", bold: true }),
          new TextRun("the cheque in question was presented on ________, i.e., within the period of its validity;"),
        ], { indent: { left: 1080 } }),

        legalPara([
          new TextRun({ text: "(b) ", bold: true }),
          new TextRun("the demand for payment was made to the Accused on ________, i.e., within thirty days of the date of receipt of information regarding the dishonouring of the cheque. True copy of the said demand dated ________ is annexed hereto as "),
          new TextRun({ text: "Annexure \u2013 'D'", bold: true }),
          new TextRun(". The postal receipt and the U.P.C. thereof are annexed hereto as "),
          new TextRun({ text: "Annexure \u2013 'E' collectively", bold: true }),
          new TextRun(";"),
        ], { indent: { left: 1080 } }),

        legalPara([
          new TextRun({ text: "(c) ", bold: true }),
          new TextRun("the Accused failed to make the payment within fifteen days of the said notice; and"),
        ], { indent: { left: 1080 } }),

        legalPara([
          new TextRun({ text: "(d) ", bold: true }),
          new TextRun("the Complainant has approached this Hon'ble Court within one month of the date of the cause of action. The complaint is therefore within time."),
        ], { indent: { left: 1080 } }),

        // Para 8: Jurisdiction
        new Paragraph({
          numbering: { reference: "complaint-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That this Hon'ble Court has jurisdiction to entertain and try the present complaint because the offence is committed within the jurisdiction of this Hon'ble Court."
            ),
          ],
        }),

        spacer,

        // ─── Prayer ───
        centeredBold("PRAYER:", 26),
        spacer,

        legalPara([
          new TextRun(
            "It is, therefore, most respectfully prayed that this Hon'ble Court may be pleased to summon the Accused under Section 138 of the Negotiable Instruments Act, 1881 as amended up-to-date and the Accused be tried and punished in accordance with law for the aforesaid offence committed by him."
          ),
        ]),

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

        // ─── Notes ───
        legalPara([
          new TextRun({ text: "Notes:", bold: true, underline: {} }),
        ]),
        legalPara([
          new TextRun({ text: "1. ", bold: true }),
          new TextRun({ text: "An affidavit in support is to be annexed.", italics: true }),
        ]),
        legalPara([
          new TextRun({ text: "2. List of Witnesses:", bold: true }),
        ]),
        legalPara([new TextRun({ text: "   (i)   Complainant", italics: true })]),
        legalPara([new TextRun({ text: "   (ii)  Banker(s) of the Complainant with record of the cheque", italics: true })]),
        legalPara([new TextRun({ text: "   (iii) Banker(s) of the Accused with record of the cheque", italics: true })]),
        legalPara([new TextRun({ text: "   (iv)  Any other witness, if needed, as per the facts of the case", italics: true })]),
      ],
    },
  ],
});
