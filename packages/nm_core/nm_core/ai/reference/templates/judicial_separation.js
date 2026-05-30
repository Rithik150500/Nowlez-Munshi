/**
 * PETITION FOR JUDICIAL SEPARATION
 * ────────────────────────────────────
 * Category : Matrimonial Pleading
 * Court    : Principal Judge, Family Court, Delhi
 * Statute  : Section 10 of the Hindu Marriage Act, 1955
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * The Petition for Judicial Separation is the third and final
 * member of the matrimonial trilogy in your library, and reading it
 * alongside Templates 11 and 27 will give you a complete map of
 * how the Hindu Marriage Act treats marital breakdown.
 *
 * THE MATRIMONIAL SPECTRUM:
 *
 *   Hindu marriage law offers a spectrum of remedies depending on
 *   what the petitioner actually wants:
 *
 *     RESTITUTION OF CONJUGAL RIGHTS (Template 27, Section 9) —
 *     The petitioner WANTS the marriage to continue. The other
 *     spouse has withdrawn from cohabitation, and the petitioner
 *     wants the court to order them to return.
 *
 *     JUDICIAL SEPARATION (this template, Section 10) — The
 *     petitioner does NOT want to live with the other spouse, but
 *     also does NOT want to dissolve the marriage. The court
 *     relieves the petitioner of the obligation to cohabit while
 *     keeping the marriage technically alive.
 *
 *     DIVORCE BY MUTUAL CONSENT (Template 11, Section 13B) — Both
 *     spouses want to end the marriage and have agreed on this
 *     amicably.
 *
 *     CONTESTED DIVORCE (Section 13) — One spouse wants to end the
 *     marriage but the other does not, and the petitioner has to
 *     prove specific matrimonial offences.
 *
 * WHY JUDICIAL SEPARATION INSTEAD OF DIVORCE?
 *
 *   Several reasons explain why a petitioner might prefer judicial
 *   separation over divorce:
 *
 *     First, religious and cultural reasons. For many Hindus, the
 *     marriage is regarded as a sacrament that cannot or should
 *     not be dissolved. Judicial separation provides legal relief
 *     from cohabitation without the religious finality of divorce.
 *
 *     Second, the desire to preserve the option of reconciliation.
 *     Judicial separation can be revoked at any time by mutual
 *     application to the court under Section 10(2). Divorce, by
 *     contrast, is irreversible and the parties would have to
 *     remarry to restore their relationship.
 *
 *     Third, child welfare considerations. The legitimacy and
 *     religious status of children is preserved more clearly when
 *     the parents are merely separated rather than divorced.
 *
 *     Fourth, financial planning. Judicial separation can be useful
 *     as a planning tool for spouses who anticipate that divorce
 *     may become necessary later but who are not yet ready to take
 *     that final step.
 *
 *     Fifth, and most strategically, judicial separation creates a
 *     legal foundation for a future divorce. Under Section
 *     13(1A)(i) of the Hindu Marriage Act, if cohabitation is not
 *     resumed for a period of one year after a decree of judicial
 *     separation, either spouse can file for divorce on that
 *     ground alone, without having to prove any matrimonial
 *     offence. This makes judicial separation a much easier
 *     stepping stone to divorce than going directly for a contested
 *     decree under Section 13.
 *
 * THE GROUNDS FOR JUDICIAL SEPARATION:
 *
 *   Section 10(1) of the Hindu Marriage Act states that judicial
 *   separation may be sought on any of the grounds specified in
 *   Section 13(1) for divorce, plus the additional grounds
 *   available to a wife under Section 13(2). This is significant
 *   because it means that judicial separation has the SAME
 *   evidentiary requirements as a contested divorce. The petitioner
 *   must plead specific matrimonial offences with full particulars
 *   of time, place and manner. The grounds include adultery,
 *   cruelty (mental and physical), desertion for two years, conversion
 *   to another religion, unsoundness of mind, leprosy (now removed
 *   by amendment), venereal disease, renunciation of the world,
 *   and presumption of death.
 *
 * THE COMMON HMA SKELETON:
 *
 *   You may notice that this template shares a common skeleton
 *   with Template 27 (Restitution) and most other Hindu Marriage
 *   Act petitions. The skeleton includes the marriage details
 *   paragraph, the status-and-residence table, the children
 *   paragraph, the substantive ground paragraph, the no-collusion
 *   paragraph, the no-improper-delay paragraph, the
 *   no-other-legal-ground paragraph, the previous-proceedings
 *   paragraph, the jurisdiction paragraph, and the court fee
 *   paragraph. What changes between matrimonial petitions is the
 *   substantive ground paragraph in the middle, where the
 *   petitioner pleads the facts that bring the case within the
 *   chosen statutory remedy. So if you have understood Template 27,
 *   you have already understood ninety percent of this template.
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

// Same status-and-residence table helpers used in matrimonial templates
const tBorder = { style: BorderStyle.SINGLE, size: 1, color: "000000" };
const tBorders = { top: tBorder, bottom: tBorder, left: tBorder, right: tBorder };
function tCell(text, width, opts = {}) {
  return new TableCell({
    borders: tBorders,
    width: { size: width, type: WidthType.DXA },
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    shading: opts.header ? { fill: "E8E8E8", type: ShadingType.CLEAR } : undefined,
    children: [new Paragraph({
      alignment: opts.align || AlignmentType.CENTER,
      children: [new TextRun({ text, bold: opts.header || false, size: 20, font: "Times New Roman" })],
    })],
  });
}

const contentWidth = 8666;

module.exports = new Document({
  styles: { default: { document: { run: { font: "Times New Roman", size: 24 } } } },
  numbering: {
    config: [{
      reference: "js-paras",
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
      // Like all Hindu Marriage Act petitions, judicial separation
      // goes to the Family Court rather than a regular civil court.
      centeredBold("IN THE COURT OF PRINCIPAL JUDGE, FAMILY COURT", 24),
      centeredBold("(DISTRICT ________), ________ COURT, DELHI", 22),
      spacer,
      centeredBold("HMA PETITION NO. ________ OF 20__", 24),
      spacer,

      // ─── Parties ───
      // Note that this is an ADVERSARIAL proceeding (one spouse
      // against the other), in contrast to the mutual consent
      // divorce at Template 11 where both spouses are co-petitioners.
      legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      legalPara([new TextRun({ text: "X ________", bold: true })]),
      legalPara([new TextRun("S/o ________")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara([new TextRun({ text: "\u2026 PETITIONER", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      centeredBold("VERSUS"),
      spacer,

      legalPara([new TextRun({ text: "Y ________", bold: true })]),
      legalPara([new TextRun("W/o ________")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara([new TextRun({ text: "\u2026 RESPONDENT", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      spacer,

      // ─── Title ───
      centeredBold("PETITION FOR JUDICIAL SEPARATION UNDER SECTION 10", 22),
      centeredBold("OF THE HINDU MARRIAGE ACT, 1955", 22),
      spacer,

      legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Body ───
      // The standard HMA skeleton, identical in structure to
      // Template 27 (Restitution) except for the substantive
      // ground paragraph and the prayer.

      // Para 1: Marriage details
      new Paragraph({ numbering: { reference: "js-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the marriage was solemnized between the parties according to Hindu rites and ceremonies on ________ (date) at ________ (place). The said marriage is registered with the Registrar of Marriage. A certified copy of the relevant extract from the Hindu Marriage Register is filed herewith."
        )] }),

      // Para 2: Status-and-residence table — same structure as
      // Templates 11 and 27. The HMA Rules require this information
      // to be presented in tabular form so that the court can quickly
      // assess jurisdiction and the personal status of the parties.
      new Paragraph({ numbering: { reference: "js-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the status and place of residence of the parties to the marriage before the marriage and at the time of filing the petition are as follows:"
        )] }),

      spacer,

      new Table({
        width: { size: contentWidth, type: WidthType.DXA },
        columnWidths: [1800, 1200, 800, 1700, 1200, 800, 1166],
        rows: [
          new TableRow({
            children: [
              tCell("", 1800, { header: true }),
              new TableCell({
                borders: tBorders, width: { size: 3700, type: WidthType.DXA },
                margins: { top: 60, bottom: 60, left: 100, right: 100 }, columnSpan: 3,
                shading: { fill: "E8E8E8", type: ShadingType.CLEAR },
                children: [new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "Husband", bold: true, size: 20, font: "Times New Roman" })],
                })],
              }),
              new TableCell({
                borders: tBorders, width: { size: 3166, type: WidthType.DXA },
                margins: { top: 60, bottom: 60, left: 100, right: 100 }, columnSpan: 3,
                shading: { fill: "E8E8E8", type: ShadingType.CLEAR },
                children: [new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "Wife", bold: true, size: 20, font: "Times New Roman" })],
                })],
              }),
            ],
          }),
          new TableRow({
            children: [
              tCell("", 1800, { header: true }),
              tCell("Status", 1200, { header: true }), tCell("Age", 800, { header: true }), tCell("Place of Residence", 1700, { header: true }),
              tCell("Status", 1200, { header: true }), tCell("Age", 800, { header: true }), tCell("Place of Residence", 1166, { header: true }),
            ],
          }),
          new TableRow({
            children: [
              tCell("Before marriage", 1800),
              tCell("", 1200), tCell("", 800), tCell("", 1700),
              tCell("", 1200), tCell("", 800), tCell("", 1166),
            ],
          }),
          new TableRow({
            children: [
              tCell("At the time of filing the petition", 1800),
              tCell("", 1200), tCell("", 800), tCell("", 1700),
              tCell("", 1200), tCell("", 800), tCell("", 1166),
            ],
          }),
        ],
      }),

      spacer,

      // Para 3: Children
      new Paragraph({ numbering: { reference: "js-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "(In this paragraph state the names of the children, if any, of the marriage together with their sex, dates of birth or ages.)", italics: true })] }),

      // Para 4: THE SUBSTANTIVE GROUND
      // Unlike the restitution petition (which pleads "withdrawal
      // from society"), the judicial separation petition pleads
      // specific matrimonial offences from Section 13(1) of the Act.
      // The most common in practice is cruelty.
      new Paragraph({ numbering: { reference: "js-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "That the Respondent has, since the solemnization of the marriage, treated the Petitioner with such cruelty as to give rise to a reasonable apprehension in the mind of the Petitioner that it would be harmful or injurious for the Petitioner to live with the Respondent. ", bold: true }),
          new TextRun(
            "The particulars of cruelty are as follows: ________ (state the matrimonial offences with specificity, including dates, places and the nature of the conduct alleged. Each instance should ideally be set out in a separate sub-paragraph so that the Court can adjudicate on each allegation distinctly)."
          ),
        ] }),

      // Para 5: No condonation — the petitioner has not forgiven
      // the cruelty by resuming cohabitation
      new Paragraph({ numbering: { reference: "js-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Petitioner has not in any manner condoned the cruelty alleged above. Whenever the Petitioner attempted to overlook past incidents in the hope of saving the marriage, the Respondent's conduct continued unabated, leaving the Petitioner with no choice but to seek the present relief."
        )] }),

      // Standard HMA paragraphs — these mirror Template 27 exactly
      // because they are the common skeleton of all HMA petitions

      new Paragraph({ numbering: { reference: "js-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That the petition is not presented in collusion with the Respondent.")] }),

      new Paragraph({ numbering: { reference: "js-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That there has not been any unnecessary or improper delay in filing the petition.")] }),

      new Paragraph({ numbering: { reference: "js-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That there is no other legal ground why relief should not be granted.")] }),

      new Paragraph({ numbering: { reference: "js-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That there have not been any previous proceedings with regard to the marriage by or on behalf of any party.")] }),

      // Jurisdiction paragraphs
      new Paragraph({ numbering: { reference: "js-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the marriage was solemnized at ________. The parties last resided together at ________. The parties are now residing at ________ (within the local limits of the ordinary original jurisdiction of this Court)."
        )] }),

      new Paragraph({ numbering: { reference: "js-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That this Hon'ble Court has jurisdiction to try and entertain this petition.")] }),

      new Paragraph({ numbering: { reference: "js-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That the requisite court fee of Rs. ________ has been affixed on this petition.")] }),

      spacer,

      // ─── Prayer ───
      // Notice the operative phrase "decree of judicial separation"
      // — this is what distinguishes this petition's prayer from
      // the restitution petition's prayer (which asks for "decree of
      // restitution") and the divorce petition's prayer (which asks
      // for "decree of dissolution of marriage").
      centeredBold("PRAYER:", 26),
      spacer,

      legalPara([
        new TextRun(
          "In view of the above facts and circumstances, it is, therefore, most respectfully and humbly prayed that this Hon'ble Court may be pleased to grant a "
        ),
        new TextRun({ text: "decree of judicial separation ", bold: true, underline: {} }),
        new TextRun("under Section 10 of the Hindu Marriage Act, 1955, in favour of the Petitioner."),
      ]),

      legalPara([
        new TextRun("Any other relief, order or direction this Hon'ble Court may deem fit in the interest of justice and equity may also be granted."),
      ]),

      spacer, spacer,

      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Place: Delhi"), new TextRun({ text: "\tPETITIONER", bold: true })] }),
      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Date: ________"), new TextRun("\tThrough")] }),
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun("Advocate")] }),

      spacer,
      centeredBold("VERIFICATION:", 24), spacer,

      legalPara([new TextRun(
        "The above-named Petitioner states on solemn affirmation that paragraphs 1 to ________ of the petition are true to the Petitioner's knowledge, and paragraphs ________ to ________ are true to the Petitioner's information received and believed to be true by him/her."
      )]),
      legalPara([new TextRun("Verified at ________ (Place)")]),
      legalPara([new TextRun("Dated: ________")]),

      spacer,
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "PETITIONER", bold: true })] }),

      spacer, spacer,
      legalPara([
        new TextRun({ text: "[NOTE: ", bold: true, italics: true }),
        new TextRun({ text: "An affidavit of the Petitioner is to be appended.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
