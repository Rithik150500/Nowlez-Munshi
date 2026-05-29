/**
 * GENERAL POWER OF ATTORNEY (GPA)
 * ─────────────────────────────────
 * Category : Conveyancing — Deed Poll (Unilateral)
 * Statute  : Power of Attorney Act, 1882
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * A Power of Attorney is a document of AGENCY — one person (the Principal /
 * Executant) authorizes another person (the Attorney) to act in their name.
 *
 * Two types exist:
 *   - GENERAL Power of Attorney (GPA) — covers broad, multiple subjects
 *   - SPECIAL Power of Attorney (SPA) — covers one specific transaction
 *
 * This template is a GPA, typically used by companies authorizing a director
 * or officer to handle all legal proceedings. Being a Deed Poll, it:
 *   - Is UNILATERAL (executed by the Principal alone)
 *   - Opens with "KNOW ALL MEN BY THESE PRESENTS" (the classic Deed Poll form)
 *   - Uses FIRST PERSON for the grant clauses
 *   - Must be stamped (Stamp Act) but registration is optional
 *
 * The witnessing clause "NOW THIS GENERAL POWER OF ATTORNEY WITNESSETH"
 * transitions from the recitals to the operative clauses listing powers.
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

function hrule() {
  return new Paragraph({
    spacing: { after: 200 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: "333333", space: 1 },
    },
    children: [],
  });
}

// ───── Document ─────

module.exports = new Document({
  styles: {
    default: {
      document: { run: { font: "Times New Roman", size: 24 } },
    },
  },

  numbering: {
    config: [
      {
        // Roman numerals for the enumerated powers — a common convention
        // in Indian power of attorney documents
        reference: "gpa-powers",
        levels: [{
          level: 0, format: LevelFormat.LOWER_ROMAN, text: "(%1)",
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
          size: { width: 11906, height: 16838 }, // A4
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
        // ─── Title ───
        centeredBold("GENERAL POWER OF ATTORNEY", 32),
        spacer,
        hrule(),

        // ─── Opening Declaration — "KNOW ALL MEN BY THESE PRESENTS" ───
        // This is the CLASSIC Deed Poll opening. In Indian conveyancing,
        // it declares the instrument's purpose to the world at large.
        // Bilateral deeds (like sale agreements) use "THIS DEED IS MADE..."
        // but Deed Polls (unilateral) use "KNOW ALL MEN..."

        legalPara([
          new TextRun({ text: "KNOW ALL MEN BY THESE PRESENTS ", bold: true, size: 26 }),
          new TextRun("THAT THIS "),
          new TextRun({ text: "GENERAL POWER OF ATTORNEY ", bold: true }),
          new TextRun("is executed at "),
          new TextRun({ text: "New Delhi ", bold: true }),
          new TextRun("on this "),
          new TextRun({ text: "________ ", bold: true }),
          new TextRun("day of "),
          new TextRun({ text: "________ 20__", bold: true }),
          new TextRun(" by:"),
        ]),

        spacer,

        // ─── Executant (Principal) ───
        // The Executant is the person GRANTING the power. In this template,
        // it is a company acting through its Managing Director.
        legalPara([
          new TextRun({ text: "M/s. TINRIN", bold: true }),
          new TextRun(
            ", a company incorporated under the Companies Act, having its registered office at E-1 WESTEND, New Delhi, through its Managing Director "
          ),
          new TextRun({ text: "Mr. X ________", bold: true }),
          new TextRun({ text: " (hereinafter referred to as the ", italics: true }),
          new TextRun({ text: "'EXECUTANT'", bold: true, italics: true }),
          new TextRun({ text: ")", italics: true }),
        ]),

        spacer,

        // ─── Appointment Clause ───
        // The formal words of appointment are critical for validity:
        // "DO HEREBY APPOINT, NOMINATE, CONSTITUTE AND AUTHORISE"
        legalPara([
          new TextRun("DO HEREBY "),
          new TextRun({ text: "APPOINT, NOMINATE, CONSTITUTE AND AUTHORISE", bold: true }),
        ]),

        spacer,

        // ─── Attorney (Agent) ───
        legalPara([
          new TextRun({ text: "Sh. Y ________", bold: true }),
          new TextRun(", ________ (details), Executive Director of M/s TINRIN"),
          new TextRun({ text: " (hereinafter referred to as the ", italics: true }),
          new TextRun({ text: "'ATTORNEY'", bold: true, italics: true }),
          new TextRun({ text: ")", italics: true }),
        ]),

        legalPara([
          new TextRun({ text: "AS MY TRUE AND LAWFUL ATTORNEY TO MANAGE, CONTROL, LOOK AFTER / SUPERVISE, AND PERFORM ALL LEGAL ACTS MENTIONED HEREUNDER.", bold: true }),
        ]),

        spacer,

        // ─── Recitals (WHEREAS clauses) ───
        // Brief background: why this GPA is being made
        legalPara([
          new TextRun({ text: "WHEREAS ", bold: true }),
          new TextRun("the Executant is the Managing Director of M/s TINRIN and is engaged in the business of ________."),
        ]),

        legalPara([
          new TextRun({ text: "AND WHEREAS ", bold: true }),
          new TextRun(
            "the Executant, due to pressing business commitments, finds it necessary to appoint an Attorney to represent the company in all legal, judicial, and quasi-judicial proceedings and to manage the affairs of the company as detailed herein."
          ),
        ]),

        spacer,

        // ─── Witnessing Clause (Testatum) ───
        // This clause transitions from recitals to the operative grant of powers.
        centeredBold("NOW THIS GENERAL POWER OF ATTORNEY WITNESSETH AS UNDER:", 22),

        spacer,

        // ─── Enumerated Powers ───
        // Each power is carefully delineated so there is no ambiguity
        // about the scope of the Attorney's authority.

        new Paragraph({
          numbering: { reference: "gpa-powers", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "To institute, commence and conduct any action, suit or other legal proceedings before any Court, Arbitrator, Quasi-judicial or statutory authorities, Offices, Tribunals, Labour Courts, Conciliation Officers, Land Acquisition Officers, etc. on behalf of the company for claiming any right, relief, recovery, title, interest, property or in respect of any matter connected with or arising out of the Company's business and, subject to the aforesaid, to settle, adjust, compromise or submit to Arbitration any such actions, suits or proceedings."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "gpa-powers", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "To defend all actions, suits, proceedings, applications, petitions, appeals, revisions, reviews, arbitrations, conciliations, taxation and labour matters and other disputes that are now pending or may hereafter be brought or made or instituted in any Court or office or Tribunal, Arbitrator, Conciliation Officer, or any other Judicial or Quasi-judicial authorities in the name of the company."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "gpa-powers", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "To appear and represent the Company in any Court of Justice or Tribunal whatsoever and, for the purpose aforesaid or any of them, to sign and verify plaints, written statements, applications and swear affidavits and to sign petitions and other necessary documents including Vakalatnama and to appoint any Solicitor, Advocate, Pleader or other Legal Advisor with the necessary power, and such again at pleasure, to revoke and appoint others in their place."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "gpa-powers", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "To continue and conduct or defend any appeal, review, revision, arbitration in any Court or Tribunal or office against any order, judgment or decree made in suits, actions, proceedings, applications, etc."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "gpa-powers", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "Generally, for and in the name and as the act and deed of the Company, to make, execute and do all and every such further and other acts, deeds, matters and things as shall be fit, requisite and necessary in and about the premises and for all or any of the purposes aforesaid and as the Company could do if acting in the premises."
            ),
          ],
        }),

        spacer,

        // ─── Ratification Clause ───
        // The Executant agrees to ratify anything the Attorney lawfully does
        // under this power — this is essential for third-party reliance.
        legalPara([
          new TextRun(
            "And I, the said Managing Director of the Company and also for the said Company, hereby agree to ratify and confirm whatsoever the said Attorney shall lawfully do or cause to be done in or about the premises by virtue of these presents."
          ),
        ]),

        spacer,
        hrule(),

        // ─── Testimonium ───
        legalPara([
          new TextRun({ text: "IN WITNESS WHEREOF ", bold: true }),
          new TextRun(
            "I have hereunto signed this document on the date and place first above written in the presence of the following witnesses."
          ),
        ]),

        spacer,
        spacer,

        // ─── Signatures ───
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { before: 400 },
          children: [new TextRun("____________________")],
        }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "EXECUTANT", bold: true })],
        }),

        spacer,
        spacer,

        // Witnesses
        legalPara([new TextRun({ text: "WITNESSES:", bold: true, underline: {} })]),
        spacer,
        legalPara([new TextRun("(1) Name: ________")]),
        legalPara([new TextRun("    Address: ________")]),
        legalPara([new TextRun("    Signature: ________")]),
        spacer,
        legalPara([new TextRun("(2) Name: ________")]),
        legalPara([new TextRun("    Address: ________")]),
        legalPara([new TextRun("    Signature: ________")]),
      ],
    },
  ],
});
