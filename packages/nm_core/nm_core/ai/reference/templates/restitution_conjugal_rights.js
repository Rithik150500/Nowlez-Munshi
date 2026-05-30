/**
 * PETITION FOR RESTITUTION OF CONJUGAL RIGHTS
 * ──────────────────────────────────────────────
 * Category : Matrimonial Pleading
 * Court    : Principal Judge, Family Court, Delhi
 * Statute  : Section 9 of the Hindu Marriage Act, 1955
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * This petition is the ONLY matrimonial remedy in Indian law that
 * seeks to PRESERVE a marriage rather than end it. To appreciate
 * how unusual this is conceptually, consider that every other
 * matrimonial template in your library — Template 11 (divorce by
 * mutual consent under Section 13B), and the petitions for divorce
 * under Section 13 and judicial separation under Section 10 — asks
 * the court to TERMINATE or SUSPEND the marriage. This template
 * does the opposite. It asks the court to ORDER the respondent to
 * return to cohabitation with the petitioner.
 *
 * SECTION 9 — THE STATUTORY REMEDY:
 *
 *   Section 9 of the Hindu Marriage Act, 1955 provides that when
 *   either the husband or the wife has, "without reasonable excuse,
 *   withdrawn from the society of the other," the aggrieved party
 *   may apply to the District Court for a decree of restitution of
 *   conjugal rights. If the court is satisfied that the statements
 *   in the petition are true and that there is no legal ground why
 *   the application should not be granted, it MAY decree restitution.
 *
 * THE BURDEN OF PROOF SHIFT:
 *
 *   Once the petitioner shows that the respondent has withdrawn from
 *   their society, the burden shifts to the respondent to prove that
 *   there was a "reasonable excuse" for the withdrawal. This is one
 *   of the few places in Indian civil law where the burden of proof
 *   shifts in this way.
 *
 * THE PRACTICAL ROLE OF SECTION 9:
 *
 *   In modern practice, restitution petitions are often filed not
 *   genuinely to restore the marriage but as a STRATEGIC move. Under
 *   Section 13(1A)(ii) of the HMA, if a decree of restitution is not
 *   complied with for a period of one year, the spouse who obtained
 *   the decree can then file for divorce on the ground of
 *   non-compliance. So a Section 9 petition is sometimes filed as a
 *   preliminary step toward an eventual divorce.
 *
 * CONSTITUTIONAL CONTROVERSY:
 *
 *   The constitutional validity of Section 9 has been debated. The
 *   Andhra Pradesh High Court once struck it down as violative of
 *   Articles 14 and 21 (T. Sareetha v. Venkata Subbaiah, 1983), but
 *   the Supreme Court overruled this in Saroj Rani v. Sudarshan
 *   Kumar Chadha (1984), holding that Section 9 serves a social
 *   purpose and is constitutional.
 *
 * FORMULAIC STRUCTURE:
 *
 *   Notice that this petition shares MANY paragraphs with the divorce
 *   and judicial separation petitions. All Hindu Marriage Act
 *   petitions follow a common skeleton: marriage particulars, status
 *   table, children, the substantive ground (which differs by
 *   remedy), no collusion, no delay, no other ground for refusal,
 *   previous proceedings, jurisdiction, and court fee. Mastering
 *   any one HMA petition therefore gives you templates for all of
 *   them — only the substantive ground paragraph changes.
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

// Table helpers for the mandatory status-and-residence table that
// is required by Rule 5 of the HMA Rules — same approach as in
// Template 11 (mutual consent divorce).
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

const contentWidth = 8666; // A4 minus our margins

module.exports = new Document({
  styles: { default: { document: { run: { font: "Times New Roman", size: 24 } } } },
  numbering: {
    config: [{
      reference: "rcr-paras",
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
      centeredBold("IN THE COURT OF PRINCIPAL JUDGE, FAMILY COURT", 24),
      centeredBold("(DISTRICT ________), ________ COURT, DELHI", 22),
      spacer,
      centeredBold("HMA PETITION NO. ________ OF 20__", 24),
      spacer,

      // ─── Parties ───
      // Unlike the mutual consent petition (Template 11) which has
      // both spouses as co-petitioners, the restitution petition is
      // adversarial — petitioner on one side, respondent on the other.
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
      centeredBold("PETITION FOR RESTITUTION OF CONJUGAL RIGHTS", 22),
      centeredBold("UNDER SECTION 9 OF THE HINDU MARRIAGE ACT, 1955", 22),
      spacer,

      legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Body ───
      // The body follows the standard HMA petition skeleton.

      // Para 1: Marriage details — establishes the legal relationship
      new Paragraph({ numbering: { reference: "rcr-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the marriage was solemnized between the parties according to Hindu rites and ceremonies on ________ (date) at ________ (place). The said marriage is registered with the Registrar of Marriage. A certified copy of the relevant extract from the Hindu Marriage Register is filed herewith."
        )] }),

      // Para 2: The status-and-residence table — same as Template 11
      new Paragraph({ numbering: { reference: "rcr-paras", level: 0 },
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
      new Paragraph({ numbering: { reference: "rcr-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "(In this paragraph state the names of the children, if any, of the marriage together with their sex, dates of birth or ages.)", italics: true })] }),

      // Para 4: THE SUBSTANTIVE GROUND — withdrawal from society
      // This is the heart of a Section 9 petition. Notice the exact
      // statutory language "without reasonable cause" — this phrase
      // tracks the language of Section 9 itself.
      new Paragraph({ numbering: { reference: "rcr-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "That the Respondent has, without any reasonable cause or excuse, withdrawn from the society of the Petitioner ", bold: true }),
          new TextRun(
            "with effect from ________ (date). The Petitioner has made all reasonable efforts to persuade the Respondent to return to the matrimonial home and resume cohabitation, but the Respondent has refused to do so. The circumstances leading to the withdrawal are as follows: ________ (state the facts in detail, including dates, places, and the relevant events)."
          ),
        ] }),

      // Para 5: Petitioner's continuing willingness — important because
      // the court will not grant the decree if the petitioner has also
      // contributed to the breakdown.
      new Paragraph({ numbering: { reference: "rcr-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "That the Petitioner is ready and willing ", bold: true, underline: {} }),
          new TextRun("to take back the Respondent and resume the matrimonial relationship. The Petitioner has not done anything which would justify the Respondent in remaining away from the matrimonial home."),
        ] }),

      // Standard HMA paragraphs — these appear in every HMA petition

      new Paragraph({ numbering: { reference: "rcr-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That the petition is not presented in collusion with the Respondent.")] }),

      new Paragraph({ numbering: { reference: "rcr-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That there has not been any unnecessary or improper delay in filing the petition.")] }),

      new Paragraph({ numbering: { reference: "rcr-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That there is no other legal ground why relief should not be granted.")] }),

      new Paragraph({ numbering: { reference: "rcr-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That there have not been any previous proceedings with regard to the marriage by or on behalf of any party.")] }),

      // Jurisdiction paragraphs
      new Paragraph({ numbering: { reference: "rcr-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the marriage was solemnized at ________. The parties last resided together at ________. The parties are now residing at ________ (within the local limits of the ordinary original jurisdiction of this Court)."
        )] }),

      new Paragraph({ numbering: { reference: "rcr-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That this Hon'ble Court has jurisdiction to try and entertain this petition.")] }),

      new Paragraph({ numbering: { reference: "rcr-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That the requisite court fee of Rs. ________ has been affixed on this petition.")] }),

      spacer,

      // ─── Prayer ───
      // The prayer is the precise opposite of a divorce prayer — instead
      // of asking the court to DISSOLVE the marriage, it asks the court
      // to ORDER the respondent to return.
      centeredBold("PRAYER:", 26),
      spacer,

      legalPara([
        new TextRun(
          "In view of the above facts and circumstances, it is, therefore, most respectfully and humbly prayed that this Hon'ble Court may be pleased to grant a "
        ),
        new TextRun({ text: "decree of restitution of conjugal rights ", bold: true, underline: {} }),
        new TextRun("under Section 9 of the Hindu Marriage Act, 1955, in favour of the Petitioner."),
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
        "The above-named Petitioner states on solemn affirmation that paras 1 to __ of the petition are true to the Petitioner's knowledge and paras __ to __ are true to the Petitioner's information received and believed to be true by him/her."
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
