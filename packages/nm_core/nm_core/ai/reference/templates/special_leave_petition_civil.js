/**
 * SPECIAL LEAVE PETITION (CIVIL) UNDER ARTICLE 136
 * ──────────────────────────────────────────────────
 * Category : Constitutional Law — Supreme Court Appellate Practice
 * Court    : Supreme Court of India
 * Statute  : Article 136 of the Constitution of India read with
 *            Order XXI Rule 3(1)(a), Supreme Court Rules, 2013
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * The Special Leave Petition (SLP) is the APEX of Indian appellate
 * practice. Article 136 vests the Supreme Court with discretionary
 * power to grant "special leave" to appeal from ANY judgment, decree,
 * determination or order of any court or tribunal in India (other
 * than military tribunals).
 *
 * "Special leave" is significant because:
 *
 *   - It is NOT an appeal as of right. The SLP is essentially a
 *     petition seeking the Supreme Court's PERMISSION to appeal.
 *   - The Supreme Court hears it in two stages: first, on the
 *     question of whether to GRANT leave; and only if leave is
 *     granted, on the merits of the appeal itself.
 *   - The Supreme Court is highly selective. Most SLPs are
 *     dismissed at the leave stage without going into the merits.
 *
 * UNIQUE STRUCTURAL FEATURES:
 *
 *   1. POSITION-OF-PARTIES TABLE — The case title shows how each
 *      party was arranged in the High Court (the court below) and
 *      how they are arranged in the Supreme Court. This is necessary
 *      because parties may have switched roles between courts.
 *
 *   2. FORMAL ADDRESSING — The petition is addressed directly to
 *      "The Hon'ble Chief Justice of India and His Companion
 *      Justices" — reflecting the SC's collegium nature.
 *
 *   3. RULE-SPECIFIC DECLARATIONS — Para 3 (Declaration under
 *      Rule 3(2)) confirms no other SLP has been filed against
 *      the same order; Para 4 (Declaration under Rule 5) certifies
 *      the annexures are true copies. These declarations are
 *      mandatory under the Supreme Court Rules, 2013.
 *
 *   4. QUESTIONS OF LAW — The SLP must formulate the specific
 *      questions of law on which appeal is sought. Article 136 is
 *      not for re-arguing facts; it is for resolving important
 *      questions of law of general public importance.
 *
 *   5. GROUNDS in Roman numerals — distinct from the body paragraphs.
 *
 *   6. THE CEREMONIAL CLOSING — "AND FOR THIS ACT OF KINDNESS THE
 *      PETITIONER SHALL EVER REMAIN GRATEFUL AS IN DUTY BOUND" — a
 *      formal phrase used in Supreme Court petitions reflecting the
 *      court's discretionary nature.
 *
 *   7. DUAL DATES — "Date of drawn" (when the petition was prepared)
 *      and "Date of filing" (when it was actually filed in court).
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

// Table helpers for the position-of-parties table
const tBorder = { style: BorderStyle.SINGLE, size: 1, color: "000000" };
const tBorders = { top: tBorder, bottom: tBorder, left: tBorder, right: tBorder };
function tCell(text, width, opts = {}) {
  return new TableCell({
    borders: tBorders,
    width: { size: width, type: WidthType.DXA },
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    shading: opts.header ? { fill: "E8E8E8", type: ShadingType.CLEAR } : undefined,
    children: [new Paragraph({
      alignment: opts.align || AlignmentType.LEFT,
      children: [new TextRun({ text, bold: opts.header || opts.bold || false, size: 20, font: "Times New Roman" })],
    })],
  });
}

// Content width for A4 with our margins = 11906 - 1800 - 1440 = 8666 DXA
const contentWidth = 8666;

module.exports = new Document({
  styles: { default: { document: { run: { font: "Times New Roman", size: 24 } } } },
  numbering: {
    config: [
      { reference: "slp-paras", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      // Roman numerals for grounds — characteristic of SLP drafting
      { reference: "slp-grounds", levels: [{ level: 0, format: LevelFormat.UPPER_ROMAN, text: "%1)",
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
      // Note the formal three-line header that all SC petitions use
      centeredBold("IN THE SUPREME COURT OF INDIA", 28),
      centeredBold("CIVIL APPELLATE JURISDICTION", 22),
      centeredBold("ORDER XXI, RULE 3(1)(a), SUPREME COURT RULES, 2013", 20),
      centeredBold("(Under Article 136 of the Constitution of India)", 22),
      spacer,
      centeredBold("SPECIAL LEAVE PETITION (CIVIL) NO. ________ OF 20__", 24),
      spacer,

      // ─── Arising-from clause ───
      // SLPs always identify the lower court order being challenged
      legalPara([
        new TextRun({ text: "(Arising out of the Final Judgment and Order dated ________ passed in Writ Petition No. ________ of 20__ by the Hon'ble High Court of ________)", italics: true, size: 22 }),
      ], { alignment: AlignmentType.CENTER }),

      spacer,

      // ─── Position of Parties Table ───
      // This table is unique to Supreme Court appeals. It explicitly
      // shows how the parties were positioned in the lower court versus
      // how they are positioned now in the Supreme Court — because the
      // person who lost below now becomes the petitioner above.
      legalPara([new TextRun({ text: "Between:", bold: true })]),
      spacer,

      new Table({
        width: { size: contentWidth, type: WidthType.DXA },
        columnWidths: [4666, 2000, 2000],
        rows: [
          // Header row showing the two courts
          new TableRow({
            children: [
              tCell("", 4666, { header: true }),
              tCell("Position in the High Court", 2000, { header: true, align: AlignmentType.CENTER }),
              tCell("Position in this Court", 2000, { header: true, align: AlignmentType.CENTER }),
            ],
          }),
          // Petitioner row
          new TableRow({
            children: [
              tCell("Mr. ________ S/o ________, Aged: ________, Resident of ________", 4666),
              tCell("Petitioner", 2000, { align: AlignmentType.CENTER }),
              tCell("Petitioner", 2000, { align: AlignmentType.CENTER, bold: true }),
            ],
          }),
        ],
      }),

      spacer,
      centeredBold("AND", 22),
      spacer,

      new Table({
        width: { size: contentWidth, type: WidthType.DXA },
        columnWidths: [4666, 2000, 2000],
        rows: [
          // Respondents
          new TableRow({
            children: [
              tCell("1. ________ S/o ________, R/o ________", 4666),
              tCell("Contesting Respondent", 2000, { align: AlignmentType.CENTER }),
              tCell("Contesting Respondent", 2000, { align: AlignmentType.CENTER }),
            ],
          }),
          new TableRow({
            children: [
              tCell("2. ________ S/o ________, R/o ________", 4666),
              tCell("Contesting Respondent", 2000, { align: AlignmentType.CENTER }),
              tCell("Contesting Respondent", 2000, { align: AlignmentType.CENTER }),
            ],
          }),
        ],
      }),

      spacer,

      // ─── Title ───
      centeredBold("SPECIAL LEAVE PETITION UNDER ARTICLE 136 OF", 22),
      centeredBold("THE CONSTITUTION OF INDIA", 22),
      spacer,

      // ─── Formal Addressing ───
      // The SC petition is addressed to the Chief Justice as the
      // head of the Court — this reflects the collegium structure
      // of the Supreme Court (the CJ heading the bench).
      legalPara([new TextRun({ text: "To,", bold: true })]),
      legalPara([new TextRun("The Hon'ble Chief Justice of India")]),
      legalPara([new TextRun("And His Companion Justices of the Supreme Court of India")]),

      spacer,

      legalPara([
        new TextRun({ text: "The humble petition of the Petitioner above named most respectfully showeth:", italics: true }),
      ]),

      spacer,

      // ─── Body ───
      // Para 1: Identifying the impugned order
      new Paragraph({ numbering: { reference: "slp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the present petition has been filed seeking special leave to appeal from the final judgment and order dated ________ of the Hon'ble High Court of ________ in Writ Petition No. ________ of 20__ titled \"________ versus ________\" which was dismissed by the Hon'ble High Court."
        )] }),

      // Para 2: Questions of Law — a critical SLP element
      // Article 136 is about questions of law, not facts.
      new Paragraph({ numbering: { reference: "slp-paras", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "QUESTIONS OF LAW:", bold: true, underline: {} })] }),

      legalPara([
        new TextRun("That the following questions of law arise for consideration herein:"),
      ]),

      legalPara([
        new TextRun({ text: "(a) ", bold: true }),
        new TextRun("Whether, in the facts and circumstances of the case, the Hon'ble High Court was justified in dismissing the Writ Petition?"),
      ], { indent: { left: 720 } }),

      legalPara([
        new TextRun({ text: "(b) ", bold: true }),
        new TextRun("Whether the impugned judgment is contrary to the settled law laid down by this Hon'ble Court in ________?"),
      ], { indent: { left: 720 } }),

      spacer,

      // Para 3: Declaration under Rule 3(2) — mandatory
      new Paragraph({ numbering: { reference: "slp-paras", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "Declaration in terms of Rule 3(2):", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "That the Petitioner states that no other petition for special leave to appeal has been filed by him against the judgment and order impugned herein."
      )]),

      // Para 4: Declaration under Rule 5 — mandatory
      new Paragraph({ numbering: { reference: "slp-paras", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "Declaration in terms of Rule 5:", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Petitioner states that the Annexures filed along with the Special Leave Petition are true copies of the pleadings and documents which formed part of the records of the case in the Court below against whose order the leave to appeal is sought for in this petition."
      )]),

      // Para 5: Grounds — using Roman numerals as is conventional in SLPs
      new Paragraph({ numbering: { reference: "slp-paras", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "GROUNDS:", bold: true, underline: {} })] }),

      legalPara([new TextRun("That the special leave to appeal is sought on the following grounds:")]),

      new Paragraph({ numbering: { reference: "slp-grounds", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("Because the Hon'ble High Court has erred in passing the impugned judgment.")] }),

      new Paragraph({ numbering: { reference: "slp-grounds", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("Because the Hon'ble High Court has failed to appreciate the legal position correctly and has thereby caused grave injustice to the Petitioner.")] }),

      new Paragraph({ numbering: { reference: "slp-grounds", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("Because the impugned judgment suffers from error apparent on the face of the record.")] }),

      new Paragraph({ numbering: { reference: "slp-grounds", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("Because the reasoning of the Hon'ble High Court is unsustainable in law.")] }),

      new Paragraph({ numbering: { reference: "slp-grounds", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("Because the Hon'ble High Court has not taken into consideration all the relevant circumstances of the case while deciding the matter.")] }),

      new Paragraph({ numbering: { reference: "slp-grounds", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("Because the impugned judgment is contrary to law and good conscience.")] }),

      new Paragraph({ numbering: { reference: "slp-grounds", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("The Petitioner craves leave of this Hon'ble Court to add, amend and alter the grounds raised in this petition.")] }),

      // Para 6: Grounds for interim relief
      new Paragraph({ numbering: { reference: "slp-paras", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "GROUNDS FOR INTERIM RELIEF:", bold: true, underline: {} })] }),

      legalPara([
        new TextRun("A. That the Petitioner apprehends that the Respondents may sell, alienate or part with the property illegally during the pendency of this petition."),
      ]),

      spacer,

      // ─── Main Prayer ───
      centeredBold("MAIN PRAYER:", 26),
      spacer,

      legalPara([new TextRun("Wherefore, it is respectfully prayed that this Hon'ble Court may kindly be pleased to:")]),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("Grant Special Leave to Appeal from the final judgment and order dated ________ of the Hon'ble High Court of ________ in Writ Petition No. ________ of 20__; and")] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("Be pleased further to pass such other order or orders as may be deemed fit and proper in the facts, reasons and other attending circumstances of the case.")] }),

      spacer,

      // ─── Prayer for Interim Relief ───
      centeredBold("PRAYER FOR INTERIM RELIEF:", 24),
      spacer,

      legalPara([
        new TextRun({ text: "(a) ", bold: true }),
        new TextRun("It is prayed that interim directions may be issued to the Respondents directing them not to sell, alienate or part with the property bearing No. ________ situated at ________."),
      ]),

      legalPara([
        new TextRun({ text: "(b) ", bold: true }),
        new TextRun("Be pleased further to pass such other order or orders as may be deemed fit and proper in the facts, reasons and other attending circumstances of the case."),
      ]),

      spacer,

      // ─── The Ceremonial Closing ───
      // This formal phrase is unique to Supreme Court petitions
      centeredBold("AND FOR THIS ACT OF KINDNESS, THE PETITIONER", 22),
      centeredBold("SHALL EVER REMAIN GRATEFUL AS IN DUTY BOUND.", 22),

      spacer, spacer,

      // ─── Filing Details ───
      // SLPs use a unique "Drawn and Filed by" format with dual dates
      legalPara([new TextRun({ text: "Drawn and Filed by:", bold: true })]),
      spacer,

      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("New Delhi"), new TextRun({ text: "\tAdvocate for the Petitioner", bold: true })] }),
      legalPara([new TextRun("Date of drawn: ________")]),
      legalPara([new TextRun("Date of filing: ________")]),

      spacer,

      legalPara([
        new TextRun({ text: "[NOTE: ", bold: true, italics: true }),
        new TextRun({ text: "To be supported by an affidavit]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
