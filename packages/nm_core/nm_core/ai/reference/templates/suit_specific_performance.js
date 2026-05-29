/**
 * SUIT FOR SPECIFIC PERFORMANCE OF CONTRACT
 * ────────────────────────────────────────────
 * Category : Civil Pleading — Equitable Remedy
 * Court    : Civil Judge, Delhi
 * Statute  : Specific Relief Act, 1963 (Sections 10-20)
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * Specific Performance is an EQUITABLE REMEDY — the court orders the
 * defendant to actually DO what they promised in a contract, rather
 * than just paying damages for breach. It is typically sought for
 * property transactions because each piece of land is unique and
 * monetary compensation cannot substitute the agreed property.
 *
 * This suit has UNIQUE REQUIREMENTS compared to other civil suits:
 *
 *   1. The plaintiff must plead and prove READINESS AND WILLINGNESS
 *      to perform their own part of the contract (Section 16(c)).
 *      This is a CONTINUING obligation — the plaintiff must be ready
 *      at ALL TIMES from the date of the contract to the hearing.
 *
 *   2. The suit must be filed WITHIN the limitation period (Article 54
 *      of the Limitation Act — 3 years from the date fixed for
 *      performance, or if no date is fixed, from when the plaintiff
 *      has notice of refusal).
 *
 *   3. A LEGAL NOTICE must precede the suit (demonstrating the
 *      plaintiff's efforts to get voluntary compliance).
 *
 *   4. The Agreement for Sale must be annexed (Annexure A).
 *
 * This template pairs naturally with Template 04 (Agreement for Sale):
 * Template 04 creates the contract; this template enforces it when
 * the other party refuses to perform.
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
      { reference: "sp-paras", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "prayer-items", levels: [{ level: 0, format: LevelFormat.LOWER_LETTER, text: "%1.",
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
      centeredBold("IN THE COURT OF ________, (DISTRICT ________), ________ COURT, DELHI", 22),
      spacer,
      centeredBold("SUIT NO. ________ OF 20__", 24),
      spacer,

      legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      legalPara([new TextRun({ text: "X ________", bold: true })]),
      legalPara([new TextRun("S/o ________")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara([new TextRun({ text: "\u2026 PLAINTIFF", bold: true })], { alignment: AlignmentType.RIGHT }),

      centeredBold("VERSUS"),
      spacer,

      legalPara([new TextRun({ text: "Y ________", bold: true })]),
      legalPara([new TextRun("S/o ________")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara([new TextRun({ text: "\u2026 DEFENDANT", bold: true })], { alignment: AlignmentType.RIGHT }),

      spacer,
      centeredBold("SUIT FOR SPECIFIC PERFORMANCE OF CONTRACT", 26),
      spacer,
      legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Body ───
      // The paragraphs follow a logical narrative arc:
      // parties → property → negotiation → agreement → earnest money →
      // defendant's refusal → plaintiff's efforts → legal notice →
      // READINESS AND WILLINGNESS → cause of action → jurisdiction

      new Paragraph({ numbering: { reference: "sp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That the Plaintiff is a resident of ________.")] }),

      new Paragraph({ numbering: { reference: "sp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Defendant is the absolute owner of the property bearing No. ________, admeasuring ________ (hereinafter referred to as 'the suit property')."
        )] }),

      new Paragraph({ numbering: { reference: "sp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Plaintiff was in need of the property for residential purpose and came to know that the Defendant is interested in selling the suit property."
        )] }),

      new Paragraph({ numbering: { reference: "sp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Plaintiff approached the Defendant for purchasing the suit property on ________ (date) and the Plaintiff and the Defendant discussed the terms and conditions."
        )] }),

      // The agreement — this is the CONTRACT being enforced
      new Paragraph({ numbering: { reference: "sp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun("That on ________ (date), the Plaintiff and the Defendant entered into an agreement in writing whereby the Defendant agreed to sell his property to the Plaintiff for Rs. ________. The copy of the agreement is annexed as "),
          new TextRun({ text: "Annexure A.", bold: true }),
        ] }),

      new Paragraph({ numbering: { reference: "sp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Plaintiff paid Rs. ________ to the Defendant as earnest money and it was decided that the balance of Rs. ________ will be paid on ________ and the sale deed will be executed and the possession of the suit property will be handed over to the Plaintiff on payment of the balance amount."
        )] }),

      // The refusal — this establishes the BREACH
      new Paragraph({ numbering: { reference: "sp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That on ________ (date), the Plaintiff approached the Defendant and requested him to execute the sale deed along with handing over of the possession of the suit property to the Plaintiff. However, the Defendant refused to execute the sale deed."
        )] }),

      new Paragraph({ numbering: { reference: "sp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Plaintiff approached the Defendant for execution of the sale deed on various occasions (________ dates), however, the Defendant refused to execute the sale deed on one pretext or the other."
        )] }),

      // Legal notice — a necessary precursor
      new Paragraph({ numbering: { reference: "sp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Plaintiff finally issued a legal notice dated ________ to the Defendant calling upon the Defendant to perform his part of the agreement by executing the sale deed and handing over the possession of the suit property. However, the Defendant failed to comply with his part of the agreement and did not reply to the legal notice."
        )] }),

      // READINESS AND WILLINGNESS — the CRITICAL pleading requirement
      // Under Section 16(c), the plaintiff MUST plead this.
      // Without this paragraph, the suit is liable to be dismissed.
      new Paragraph({ numbering: { reference: "sp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "That the Plaintiff is ready and willing to perform his part of the agreement by paying the balance amount.", bold: true, underline: {} }),
        ] }),

      // Cause of action, limitation, jurisdiction, court fees
      new Paragraph({ numbering: { reference: "sp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the cause of action arose on ________ (date) when the Defendant agreed to sell the suit property to the Plaintiff. The cause of action further arose on ________ when the Defendant refused to perform his part. The cause of action is still subsisting as the Defendant has refused to perform his part of the agreement."
        )] }),

      new Paragraph({ numbering: { reference: "sp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That the suit is within the period of limitation.")] }),

      new Paragraph({ numbering: { reference: "sp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That this Hon'ble Court has jurisdiction to entertain this suit because the cause of action arose within the territorial jurisdiction of the Court.")] }),

      new Paragraph({ numbering: { reference: "sp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That the requisite court fees have been paid.")] }),

      spacer,
      centeredBold("PRAYER:", 26),
      spacer,

      legalPara([new TextRun("It is, therefore, most respectfully prayed that this Hon'ble Court may be pleased to:")]),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "pass a decree of specific performance of the agreement in favour of the Plaintiff and against the Defendant directing the Defendant to execute the sale deed and hand over the possession of the suit property to the Plaintiff;", bold: false })] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("award cost of the suit in favour of the Plaintiff and against the Defendant; and")] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("pass such other and further order(s) as may be deemed fit and proper on the facts and in the circumstances of this case.")] }),

      spacer, spacer,

      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Place: ________"), new TextRun("\tPlaintiff")] }),
      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Date: ________"), new TextRun("\tThrough")] }),
      new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun("Advocate")] }),

      spacer,
      centeredBold("VERIFICATION:", 24), spacer,

      legalPara([new TextRun(
        "Verified at Delhi on this ________ day of ________ 20__ that the contents of paras 1 to __ of the plaint are true to my knowledge derived from the records, those of paras __ to __ are true on information received and believed to be true and last para is the humble prayer to this Hon'ble Court."
      )]),
      spacer,
      new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Plaintiff", bold: true })] }),
      spacer,
      legalPara([
        new TextRun({ text: "[NOTE: ", bold: true, italics: true }),
        new TextRun({ text: "The above plaint must be supported by an Affidavit]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
