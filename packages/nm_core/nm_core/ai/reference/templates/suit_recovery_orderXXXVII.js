/**
 * SUIT FOR RECOVERY UNDER ORDER XXXVII CPC (SUMMARY SUIT)
 * ──────────────────────────────────────────────────────────
 * Category : Civil Pleading — Summary Procedure
 * Court    : District Judge, Delhi
 * Statute  : Order XXXVII, Code of Civil Procedure, 1908
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * The Summary Suit under Order XXXVII is a UNIQUE FAST-TRACK procedure
 * available only for specific types of money claims:
 *
 *   - Suits on bills of exchange, hundis and promissory notes
 *   - Suits for recovery of debt or liquidated demand arising on
 *     a written contract
 *   - Suits on enactments where the recoverable sum is fixed
 *   - Suits on guarantees in respect of a debt or liquidated demand
 *
 * What makes it "summary":
 *
 *   In an ORDINARY suit, the defendant has the absolute RIGHT to
 *   defend by simply filing a Written Statement (see Template 16).
 *
 *   In a SUMMARY suit, the defendant CANNOT defend as of right.
 *   They must first seek "LEAVE TO DEFEND" from the court within
 *   10 days of being served. The court grants leave only if the
 *   defendant can show a "triable issue" — a real, bona fide defense.
 *
 *   If the defendant fails to apply for leave, or if leave is refused,
 *   the plaintiff is entitled to an immediate decree without trial.
 *
 * This procedure is designed to prevent unscrupulous defendants from
 * delaying clear-cut money claims through frivolous defenses.
 *
 * CRITICAL DRAFTING REQUIREMENT:
 *   Paragraph 17 of this template is MANDATORY. Order XXXVII Rule 2(2)
 *   requires the plaintiff to specifically state that the suit is filed
 *   under Order XXXVII and that no relief outside the scope of
 *   Order XXXVII has been claimed. Without this paragraph, the suit
 *   is liable to be treated as an ordinary suit (losing the summary
 *   procedure benefit).
 */

const {
  Document, Paragraph, TextRun,
  AlignmentType, TabStopType, TabStopPosition,
  Footer, PageNumber, LevelFormat, BorderStyle
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
      { reference: "summary-paras", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "prayer-items", levels: [{ level: 0, format: LevelFormat.LOWER_LETTER, text: "(%1)",
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
      centeredBold("IN THE COURT OF DISTRICT JUDGE", 26),
      centeredBold("(DISTRICT ________), ________ COURT, DELHI", 22),
      spacer,
      centeredBold("SUIT NO. ________ OF 20__", 24),
      // The case number is followed by the statutory reference identifying
      // this as a summary suit — alerting the court at first glance that
      // a special procedure applies.
      legalPara([new TextRun({ text: "(SUIT UNDER ORDER XXXVII OF THE CODE OF CIVIL PROCEDURE, 1908)", italics: true })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Parties ───
      legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      legalPara([new TextRun({ text: "M/s ABC Pvt. Ltd.", bold: true })]),
      legalPara([new TextRun("A Company Incorporated Under The")]),
      legalPara([new TextRun("Companies Act, Having Its Registered Office")]),
      legalPara([new TextRun("At New Delhi.")]),
      legalPara([new TextRun("Through its Director")]),
      legalPara([new TextRun("Sh. ________")]),
      legalPara([new TextRun({ text: "\u2026 PLAINTIFF", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      centeredBold("VERSUS"),
      spacer,

      legalPara([new TextRun({ text: "M/s XYZ Ltd.", bold: true })]),
      legalPara([new TextRun("A Company Incorporated Under The")]),
      legalPara([new TextRun("Companies Act, Having Its Registered")]),
      legalPara([new TextRun("Office At Delhi")]),
      legalPara([new TextRun("Through its Director")]),
      legalPara([new TextRun("Sh. ________")]),
      legalPara([new TextRun({ text: "\u2026 DEFENDANT", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      spacer,

      // ─── Title ───
      centeredBold("SUIT FOR RECOVERY OF Rs. ________ UNDER ORDER XXXVII", 22),
      centeredBold("OF THE CODE OF CIVIL PROCEDURE, 1908", 22),
      spacer,

      legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Body ───
      // The body narrates the underlying business transaction,
      // the dishonoured cheque (which qualifies the suit for the
      // summary procedure), and the failed attempts at recovery.

      new Paragraph({ numbering: { reference: "summary-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Plaintiff is a company incorporated under the Companies Act and is engaged in the business of ________. The present suit is being filed by the Plaintiff through its authorised representative who is duly competent to institute the present suit on behalf of the Plaintiff company."
        )] }),

      new Paragraph({ numbering: { reference: "summary-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Defendant is also a company incorporated under the Companies Act and is engaged in the business of ________."
        )] }),

      new Paragraph({ numbering: { reference: "summary-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That sometime in the year ________, the Defendant approached the Plaintiff for ________ (state the nature of the underlying transaction giving rise to the debt). After mutual discussions, the parties entered into a written agreement dated ________."
        )] }),

      new Paragraph({ numbering: { reference: "summary-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Plaintiff duly performed its part of the agreement by ________. The Defendant accepted the goods/services without any complaint or objection whatsoever."
        )] }),

      new Paragraph({ numbering: { reference: "summary-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That after completion of the work/delivery of goods, the Plaintiff submitted its final bill bearing No. ________ dated ________ for a sum of Rs. ________ to the Defendant."
        )] }),

      new Paragraph({ numbering: { reference: "summary-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Defendant accepted the said bill and acknowledged its liability to make payment of the said sum to the Plaintiff."
        )] }),

      new Paragraph({ numbering: { reference: "summary-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That despite repeated requests and reminders, the Defendant failed to make payment of the outstanding amount. The Plaintiff approached the Defendant on numerous occasions but was met with one excuse after another."
        )] }),

      // The dishonoured cheque — this is what qualifies the suit
      // for the summary procedure under Order XXXVII Rule 1(2)(b).
      new Paragraph({ numbering: { reference: "summary-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Defendant handed over Cheque No. ________ dated ________ for Rs. ________ drawn on ________ Bank to the Plaintiff towards discharge of the outstanding liability."
        )] }),

      new Paragraph({ numbering: { reference: "summary-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the said cheque was presented by the Plaintiff for encashment, however, the same was dishonoured upon presentation vide bank memo dated ________."
        )] }),

      new Paragraph({ numbering: { reference: "summary-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Plaintiff immediately informed the Defendant about the dishonour of the said cheque and called upon the Defendant to make payment of the said amount along with interest at the rate of ________ per annum. However, the Defendant failed to pay the same despite repeated requests and reminders."
        )] }),

      new Paragraph({ numbering: { reference: "summary-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Plaintiff finally issued a legal notice dated ________ to the Defendant calling upon the Defendant to clear the outstanding amount of Rs. ________ along with interest at the rate of ________ per annum. However, no payment has been made by the Defendant despite the said notice."
        )] }),

      new Paragraph({ numbering: { reference: "summary-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Defendant is now liable to pay a sum of Rs. ________ along with interest at the rate of ________ per annum from the date of the Plaintiff's bill. The Plaintiff is claiming interest from ________ up to the date of filing of this suit."
        )] }),

      // Cause of action, limitation, jurisdiction
      new Paragraph({ numbering: { reference: "summary-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the cause of action in favour of the Plaintiff and against the Defendant first arose on ________ when the Defendant approached the Plaintiff for ________. It further arose on ________ when the Plaintiff submitted the final bill, and on each date when the Plaintiff called upon the Defendant to make payment. The cause of action is still subsisting as the Defendant has failed to pay the outstanding amount despite repeated oral and written requests."
        )] }),

      new Paragraph({ numbering: { reference: "summary-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That the suit is within the period of limitation.")] }),

      new Paragraph({ numbering: { reference: "summary-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That this Hon'ble Court has jurisdiction to entertain this suit because part of the cause of action arose within its territorial jurisdiction. The contract was entered into and the payment of the outstanding amount was to be made within the territorial jurisdiction of this Hon'ble Court."
        )] }),

      new Paragraph({ numbering: { reference: "summary-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the value of this suit for the purposes of court fee and jurisdiction is Rs. ________ on which court fee of Rs. ________ is paid."
        )] }),

      // ═══════════════════════════════════════════════════════════
      // PARAGRAPH 17 — THE MANDATORY ORDER XXXVII DECLARATION
      // ═══════════════════════════════════════════════════════════
      // This paragraph is REQUIRED by Order XXXVII Rule 2(2). Without
      // it, the suit loses its summary character and becomes an
      // ordinary suit. It is rendered in bold to highlight its
      // critical importance.
      new Paragraph({ numbering: { reference: "summary-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "That this suit is filed under Order XXXVII of the Code of Civil Procedure and no relief has been claimed which does not fall within the ambit of Order XXXVII.", bold: true, underline: {} }),
        ] }),

      spacer,

      // ─── Prayer ───
      centeredBold("PRAYER:", 26),
      spacer,

      legalPara([new TextRun("It is, therefore, most respectfully prayed that this Hon'ble Court may be pleased to:")]),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("Pass a decree for Rs. ________ in favour of the Plaintiff and against the Defendant;")] }),

      // Note the THREE distinct interest claims unique to recovery suits:
      // (i) past interest from cause of action to date of filing,
      // (ii) pendente lite interest (during pendency of the suit),
      // (iii) future interest (from date of decree till realization)
      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "award interest at the rate of ________ per annum from ________ up to the date of filing of the suit, pendente lite and future interest at the rate of ________ per annum on the above stated amount in favour of the Plaintiff and against the Defendant;"
        )] }),

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
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun("Advocate")] }),

      spacer,
      centeredBold("VERIFICATION:", 24), spacer,

      legalPara([new TextRun(
        "Verified at Delhi on this ________ day of ________ 20__ that the contents of paras 1 to __ of the plaint are true to my knowledge derived from the records of the Plaintiff maintained in the ordinary course of its business, those of paras __ to __ are true on information received and believed to be true and last para is the humble prayer to this Hon'ble Court."
      )]),

      spacer,
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "Plaintiff", bold: true })] }),

      spacer, spacer,
      legalPara([
        new TextRun({ text: "[NOTE: ", bold: true, italics: true }),
        new TextRun({ text: "The above plaint must be supported by an Affidavit. Under Order XXXVII Rule 3, the summons issued to the Defendant must be in Form No. 4 of Appendix B, requiring the Defendant to appear within 10 days. The Defendant cannot defend the suit without obtaining 'leave to defend' by demonstrating a triable issue.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
