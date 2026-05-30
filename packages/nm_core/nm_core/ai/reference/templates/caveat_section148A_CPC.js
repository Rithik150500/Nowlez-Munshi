/**
 * CAVEAT UNDER SECTION 148-A OF THE CODE OF CIVIL PROCEDURE, 1908
 * ──────────────────────────────────────────────────────────────────
 * Category : Civil Pleading — Preventive / Pre-emptive Filing
 * Court    : High Court of Delhi
 * Statute  : Section 148-A, Code of Civil Procedure, 1908
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * A CAVEAT is the most UNUSUAL filing in Indian civil procedure:
 *
 *   1. It is filed BEFORE the opposing party's petition even exists.
 *      The caveator ANTICIPATES that the other side will file and
 *      proactively asks the court for notice before passing any order.
 *
 *   2. The party label "CAVEATOR" exists NOWHERE else in Indian
 *      litigation. The caveator is typically the respondent from a
 *      lower-court proceeding who won and fears the losing party
 *      will seek an ex-parte stay from a higher court.
 *
 *   3. The case title references a FUTURE petition that does not yet
 *      exist — "ARISING OUT OF... [lower court order]"
 *
 *   4. A caveat remains valid for only 90 DAYS from the date of
 *      filing (Section 148-A(2)).
 *
 *   5. The caveator must send a copy to the "would-be petitioner"
 *      by Registered A/D post (Section 148-A(3)).
 *
 * Purpose: To prevent ex-parte interim orders. When a person loses
 * in a lower court, they often rush to the High Court seeking an
 * urgent stay. The caveat ensures the other side gets notice before
 * any stay is granted.
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
    config: [{
      reference: "caveat-paras",
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
      centeredBold("IN THE HIGH COURT OF DELHI AT NEW DELHI", 26),
      spacer,

      // ─── Caveat Number ───
      centeredBold("CAVEAT NO. ________ / 20__", 24),
      spacer,

      // ─── Arising-From Clause ───
      // This is unique to caveats — it references the LOWER COURT
      // order that the caveator expects will be challenged.
      legalPara([
        new TextRun({ text: "(ARISING OUT OF THE JUDGMENT AND ORDER DATED ________ IN SUIT NO. ________ TITLED AS ABC v. XYZ PASSED BY SH. ________, CIVIL JUDGE, ________ DISTRICT, DELHI)", italics: true, size: 22 }),
      ], { alignment: AlignmentType.CENTER }),

      spacer,

      // ─── Parties ───
      // The "would-be petitioner" is listed first (the person
      // expected to file), and the CAVEATOR is listed as "Respondent."
      legalPara([new TextRun({ text: "In the matter of:", bold: true })]),
      spacer,
      legalPara([new TextRun({ text: "XYZ ________", bold: true })]),
      legalPara([new TextRun("S/o ________")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara([new TextRun({ text: "\u2026 Petitioner (would-be)", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      centeredBold("VERSUS"),
      spacer,

      // The CAVEATOR — the unique party label
      legalPara([new TextRun({ text: "ABC ________", bold: true })]),
      legalPara([new TextRun("S/o ________")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara([new TextRun({ text: "\u2026 Respondent / CAVEATOR", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      spacer,

      // ─── Title ───
      centeredBold("CAVEAT UNDER SECTION 148-A OF THE", 24),
      centeredBold("CODE OF CIVIL PROCEDURE, 1908", 24),
      centeredBold("BY RESPONDENT / CAVEATOR", 22),
      spacer,

      legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Body ───
      // Para 1: The lower court order that precipitated this caveat
      new Paragraph({ numbering: { reference: "caveat-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That Sh. ________, Civil Judge, ________ District, Delhi, has passed an order against the would-be petitioner in Civil Suit No. ________ titled as ABC v. XYZ on ________, whereby the application filed by the Plaintiff / would-be Petitioner was dismissed."
        )] }),

      // Para 2: The caveator's ANTICIPATION — the core of a caveat
      new Paragraph({ numbering: { reference: "caveat-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun("That the Caveator is expecting that the Plaintiff / would-be Petitioner "),
          new TextRun({ text: "may file a Civil Misc. (Main) Petition under Article 227 of the Constitution of India ", bold: true }),
          new TextRun("against the said order in this Hon'ble Court, and as such this caveat is being filed."),
        ] }),

      // Para 3: Right to contest
      new Paragraph({ numbering: { reference: "caveat-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Caveator has a right to appear and contest the Civil Misc. (Main) Petition if preferred by the Plaintiff / would-be Petitioner."
        )] }),

      // Para 4: The REQUEST — notice before any order.
      // This is the operative paragraph — the whole point of a caveat.
      new Paragraph({ numbering: { reference: "caveat-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun("That the Caveator desires that "),
          new TextRun({ text: "he may be given notice of the filing of the Civil Misc. (Main) Petition as and when the same is filed ", bold: true }),
          new TextRun("by the Plaintiff / would-be Petitioner, to enable the Caveator to appear at the time of hearing for admission, and "),
          new TextRun({ text: "no stay may be granted without hearing the Caveator / Respondent.", bold: true, underline: {} }),
        ] }),

      // Para 5: Copy sent — mandatory requirement under Section 148-A(3)
      new Paragraph({ numbering: { reference: "caveat-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That a copy of this caveat has been sent by Regd. A/D post to the Plaintiff / would-be Petitioner."
        )] }),

      // Para 6: Court fee
      new Paragraph({ numbering: { reference: "caveat-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That the requisite court fees have been paid.")] }),

      spacer,

      // ─── Prayer ───
      // The caveat prayer is distinctively narrow: it asks only
      // for notice before any order — nothing else.
      centeredBold("PRAYER:", 26),
      spacer,

      legalPara([
        new TextRun("It is, therefore, most respectfully prayed that "),
        new TextRun({ text: "nothing may be done in the Civil Misc. Petition that may be filed by the would-be Petitioner without notice to the Caveator or his counsel.", bold: true }),
      ]),

      spacer, spacer,

      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Delhi"), new TextRun({ text: "\tCaveator", bold: true })] }),
      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Dated: ________"), new TextRun("\tThrough")] }),
      new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun("Advocate")] }),

      spacer, spacer,
      legalPara([
        new TextRun({ text: "[Note: ", bold: true, italics: true }),
        new TextRun({ text: "An affidavit of the Caveator, duly attested by Oath Commissioner, in support of this application is to be attached. The caveat remains valid for 90 days from the date of filing.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
