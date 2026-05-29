/**
 * TRANSFER PETITION UNDER SECTION 25 OF THE CODE OF CIVIL PROCEDURE
 * ────────────────────────────────────────────────────────────────────
 * Category : Civil Procedure — Supreme Court Original Jurisdiction
 * Court    : Supreme Court of India
 * Statute  : Section 25, Code of Civil Procedure, 1908
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * The Transfer Petition under Section 25 CPC is a remarkable
 * pleading because it invokes the ORIGINAL civil jurisdiction of the
 * Supreme Court of India. Until now, every Supreme Court template in
 * your library has invoked the Court's APPELLATE jurisdiction. The
 * Civil SLP at Template 23 and the Criminal SLP at Template 32 both
 * ask the Supreme Court to review what a lower court has already
 * decided. This Transfer Petition is different. It asks the Supreme
 * Court to do something the lower courts cannot do at all, namely to
 * transfer a case from a court in one state to a court in another
 * state.
 *
 * THE PROBLEM SECTION 25 SOLVES:
 *
 *   Indian civil procedure permits a plaintiff to file a suit in any
 *   court that has territorial jurisdiction over the cause of action
 *   or the defendant's residence. This rule is generally fair, but
 *   it creates a serious hardship in one specific situation: when
 *   the plaintiff and the defendant live in different states. The
 *   plaintiff, who chose where to file, will naturally pick the court
 *   most convenient for themselves. The defendant, who had no choice
 *   in the matter, may have to travel hundreds or thousands of
 *   kilometres for every hearing date.
 *
 *   The classic example is a matrimonial dispute. Imagine a wife who
 *   originally lived with her husband in Mumbai, but who returned to
 *   her parents' home in Delhi after the marriage broke down. The
 *   husband then files a divorce petition in Mumbai because that is
 *   where they last resided together. The wife, who is now in Delhi
 *   with no money and no support, would have to travel to Mumbai for
 *   every hearing. She cannot afford this, she has no place to stay
 *   in Mumbai, and the constant travel becomes a form of
 *   harassment. Section 25 gives her a remedy: she can apply to the
 *   Supreme Court to transfer the divorce petition from Mumbai to a
 *   court in Delhi.
 *
 * WHY THE SUPREME COURT?
 *
 *   The reason this kind of transfer goes to the Supreme Court
 *   rather than to a High Court is constitutional. Each High Court
 *   has jurisdiction only within its own state, so the Bombay High
 *   Court can transfer a case from one court in Maharashtra to
 *   another court in Maharashtra, and the Delhi High Court can do
 *   the same within Delhi. But neither High Court can transfer a
 *   case across state borders, because that would mean exercising
 *   jurisdiction over a court in another state. Only the Supreme
 *   Court, which has all-India jurisdiction, can move cases between
 *   states. This is what gives Section 25 its special character.
 *
 * THE STRUCTURAL FEATURES OF THE PETITION:
 *
 *   First, look at the case header. It says "ORIGINAL CIVIL
 *   JURISDICTION" rather than "Civil Appellate Jurisdiction." This
 *   one phrase tells you immediately that the petition is invoking
 *   the Supreme Court's original power, not its appellate power.
 *
 *   Second, look at the case title format. It has TWO "IN THE
 *   MATTER OF" clauses. The first identifies the parties to the
 *   transfer petition itself, and the second identifies the
 *   underlying suit that is being asked to be transferred. This
 *   double-titling reflects the dual nature of the petition: it is
 *   simultaneously a Supreme Court proceeding and an application
 *   relating to a separate case in another court.
 *
 *   Third, the petition has a distinctive BRIEF FACTS section,
 *   similar to the one you saw in the Criminal SLP at Template 32.
 *   This narrative section tells the Supreme Court the entire
 *   story of the marriage breakdown and the underlying litigation,
 *   so that the Court can quickly understand what is being asked
 *   and why.
 *
 *   Fourth, the petition contains a GROUNDS section where the
 *   petitioner sets out specific reasons for the transfer. These
 *   grounds are quite distinctive and have evolved through years of
 *   Supreme Court practice. They typically include lack of someone
 *   to accompany the petitioner, lack of accommodation in the city
 *   where the case is pending, financial inability to travel,
 *   medical conditions that make travel difficult, the presence of
 *   minor children, fear of harassment by the respondent, and the
 *   fact that other related proceedings are already pending in the
 *   court to which transfer is sought. These are not abstract legal
 *   grounds but practical hardship factors, and the Supreme Court
 *   is generally quite sympathetic to wife-petitioners in
 *   matrimonial transfer cases.
 *
 *   Fifth, paragraph 4 of the petition declares that no other
 *   similar transfer petition has been filed before the Supreme
 *   Court in respect of this matter. This declaration is required
 *   to prevent forum shopping.
 *
 * THE STRATEGIC IMPORTANCE OF SECTION 25:
 *
 *   In practice, transfer petitions are one of the most common
 *   matters the Supreme Court hears. The reason is that they
 *   provide quick relief in matrimonial cases where the inability
 *   to travel would otherwise effectively deny one spouse the
 *   right to contest the case at all. Many divorce cases are
 *   effectively won or lost at the transfer petition stage,
 *   because once the case is transferred to a court near the wife,
 *   the husband often loses interest in pursuing it. The Supreme
 *   Court has been generous in granting transfers in matrimonial
 *   cases, especially where the wife cites lack of accompaniment,
 *   financial hardship, or the presence of minor children.
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
      { reference: "tp-paras", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      // Brief facts use sub-numbering like 2.1, 2.2 — but docx-js
      // does not handle this directly, so we use a separate counter
      { reference: "brief-facts", levels: [{ level: 0, format: LevelFormat.LOWER_ROMAN, text: "(%1)",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 1080, hanging: 400 } } } }] },
      // Grounds use Roman lowercase
      { reference: "grounds", levels: [{ level: 0, format: LevelFormat.LOWER_ROMAN, text: "%1.",
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
      // Notice "ORIGINAL CIVIL JURISDICTION" — this distinguishes
      // the petition from SLPs which use "Civil Appellate
      // Jurisdiction" or "Criminal Appellate Jurisdiction."
      centeredBold("IN THE SUPREME COURT OF INDIA", 28),
      centeredBold("ORIGINAL CIVIL JURISDICTION", 22),
      spacer,
      centeredBold("TRANSFER PETITION (CIVIL) NO. ________ OF 20__", 24),
      spacer,
      legalPara([
        new TextRun({ text: "(UNDER SECTION 25 OF THE CODE OF CIVIL PROCEDURE, 1908, READ WITH ORDER XLI, SUPREME COURT RULES, 2013)", italics: true, size: 22 }),
      ], { alignment: AlignmentType.CENTER }),

      spacer,

      // ─── First "In the Matter Of" — the parties ───
      legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })]),
      spacer,

      legalPara([new TextRun({ text: "J ________", bold: true })]),
      legalPara([new TextRun("D/o ________")]),
      legalPara([new TextRun("R/o ________ (Delhi)")]),
      legalPara([new TextRun({ text: "\u2026 PETITIONER", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      centeredBold("VERSUS"),
      spacer,

      legalPara([new TextRun({ text: "B ________", bold: true })]),
      legalPara([new TextRun("S/o ________")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara([new TextRun({ text: "\u2026 RESPONDENT", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      spacer,

      // ─── Second "And in the Matter Of" — identifying the suit ───
      // This double-titling is unique to transfer petitions and
      // reflects the dual nature of the proceeding.
      legalPara([new TextRun({ text: "AND IN THE MATTER OF:", bold: true, underline: {} })]),
      spacer,
      legalPara([
        new TextRun(
          "TRANSFER OF THE DIVORCE PETITION BEING HMA PETITION NO. ________ OF 20__ TITLED AS '________ VERSUS ________' PENDING ADJUDICATION BEFORE THE PRINCIPAL JUDGE, FAMILY COURT, ________ (the court name where the case is pending) TO THE PRINCIPAL JUDGE, FAMILY COURT, ________ (the court name where the transfer is sought)."
        ),
      ]),

      spacer,

      // ─── Formal Addressing ───
      // Same as the SLPs — addressed to the Chief Justice
      legalPara([new TextRun({ text: "To,", bold: true })]),
      legalPara([new TextRun("The Hon'ble Chief Justice of India")]),
      legalPara([new TextRun("And His Companion Justices of the Hon'ble Supreme Court of India at New Delhi")]),

      spacer,

      legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Body ───

      // Para 1: Identifying what is being asked
      new Paragraph({ numbering: { reference: "tp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Petitioner is seeking transfer of the Divorce Petition being HMA Petition No. ________ of 20__ titled as '________ versus ________' pending adjudication before the Principal Judge, Family Court, ________, to the Principal Judge, Family Court, ________."
        )] }),

      // Para 2: BRIEF FACTS section — narrative format like the
      // Criminal SLP. The Supreme Court needs the full picture
      // before deciding whether to grant the transfer.
      new Paragraph({ numbering: { reference: "tp-paras", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "BRIEF FACTS:", bold: true, underline: {} })] }),

      // The brief facts use sub-paragraphs (i), (ii), etc. because
      // they form a single logical narrative under one paragraph
      // number. This is conventional in transfer petitions.

      new Paragraph({ numbering: { reference: "brief-facts", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "The Petitioner is the wife of the Respondent. The Petitioner got married to the Respondent on ________ at ________ according to Hindu rites and ceremonies."
        )] }),

      new Paragraph({ numbering: { reference: "brief-facts", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That after their marriage, the parties were residing at ________."
        )] }),

      new Paragraph({ numbering: { reference: "brief-facts", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That out of the wedlock, one child namely ________ was born to the parties."
        )] }),

      new Paragraph({ numbering: { reference: "brief-facts", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That immediately after the marriage, the attitude of the Respondent changed towards the Petitioner. The Respondent and his parents were harassing the Petitioner, and serious disputes and differences started cropping up between the parties."
        )] }),

      new Paragraph({ numbering: { reference: "brief-facts", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Petitioner was thrown out of her matrimonial home by the Respondent and was forced to go to her parents' home at ________."
        )] }),

      new Paragraph({ numbering: { reference: "brief-facts", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "The Petitioner, after coming to her parents' house, made several attempts to sort out the differences and bring the situation under control. However, there was no change in the attitude of the Respondent and his parents."
        )] }),

      // The crucial fact — the husband filed a divorce petition in
      // a place inconvenient to the wife
      new Paragraph({ numbering: { reference: "brief-facts", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That the Respondent filed a Petition for Dissolution of Marriage under Section 13 of the Hindu Marriage Act, 1955. The said Divorce Petition being HMA Petition No. ________ of 20__ titled as '________ versus ________' is presently pending adjudication before the Principal Judge, Family Court, ________. A true copy of the said Divorce Petition is annexed herewith and marked as "
          ),
          new TextRun({ text: "Annexure P-1.", bold: true }),
        ] }),

      // The other related proceeding — typically a Section 125
      // maintenance petition filed by the wife in her own town
      new Paragraph({ numbering: { reference: "brief-facts", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That since the Petitioner was unable to survive on her own, she was compelled to file a Petition for Maintenance under Section 125 of the Code of Criminal Procedure, 1973. The said Petition being Case No. ________ of 20__ titled as '________ versus ________' is presently pending adjudication before the Court of ________ at ________. A true copy of the said Petition is annexed herewith and marked as "
          ),
          new TextRun({ text: "Annexure P-2.", bold: true }),
        ] }),

      spacer,

      // Para 3: GROUNDS — the practical hardship factors
      new Paragraph({ numbering: { reference: "tp-paras", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "That this Transfer Petition is being filed by the Petitioner for transferring the said Divorce Petition on, amongst others, the following grounds:", bold: true }),
        ] }),

      legalPara([new TextRun({ text: "GROUNDS:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      new Paragraph({ numbering: { reference: "grounds", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because the present Petitioner has no one to accompany her from ________ to ________ on the dates of hearing in the pending matter."
        )] }),

      new Paragraph({ numbering: { reference: "grounds", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because the Petitioner has no place to stay at ________. She is not in a sound financial position to afford a place to stay at ________ as she is totally dependent on her parents and is presently living with them at ________."
        )] }),

      new Paragraph({ numbering: { reference: "grounds", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because the Petitioner is suffering from health problems and has been advised by her doctor not to undertake long journeys, as the same may aggravate her medical condition."
        )] }),

      new Paragraph({ numbering: { reference: "grounds", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because the Petitioner has a minor child who cannot be left alone while she travels to ________, and it is troublesome for the child to travel on every date fixed for hearing."
        )] }),

      new Paragraph({ numbering: { reference: "grounds", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because the Petitioner has reasonable apprehension that she may be humiliated and defamed by the Respondent and his family members whenever she visits the courts at ________."
        )] }),

      new Paragraph({ numbering: { reference: "grounds", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because the case filed by the Petitioner is already pending adjudication at ________, and it would be convenient for both parties if all related proceedings between them were adjudicated by courts at the same place."
        )] }),

      spacer,

      // Para 4: Declaration of no other transfer petition
      // (similar to the SLP declaration)
      new Paragraph({ numbering: { reference: "tp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Petitioner has not filed any other similar transfer petition before this Hon'ble Court so far in respect of this matter."
        )] }),

      // Para 5: Court fee
      new Paragraph({ numbering: { reference: "tp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the requisite court fee of Rs. ________ has been affixed on this petition."
        )] }),

      spacer,

      // ─── Prayer ───
      // The prayer is short and specific — asking only for the
      // transfer order, not for any other relief.
      centeredBold("PRAYER:", 26),
      spacer,

      legalPara([new TextRun(
        "In view of the above facts and circumstances, it is respectfully submitted that this Hon'ble Court may be pleased:"
      )]),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "To pass an order transferring HMA Petition No. ________ filed by the Respondent against the Petitioner, titled '________ versus ________', from the Court of Principal Judge, Family Court, ________, to the Court of Principal Judge, Family Court, ________;", bold: true }),
        ] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("To pass any other and further order as may be deemed fit and proper in the facts and circumstances of the case.")] }),

      spacer, spacer,

      // ─── Filing block — same dual-date format as SLPs ───
      legalPara([new TextRun({ text: "FILED BY:", bold: true })]),
      spacer,
      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("New Delhi"), new TextRun({ text: "\tAdvocate for the Petitioner", bold: true })] }),
      legalPara([new TextRun("Date of drawn: ________")]),
      legalPara([new TextRun("Date of filing: ________")]),

      spacer,

      legalPara([
        new TextRun({ text: "[NOTE: ", bold: true, italics: true }),
        new TextRun({ text: "To be supported by an affidavit. Annexures P-1 and P-2 (the Divorce Petition and the Maintenance Petition) must be filed along with this petition.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
