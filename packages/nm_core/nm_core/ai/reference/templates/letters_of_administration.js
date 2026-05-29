/**
 * PETITION FOR GRANT OF LETTERS OF ADMINISTRATION
 * ──────────────────────────────────────────────────
 * Category : Succession Law — Pleading under Indian Succession Act, 1925
 * Court    : District Judge, Delhi
 * Statute  : Indian Succession Act, 1925 (Sections 218-241)
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * Letters of Administration is the close cousin of Probate, and the
 * easiest way to understand it is to see how it fits into the larger
 * scheme of Indian succession law alongside the probate petition you
 * already have at Template 10.
 *
 * THE THREE-WAY DISTINCTION:
 *
 *   When a person dies, their estate must be administered. Indian
 *   law recognises three distinct scenarios depending on what the
 *   deceased left behind:
 *
 *   SCENARIO 1: Deceased left a valid WILL that NAMES AN EXECUTOR.
 *     The named executor applies for PROBATE. The probate is the
 *     court's certification that the will is valid and that the
 *     executor has authority to administer the estate. This is
 *     Template 10 in your library.
 *
 *   SCENARIO 2: Deceased left a valid WILL but did NOT name an
 *     executor (or the named executor is dead, refuses to act, or
 *     is incapable). A beneficiary or legal heir applies for
 *     LETTERS OF ADMINISTRATION WITH THE WILL ANNEXED. The court
 *     authorises that person to administer the estate according to
 *     the terms of the will.
 *
 *   SCENARIO 3: Deceased left NO WILL at all (intestacy). A legal
 *     heir applies for LETTERS OF ADMINISTRATION SIMPLY. The court
 *     authorises that person to distribute the estate according to
 *     the laws of intestate succession applicable to the deceased.
 *
 * This template covers SCENARIO 2 — letters of administration with
 * the will annexed. The structure is very similar to the probate
 * petition because in both cases there is an underlying will, but
 * the legal effect is different. In probate, the executor steps into
 * the deceased's shoes by virtue of the deceased's own appointment
 * (the will). In letters of administration, the administrator steps
 * into the deceased's shoes by virtue of a court appointment.
 *
 * KEY STRUCTURAL DIFFERENCES FROM TEMPLATE 10 (PROBATE):
 *
 *   1. FORUM — Letters of administration are typically filed in
 *      the Court of the District Judge, while probate is more
 *      commonly filed in the High Court (under its testamentary
 *      and intestate jurisdiction). The choice depends on the
 *      pecuniary value of the estate.
 *
 *   2. CASE TITLE — Notice the case title format which uses the
 *      formal "IN THE MATTER OF A PETITION FOR LETTERS OF
 *      ADMINISTRATION OF THE ESTATE OF THE LATE ________"
 *      construction, characteristic of succession proceedings.
 *
 *   3. THE CRITICAL PARAGRAPH 11 — In a probate petition, the
 *      petitioner is described as "the named Executor in the Will."
 *      In a letters of administration petition, the petitioner is
 *      described as "the beneficiary mentioned in the Will." This
 *      single sentence shifts the entire jurisdictional basis of
 *      the petition.
 *
 *   4. SINGLE VERIFICATION — Unlike the probate petition which
 *      requires THREE separate verifications (by the executor and
 *      by both witnesses to the will), the letters of administration
 *      petition typically requires only the petitioner's
 *      verification. This is because the court is not certifying
 *      the will's validity in the same way; it is appointing an
 *      administrator.
 *
 *   5. THE CASE NUMBER references "ACT XXXIX OF 1925," which is
 *      the historical statutory citation for the Indian Succession
 *      Act of 1925. This archaic numbering format is preserved in
 *      Indian succession practice as a matter of tradition.
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
      {
        reference: "loa-paras",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
      },
      {
        // For the heirs listing — uses bracketed numbers
        reference: "heirs-list",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "(%1)",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1080, hanging: 360 } } } }],
      },
      {
        // Prayer items use lowercase letters
        reference: "prayer-items",
        levels: [{ level: 0, format: LevelFormat.LOWER_LETTER, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
      },
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
      centeredBold("IN THE COURT OF THE DISTRICT JUDGE", 26),
      centeredBold("(DISTRICT ________), ________ COURT, DELHI", 22),
      spacer,

      // ─── Case Number ───
      // The "Case No. ... Under Act XXXIX of 1925" format is the
      // traditional way of citing the Indian Succession Act and is
      // preserved in succession practice for historical continuity.
      centeredBold("CASE NO. ________ UNDER ACT XXXIX OF 1925", 22),
      spacer,

      // ─── Case Title ───
      // The "IN THE MATTER OF" construction reflects that succession
      // proceedings are non-adversarial — they are about the estate of
      // a deceased person, not a dispute between living parties.
      centeredBold("IN THE MATTER OF A PETITION FOR LETTERS OF ADMINISTRATION", 22),
      centeredBold("OF THE ESTATE OF THE LATE Sh. ________", 22),
      spacer,

      // ─── Parties ───
      legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      // The petitioner — typically a beneficiary under the will or a
      // legal heir if there is no will.
      legalPara([new TextRun({ text: "X ________", bold: true })]),
      legalPara([new TextRun("S/o ________")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara([new TextRun({ text: "\u2026 PETITIONER", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      centeredBold("VERSUS"),
      spacer,

      // The respondents — the State plus all other legal heirs.
      // Including all heirs as respondents is a procedural safeguard
      // that ensures everyone with a potential claim has notice of
      // the proceedings.
      legalPara([new TextRun({ text: "1. STATE of ________", bold: true })]),
      spacer,
      legalPara([new TextRun({ text: "2. Y ________", bold: true })]),
      legalPara([new TextRun("   S/o ________")]),
      legalPara([new TextRun("   R/o ________")]),
      legalPara([new TextRun({ text: "\u2026 RESPONDENTS", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      spacer,

      // ─── Title ───
      centeredBold("PETITION FOR GRANT OF LETTERS OF ADMINISTRATION", 26),
      spacer,

      legalPara([new TextRun({ text: "Most Respectfully Showeth:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Body ───
      // Notice how the body shares many paragraphs with Template 10
      // (the probate petition). This reflects the underlying legal
      // similarity — both are about administering an estate based on
      // a will. The differences appear at specific points: the title,
      // paragraph 11, and the prayer.

      new Paragraph({ numbering: { reference: "loa-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the present petition is filed by the Petitioner for the grant of Letters of Administration in respect of the estate of the deceased Late Sh. ________, S/o ________. At the time of his death on ________, the deceased was residing at ________."
        )] }),

      new Paragraph({ numbering: { reference: "loa-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That during his lifetime before his death, the deceased had bequeathed his estate in the manner specified in his last and final testament/will dated ________, which was made by him in a sound state of mind. The Original Will is annexed as "
          ),
          new TextRun({ text: "Annexure A.", bold: true }),
        ] }),

      new Paragraph({ numbering: { reference: "loa-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the said Will was duly made by the deceased in the presence of the witnesses whose names, addresses and signatures appear at the end of the Will."
        )] }),

      new Paragraph({ numbering: { reference: "loa-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That by virtue of the said Will, the deceased has bequeathed his estate as follows: ________ (mention how the deceased has bequeathed his estate, the name, relation and the individual share of each beneficiary, and also mention whether he has excluded any of his legal heirs from the Will)."
        )] }),

      // Para 5: List of relatives — the same heir-listing requirement
      // as the probate petition.
      new Paragraph({ numbering: { reference: "loa-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That a description of the relatives of the deceased and their respective residences is given below:"
        )] }),

      new Paragraph({ numbering: { reference: "heirs-list", level: 0 },
        spacing: { after: 80, line: 360 },
        children: [new TextRun("Son (Petitioner)")] }),
      new Paragraph({ numbering: { reference: "heirs-list", level: 0 },
        spacing: { after: 80, line: 360 },
        children: [new TextRun("Brother, Sri ________, resident of ________")] }),
      new Paragraph({ numbering: { reference: "heirs-list", level: 0 },
        spacing: { after: 80, line: 360 },
        children: [new TextRun("Widow, Smt. ________, resident of ________")] }),
      new Paragraph({ numbering: { reference: "heirs-list", level: 0 },
        spacing: { after: 80, line: 360 },
        children: [new TextRun("Mother, Smt. ________, resident of ________")] }),
      new Paragraph({ numbering: { reference: "heirs-list", level: 0 },
        spacing: { after: 120, line: 360 },
        children: [new TextRun("Daughter, Smt. ________, resident of ________")] }),

      legalPara([
        new TextRun({ text: "(All the relatives shall be made as Respondents)", italics: true, bold: true }),
      ], { indent: { left: 720 } }),

      spacer,

      // The remaining paragraphs are similar in structure to the
      // probate petition but worded for a beneficiary applying for
      // letters of administration rather than an executor seeking
      // probate.

      new Paragraph({ numbering: { reference: "loa-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That the amount of the assets of the deceased which are likely to come to the hands of the Petitioner are detailed in "
          ),
          new TextRun({ text: "Schedule-A", bold: true }),
          new TextRun(
            ", which is annexed with the present petition. The Petitioner has set forth all the assets and liabilities with complete particulars of the estate of the deceased as the Petitioner could ascertain as of now with the best of his efforts."
          ),
        ] }),

      new Paragraph({ numbering: { reference: "loa-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That so far as the Petitioner has been able to ascertain and is aware, there are no properties and effects other than those specified in the affidavit of assets."
        )] }),

      new Paragraph({ numbering: { reference: "loa-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Petitioner undertakes, in case any other properties and effects come to his hands, to pay the Court fees payable in respect thereof."
        )] }),

      new Paragraph({ numbering: { reference: "loa-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That there is no legal impediment to the grant of Letters of Administration in favour of the Petitioner."
        )] }),

      new Paragraph({ numbering: { reference: "loa-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Petitioner undertakes to execute the Will of the testator as per his wishes and undertakes to take all steps as per his wishes, desires and directions as contained in the Will annexed."
        )] }),

      // PARAGRAPH 11 — THE CRITICAL JURISDICTIONAL STATEMENT
      // This is the single sentence that distinguishes a letters of
      // administration petition from a probate petition. Compare this
      // with paragraph 11 of Template 10, which says "the named
      // Executor in the Will." Here, the petitioner is "the
      // beneficiary mentioned in the Will." This wording shifts the
      // entire legal basis of the petition from execution by
      // appointment to administration by court order.
      new Paragraph({ numbering: { reference: "loa-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "That the Petitioner is claiming Letters of Administration of the Will and has filed this petition being the ", bold: true }),
          new TextRun({ text: "beneficiary mentioned in the Will.", bold: true, underline: {} }),
        ] }),

      new Paragraph({ numbering: { reference: "loa-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That to the best of the belief of the Petitioner, no petition has been made to any other court for the purpose of the said Will."
        )] }),

      new Paragraph({ numbering: { reference: "loa-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the deceased died and had a fixed abode within the territorial jurisdiction of this Hon'ble Court. The immovable property is also situated within the jurisdiction of this Hon'ble Court, and therefore this Hon'ble Court has the jurisdiction to entertain, try and decide this petition."
        )] }),

      new Paragraph({ numbering: { reference: "loa-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That the requisite court fee of Rs. ________ has been affixed on this petition.")] }),

      spacer,

      // ─── Prayer ───
      // Note that the prayer asks for "Letters of Administration"
      // rather than "Probate" — this is the operative difference.
      centeredBold("PRAYER:", 26),
      spacer,

      legalPara([new TextRun("It is, therefore, most humbly prayed that:")]),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "The Letters of Administration of the Will be granted to the Petitioner.", bold: true }),
        ] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Any other or further relief which this Hon'ble Court may deem fit, just, proper and necessary may also be granted in favour of the Petitioner."
        )] }),

      spacer, spacer,

      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Place: ________"), new TextRun({ text: "\tPETITIONER", bold: true })] }),
      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Date: ________"), new TextRun("\tThrough")] }),
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun("Advocate")] }),

      spacer,

      // ─── Verification ───
      // Note that there is only ONE verification here, in contrast to
      // the THREE verifications in the probate petition. This is
      // because the court in letters of administration is not certifying
      // the validity of the will in the same way — it is appointing
      // an administrator.
      centeredBold("VERIFICATION:", 24), spacer,

      legalPara([new TextRun(
        "I, ________, S/o ________, R/o ________, the Petitioner in the above petition, declare that what is stated herein is true to the best of my information and belief. The last para is the prayer to this Hon'ble Court."
      )]),
      legalPara([new TextRun("Verified at New Delhi on this ________ day of ________ 20__.")]),

      spacer,
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "PETITIONER", bold: true })] }),

      spacer, spacer,

      legalPara([
        new TextRun({ text: "[NOTE: ", bold: true, italics: true }),
        new TextRun({ text: "To be supported by an affidavit and accompanied by a Schedule of Assets.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
