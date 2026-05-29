/**
 * LEGAL NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881
 * ────────────────────────────────────────────────────────────────────────
 * Category : Pre-Litigation Notice (NOT a court filing)
 * Statute  : Section 138, Negotiable Instruments Act, 1881
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * This template is STRUCTURALLY DIFFERENT from all other templates in
 * this library. Legal notices are NOT court documents — they are formal
 * demand letters sent by an advocate on behalf of their client BEFORE
 * filing a case. They serve as:
 *
 *   (a) A mandatory statutory pre-condition (under Section 138 NI Act,
 *       the demand notice MUST be sent within 30 days of dishonour
 *       before any criminal complaint can be filed); and
 *
 *   (b) Evidence of the complainant's compliance with procedure.
 *
 * Structural characteristics of a legal notice:
 *
 *   1. ADVOCATE'S LETTERHEAD — Chamber number, court, phone number
 *      (top-right, like a professional letterhead)
 *
 *   2. MODE OF SERVICE — "REGD A/D / U.P.C." indicating the notice
 *      must be sent by Registered Post with Acknowledgement Due AND
 *      Under Postal Certificate (dual sending for proof of delivery)
 *
 *   3. ADDRESSEE BLOCK — multiple addresses if the person has more than
 *      one known address (to ensure deemed service)
 *
 *   4. SUBJECT LINE — identifying the statute under which notice is sent
 *
 *   5. NUMBERED PARAGRAPHS — narrating the facts chronologically:
 *      the underlying transaction → cheque issued → deposited →
 *      dishonoured → demand for payment → consequence of non-payment
 *
 *   6. COPY RETAINED NOTE — "Copy kept in my office for future
 *      reference and use" (standard closing for notices)
 *
 * The 15-day period mentioned in paragraph 6 is critical — it is the
 * statutory window within which the accused must pay to avoid
 * criminal prosecution under Section 138.
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

const spacer = new Paragraph({ spacing: { after: 120 }, children: [] });

function hrule() {
  return new Paragraph({
    spacing: { after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "333333", space: 1 } },
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
    config: [{
      reference: "notice-paras",
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
      // ─── ADVOCATE'S LETTERHEAD ───
      // Legal notices are issued on the advocate's letterhead.
      // Name on the left, chamber details on the right.
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 40 },
        children: [
          new TextRun({ text: "A. ________ GUPTA", bold: true, size: 28 }),
          new TextRun({ text: "\tCh. No. ________, Delhi High Court", size: 20 }),
        ],
      }),
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 40 },
        children: [
          new TextRun({ text: "Advocate", size: 22 }),
          new TextRun({ text: "\tNew Delhi.", size: 20 }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 60 },
        children: [new TextRun({ text: "Ph. 011-2338XXXX", size: 20 })],
      }),

      hrule(),

      // ─── Mode of Service & Date ───
      // "REGD A/D / U.P.C." = Registered Acknowledgement Due / Under Postal Certificate
      // Both modes are used simultaneously to ensure proof of delivery.
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 120 },
        children: [
          new TextRun({ text: "REGD A/D / U.P.C.", bold: true }),
          new TextRun("\tDated: ________"),
        ],
      }),

      spacer,

      // ─── Addressee Block ───
      // Multiple addresses are listed when the addressee has more than one
      // known address — to ensure "deemed service" under law.
      legalPara([new TextRun({ text: "To,", bold: true })]),
      legalPara([new TextRun("Sh. ________,")]),
      legalPara([new TextRun("________ Connaught Place,")]),
      legalPara([new TextRun("New Delhi - 110001")]),
      spacer,
      legalPara([new TextRun({ text: "And also at:", bold: true, italics: true })]),
      legalPara([new TextRun("________")]),
      legalPara([new TextRun("New Delhi - ________")]),

      spacer,

      // ─── Subject Line ───
      legalPara([
        new TextRun({ text: "SUB: LEGAL NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881", bold: true, underline: {} }),
      ]),

      spacer,

      // ─── Opening ───
      // The standard opening for all legal notices: "Under the instructions
      // from and on behalf of my client..."
      legalPara([new TextRun({ text: "Dear Sir,", bold: true })]),

      spacer,

      legalPara([
        new TextRun("Under the instructions from and on behalf of my client "),
        new TextRun({ text: "Sh. ________", bold: true }),
        new TextRun(", R/o ________, New Delhi (hereinafter referred to as "),
        new TextRun({ text: "'my client'", bold: true }),
        new TextRun("), I serve you with the following notice:"),
      ]),

      spacer,

      // ─── Body (Chronological narration) ───
      // Each paragraph establishes one link in the chain of events
      // that constitutes the Section 138 offence.

      // Para 1: The underlying transaction
      new Paragraph({
        numbering: { reference: "notice-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That my client is engaged in the business of ________. During the ordinary course of business, you addressee purchased from my client ________ for which you issued a cheque bearing No. ________ dated ________ of ________ Bank, ________ Branch, New Delhi, for a sum of Rs. ________, as part payment towards discharge of your liability which you had incurred by way of purchasing the aforesaid ________ from my client."
        )],
      }),

      // Para 2: Cheque deposited for encashment
      new Paragraph({
        numbering: { reference: "notice-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the above-mentioned cheque was deposited by my client with his banker, ________, for encashment on ________ (date)."
        )],
      }),

      // Para 3: Cheque dishonoured — the triggering event
      new Paragraph({
        numbering: { reference: "notice-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun("That the said cheque was returned to my client with an endorsement "),
          new TextRun({ text: "'Dishonoured for insufficiency of funds.'", bold: true }),
          new TextRun(" The dishonoured cheque along with the cheque returning memo of the bank dated ________ was returned to my client."),
        ],
      }),

      // Para 4: When client learned of dishonour
      new Paragraph({
        numbering: { reference: "notice-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That for the first time my client came to know about the dishonouring of the said cheque on ________."
        )],
      }),

      // Para 5: Criminal liability — establishing the offence
      new Paragraph({
        numbering: { reference: "notice-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That on account of the dishonouring of the cheque, you addressee are guilty of committing offences punishable under Section 138 of the Negotiable Instruments Act, 1881."
        )],
      }),

      // Para 6: The demand — this is the OPERATIVE paragraph.
      // The 15-day demand is the statutory pre-condition for filing
      // a criminal complaint. If the addressee pays within 15 days,
      // no offence is committed.
      new Paragraph({
        numbering: { reference: "notice-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun("Now through this legal notice I hereby call upon you, addressee, to make the payment of "),
          new TextRun({ text: "Rs. ________", bold: true }),
          new TextRun(", the amount of the said dishonoured cheque, "),
          new TextRun({ text: "within fifteen days of the receipt of this notice", bold: true, underline: {} }),
          new TextRun(", failing which my client shall be constrained to take legal action against you by way of civil as well as criminal proceedings, at your risk as to cost and consequences resulting therefrom."),
        ],
      }),

      spacer,
      spacer,

      // ─── Closing ───
      legalPara([new TextRun("Yours Sincerely,")]),

      spacer,

      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [new TextRun({ text: "Advocate", bold: true })],
      }),

      spacer,
      hrule(),

      // ─── Copy Retained Note ───
      // This is standard in ALL Indian legal notices — it records
      // that the advocate retained a copy for their files.
      legalPara([
        new TextRun({ text: "Copy kept in my office for future reference and use.", italics: true }),
      ]),
    ],
  }],
});
