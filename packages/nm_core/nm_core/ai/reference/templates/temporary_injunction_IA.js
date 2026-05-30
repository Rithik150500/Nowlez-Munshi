/**
 * APPLICATION FOR TEMPORARY INJUNCTION
 * ───────────────────────────────────────
 * Category : Civil Pleading — Interlocutory Application (IA)
 * Court    : Senior Civil Judge, Delhi
 * Statute  : Order XXXIX Rules 1 and 2 read with Section 151,
 *            Code of Civil Procedure, 1908
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * This is the FIRST template in the library that is filed AS AN
 * INTERLOCUTORY APPLICATION (IA) within an existing suit, rather
 * than as a standalone proceeding. The case number reflects this:
 *
 *   IA NO. ________ OF 20__
 *   IN
 *   SUIT NO. ________ OF 20__
 *
 * The "IN" word is critical — it shows that this application is
 * filed WITHIN a parent suit, not as a separate case.
 *
 * RELATIONSHIP WITH PERMANENT INJUNCTION SUIT (Template 01):
 *
 *   Template 01 (Permanent Injunction Suit) seeks a FINAL injunction
 *   that will be granted after a full trial — possibly years away.
 *
 *   This template (Temporary Injunction IA) seeks INTERIM protection
 *   immediately, to preserve the status quo until the suit is decided.
 *
 *   The two are typically filed TOGETHER on the same day. The court
 *   first hears the IA and grants interim protection (or refuses it),
 *   then proceeds with the main suit at its normal pace.
 *
 * THE THREE-ELEMENT TEST:
 *
 *   For granting a temporary injunction, the court applies the
 *   well-established three-element test:
 *
 *     1. PRIMA FACIE CASE — does the applicant have a legitimate,
 *        arguable case that is likely to succeed?
 *
 *     2. BALANCE OF CONVENIENCE — will more harm be caused to the
 *        applicant by refusing the injunction than to the respondent
 *        by granting it?
 *
 *     3. IRREPARABLE INJURY — will the applicant suffer harm that
 *        cannot be adequately compensated by money damages if the
 *        injunction is refused?
 *
 *   These three elements must each be specifically pleaded — paragraphs
 *   3, 4 and 5 of this template address them in order.
 *
 * BREVITY PRINCIPLE: Notice paragraph 2 — "the contents of the
 * accompanying suit may kindly be read as part and parcel of this
 * application which are not repeated here for the sake of brevity."
 * This is a standard convention in IAs to avoid duplicating the
 * factual narrative already set out in the main plaint.
 */

const {
  Document, Paragraph, TextRun,
  AlignmentType, TabStopType, TabStopPosition,
  Footer, PageNumber, LevelFormat
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

module.exports = new Document({
  styles: { default: { document: { run: { font: "Times New Roman", size: 24 } } } },
  numbering: {
    config: [
      { reference: "ia-paras", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "prayer-items", levels: [{ level: 0, format: LevelFormat.LOWER_LETTER, text: "%1)",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
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
      centeredBold("IN THE COURT OF SENIOR CIVIL JUDGE", 26),
      centeredBold("(DISTRICT ________), ________ COURT, DELHI", 22),
      spacer,

      // ─── IA Numbering — the distinctive "IA NO ... IN SUIT NO ..." format ───
      // The "IN" word is what marks this as an interlocutory application
      // filed within an existing suit.
      centeredBold("IA NO. ________ OF 20__", 24),
      centeredBold("IN", 22),
      centeredBold("SUIT NO. ________ OF 20__", 24),

      spacer,

      // ─── Parties ───
      // In an IA, the parties are labelled with their dual roles:
      // their original role in the suit (Plaintiff/Defendant) AND
      // their role in the IA (Applicant/Respondent).
      legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      legalPara([new TextRun({ text: "Sh. Om Veer Singh", bold: true })]),
      legalPara([new TextRun("S/o ________")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara([new TextRun({ text: "\u2026 PLAINTIFF / APPLICANT", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      centeredBold("VERSUS"),
      spacer,

      legalPara([new TextRun({ text: "1. Dr. U. Basu", bold: true })]),
      legalPara([new TextRun("   S/o ________")]),
      legalPara([new TextRun("   R/o ________")]),
      legalPara([new TextRun({ text: "2. Sh. Tapan Kumar", bold: true })]),
      legalPara([new TextRun("   S/o ________")]),
      legalPara([new TextRun("   R/o ________")]),
      legalPara([new TextRun({ text: "\u2026 DEFENDANTS / RESPONDENTS", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      spacer,

      // ─── Title ───
      centeredBold("APPLICATION FOR TEMPORARY INJUNCTION UNDER", 22),
      centeredBold("ORDER XXXIX, RULES 1 AND 2 READ WITH SECTION 151", 22),
      centeredBold("OF THE CODE OF CIVIL PROCEDURE, 1908", 22),
      spacer,

      legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Body ───
      // IA bodies are deliberately SHORT — the facts are already in
      // the main plaint, which is incorporated by reference.

      // Para 1: Identifying the parent suit
      new Paragraph({ numbering: { reference: "ia-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Plaintiff has filed a suit for permanent injunction which is pending for disposal before this Hon'ble Court."
        )] }),

      // Para 2: The brevity clause — incorporating the main plaint by reference
      new Paragraph({ numbering: { reference: "ia-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun("That the contents of the accompanying suit for permanent injunction "),
          new TextRun({ text: "may kindly be read as a part and parcel of this application ", bold: true }),
          new TextRun("which are not repeated here for the sake of brevity."),
        ] }),

      // Para 3: ELEMENT 1 — PRIMA FACIE CASE
      new Paragraph({ numbering: { reference: "ia-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun("That the Plaintiff/Applicant has got a "),
          new TextRun({ text: "prima facie case ", bold: true, italics: true }),
          new TextRun("in his favour and there is likelihood of success in the present case."),
        ] }),

      // Para 4: ELEMENT 3 — IRREPARABLE INJURY
      // (The standard pleading order in IAs places irreparable injury
      // before balance of convenience because it is the more dramatic
      // ground.)
      new Paragraph({ numbering: { reference: "ia-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun("That in case the Defendants are not restrained by means of an "),
          new TextRun({ text: "ad-interim injunction ", bold: true }),
          new TextRun("from dispossessing the Plaintiff from the above said premises and from interfering in the physical peaceful possession of the said premises, the Plaintiff "),
          new TextRun({ text: "shall suffer irreparable loss and injury ", bold: true }),
          new TextRun("and the suit shall become infructuous, leading to multiplicity of cases."),
        ] }),

      // Para 5: ELEMENT 2 — BALANCE OF CONVENIENCE
      new Paragraph({ numbering: { reference: "ia-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun("That the "),
          new TextRun({ text: "balance of convenience ", bold: true }),
          new TextRun("lies in favour of the Plaintiff and against the Defendants."),
        ] }),

      spacer,

      // ─── Prayer ───
      // The prayer in an IA seeks INTERIM relief — note the words
      // "ex-parte ad interim injunction" which is the strongest form
      // of relief: granted without even hearing the other side, and
      // operative until further orders.
      centeredBold("PRAYER:", 26),
      spacer,

      legalPara([new TextRun("It is, therefore, most respectfully prayed that this Hon'ble Court may be pleased to:")]),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun("Pass an "),
          new TextRun({ text: "ex-parte ad interim injunction ", bold: true }),
          new TextRun("restraining the Defendants, their associates, servants, agents and representatives from interfering in the peaceful physical possession of the Plaintiff in the above said premises and from dispossessing the Applicant/Plaintiff from the same;"),
        ] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("pass such other and further order(s) as may be deemed fit and proper on the facts and in the circumstances of this case.")] }),

      spacer, spacer,

      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Place: ________"), new TextRun("\tPlaintiff / Applicant")] }),
      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Date: ________"), new TextRun("\tThrough")] }),
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun("Advocate")] }),

      spacer, spacer,

      legalPara([
        new TextRun({ text: "[NOTE: ", bold: true, italics: true }),
        new TextRun({ text: "This Application has to be supported by an affidavit]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
