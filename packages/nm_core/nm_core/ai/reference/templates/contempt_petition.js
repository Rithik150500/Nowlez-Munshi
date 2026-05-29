/**
 * CONTEMPT PETITION UNDER SECTIONS 11 AND 12 OF
 * THE CONTEMPT OF COURTS ACT, 1971
 * ────────────────────────────────────────────────
 * Category : Quasi-criminal Pleading
 * Court    : High Court of Delhi
 * Statute  : Sections 11, 12, Contempt of Courts Act, 1971
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * The Contempt Petition is structurally and conceptually unlike any
 * other pleading in the library because the wrong it complains of is
 * not an ordinary legal injury — it is the WILFUL DISOBEDIENCE OF A
 * COURT ORDER. To grasp this distinction, think of it this way: in
 * almost every other proceeding, the parties come to court to ASK
 * the court for a remedy. In a contempt petition, by contrast, the
 * parties come to court because someone has IGNORED what the court
 * already ordered. The contempt jurisdiction exists to protect the
 * dignity and authority of the court itself.
 *
 * TWO TYPES OF CONTEMPT:
 *
 *   The Contempt of Courts Act recognises two distinct categories.
 *   Civil contempt under Section 2(b) is "wilful disobedience to
 *   any judgment, decree, direction, order, writ or other process
 *   of a court or wilful breach of an undertaking given to a court."
 *   Criminal contempt under Section 2(c) is broader and covers acts
 *   that scandalise the court, prejudice judicial proceedings, or
 *   interfere with the administration of justice.
 *
 *   This template addresses CIVIL contempt because it deals with the
 *   disobedience of an injunction order — the most common scenario
 *   in practice.
 *
 * UNIQUE STRUCTURAL FEATURES:
 *
 *   1. CASE NUMBER references the underlying writ proceeding. Notice
 *      the "IN" word again — the same pattern as IAs (Template 22):
 *
 *           CONTEMPT PETITION NO. ___ OF 20__
 *           IN
 *           CIVIL WRIT NO. ___ OF 20__
 *
 *      This shows that contempt is NOT a fresh proceeding but a
 *      derivative one, parasitic on the original case.
 *
 *   2. THE PARTY WHO BREACHED IS CALLED A "CONTEMNER" — this label
 *      exists nowhere else in Indian litigation. The "Contemners"
 *      are the specific officers who carried out the disobedience,
 *      named individually so the punishment can be visited upon
 *      them personally rather than the abstract entity they serve.
 *
 *   3. THE TWO-PART NARRATIVE — the body of the petition has a
 *      distinctive two-part structure: first, it establishes that
 *      a court order was passed (the foundation); then it
 *      establishes that the order was disobeyed (the breach).
 *      Both must be proved with documentary evidence; the original
 *      order is annexed and the proof of breach is annexed
 *      separately.
 *
 *   4. PUNISHMENT IS THE REMEDY — unlike injunctions or damages,
 *      the contempt prayer asks the court to PUNISH the contemners.
 *      Under Section 12 of the Contempt of Courts Act, the court
 *      can impose simple imprisonment up to six months and/or a
 *      fine up to two thousand rupees.
 *
 *   5. STRICT PROOF REQUIRED — because contempt is quasi-criminal,
 *      it must be proved beyond reasonable doubt, not on the
 *      balance of probabilities. The contemner is entitled to a
 *      reply, and the burden lies on the petitioner.
 *
 * THE LIMITATION RULE — A SUBTLE TRAP:
 *
 *   Under Section 20 of the Contempt of Courts Act, no contempt
 *   action can be initiated more than ONE YEAR after the date on
 *   which the contempt is alleged to have been committed. This is
 *   a much shorter limitation than ordinary civil claims and
 *   catches many lawyers out.
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
      reference: "contempt-paras",
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
      // Contempt petitions are typically filed in the High Court because
      // the underlying order being disobeyed is usually a writ or an
      // injunction passed by a higher court. Lower courts have limited
      // contempt jurisdiction.
      centeredBold("IN THE HIGH COURT OF DELHI AT NEW DELHI", 26),
      spacer,

      // ─── Case Number — derivative numbering format ───
      // Just like an IA, a contempt petition is filed within an existing
      // case rather than as a fresh proceeding.
      centeredBold("CONTEMPT PETITION NO. ________ OF 20__", 24),
      centeredBold("IN", 22),
      centeredBold("CIVIL WRIT PETITION NO. ________ OF 20__", 24),
      spacer,

      // ─── Parties ───
      // The petitioners are the original beneficiaries of the order
      // that was breached. Notice how respondents include both the
      // institutional party AND the specific officers responsible —
      // the latter are the people who will face actual punishment.
      legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      legalPara([new TextRun({ text: "1. X ________", bold: true })]),
      legalPara([new TextRun("   S/o ________")]),
      legalPara([new TextRun("   R/o ________, New Delhi")]),
      legalPara([new TextRun({ text: "2. Y ________", bold: true })]),
      legalPara([new TextRun("   W/o ________")]),
      legalPara([new TextRun("   R/o ________, New Delhi")]),
      legalPara([new TextRun({ text: "\u2026 PETITIONERS", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      centeredBold("VERSUS"),
      spacer,

      // The institutional respondent
      legalPara([new TextRun({ text: "1. ", bold: true }), new TextRun("Union of India through its Standing Counsel, Delhi High Court, New Delhi.")]),
      legalPara([new TextRun({ text: "2. ", bold: true }), new TextRun("________ Authority through its ________")]),
      legalPara([new TextRun({ text: "3. ", bold: true }), new TextRun("________ Authority through its ________")]),
      // The individual officer respondents — these are the actual
      // contemners who will face punishment.
      legalPara([new TextRun({ text: "4. ", bold: true }), new TextRun("Shri ________, Asstt. Director, ________, New Delhi.")]),
      legalPara([new TextRun({ text: "5. ", bold: true }), new TextRun("Shri ________, ________ Officer, ________")]),
      legalPara([new TextRun({ text: "\u2026 RESPONDENTS / ALLEGED CONTEMNERS", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      spacer,

      // ─── Title ───
      centeredBold("CONTEMPT PETITION UNDER SECTIONS 11 AND 12", 22),
      centeredBold("OF THE CONTEMPT OF COURTS ACT, 1971", 22),
      spacer,

      legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Body ───
      // The body has a distinctive two-part narrative arc.

      // PART 1 — Establishing the court order that was disobeyed.

      // Para 1: The original proceeding
      new Paragraph({ numbering: { reference: "contempt-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Petitioners, being members of the ________ Welfare Association, ________, New Delhi, filed Civil Writ Petition No. ________ of 20__ in the High Court of Delhi at New Delhi. The respondents in the said petition were the Union of India and other authorities. The said petition is still pending and awaiting final disposal."
        )] }),

      // Para 2: The court order — this is the foundational fact.
      // Without proving that an order was passed, there can be no contempt.
      new Paragraph({ numbering: { reference: "contempt-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That this Hon'ble Court, on ________ (date), issued notice to the respondents and "
          ),
          new TextRun({ text: "granted status quo orders ", bold: true }),
          new TextRun("thereby restraining the respondents, including the ________ Authority, from demolishing any construction raised in the impugned area. The said area included plot Nos. ________ belonging to the Petitioners. Copies of the orders for grant of status quo are annexed herein as "),
          new TextRun({ text: "Annexures A-1, A-2 and A-3.", bold: true }),
        ] }),

      // Para 3: Site identification
      new Paragraph({ numbering: { reference: "contempt-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun("That the Petitioners herein have annexed the site plan, which is "),
          new TextRun({ text: "Annexure A-4.", bold: true }),
          new TextRun(" The plot area belonging to the Petitioners is marked in red."),
        ] }),

      // Para 4: Notice to the respondents — the petitioners must show
      // that the contemners had knowledge of the order. Wilful disobedience
      // requires knowledge.
      new Paragraph({ numbering: { reference: "contempt-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That the respondent ________ Authority had been conducting demolition activity in the said area, and since the Petitioners apprehended that their property might also be demolished, they approached the said Authority several times and made them aware of the court orders, particularly the orders for grant of status quo. A written representation dated ________ was also routed through the ________ Welfare Association to the Deputy Director, ________ Authority. The copy of the same is annexed as "
          ),
          new TextRun({ text: "Annexure A-5.", bold: true }),
        ] }),

      // PART 2 — The wilful disobedience.
      // This is the heart of the contempt allegation. Notice the
      // specificity — exact date, exact time, exact officers named.

      // Para 5: The breach itself
      new Paragraph({ numbering: { reference: "contempt-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "However, despite making the respondents aware of the orders of grant of status quo ", bold: true }),
          new TextRun("in Writ Petition (Civil) No. ________ of 20__, the officials of the ________ Authority, namely "),
          new TextRun({ text: "Shri ________ ", bold: true }),
          new TextRun("along with "),
          new TextRun({ text: "Shri ________, ", bold: true }),
          new TextRun("came to the site on ________ (date) at ________ (time) and demolished the construction raised on plot Nos. ________ belonging to the Petitioners."),
        ] }),

      // Para 6: The damage caused — quantifies the harm
      new Paragraph({ numbering: { reference: "contempt-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That as a result of the demolition, the Petitioners have suffered loss as all the plots had constructions on them. The details of the constructions and the damage incurred are given herein below: ________."
        )] }),

      // Para 7: Photographic evidence
      new Paragraph({ numbering: { reference: "contempt-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun("That the Petitioners herein annex as "),
          new TextRun({ text: "Annexure A-6 ", bold: true }),
          new TextRun("the photographs of the place where their building situated and which has been demolished by the respondent ________ Authority."),
        ] }),

      // Para 8: The contempt allegation — naming the contemners specifically
      new Paragraph({ numbering: { reference: "contempt-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That the Petitioners, being the owners of the plots in the area for which status quo orders had been granted by this Hon'ble Court, had every right to expect that no demolition would be carried out. The said status quo is still continuing by virtue of the orders of this Hon'ble Court. By not complying with the said status quo orders, "
          ),
          new TextRun({ text: "the respondent ________ Authority and its officers have committed contempt of court. ", bold: true }),
          new TextRun("It is worthwhile to mention that the following officers are the "),
          new TextRun({ text: "CONTEMNERS ", bold: true, underline: {} }),
          new TextRun("as they were conducting the demolition: Shri ________ (Respondent No. 4), Shri ________ (Respondent No. 5), and Shri ________ (Respondent No. 6)."),
        ] }),

      // Para 9: Cause of action
      new Paragraph({ numbering: { reference: "contempt-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "The cause of action in the present petition arose when the respondent ________ Authority and its officers, namely Respondents Nos. 4 to 6 herein, were apprised of the status quo orders in Civil Writ Petition No. ________ of 20__ and the concerned officers refused to comply with the orders of the Court. The cause of action is still continuing as the demolition has been done in defiance of the orders of this Hon'ble Court."
        )] }),

      spacer,

      // ─── Prayer ───
      // The contempt prayer is uniquely punitive — it asks the court
      // to PUNISH the contemners, not to grant any civil relief.
      centeredBold("PRAYER:", 26),
      spacer,

      legalPara([
        new TextRun(
          "It is, therefore, most respectfully prayed that this Hon'ble Court may be pleased to "
        ),
        new TextRun({ text: "initiate contempt proceedings against the above-named contemners ", bold: true, underline: {} }),
        new TextRun("and pass appropriate orders punishing them in accordance with Section 12 of the Contempt of Courts Act, 1971. It is further prayed that this Hon'ble Court may be pleased to pass such further orders or directions as it may deem fit and proper in the facts and circumstances of the case."),
      ]),

      spacer, spacer,

      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Place: ________"), new TextRun({ text: "\tPETITIONERS", bold: true })] }),
      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Date: ________"), new TextRun("\tThrough")] }),
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun("Advocate")] }),

      spacer, spacer,

      legalPara([
        new TextRun({ text: "[NOTE: ", bold: true, italics: true }),
        new TextRun({ text: "The petition must be supported by an affidavit. Under Section 20 of the Contempt of Courts Act, 1971, no contempt proceedings can be initiated after the expiry of one year from the date on which the contempt is alleged to have been committed.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
