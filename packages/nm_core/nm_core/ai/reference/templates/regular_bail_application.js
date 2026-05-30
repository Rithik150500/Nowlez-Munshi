/**
 * APPLICATION FOR GRANT OF REGULAR BAIL
 * ───────────────────────────────────────
 * Category : Criminal Law Pleading
 * Court    : Chief Judicial Magistrate, Delhi
 * Statute  : Section 480 of the Bharatiya Nagarik Suraksha Sanhita, 2023
 *            (formerly Section 439 of CrPC, 1973)
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * REGULAR bail vs ANTICIPATORY bail — a critical distinction:
 *
 *   ANTICIPATORY BAIL (Template 06):
 *     - Filed BEFORE arrest (the person is free)
 *     - Filed before the Sessions Judge
 *     - Prayer: "release in the EVENT of arrest" (conditional)
 *     - Signed by the applicant freely
 *
 *   REGULAR BAIL (this template):
 *     - Filed AFTER arrest (the person is IN JUDICIAL CUSTODY)
 *     - Filed before the CJM / Sessions Judge
 *     - Prayer: "release on bail DURING PENDENCY" (unconditional)
 *     - Signed inside jail, attested by Jail Authorities
 *     - Requires affidavit of "Pairokar" (a surety person outside jail)
 *     - Vakalatnama (authorization to advocate) also attested by jail
 *
 * The body paragraphs follow the same arc as anticipatory bail but
 * emphasize different factors: length of custody, stage of investigation,
 * and the "already arrested" circumstance.
 */

const {
  Document, Paragraph, TextRun,
  AlignmentType, TabStopType, TabStopPosition,
  Footer, PageNumber, LevelFormat, BorderStyle
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

// ───── Document ─────

module.exports = new Document({
  styles: {
    default: {
      document: { run: { font: "Times New Roman", size: 24 } },
    },
  },

  numbering: {
    config: [{
      reference: "bail-paras",
      levels: [{
        level: 0, format: LevelFormat.DECIMAL, text: "%1.",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } },
      }],
    }],
  },

  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1440, bottom: 1440, left: 1800, right: 1440 },
      },
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ children: ["Page ", PageNumber.CURRENT], size: 18, font: "Times New Roman" })],
        })],
      }),
    },
    children: [
      // ─── Court Header ───
      centeredBold("IN THE COURT OF CHIEF JUDICIAL MAGISTRATE", 24),
      centeredBold("(DISTRICT ________), ________ COURT, DELHI", 22),
      spacer,
      centeredBold("BAIL APPLICATION NO. ________ OF 20__", 24),
      spacer,

      // ─── Parties ───
      legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      legalPara([new TextRun({ text: "X ________", bold: true })]),
      legalPara([new TextRun("S/o ________")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara(
        [new TextRun({ text: "\u2026 APPLICANT", bold: true })],
        { alignment: AlignmentType.RIGHT }
      ),

      centeredBold("VERSUS"),
      spacer,

      legalPara([new TextRun({ text: "STATE", bold: true })]),
      legalPara(
        [new TextRun({ text: "\u2026 RESPONDENT / COMPLAINANT", bold: true })],
        { alignment: AlignmentType.RIGHT }
      ),

      spacer,

      // ─── FIR Details ───
      new Paragraph({
        spacing: { after: 60 },
        border: { top: { style: BorderStyle.SINGLE, size: 2, color: "333333", space: 4 } },
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "FIR NO. ________ OF 20__", bold: true, size: 22 })],
      }),
      new Paragraph({
        spacing: { after: 60 },
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "UNDER SECTION ________ BNS", bold: true, size: 22 })],
      }),
      new Paragraph({
        spacing: { after: 120 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: "333333", space: 4 } },
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "POLICE STATION: ________", bold: true, size: 22 })],
      }),

      spacer,

      // ─── Title ───
      centeredBold("APPLICATION FOR GRANT OF BAIL UNDER SECTION 480", 22),
      centeredBold("OF THE BHARATIYA NAGARIK SURAKSHA SANHITA, 2023", 22),
      spacer,

      legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Body ───
      // Key difference from anticipatory bail: the very first paragraph
      // states that the accused is ALREADY arrested and in custody.

      new Paragraph({
        numbering: { reference: "bail-paras", level: 0 },
        spacing: { after: 120, line: 360 },
        alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "That the Accused above named was arrested by the police on ________ and is in judicial custody since then.", bold: true }),
          new TextRun(
            " It is alleged that on ________, the Accused was ________ (briefly state the prosecution's allegations)."
          ),
        ],
      }),

      new Paragraph({
        numbering: { reference: "bail-paras", level: 0 },
        spacing: { after: 120, line: 360 },
        alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That the Accused has been falsely implicated in the instant case and he has nothing to do with the alleged offence."
          ),
        ],
      }),

      new Paragraph({
        numbering: { reference: "bail-paras", level: 0 },
        spacing: { after: 120, line: 360 },
        alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That nothing was recovered from the possession of the Accused or at his instance and the so-called case property has been planted upon the Accused."
          ),
        ],
      }),

      new Paragraph({
        numbering: { reference: "bail-paras", level: 0 },
        spacing: { after: 120, line: 360 },
        alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That the Accused is a law-abiding citizen and belongs to a very respectable family. He has never indulged in any illegal activities and commands respect and admiration in his locality."
          ),
        ],
      }),

      new Paragraph({
        numbering: { reference: "bail-paras", level: 0 },
        spacing: { after: 120, line: 360 },
        alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun("That the brief facts of the case are as follows: ________"),
        ],
      }),

      new Paragraph({
        numbering: { reference: "bail-paras", level: 0 },
        spacing: { after: 120, line: 360 },
        alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That the Accused is a permanent resident of Delhi and there are no chances of his absconding in case he is released on bail."
          ),
        ],
      }),

      new Paragraph({
        numbering: { reference: "bail-paras", level: 0 },
        spacing: { after: 120, line: 360 },
        alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That there is no chance of the Accused absconding or tampering with the prosecution evidence in the event of release on bail."
          ),
        ],
      }),

      new Paragraph({
        numbering: { reference: "bail-paras", level: 0 },
        spacing: { after: 120, line: 360 },
        alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun("That the Accused undertakes to join the investigation as and when directed to do so."),
        ],
      }),

      new Paragraph({
        numbering: { reference: "bail-paras", level: 0 },
        spacing: { after: 120, line: 360 },
        alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That the Accused is not a previous convict and has not been involved in any case of this nature except the present case."
          ),
        ],
      }),

      new Paragraph({
        numbering: { reference: "bail-paras", level: 0 },
        spacing: { after: 120, line: 360 },
        alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun("That the Accused from all accounts is an innocent person."),
        ],
      }),

      spacer,

      // ─── Prayer ───
      // Note the wording: "during the pendency of this case" —
      // this is unconditional (contrast with anticipatory bail's
      // "in the event of his arrest").
      centeredBold("PRAYER:", 26),
      spacer,

      legalPara([
        new TextRun("It is, therefore, respectfully prayed that the Accused may kindly be released on bail "),
        new TextRun({ text: "during the pendency of this case.", bold: true, underline: {} }),
      ]),

      spacer,
      spacer,

      // ─── Signature Block ───
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [
          new TextRun("Place: ________"),
          new TextRun("\tApplicant"),
        ],
      }),
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [
          new TextRun("Date: ________"),
          new TextRun("\tThrough"),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun("Advocate")],
      }),

      spacer,
      spacer,

      // ─── Special Notes for Regular Bail ───
      // These notes highlight the procedural differences from
      // anticipatory bail — the jail attestation requirement.
      legalPara([
        new TextRun({ text: "Notes:", bold: true, underline: {} }),
      ]),
      legalPara([
        new TextRun({ text: "1. ", bold: true }),
        new TextRun({ text: "To be supported by affidavit of Pairokar (surety person) and Vakalatnama duly attested by Jail Authorities.", italics: true }),
      ]),
      legalPara([
        new TextRun({ text: "2. ", bold: true }),
        new TextRun({ text: "The Vakalatnama must be signed by the Accused inside the jail premises and authenticated by the Jail Superintendent.", italics: true }),
      ]),
    ],
  }],
});
