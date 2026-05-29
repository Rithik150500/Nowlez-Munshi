/**
 * PETITION UNDER SECTION 12 OF THE PROTECTION OF WOMEN FROM
 * DOMESTIC VIOLENCE ACT, 2005
 * ───────────────────────────────────────────────────────────
 * Category : Social Welfare Law / Quasi-Criminal Pleading
 * Court    : Chief Judicial Magistrate, Delhi
 * Statute  : Protection of Women from Domestic Violence Act, 2005
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * The Domestic Violence Act, 2005 (commonly called "the DV Act") is
 * a remarkable social welfare statute that takes a comprehensive
 * approach to protecting women in domestic relationships. To
 * appreciate its uniqueness, contrast it with Template 24 (the
 * maintenance application under Section 144 BNSS):
 *
 *   Section 144 BNSS provides ONE remedy — monthly maintenance.
 *
 *   The DV Act provides FIVE distinct types of relief in a single
 *   petition:
 *
 *     - PROTECTION ORDERS (Section 18) — restraining the respondent
 *       from committing acts of violence, contacting the aggrieved
 *       woman, alienating assets, or operating bank accounts;
 *
 *     - RESIDENCE ORDERS (Section 19) — protecting the woman's
 *       right to reside in the shared household, restraining her
 *       dispossession, and even allowing her to be restored to
 *       possession if she has been thrown out;
 *
 *     - MONETARY RELIEF (Section 20) — covering medical expenses,
 *       loss of earnings, maintenance for the woman and her
 *       children, and the cost of any property destroyed;
 *
 *     - CUSTODY ORDERS (Section 21) — temporary custody of children;
 *
 *     - COMPENSATION ORDERS (Section 22) — for mental torture,
 *       emotional distress, and physical injuries.
 *
 * KEY CONCEPTS:
 *
 *   1. WHO CAN BE A "RESPONDENT" — Originally only the husband
 *      could be a respondent, but after Hiral P. Harsora v.
 *      Kusum Narottamdas Harsora (Supreme Court, 2016), the
 *      definition was struck down to the extent it limited
 *      respondents to "adult male persons." Now female relatives
 *      of the husband can also be respondents. This template
 *      uses the father-in-law as the respondent.
 *
 *   2. "DOMESTIC RELATIONSHIP" — The Act applies only when there
 *      is a "domestic relationship," meaning the parties have
 *      lived together at any point in a shared household. This
 *      relationship must be specifically pleaded.
 *
 *   3. "AGGRIEVED PERSON" — Only women can be applicants. The
 *      Act is gender-specific in this respect.
 *
 *   4. "SHARED HOUSEHOLD" — A defined term meaning the household
 *      where the aggrieved person lives or has lived in a domestic
 *      relationship, whether or not she has any title or interest
 *      in it. This is important because it gives a wife a right
 *      to reside even in property she does not own.
 *
 *   5. THE TABLE STRUCTURE FOR CHILDREN — Notice that this
 *      template uses a table inside the body of the petition to
 *      list the children. This is a documentary convention in
 *      DV Act petitions because children's age and school status
 *      affect the calculation of monetary relief.
 *
 * FORUM:
 *
 *   The DV Act petition is filed before a Judicial Magistrate
 *   First Class — not a Family Court. This reflects the
 *   quasi-criminal character of the statute. The Magistrate has
 *   the power to issue all the orders listed above and can also
 *   commit a non-compliant respondent to imprisonment under
 *   Section 31 of the Act.
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

// Table helpers for the children-listing table
const tBorder = { style: BorderStyle.SINGLE, size: 1, color: "000000" };
const tBorders = { top: tBorder, bottom: tBorder, left: tBorder, right: tBorder };
function tCell(text, width, opts = {}) {
  return new TableCell({
    borders: tBorders,
    width: { size: width, type: WidthType.DXA },
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    shading: opts.header ? { fill: "E8E8E8", type: ShadingType.CLEAR } : undefined,
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, bold: opts.header || false, size: 20, font: "Times New Roman" })],
    })],
  });
}

const contentWidth = 8666;

module.exports = new Document({
  styles: { default: { document: { run: { font: "Times New Roman", size: 24 } } } },
  numbering: {
    config: [{
      reference: "dv-paras",
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
      // The DV Act petition goes to a Judicial Magistrate, not a Family
      // Court — this reflects its quasi-criminal nature.
      centeredBold("IN THE COURT OF CHIEF JUDICIAL MAGISTRATE", 24),
      centeredBold("________ COURT (DISTRICT ________), DELHI", 22),
      spacer,
      centeredBold("COMPLAINT NO. ________ OF 20__", 24),
      centeredBold("U/S 12 OF THE PROTECTION OF WOMEN FROM", 22),
      centeredBold("DOMESTIC VIOLENCE ACT, 2005", 22),
      spacer,

      // ─── Parties ───
      // The aggrieved person — a widow in this template, illustrating
      // that the DV Act protects women even after the husband's death
      // when they live with hostile in-laws.
      legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      legalPara([new TextRun({ text: "Smt. X ________", bold: true })]),
      legalPara([new TextRun("W/o Late Sh. Y")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara([new TextRun({ text: "\u2026 COMPLAINANT", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      centeredBold("VERSUS"),
      spacer,

      // The respondent — a father-in-law, illustrating the post-2016
      // expansion of "respondent" to include relatives of the husband.
      legalPara([new TextRun({ text: "Sh. Z ________", bold: true })]),
      legalPara([new TextRun("S/o ________")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara([new TextRun({ text: "(Father-in-law of the Complainant)", italics: true })]),
      legalPara([new TextRun({ text: "\u2026 RESPONDENT", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      legalPara([new TextRun({ text: "Police Station: ________", bold: true })]),

      spacer,

      // ─── Title ───
      centeredBold("COMPLAINT UNDER SECTION 12 OF THE PROTECTION OF", 22),
      centeredBold("WOMEN FROM DOMESTIC VIOLENCE ACT, 2005", 22),
      spacer,

      legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Body ───

      // Para 1: Identifying the relationship and the alleged conduct.
      // Notice the language tracking the statute: "harassing and
      // torturing" by "illegal acts of violence."
      new Paragraph({ numbering: { reference: "dv-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Respondent is the father-in-law of the Complainant, who is harassing and torturing the Complainant by illegal acts of violence in order to throw her out of the matrimonial home."
        )] }),

      // Para 2: The marriage and the death of the husband.
      // Critically, this paragraph also lists the children, who are
      // affected parties even though they are not the applicants.
      new Paragraph({ numbering: { reference: "dv-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Complainant was married to Late Sh. Y on ________ as per Hindu rites and ceremonies, and thereafter started living in the matrimonial home as a joint family along with the Respondent. Out of the wedlock, the following two children were born, who are in the care and custody of the Complainant. The husband of the Complainant died on ________ due to illness."
        )] }),

      spacer,

      // The children-listing table — a documentary convention in DV Act
      // petitions because children's status affects monetary relief.
      new Table({
        width: { size: contentWidth, type: WidthType.DXA },
        columnWidths: [1000, 2500, 1500, 1166, 2500],
        rows: [
          new TableRow({
            children: [
              tCell("S. No.", 1000, { header: true }),
              tCell("Name of Children", 2500, { header: true }),
              tCell("Relation", 1500, { header: true }),
              tCell("Age", 1166, { header: true }),
              tCell("Status", 2500, { header: true }),
            ],
          }),
          new TableRow({
            children: [
              tCell("1", 1000),
              tCell("Master A ________", 2500),
              tCell("Son", 1500),
              tCell("________", 1166),
              tCell("Studying in Class ________", 2500),
            ],
          }),
          new TableRow({
            children: [
              tCell("2", 1000),
              tCell("Baby B ________", 2500),
              tCell("Daughter", 1500),
              tCell("________", 1166),
              tCell("Studying in Class ________", 2500),
            ],
          }),
        ],
      }),

      spacer,

      // Para 3: The deceased husband's business — establishes economic context
      new Paragraph({ numbering: { reference: "dv-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That before his death, Sh. Y was engaged in the manufacturing and trading of ________ and was operating a factory at rented accommodation at ________ as a sole proprietor under the name and style of M/s ________. He was also running a shop on the ground floor."
        )] }),

      // Para 4: The respondent's misappropriation
      new Paragraph({ numbering: { reference: "dv-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That after the death of the Complainant's husband on ________, the Respondent has misappropriated the machines, tools, raw materials etc. lying in the factory and has also trespassed into the shop belonging to the husband of the Complainant."
        )] }),

      // Para 5: Economic deprivation
      new Paragraph({ numbering: { reference: "dv-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the shop of the husband of the Complainant has been taken over by the Respondent, who does not allow the Complainant to enter the same and to run the same."
        )] }),

      // Para 6: Economic abuse — a recognised form of domestic violence
      // under the Act. Listing this distinctly is important because the
      // Act explicitly recognises economic abuse as one of the categories.
      new Paragraph({ numbering: { reference: "dv-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "That the Respondent is economically harassing the Complainant ", bold: true }),
          new TextRun("as he has taken over the shop and does not pay any amount to the Complainant, who has no money and no earnings at all and is dependent upon the shop of her husband for maintenance."),
        ] }),

      // Para 7: Verbal abuse and threats
      new Paragraph({ numbering: { reference: "dv-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Respondent maltreats the Complainant in one way or the other and abuses her in filthy language and wants her to vacate the second floor of the property so that he may trespass into the same."
        )] }),

      // Para 8: Threats of dispossession
      new Paragraph({ numbering: { reference: "dv-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Respondent threatens the Complainant with dire consequences if she does not vacate the second floor of the property."
        )] }),

      // Para 9: Need for the petition
      new Paragraph({ numbering: { reference: "dv-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That hence the Complainant is left with no other alternative but to file the instant complaint under Section 12 of the Protection of Women from Domestic Violence Act."
        )] }),

      // Para 10: The "domestic relationship" — a defined term and
      // jurisdictional fact under the Act
      new Paragraph({ numbering: { reference: "dv-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "That the Complainant has a domestic relationship with the Respondent ", bold: true, underline: {} }),
          new TextRun("as the Respondent was living with the Complainant before the death of her husband."),
        ] }),

      // Para 11: Effect on children
      new Paragraph({ numbering: { reference: "dv-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the deeds and misdeeds of the Respondent are affecting the health and safety of the Complainant as well as her two children, as after the death of her husband, the Respondent wants the children to stop going to school and be sent to an orphanage."
        )] }),

      // Para 12: Status as "aggrieved person"
      new Paragraph({ numbering: { reference: "dv-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the complaint under Section 12 of the Protection of Women from Domestic Violence Act, 2005 is being filed as such by the aggrieved person."
        )] }),

      spacer,

      // ─── THE MULTI-RELIEF PRAYER ───
      // This is the distinctive feature of the DV Act petition: instead
      // of asking for a single remedy, the prayer enumerates several
      // distinct categories of relief, each tied to a specific section.
      centeredBold("ORDERS PRAYED FOR:", 26),
      spacer,

      legalPara([new TextRun(
        "It is prayed that this Hon'ble Court may take cognizance of the complaint and pass any or all of the following orders, as deemed necessary in the circumstances of the case:"
      )]),

      spacer,

      // Relief I: Protection Order under Section 18
      legalPara([
        new TextRun({ text: "I. PROTECTION ORDER UNDER SECTION 18: ", bold: true, underline: {} }),
        new TextRun("Directing the Respondent to stay away from the Complainant and not to interfere in her possession of the ground floor and second floor of the property in any manner whatsoever."),
      ]),

      // Relief II: Residence Order under Section 19
      legalPara([
        new TextRun({ text: "II. RESIDENCE ORDER UNDER SECTION 19: ", bold: true, underline: {} }),
        new TextRun("Directing the Respondent to refrain from dispossessing the Complainant from the second and third floors of the property No. ________ (specifically shown in red in the site plan enclosed) and to refrain from interfering in the possession of the Complainant on the ground floor of the property, including the shop."),
      ]),

      // Relief III: Monetary Relief under Section 20 with sub-items
      legalPara([
        new TextRun({ text: "III. MONETARY RELIEF UNDER SECTION 20: ", bold: true, underline: {} }),
        new TextRun("Directing the Respondent to pay the following expenses as monetary relief:"),
      ]),
      legalPara([
        new TextRun({ text: "(a) ", bold: true }),
        new TextRun("Food, clothes, medications and other basic necessities — Rs. ________ p.m."),
      ], { indent: { left: 1080 } }),
      legalPara([
        new TextRun({ text: "(b) ", bold: true }),
        new TextRun("School fees and related expenses for the children — Rs. ________ p.m."),
      ], { indent: { left: 1080 } }),
      legalPara([
        new TextRun({ text: "(c) ", bold: true }),
        new TextRun("Total monthly maintenance — Rs. ________ p.m."),
      ], { indent: { left: 1080 } }),

      // Relief IV: Compensation Order under Section 22
      legalPara([
        new TextRun({ text: "IV. COMPENSATION UNDER SECTION 22: ", bold: true, underline: {} }),
        new TextRun("For causing mental agony and physical suffering to the Complainant, as deemed fit by this Hon'ble Court."),
      ]),

      spacer,

      // ─── Final Prayer ───
      centeredBold("PRAYER", 26),
      spacer,

      legalPara([new TextRun(
        "It is, therefore, most respectfully prayed that this Hon'ble Court may be pleased to grant the relief(s) claimed herein and pass such orders as this Hon'ble Court may deem fit and proper under the given facts and circumstances of the case, for protecting the Complainant from domestic violence."
      )]),

      spacer, spacer,

      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "COMPLAINANT", bold: true })] }),
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun("Through")] }),
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun("Advocate")] }),

      spacer,
      centeredBold("VERIFICATION:", 24), spacer,

      legalPara([new TextRun(
        "Verified at Delhi on this ________ day of ________ that the contents of paras 1 to __ of the above complaint are true and correct to my knowledge and nothing material has been concealed therefrom."
      )]),

      spacer,
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "COMPLAINANT", bold: true })] }),

      spacer, spacer,
      legalPara([
        new TextRun({ text: "[Note: ", bold: true, italics: true }),
        new TextRun({ text: "To be accompanied by an affidavit.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
