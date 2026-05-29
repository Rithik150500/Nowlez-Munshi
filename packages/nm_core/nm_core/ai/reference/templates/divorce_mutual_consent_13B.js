/**
 * PETITION FOR DIVORCE BY MUTUAL CONSENT
 * ─────────────────────────────────────────
 * Category : Matrimonial Pleading
 * Court    : Principal Judge, Family Court, Delhi
 * Statute  : Section 13B(1), Hindu Marriage Act, 1955
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * This petition is STRUCTURALLY UNIQUE among all Indian pleadings:
 *
 *   1. BOTH spouses are PETITIONERS (not adversaries). There is no
 *      "Respondent." The case title reads "Petitioner No. 1 AND
 *      Petitioner No. 2" — not "Petitioner VERSUS Respondent."
 *
 *   2. It requires DUAL signatures (both petitioners sign everywhere)
 *      and SEPARATE affidavits from each spouse.
 *
 *   3. It includes a mandatory STATUS TABLE showing each spouse's
 *      status, age, and residence both before marriage and at the
 *      time of filing — this is required by Rule 5 of the HMA Rules.
 *
 *   4. Under Section 13B, the petition must establish:
 *      (a) Living separately for at least one year
 *      (b) Unable to live together
 *      (c) Mutual agreement to dissolve marriage
 *      (d) Consent not obtained by force/fraud/undue influence
 *
 *   5. After filing, there is a mandatory 6-month "cooling off" period
 *      (which the Supreme Court in Amardeep Singh v. Harveen Kaur, 2017
 *      held can be waived in appropriate cases).
 */

const {
  Document, Paragraph, TextRun,
  Table, TableRow, TableCell,
  AlignmentType, TabStopType, TabStopPosition,
  Footer, PageNumber, LevelFormat,
  BorderStyle, WidthType, ShadingType
} = require("docx");

// ───── Helpers ─────

function legalPara(children, opts = {}) {
  return new Paragraph({
    spacing: { after: 120, line: 360 },
    alignment: AlignmentType.JUSTIFIED,
    ...opts,
    children,
  });
}

function centeredBold(text, size = 24) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [new TextRun({ text, bold: true, size, font: "Times New Roman" })],
  });
}

const spacer = new Paragraph({ spacing: { after: 120 }, children: [] });

// ── Table helpers for the mandatory status table ──
const tBorder = { style: BorderStyle.SINGLE, size: 1, color: "000000" };
const tBorders = { top: tBorder, bottom: tBorder, left: tBorder, right: tBorder };
const cellMargins = { top: 60, bottom: 60, left: 100, right: 100 };

function tCell(text, width, opts = {}) {
  return new TableCell({
    borders: tBorders,
    width: { size: width, type: WidthType.DXA },
    margins: cellMargins,
    shading: opts.header ? { fill: "E8E8E8", type: ShadingType.CLEAR } : undefined,
    children: [
      new Paragraph({
        alignment: opts.align || AlignmentType.CENTER,
        children: [new TextRun({
          text,
          bold: opts.header || false,
          size: 20,
          font: "Times New Roman",
        })],
      }),
    ],
  });
}

// ───── Document ─────

// Content width for A4 with 1.25" left + 1" right margins = 11906 - 1800 - 1440 = 8666 DXA
const contentWidth = 8666;

module.exports = new Document({
  styles: {
    default: {
      document: { run: { font: "Times New Roman", size: 24 } },
    },
  },

  numbering: {
    config: [
      {
        reference: "petition-paras",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },

  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, bottom: 1440, left: 1800, right: 1440 },
        },
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ children: ["Page ", PageNumber.CURRENT], size: 18, font: "Times New Roman" }),
              ],
            }),
          ],
        }),
      },
      children: [
        // ─── Court Header ───
        centeredBold("IN THE COURT OF PRINCIPAL JUDGE, FAMILY COURT", 24),
        centeredBold("(DISTRICT ________), ________ COURT, DELHI", 22),
        spacer,
        centeredBold("HMA PETITION NO. ________ OF 20__", 24),
        spacer,

        // ─── Parties Block ───
        // NOTE: Unlike all other petitions, there is NO "VERSUS" here.
        // Both spouses appear as co-petitioners separated by "AND".
        legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
          { alignment: AlignmentType.CENTER }),

        legalPara([new TextRun({ text: "X ________", bold: true })]),
        legalPara([new TextRun("S/o ________")]),
        legalPara([new TextRun("R/o ________")]),
        legalPara(
          [new TextRun({ text: "\u2026 PETITIONER NO. 1", bold: true })],
          { alignment: AlignmentType.RIGHT }
        ),

        spacer,

        // "AND" — not "VERSUS"
        centeredBold("AND", 26),

        spacer,

        legalPara([new TextRun({ text: "Y ________", bold: true })]),
        legalPara([new TextRun("W/o ________")]),
        legalPara([new TextRun("R/o ________")]),
        legalPara(
          [new TextRun({ text: "\u2026 PETITIONER NO. 2", bold: true })],
          { alignment: AlignmentType.RIGHT }
        ),

        spacer,

        // ─── Title ───
        centeredBold("PETITION FOR DISSOLUTION OF MARRIAGE BY A DECREE OF", 22),
        centeredBold("DIVORCE BY MUTUAL CONSENT UNDER SECTION 13B(1)", 22),
        centeredBold("OF THE HINDU MARRIAGE ACT, 1955", 22),
        spacer,

        legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
          { alignment: AlignmentType.CENTER }),
        spacer,

        // ─── Body ───

        // Para 1: Marriage details — this establishes the legal relationship
        new Paragraph({
          numbering: { reference: "petition-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That a marriage was solemnized between the parties according to Hindu rites and ceremonies on ________ (date) at ________ (place). A certified copy of the relevant extract from the Hindu Marriage Register is filed herewith. An affidavit, duly attested, stating these facts is filed herewith."
            ),
          ],
        }),

        // Para 2: Status Table — a unique feature of matrimonial petitions
        // required by Rule 5 of the HMA Rules. This shows the court that
        // both parties are Hindu (jurisdictional requirement for HMA).
        new Paragraph({
          numbering: { reference: "petition-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the status and place of residence of the parties to the marriage before the marriage and at the time of filing the petition are as follows:"
            ),
          ],
        }),

        spacer,

        // The mandatory status table — demonstrates a table inside a pleading.
        // Column widths: timing(1800) + husband status(1200) + husband age(800)
        // + husband place(1700) + wife status(1200) + wife age(800) + wife place(966) = 8666
        new Table({
          width: { size: contentWidth, type: WidthType.DXA },
          columnWidths: [1800, 1200, 800, 1700, 1200, 800, 1166],
          rows: [
            // Header row 1: "Husband" and "Wife" spanning 3 columns each
            new TableRow({
              children: [
                tCell("", 1800, { header: true }),
                // "Husband" header spanning 3 columns
                new TableCell({
                  borders: tBorders, width: { size: 3700, type: WidthType.DXA },
                  margins: cellMargins, columnSpan: 3,
                  shading: { fill: "E8E8E8", type: ShadingType.CLEAR },
                  children: [new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: "Husband", bold: true, size: 20, font: "Times New Roman" })],
                  })],
                }),
                // "Wife" header spanning 3 columns
                new TableCell({
                  borders: tBorders, width: { size: 3166, type: WidthType.DXA },
                  margins: cellMargins, columnSpan: 3,
                  shading: { fill: "E8E8E8", type: ShadingType.CLEAR },
                  children: [new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: "Wife", bold: true, size: 20, font: "Times New Roman" })],
                  })],
                }),
              ],
            }),
            // Header row 2: sub-columns
            new TableRow({
              children: [
                tCell("", 1800, { header: true }),
                tCell("Status", 1200, { header: true }),
                tCell("Age", 800, { header: true }),
                tCell("Place of Residence", 1700, { header: true }),
                tCell("Status", 1200, { header: true }),
                tCell("Age", 800, { header: true }),
                tCell("Place of Residence", 1166, { header: true }),
              ],
            }),
            // Data row 1: Before marriage
            new TableRow({
              children: [
                tCell("Before marriage", 1800),
                tCell("", 1200), tCell("", 800), tCell("", 1700),
                tCell("", 1200), tCell("", 800), tCell("", 1166),
              ],
            }),
            // Data row 2: At the time of filing
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

        // Para 3: Children details
        new Paragraph({
          numbering: { reference: "petition-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "(State the place where the parties last resided together and the names of the children, if any, of the marriage, together with their sex, dates of birth or ages.)"
            ),
          ],
        }),

        // Para 4: Living separately — the CORE requirement under Section 13B
        new Paragraph({
          numbering: { reference: "petition-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the parties to the petition have been living separately since ________ and have not been able to live together since then. "
            ),
            new TextRun({ text: "(In a few paragraphs, mention the reasons for not being able to live together. In case there is a settlement between parties, the same can also be mentioned.)", italics: true }),
          ],
        }),

        // Para 5: Mutual consent — the defining element of Section 13B
        new Paragraph({
          numbering: { reference: "petition-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({ text: "That the parties to the petition have mutually agreed that their marriage should be dissolved.", bold: true }),
          ],
        }),

        // Para 6-9: Statutory safeguards
        new Paragraph({
          numbering: { reference: "petition-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun("That the mutual consent has not been obtained by force, fraud or undue influence."),
          ],
        }),

        new Paragraph({
          numbering: { reference: "petition-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun("That the petition is not presented in collusion."),
          ],
        }),

        new Paragraph({
          numbering: { reference: "petition-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun("That there has not been any unnecessary or improper delay in instituting the proceedings."),
          ],
        }),

        new Paragraph({
          numbering: { reference: "petition-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun("That there is no other legal ground why relief should not be granted."),
          ],
        }),

        // Para 10-11: Jurisdiction and court fee
        new Paragraph({
          numbering: { reference: "petition-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun("That the Petitioners submit that this Court has jurisdiction to entertain this petition. "),
            new TextRun({ text: "(Mention how the court has jurisdiction to entertain the petition.)", italics: true }),
          ],
        }),

        new Paragraph({
          numbering: { reference: "petition-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun("That the requisite court fee of Rs. ________ has been affixed on this petition."),
          ],
        }),

        spacer,

        // ─── Prayer ───
        centeredBold("PRAYER:", 26),
        spacer,

        legalPara([
          new TextRun(
            "In view of the above facts and circumstances, it is, therefore, most respectfully and humbly prayed that this Hon'ble Court may be pleased to grant a decree of divorce on mutual consent thereby dissolving the marriage between Petitioner No. 1 and Petitioner No. 2 on the ground of mutual consent."
          ),
        ]),

        spacer,
        spacer,

        // ─── DUAL Signature Block ───
        // Both petitioners must sign — this is distinctive to mutual consent petitions.
        new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({ text: "PETITIONER NO. 1", bold: true }),
            new TextRun({ text: "\tPETITIONER NO. 2", bold: true }),
          ],
        }),

        spacer,

        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "THROUGH", bold: true })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun("COUNSEL")],
        }),

        spacer,

        // ─── Verification ───
        // Also requires DUAL verification by both petitioners.
        centeredBold("VERIFICATION:", 24),
        spacer,

        legalPara([
          new TextRun(
            "The above-named Petitioners state on solemn affirmation that paras 1 to __ of the petition are true to the Petitioners' knowledge and paras __ to __ are true to the Petitioners' information received and believed to be true by them."
          ),
        ]),

        legalPara([new TextRun("Verified at ________ (Place)")]),
        legalPara([new TextRun("Dated: ________")]),

        spacer,

        new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({ text: "PETITIONER NO. 1", bold: true }),
            new TextRun({ text: "\tPETITIONER NO. 2", bold: true }),
          ],
        }),

        spacer,
        spacer,

        legalPara(
          [
            new TextRun({ text: "[Note: ", bold: true, italics: true }),
            new TextRun({ text: "Separate affidavits of Petitioner No. 1 and Petitioner No. 2 are to be appended]", italics: true }),
          ],
          { alignment: AlignmentType.CENTER }
        ),
      ],
    },
  ],
});
