/**
 * PETITION FOR DISSOLUTION OF MARRIAGE BY DECREE OF DIVORCE
 * UNDER SECTION 13 OF THE HINDU MARRIAGE ACT, 1955 (CONTESTED)
 * ────────────────────────────────────────────────────────────────
 * Category : Matrimonial Pleading — Contested Divorce
 * Court    : Principal Judge, Family Court, Delhi
 * Statute  : Section 13(1), Hindu Marriage Act, 1955
 * Source   : Standard form used in Indian matrimonial practice
 *
 * The contested Petition for Divorce under Section 13 completes
 * the matrimonial trilogy in your library by adding the option
 * that one spouse takes when the other will not agree to mutual
 * consent. To see exactly where it fits, you should now have a
 * complete picture of the matrimonial spectrum:
 *
 *   At one end is the Petition for Restitution of Conjugal Rights
 *   at Template 27, which seeks to PRESERVE the marriage by
 *   ordering the absent spouse to return.
 *
 *   In the middle is the Petition for Judicial Separation at
 *   Template 39, which gives legal relief from cohabitation
 *   without dissolving the marriage.
 *
 *   At the friendly end of dissolution is the Petition for Divorce
 *   by Mutual Consent at Template 11, where both spouses agree to
 *   end the marriage amicably.
 *
 *   And at the contested end of dissolution is THIS template —
 *   the Petition under Section 13(1), where one spouse wants the
 *   marriage to end but the other does not, and the petitioner
 *   has to PROVE specific matrimonial offences against the
 *   respondent.
 *
 * THE SHIFT FROM CONSENT TO PROOF:
 *
 *   The most important difference between this template and the
 *   mutual consent petition at Template 11 is the shift from
 *   consent-based to proof-based dissolution. In mutual consent
 *   divorce, the parties simply tell the court that the marriage
 *   has irretrievably broken down and that they have lived apart
 *   for at least one year. The court has to satisfy itself that
 *   the consent is genuine and that the parties have understood
 *   the consequences, but it does not need to assess any underlying
 *   wrongdoing. The relief is essentially administrative.
 *
 *   In contested divorce under Section 13(1), by contrast, the
 *   petitioner must plead and prove SPECIFIC MATRIMONIAL
 *   OFFENCES against the respondent. The court hears evidence,
 *   evaluates the credibility of witnesses, examines documents,
 *   and ultimately decides whether the alleged offences have been
 *   established. The relief is essentially adjudicatory. This
 *   means that contested divorce is far more time-consuming,
 *   far more emotionally damaging to both parties, and far more
 *   expensive than mutual consent divorce. It is also far more
 *   uncertain in outcome, because the court may not be persuaded
 *   that the alleged offences are sufficiently grave or
 *   sufficiently proved.
 *
 * THE GROUNDS FOR CONTESTED DIVORCE:
 *
 *   Section 13(1) of the Hindu Marriage Act sets out a long list
 *   of matrimonial offences that can be the basis for contested
 *   divorce. These include adultery, cruelty (which encompasses
 *   both physical and mental cruelty), desertion for a continuous
 *   period of at least two years, conversion to another religion,
 *   incurable unsoundness of mind, virulent and incurable form of
 *   leprosy (now removed by amendment), venereal disease in a
 *   communicable form, renunciation of the world by entering a
 *   religious order, and presumption of death after seven years'
 *   absence. Section 13(2) adds two grounds available only to a
 *   wife: the husband's bigamy or his being guilty of rape,
 *   sodomy or bestiality. And Section 13B, which is the basis of
 *   Template 11, adds the ground of mutual consent.
 *
 *   In modern practice, the overwhelming majority of contested
 *   divorce petitions are based on the ground of CRUELTY. The
 *   reason is that cruelty is a flexible and broad concept that
 *   covers a wide range of harmful conduct: physical abuse,
 *   verbal abuse, financial abuse, repeated dowry demands,
 *   refusal of marital intercourse, false criminal complaints,
 *   public humiliation, and so on. The Supreme Court has
 *   developed a substantial body of case law on what constitutes
 *   cruelty, and it has consistently held that cruelty in
 *   matrimonial cases is to be assessed not by an objective
 *   standard but by reference to the impact on the particular
 *   spouse who is complaining of it.
 *
 * THE BURDEN AND THE STANDARD OF PROOF:
 *
 *   Because contested divorce is fundamentally adjudicatory, the
 *   petitioner bears the burden of proof, and the standard is the
 *   ordinary civil standard of preponderance of probabilities. In
 *   practice, this means the petitioner must produce documentary
 *   evidence wherever possible (medical records, photographs,
 *   police complaints, text messages, witness statements) and
 *   must call witnesses who can corroborate the alleged conduct.
 *   The respondent's mere denial is not enough to defeat
 *   well-supported allegations, but vague allegations without
 *   corroboration will not succeed either.
 *
 * THE ONE-YEAR BAR:
 *
 *   Under Section 14 of the Hindu Marriage Act, no petition for
 *   divorce can be presented within one year of the date of the
 *   marriage. This bar applies to both contested and mutual
 *   consent divorce. The exception is that the court may grant
 *   leave to file earlier if the petitioner can show "exceptional
 *   hardship" or "exceptional depravity" on the part of the
 *   respondent. This bar is designed to discourage hasty divorces
 *   in the early months of marriage when the parties may simply
 *   be adjusting to married life.
 *
 * THE COMMON SKELETON, AGAIN:
 *
 *   You will notice that this template shares the common Hindu
 *   Marriage Act skeleton with Templates 27 and 39. The marriage
 *   details paragraph, the status-and-residence table, the
 *   children paragraph, the no-collusion paragraph, the
 *   no-improper-delay paragraph, the no-other-legal-ground
 *   paragraph, the previous-proceedings paragraph, the
 *   jurisdiction paragraph, and the court fee paragraph all
 *   appear in essentially the same form. What changes is the
 *   substantive ground paragraph in the middle, where the
 *   petitioner pleads cruelty (or whichever offence is being
 *   relied on) with maximum particularity, and the prayer at
 *   the end, which asks for a "decree of dissolution of marriage"
 *   rather than a decree of judicial separation or restitution.
 *   This common skeleton is what makes Hindu Marriage Act
 *   drafting tractable: master one petition, and you have
 *   substantially mastered them all.
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
      reference: "div13-paras",
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
      // Note that this is an ADVERSARIAL proceeding (one spouse
      // versus the other), in contrast to the mutual consent
      // divorce at Template 11 where both spouses are
      // co-petitioners.
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
      centeredBold("PETITION FOR DISSOLUTION OF MARRIAGE BY A DECREE", 22),
      centeredBold("OF DIVORCE UNDER SECTION 13 OF THE HINDU", 22),
      centeredBold("MARRIAGE ACT, 1955", 22),
      spacer,

      legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Body ───
      // The standard HMA skeleton applies here. Notice how it
      // mirrors Templates 27 and 39 almost paragraph-for-paragraph.
      // The only structural difference is in the substantive
      // ground paragraph (paragraph 4) and the prayer.

      // Para 1: Marriage details
      new Paragraph({ numbering: { reference: "div13-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the marriage was solemnized between the parties according to Hindu rites and ceremonies after the commencement of the Hindu Marriage Act on ________ (date) at ________ (place). The said marriage is registered with the Registrar of Marriage. A certified copy of the relevant extract from the Hindu Marriage Register is filed herewith."
        )] }),

      // Para 2: Status-and-residence table
      new Paragraph({ numbering: { reference: "div13-paras", level: 0 },
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
      new Paragraph({ numbering: { reference: "div13-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "(In this paragraph, state the names of the children, if any, of the marriage together with their sex, dates of birth or ages.)", italics: true })] }),

      // Para 4: THE SUBSTANTIVE GROUND — Section 13(1)(i-a) cruelty
      // This is where the contested divorce template differs most
      // dramatically from the other matrimonial petitions. The
      // petitioner must plead specific matrimonial offences with
      // particulars of time, place and manner. The most common
      // ground in modern practice is cruelty.
      new Paragraph({ numbering: { reference: "div13-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "That after the solemnization of the marriage, the Respondent has treated the Petitioner with cruelty within the meaning of Section 13(1)(i-a) of the Hindu Marriage Act, 1955. ", bold: true }),
          new TextRun(
            "The particulars of cruelty are set out in the following sub-paragraphs:"
          ),
        ] }),

      // Particulars of cruelty — each instance must be set out
      // with date, place, and the nature of the conduct alleged.
      // The instances given here are examples; in actual practice
      // the petitioner would draft these with the specific facts
      // of the case.

      legalPara([
        new TextRun({ text: "(a) ", bold: true }),
        new TextRun(
          "That on or about ________ (date), at the matrimonial home, the Respondent ________ (state the specific incident of cruelty, e.g., physical assault, verbal abuse, public humiliation, or other harmful conduct, with all relevant details)."
        ),
      ], { indent: { left: 720 } }),

      legalPara([
        new TextRun({ text: "(b) ", bold: true }),
        new TextRun(
          "That the Respondent has, throughout the period of cohabitation, made repeated and unjustified demands for ________ (e.g., dowry, expensive gifts, financial transfers from the Petitioner's family) and has subjected the Petitioner to mental harassment when such demands were not met."
        ),
      ], { indent: { left: 720 } }),

      legalPara([
        new TextRun({ text: "(c) ", bold: true }),
        new TextRun(
          "That on ________ (date), the Respondent ________ (state another specific incident, with details). The Petitioner suffered ________ (state the consequences in physical, mental, or emotional terms)."
        ),
      ], { indent: { left: 720 } }),

      legalPara([
        new TextRun({ text: "(d) ", bold: true }),
        new TextRun(
          "That the cumulative effect of the Respondent's conduct has been to cause grave mental agony and physical suffering to the Petitioner, such that it has become impossible for the Petitioner to continue to live with the Respondent without serious risk to his/her physical and mental health."
        ),
      ], { indent: { left: 720 } }),

      // Para 5: No connivance, condonation, or collusion — these
      // are bars to relief under Section 23 of the Act and must
      // be specifically negated.
      new Paragraph({ numbering: { reference: "div13-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Petitioner has not in any manner connived at, condoned or accepted the cruelty of the Respondent. Whenever the Petitioner attempted to overlook past incidents in the hope of preserving the marriage, the Respondent's conduct continued unabated and the cruelty escalated rather than abating."
        )] }),

      // Standard HMA paragraphs

      new Paragraph({ numbering: { reference: "div13-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That the petition is not presented in collusion with the Respondent.")] }),

      new Paragraph({ numbering: { reference: "div13-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That there has not been any unnecessary or improper delay in filing the petition.")] }),

      new Paragraph({ numbering: { reference: "div13-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That there is no other legal ground why relief should not be granted.")] }),

      new Paragraph({ numbering: { reference: "div13-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That there have not been any previous proceedings with regard to the marriage by or on behalf of any party.")] }),

      // The one-year bar declaration — important to confirm that
      // the petition is not premature under Section 14
      new Paragraph({ numbering: { reference: "div13-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That more than one year has elapsed since the date of the marriage, and the present petition is therefore not barred by Section 14 of the Hindu Marriage Act, 1955."
        )] }),

      // Jurisdiction paragraphs
      new Paragraph({ numbering: { reference: "div13-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the marriage was solemnized at ________. The parties last resided together at ________. The Petitioner is now residing at ________ (within the local limits of the ordinary original jurisdiction of this Court)."
        )] }),

      new Paragraph({ numbering: { reference: "div13-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That this Hon'ble Court has jurisdiction to try and entertain this petition.")] }),

      new Paragraph({ numbering: { reference: "div13-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That the requisite court fee of Rs. ________ has been affixed on this petition.")] }),

      spacer,

      // ─── Prayer ───
      // The operative phrase here is "decree of dissolution of
      // marriage by divorce" — distinct from the prayers in the
      // other matrimonial templates.
      centeredBold("PRAYER:", 26),
      spacer,

      legalPara([
        new TextRun(
          "In view of the above facts and circumstances, it is, therefore, most respectfully and humbly prayed that this Hon'ble Court may be pleased to grant a "
        ),
        new TextRun({ text: "decree of dissolution of marriage by divorce ", bold: true, underline: {} }),
        new TextRun("under Section 13(1)(i-a) of the Hindu Marriage Act, 1955, in favour of the Petitioner and against the Respondent."),
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
        new TextRun({ text: "An affidavit of the Petitioner is to be appended. Documentary evidence supporting the allegations of cruelty (medical records, photographs, police complaints, witness statements) should be filed along with the petition.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
