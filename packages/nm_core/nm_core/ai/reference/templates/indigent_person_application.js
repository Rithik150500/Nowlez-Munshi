/**
 * APPLICATION TO SUE AS AN INDIGENT PERSON
 * ─────────────────────────────────────────────
 * Category : Civil Procedure — Access to Justice
 * Court    : Civil Judge, Delhi
 * Statute  : Order XXXIII read with Section 151,
 *            Code of Civil Procedure, 1908
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * Order XXXIII of the Code of Civil Procedure is one of the most
 * socially significant procedural devices in Indian civil law. It
 * exists to solve a problem that would otherwise leave the courts
 * inaccessible to vast numbers of litigants — namely, that civil
 * suits in India require the plaintiff to pay court fees up front,
 * and these fees are calculated as a percentage of the value of the
 * relief sought. For a labourer suing an employer for wrongful
 * dismissal, or a tenant suing a landlord for the return of a
 * security deposit, the court fee alone might exceed several months'
 * wages. Without some mechanism to waive this requirement, the
 * promise of "equal justice under law" would be hollow for the poor.
 *
 * Order XXXIII solves this by creating the legal fiction of an
 * "indigent person." If the would-be plaintiff can satisfy the
 * court that they are too poor to pay the prescribed court fee,
 * the court permits them to file the suit without paying it. The
 * suit then proceeds normally, and if the indigent person ultimately
 * wins, they undertake to pay the court fee out of the decretal
 * amount they recover.
 *
 * THE DEFINITION OF "INDIGENT PERSON":
 *
 *   Under Order XXXIII Rule 1, a person is an "indigent person" if:
 *
 *     (a) they are not possessed of sufficient means (other than
 *         property exempt from attachment in execution of a decree
 *         and the subject-matter of the suit) to enable them to pay
 *         the fee prescribed by law for the plaint in such suit; or
 *
 *     (b) where no such fee is prescribed, they are not entitled to
 *         property worth one thousand rupees other than property
 *         exempt from attachment in execution of a decree and the
 *         subject-matter of the suit.
 *
 *   Note that this definition is not absolute poverty. A person can
 *   own a small house and modest furniture and still qualify, because
 *   those items are exempt from attachment. The test is whether they
 *   have "sufficient means" specifically to pay the court fee.
 *
 * THE TWO-STAGE PROCEDURE:
 *
 *   1. First, the indigent person files an APPLICATION (this template)
 *      together with the proposed plaint. The court does not accept
 *      the plaint as filed yet — it is held in abeyance.
 *
 *   2. The court then conducts an inquiry into the applicant's
 *      financial position. The opposite party and the government
 *      pleader are given an opportunity to be heard. The court may
 *      examine the applicant on oath about their means.
 *
 *   3. If the court is satisfied that the applicant is genuinely
 *      indigent, it grants permission and the plaint is then
 *      registered as a regular suit. If the court is not satisfied,
 *      the application is rejected and the applicant is given time
 *      to pay the court fee in the ordinary way.
 *
 * THE FATEFUL UNDERTAKING:
 *
 *   Notice paragraph 4 of the template. The applicant undertakes to
 *   pay the court fee in full IF the case is decreed in their favour.
 *   This undertaking has a sting in the tail: if the indigent person
 *   eventually wins, the court fee becomes a first charge on the
 *   amount they recover, and the State recovers it before the
 *   plaintiff sees a paisa. So the waiver is not a permanent gift —
 *   it is a deferral that becomes recoverable if the plaintiff
 *   ultimately succeeds.
 *
 * THE DUAL PARTY LABEL:
 *
 *   Notice that the parties are labelled "Applicant / Plaintiff"
 *   and "Respondent / Defendant." The dual labels reflect the dual
 *   nature of this filing: it is simultaneously an APPLICATION (for
 *   permission to sue without fees) and a SUIT (the underlying
 *   claim). Once the court grants permission, the "Applicant /
 *   Plaintiff" sheds the first label and becomes simply the
 *   "Plaintiff" in a regular suit.
 *
 * BREVITY BY INCORPORATION:
 *
 *   Like the Temporary Injunction IA at Template 22, this application
 *   uses the brevity convention of incorporating the underlying suit
 *   by reference rather than repeating its facts. Look at paragraph 2,
 *   which says "the contents of the accompanying suit may kindly be
 *   read as a part and parcel of this application." This convention
 *   exists because the application is a procedural shell wrapped
 *   around a substantive suit, and there is no need to duplicate
 *   the substantive narrative.
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
      { reference: "indigent-paras", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
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
      // ─── Court Header ───
      centeredBold("IN THE COURT OF CIVIL JUDGE", 26),
      centeredBold("(DISTRICT ________), ________ COURT, DELHI", 22),
      spacer,
      centeredBold("SUIT NO. ________ OF 20__", 24),
      spacer,

      // ─── Parties ───
      // Notice the dual labelling — Applicant / Plaintiff and
      // Respondent / Defendant. This reflects the hybrid nature of
      // the filing as both an application and an embryonic suit.
      legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      legalPara([new TextRun({ text: "X ________", bold: true })]),
      legalPara([new TextRun("S/o ________")]),
      legalPara([new TextRun("R/o ________, New Delhi")]),
      legalPara([new TextRun({ text: "\u2026 APPLICANT / PLAINTIFF", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      centeredBold("VERSUS"),
      spacer,

      legalPara([new TextRun({ text: "Y ________", bold: true })]),
      legalPara([new TextRun("S/o ________")]),
      legalPara([new TextRun("R/o ________, New Delhi")]),
      legalPara([new TextRun({ text: "\u2026 RESPONDENT / DEFENDANT", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      spacer,

      // ─── Title ───
      centeredBold("APPLICATION UNDER ORDER XXXIII READ WITH SECTION 151", 22),
      centeredBold("OF THE CODE OF CIVIL PROCEDURE, 1908", 22),
      spacer,

      legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Body ───
      // The body of an indigent person application is unusually short
      // — typically only five paragraphs. The substantive suit is
      // incorporated by reference, and the application focuses
      // entirely on establishing the applicant's indigence.

      // Para 1: Identifying the underlying suit
      new Paragraph({ numbering: { reference: "indigent-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Applicant has filed the above-titled suit which is pending disposal before this Hon'ble Court."
        )] }),

      // Para 2: The brevity clause — incorporating the suit by reference.
      // This is the same convention used in the Temporary Injunction IA
      // (Template 22) and prevents needless duplication.
      new Paragraph({ numbering: { reference: "indigent-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun("That the contents of the accompanying suit "),
          new TextRun({ text: "may kindly be read as a part and parcel of this application ", bold: true }),
          new TextRun("which are not repeated here for the sake of brevity."),
        ] }),

      // Para 3: THE INDIGENCE PLEADING — the heart of the application.
      // This paragraph must specifically state that the applicant has
      // no movable or immovable property and no source of income.
      // The court will examine these claims in detail.
      new Paragraph({ numbering: { reference: "indigent-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun("That the Applicant is "),
          new TextRun({ text: "an indigent person and has no movable or immovable property and has no source of income. ", bold: true, underline: {} }),
          new TextRun("Therefore, the Applicant is unable to pay the requisite amount of court fee stamp as required by law."),
        ] }),

      // Para 4: THE UNDERTAKING — the deferral mechanism.
      // The applicant undertakes to pay the court fee if the case is
      // decreed in their favour. This is what makes the waiver
      // legally palatable: the State is not giving up the fee, only
      // postponing collection until the applicant has the means.
      new Paragraph({ numbering: { reference: "indigent-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "That the Applicant undertakes to pay the entire court fee if the case is decreed in his favour.", bold: true }),
        ] }),

      // Para 5: Concluding plea
      new Paragraph({ numbering: { reference: "indigent-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That there are sufficient reasons for the acceptance of the present application and for granting permission to the Applicant to institute the present suit as an indigent person."
        )] }),

      spacer,

      // ─── Prayer ───
      // The prayer is short and focused. It asks for permission, not
      // for any substantive relief — that will come later in the suit
      // itself if permission is granted.
      centeredBold("PRAYER:", 26),
      spacer,

      legalPara([new TextRun("It is, therefore, most respectfully prayed that this Hon'ble Court may be pleased to:")]),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "allow the Applicant to sue as an indigent person ", bold: true }),
          new TextRun("in the interest of justice;"),
        ] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("pass such further orders/directions as it may deem fit and proper in the facts and circumstances of the case.")] }),

      spacer, spacer,

      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Place: Delhi"), new TextRun({ text: "\tAPPLICANT", bold: true })] }),
      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Date: ________"), new TextRun("\tThrough")] }),
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun("Advocate")] }),

      spacer,
      centeredBold("VERIFICATION:", 24), spacer,

      legalPara([new TextRun(
        "Verified at Delhi on ________ day of ________, 20__ that the contents of the said application are true to my knowledge and on the basis of information received and believed to be true."
      )]),

      spacer,
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "APPLICANT", bold: true })] }),

      spacer, spacer,

      legalPara([
        new TextRun({ text: "[Note: ", bold: true, italics: true }),
        new TextRun({ text: "The petition must be supported by an affidavit. The court will conduct an inquiry into the applicant's means under Order XXXIII Rule 1A. The Government Pleader and the opposite party must be given an opportunity to be heard before the application is allowed.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
