/**
 * APPLICATION FOR EXECUTION OF DECREE
 * ──────────────────────────────────────
 * Category : Civil Procedure — Post-judgment Enforcement
 * Court    : The Court that passed the decree (or to which it is transferred)
 * Statute  : Order XXI, Code of Civil Procedure, 1908
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * The Application for Execution of Decree is the practical capstone
 * of every civil suit. To understand why it deserves a place in your
 * library, consider what happens after the dramatic moments of trial
 * and judgment are over. A plaintiff who has won a suit for recovery
 * of money does not automatically receive that money. A landlord who
 * has won a suit for ejectment does not automatically get possession.
 * The decree is only a piece of paper that says the plaintiff is
 * entitled to a particular relief. To actually obtain that relief in
 * the real world, the decree-holder must take active steps under
 * Order XXI of the Code of Civil Procedure to enforce the decree
 * against the judgment-debtor. This process is called "execution,"
 * and the application that initiates it is what this template
 * provides.
 *
 * THE TWO ROLES IN EXECUTION PROCEEDINGS:
 *
 *   The terminology of execution is distinctive and worth learning
 *   precisely. The party who won the suit is called the
 *   DECREE-HOLDER (not "plaintiff" anymore, even though they were
 *   the plaintiff during the original suit). The party who lost is
 *   called the JUDGMENT-DEBTOR (not "defendant" anymore). These
 *   labels reflect the new legal status of each party after the
 *   judgment has been delivered. The decree-holder now has a legal
 *   right to a specific relief, and the judgment-debtor now has a
 *   legal obligation to provide that relief.
 *
 * THE CASE NUMBERING REFLECTS THE DERIVATIVE CHARACTER:
 *
 *   Notice the case number block in the template:
 *
 *     EXECUTION PETITION NO. ________ OF 20__
 *     IN
 *     CIVIL SUIT NO. ________ OF 20__
 *
 *   The "IN" word again signals that this is a derivative proceeding
 *   filed within an existing suit, not a fresh case. You have seen
 *   this same pattern in the Temporary Injunction IA at Template 22
 *   and in the Contempt Petition at Template 28. Whenever you see
 *   "IN" connecting two case numbers, you are looking at a
 *   procedural application within a parent case.
 *
 * THE TEN-COLUMN TABULAR FORMAT:
 *
 *   The most distinctive structural feature of this template is
 *   that the body of the application is presented as a TABLE rather
 *   than as numbered paragraphs of running prose. The reason is
 *   that Order XXI Rule 11 requires the decree-holder to state
 *   ten specific particulars about the decree and the proposed
 *   mode of execution, and these particulars are most efficiently
 *   communicated in tabular form. Each row of the table corresponds
 *   to one statutory requirement. The court can scan the table
 *   quickly and immediately understand what is being sought.
 *
 *   This is the only template in your library that uses a table for
 *   the body of the application itself. Other templates have used
 *   tables for limited purposes (the position-of-parties table in
 *   the SLP, the children-listing table in the DV Act petition, the
 *   marriage-status table in the matrimonial petitions), but this is
 *   the first time the table IS the body.
 *
 * THE TEN PARTICULARS UNDER ORDER XXI RULE 11:
 *
 *   Each row of the table maps to one of the following statutory
 *   requirements:
 *
 *     1. Number of the suit
 *     2. Names of the parties
 *     3. Date of the decree or order whose execution is sought
 *     4. Whether any appeal has been preferred from the decree
 *     5. Whether any payment has been received in satisfaction
 *     6. Whether any previous application for execution has been made
 *     7. Amount of the decree along with any interest
 *     8. Amount of costs allowed by the court
 *     9. Against whom execution is sought
 *     10. The manner in which the assistance of the court is required
 *
 *   The tenth column is the most important practically because it
 *   specifies HOW the court is being asked to enforce the decree.
 *   The available modes under Order XXI Rule 30 include:
 *     - delivery of property
 *     - attachment and sale of property
 *     - attachment of bank accounts
 *     - arrest and detention in civil prison
 *     - appointment of a receiver
 *
 *   The decree-holder chooses the mode that is most likely to
 *   actually produce the relief, and the court (after hearing the
 *   judgment-debtor) decides whether to allow that mode.
 *
 * THE DOCUMENTARY REQUIREMENT:
 *
 *   Notice the closing paragraph which states that the application
 *   must be accompanied by a duly certified copy of the decree, or
 *   by the original decree, or by the minutes of the decree until it
 *   is drawn up. Without these accompanying documents, the executing
 *   court has no way to verify the decree-holder's claim, and the
 *   application will be returned for cure of the defect. Some judges
 *   are willing to allow execution to begin even before the decree
 *   is formally sealed, on the strength of the minutes of the
 *   judgment, because justice should not be delayed by mere registry
 *   procedures.
 */

const {
  Document, Paragraph, TextRun,
  Table, TableRow, TableCell,
  AlignmentType, TabStopType, TabStopPosition,
  Footer, PageNumber, LevelFormat,
  BorderStyle, WidthType, ShadingType
} = require("docx");

function legalPara(children, opts = {}) {
  return new Paragraph({
    spacing: { after: 120, line: 360 },
    alignment: AlignmentType.JUSTIFIED, ...opts, children,
  });
}
function centeredBold(text, size = 24) {
  return new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 60 },
    children: [new TextRun({ text, bold: true, size, font: "Times New Roman" })],
  });
}
const spacer = new Paragraph({ spacing: { after: 120 }, children: [] });

// Table helpers — used to create the ten-row particulars table
const tBorder = { style: BorderStyle.SINGLE, size: 1, color: "000000" };
const tBorders = { top: tBorder, bottom: tBorder, left: tBorder, right: tBorder };

// Cell helper that takes a width and a paragraph children array
function tCell(textOrChildren, width, opts = {}) {
  const children = typeof textOrChildren === "string"
    ? [new Paragraph({
        alignment: opts.align || AlignmentType.LEFT,
        spacing: { after: 60, line: 280 },
        children: [new TextRun({
          text: textOrChildren,
          bold: opts.header || opts.bold || false,
          size: 20,
          font: "Times New Roman",
        })],
      })]
    : textOrChildren;
  return new TableCell({
    borders: tBorders,
    width: { size: width, type: WidthType.DXA },
    margins: { top: 100, bottom: 100, left: 120, right: 120 },
    shading: opts.header ? { fill: "E8E8E8", type: ShadingType.CLEAR } : undefined,
    children,
  });
}

// A4 minus our margins
const contentWidth = 8666;

module.exports = new Document({
  styles: { default: { document: { run: { font: "Times New Roman", size: 24 } } } },
  numbering: {
    config: [{
      reference: "exec-paras",
      levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
    }],
  },
  sections: [{
    properties: {
      page: { size: { width: 11906, height: 16838 },
              margin: { top: 1440, bottom: 1440, left: 1800, right: 1440 } },
    },
    footers: { default: new Footer({ children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ children: ["Page ", PageNumber.CURRENT], size: 18, font: "Times New Roman" })],
    })] }) },
    children: [
      // ─── Court Header ───
      // The execution application is filed in the same court that
      // passed the decree, unless the decree has been transferred to
      // another court for execution under Section 39 CPC.
      centeredBold("IN THE COURT OF ________", 26),
      centeredBold("(DISTRICT ________), ________ COURT, DELHI", 22),
      spacer,

      // ─── Case Numbering — the IN format showing derivation ───
      centeredBold("EXECUTION PETITION NO. ________ OF 20__", 24),
      centeredBold("IN", 22),
      centeredBold("CIVIL SUIT NO. ________ OF 20__", 24),
      spacer,

      // ─── Parties ───
      // The transformed labels — Decree-Holder and Judgment-Debtor —
      // reflect the new legal status of each party after judgment.
      legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      legalPara([new TextRun({ text: "A ________", bold: true })]),
      legalPara([new TextRun("S/o ________")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara([new TextRun({ text: "\u2026 DECREE-HOLDER", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      centeredBold("VERSUS"),
      spacer,

      legalPara([new TextRun({ text: "B ________", bold: true })]),
      legalPara([new TextRun("S/o ________")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara([new TextRun({ text: "\u2026 JUDGMENT-DEBTOR", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      spacer,

      // ─── Title and Operative Statement ───
      legalPara([
        new TextRun({ text: "THE DECREE-HOLDER PRAYS FOR EXECUTION OF THE DECREE / ORDER DATED ________, ", bold: true }),
        new TextRun({ text: "the particulars whereof are stated in the columns hereunder:", bold: true }),
      ], { alignment: AlignmentType.CENTER }),

      spacer,

      // Police Station — required by some courts so that police
      // assistance can be requisitioned during execution if needed
      legalPara([new TextRun({ text: "Police Station: ________", bold: true })]),

      spacer,

      // ═══════════════════════════════════════════════════════════
      // THE TEN-ROW PARTICULARS TABLE
      // ═══════════════════════════════════════════════════════════
      // Each row corresponds to one statutory requirement under
      // Order XXI Rule 11. The table is the body of the application,
      // not just an exhibit attached to it.

      new Table({
        width: { size: contentWidth, type: WidthType.DXA },
        columnWidths: [666, 4500, 3500],
        rows: [
          // Row 1: Number of the suit
          new TableRow({
            children: [
              tCell("1.", 666, { header: true, align: AlignmentType.CENTER }),
              tCell("Number of suit", 4500),
              tCell("Civil Suit No. ________ of 20__", 3500),
            ],
          }),
          // Row 2: Names of parties
          new TableRow({
            children: [
              tCell("2.", 666, { header: true, align: AlignmentType.CENTER }),
              tCell("Names of parties", 4500),
              tCell("A versus B", 3500),
            ],
          }),
          // Row 3: Date of decree
          new TableRow({
            children: [
              tCell("3.", 666, { header: true, align: AlignmentType.CENTER }),
              tCell("Date of the decree / order of which execution is sought", 4500),
              tCell("________", 3500),
            ],
          }),
          // Row 4: Whether appeal filed
          new TableRow({
            children: [
              tCell("4.", 666, { header: true, align: AlignmentType.CENTER }),
              tCell("Whether any appeal has been preferred from the decree / order under execution", 4500),
              tCell("No appeal has been filed against the decree dated ________", 3500),
            ],
          }),
          // Row 5: Payments received toward satisfaction
          new TableRow({
            children: [
              tCell("5.", 666, { header: true, align: AlignmentType.CENTER }),
              tCell("Whether any payment has been received towards satisfaction of decree / order", 4500),
              tCell("No payment has been received from the Judgment-Debtor towards satisfaction of the decree", 3500),
            ],
          }),
          // Row 6: Previous applications
          new TableRow({
            children: [
              tCell("6.", 666, { header: true, align: AlignmentType.CENTER }),
              tCell("Whether any application was made previous to this and, if so, their dates and results", 4500),
              tCell("No previous application for execution of the decree has been filed", 3500),
            ],
          }),
          // Row 7: Amount of decree
          new TableRow({
            children: [
              tCell("7.", 666, { header: true, align: AlignmentType.CENTER }),
              tCell("Amount of the suit along with interest as per decree or any other relief granted by the decree", 4500),
              tCell("Principal: Rs. ________; Interest at ________% per annum from ________ till ________: Rs. ________; Total: Rs. ________", 3500),
            ],
          }),
          // Row 8: Costs
          new TableRow({
            children: [
              tCell("8.", 666, { header: true, align: AlignmentType.CENTER }),
              tCell("Amount of costs if allowed by the Court", 4500),
              tCell("Costs of Rs. ________ have been allowed by the Hon'ble Court", 3500),
            ],
          }),
          // Row 9: Against whom execution is sought
          new TableRow({
            children: [
              tCell("9.", 666, { header: true, align: AlignmentType.CENTER }),
              tCell("Against whom execution is sought", 4500),
              tCell("Execution is sought against B (Judgment-Debtor), S/o ________, R/o ________", 3500),
            ],
          }),
          // Row 10: Mode of execution — the most important row
          new TableRow({
            children: [
              tCell("10.", 666, { header: true, align: AlignmentType.CENTER }),
              tCell("In what manner the Court's assistance is sought", 4500),
              tCell("By attachment and sale of the movable and immovable property of the Judgment-Debtor described in the schedule annexed hereto, and by such other modes of execution as this Hon'ble Court may deem fit and proper", 3500),
            ],
          }),
        ],
      }),

      spacer, spacer,

      // ─── Prayer ───
      // The prayer is short because the substance of the application
      // is in the table above.
      centeredBold("PRAYER:", 26),
      spacer,

      legalPara([
        new TextRun(
          "The Decree-Holder prays that the execution of the decree passed in the above case may be granted in the manner specified in Column 10 of the table above, and that this Hon'ble Court may pass such further orders or directions as may be deemed fit and proper in the facts and circumstances of the case."
        ),
      ]),

      spacer, spacer,

      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Place: ________"), new TextRun({ text: "\tDECREE-HOLDER", bold: true })] }),
      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Date: ________"), new TextRun("\tThrough")] }),
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun("Advocate of Decree-Holder")] }),

      spacer,
      centeredBold("VERIFICATION:", 24), spacer,

      legalPara([new TextRun(
        "Verified at ________ on ________ day of ________, 20__ that the contents of this application are true to my knowledge and belief."
      )]),

      spacer,
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "DECREE-HOLDER", bold: true })] }),

      spacer, spacer,

      legalPara([
        new TextRun({ text: "[NOTE: ", bold: true, italics: true }),
        new TextRun({ text: "The application for execution shall be accompanied by a duly certified copy of the decree or order, or by the original, or by the minutes of decree or order until the decree or order is drawn up. The Court may allow execution before sealing of the decree or order in appropriate cases.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
