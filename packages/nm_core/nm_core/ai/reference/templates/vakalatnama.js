/**
 * VAKALATNAMA
 * ─────────────
 * Category : Client-Advocate Authorisation Document
 * Used in  : Every court proceeding in India
 * Statute  : The Advocates Act, 1961; Bar Council of India Rules
 * Source   : Standard form used in Indian legal practice
 *
 * The Vakalatnama is the most fundamental document in Indian legal
 * practice. To understand its place, consider this: every single
 * piece of litigation in India, from the smallest claim in a
 * consumer forum to the most weighty constitutional case in the
 * Supreme Court, begins with a Vakalatnama. Until the client signs
 * it, no advocate can lawfully appear in court on the client's
 * behalf, and no court will permit the advocate to address the
 * bench. Yet despite its universal importance, students often
 * overlook it because it is short, formulaic, and rarely the
 * subject of dispute.
 *
 * THE LEGAL FUNCTION:
 *
 *   The Vakalatnama is essentially a power of attorney specifically
 *   tailored for litigation. It empowers a named advocate to do
 *   four broad things on behalf of the client: to APPEAR in court,
 *   to PLEAD by addressing the court orally, to ACT by filing
 *   documents and taking procedural steps, and to SETTLE the case
 *   if the client so authorises. The advocate's authority is
 *   confined to the specific case mentioned in the Vakalatnama and
 *   does not extend to other matters. If the client has multiple
 *   cases, a separate Vakalatnama is needed for each one.
 *
 * THE WORD ITSELF:
 *
 *   "Vakalatnama" is a compound Persian-Arabic word that came into
 *   Indian legal vocabulary during the Mughal period and was
 *   retained by the British. "Vakalat" means representation or
 *   advocacy, and "nama" means a written document. So the word
 *   literally means "document of representation." This historical
 *   etymology is preserved even though the contents of the document
 *   are now governed by the modern Advocates Act, 1961, and the
 *   Bar Council of India Rules.
 *
 * STRUCTURAL FEATURES:
 *
 *   1. THE CLIENT'S DECLARATION — The Vakalatnama is drafted in
 *      the FIRST PERSON of the client. The client says "I hereby
 *      appoint" rather than the lawyer saying "I am hereby
 *      appointed." This first-person framing is essential because
 *      the document is meant to be the client's authorisation,
 *      not the lawyer's claim of authority.
 *
 *   2. THE ENUMERATED POWERS — The advocate's authority is set
 *      out in a series of clauses, each describing one category
 *      of action the advocate is empowered to take. The list is
 *      conventional and exhaustive, designed to cover every
 *      procedural step that may arise in the litigation.
 *
 *   3. THE NON-LIABILITY CLAUSE — A distinctive feature of
 *      Vakalatnamas in many Indian jurisdictions is the clause
 *      stating that the advocate shall not be held responsible
 *      for any default in the conduct of the case if the client
 *      fails to provide instructions or to be present when
 *      required. This protects the advocate from being held
 *      liable for outcomes that resulted from the client's own
 *      conduct.
 *
 *   4. THE FEES AND COSTS CLAUSE — The Vakalatnama typically
 *      states that the client shall be liable to pay the
 *      advocate's fees and out-of-pocket expenses. If fees are
 *      unpaid, the advocate has a lien on the case papers and
 *      may withdraw from the case after giving notice.
 *
 *   5. THE ACCEPTANCE BY THE ADVOCATE — At the bottom of the
 *      Vakalatnama, the advocate signs an acceptance of the
 *      appointment. Without this acceptance, the document is
 *      merely a unilateral offer by the client. Once accepted,
 *      it becomes a binding contract of representation.
 *
 * THE STAMP REQUIREMENT:
 *
 *   In most Indian states, the Vakalatnama must bear a court fee
 *   stamp of a small denomination (typically Rs. 10 or Rs. 25,
 *   depending on the state). Without the stamp, the registry will
 *   refuse to file the document, and the advocate will not be
 *   recognised as the client's authorised representative.
 *
 * MULTI-ADVOCATE VAKALATNAMAS:
 *
 *   It is common for clients to engage more than one advocate,
 *   particularly in complex litigation. The Vakalatnama can be
 *   drafted to authorise multiple advocates, either jointly or
 *   severally. Each advocate then signs the acceptance separately.
 *   This template uses the single-advocate form for clarity, but
 *   the same structure can be expanded to include any number of
 *   advocates.
 */

const {
  Document, Paragraph, TextRun,
  AlignmentType, TabStopType, TabStopPosition,
  Footer, PageNumber, LevelFormat, BorderStyle
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
function hrule() {
  return new Paragraph({
    spacing: { after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "333333", space: 1 } },
    children: [],
  });
}

module.exports = new Document({
  styles: { default: { document: { run: { font: "Times New Roman", size: 24 } } } },
  numbering: {
    config: [{
      reference: "vak-clauses",
      levels: [{ level: 0, format: LevelFormat.LOWER_LETTER, text: "(%1)",
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
      // ─── Title ───
      centeredBold("VAKALATNAMA", 32),
      spacer, hrule(),

      // ─── Court Identification ───
      // The Vakalatnama must specify the exact court and the exact
      // case in which the advocate is being authorised to appear.
      centeredBold("IN THE COURT OF ________", 24),
      centeredBold("(DISTRICT ________), ________ COURT, DELHI", 22),
      spacer,
      centeredBold("CASE NO. ________ OF 20__", 24),
      spacer,

      // ─── Cause Title ───
      legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      legalPara([new TextRun({ text: "________", bold: true })]),
      legalPara([new TextRun({ text: "\u2026 PLAINTIFF / PETITIONER / APPLICANT", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      centeredBold("VERSUS"),
      spacer,

      legalPara([new TextRun({ text: "________", bold: true })]),
      legalPara([new TextRun({ text: "\u2026 DEFENDANT / RESPONDENT", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      spacer, hrule(),

      // ─── The Client's First-Person Declaration ───
      // This is the operative part of the Vakalatnama. The client
      // speaks in the first person and formally appoints the
      // advocate. Notice the precise language identifying the
      // client by name, parentage, age, and address — without these
      // particulars, the document could be challenged as not
      // belonging to the client at all.
      legalPara([
        new TextRun({ text: "KNOW ALL PERSONS BY THESE PRESENTS ", bold: true }),
        new TextRun("that I, "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(", son / wife / daughter of "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(", aged about "),
        new TextRun({ text: "________ ", bold: true }),
        new TextRun("years, by occupation "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(", residing at "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(", being the "),
        new TextRun({ text: "Plaintiff / Petitioner / Defendant / Respondent ", bold: true }),
        new TextRun("in the above-titled case, "),
        new TextRun({ text: "do hereby appoint, nominate and retain ", bold: true }),
        new TextRun({ text: "Sh. ________", bold: true }),
        new TextRun(", Advocate, having his chamber at "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(", enrolled with the Bar Council of "),
        new TextRun({ text: "________ ", bold: true }),
        new TextRun("under Enrolment No. "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(", to be my "),
        new TextRun({ text: "Advocate ", bold: true }),
        new TextRun("in the above-titled case, with the following authority:"),
      ]),

      spacer,

      // ─── The Enumerated Powers ───
      // Each clause describes one category of action the advocate
      // is empowered to take. The list is conventional and
      // exhaustive in Indian practice.

      // Clause (a): To appear and conduct
      new Paragraph({ numbering: { reference: "vak-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "To appear, act, plead and conduct the said case before this Hon'ble Court and before any other court or tribunal to which the said case may be transferred or appealed."
        )] }),

      // Clause (b): To file and present documents
      new Paragraph({ numbering: { reference: "vak-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "To file and present plaints, written statements, replies, rejoinders, applications, affidavits, petitions, appeals, revisions, reviews, executions and any other documents in the said case as may be necessary."
        )] }),

      // Clause (c): To examine and cross-examine
      new Paragraph({ numbering: { reference: "vak-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "To examine and cross-examine witnesses, to produce and call for documents, and to lead all relevant evidence in support of the case."
        )] }),

      // Clause (d): To receive money and documents
      new Paragraph({ numbering: { reference: "vak-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "To receive on my behalf any sum of money, document, decree, order or any other thing that may be due to me from the opposite party or from this Hon'ble Court, and to grant valid receipts and discharges for the same."
        )] }),

      // Clause (e): To engage other advocates
      new Paragraph({ numbering: { reference: "vak-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "To engage and appoint any other advocate or counsel to assist him in the conduct of the said case as he may deem necessary, and to authorise such other advocate or counsel to act on my behalf with the same powers as conferred herein."
        )] }),

      // Clause (f): To compromise and settle
      // This is a sensitive clause. By giving the advocate
      // authority to compromise, the client empowers the lawyer
      // to negotiate and settle without coming back for further
      // instructions on every point. Some clients deliberately
      // omit this clause to retain personal control.
      new Paragraph({ numbering: { reference: "vak-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "To compromise, settle, withdraw or refer to arbitration the said case or any part thereof, with my prior consent, and to take all such steps as may be necessary for the proper conduct and disposal of the case."
        )] }),

      // Clause (g): Withdrawal of appearance
      new Paragraph({ numbering: { reference: "vak-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "To withdraw appearance from the said case after due notice to me, in case I fail to provide instructions or to pay the agreed professional fees and expenses."
        )] }),

      spacer,

      // ─── Ratification ───
      legalPara([
        new TextRun({ text: "I hereby ratify and confirm ", bold: true, italics: true }),
        new TextRun("all the lawful acts, deeds, matters and things done or to be done by my said advocate by virtue of the powers herein contained as if the same had been done by me personally."),
      ]),

      spacer,

      // ─── The Non-liability Clause ───
      // This protects the advocate from being held responsible
      // for adverse outcomes caused by the client's own conduct.
      legalPara([
        new TextRun({ text: "I further declare ", bold: true }),
        new TextRun("that the said advocate shall not be held responsible for any default in the conduct of the case arising from my failure to provide proper instructions, to be present in court when required, or to pay the agreed professional fees and out-of-pocket expenses on time."),
      ]),

      // ─── Fees and Liability ───
      legalPara([
        new TextRun({ text: "I undertake ", bold: true }),
        new TextRun("to pay the agreed professional fees and out-of-pocket expenses to my said advocate as and when demanded, and I acknowledge that he shall have a lien on my case papers, documents and any sums recovered on my behalf for the satisfaction of his fees and expenses."),
      ]),

      spacer, hrule(),

      // ─── Testimonium ───
      legalPara([
        new TextRun({ text: "IN WITNESS WHEREOF ", bold: true }),
        new TextRun("I have signed this Vakalatnama at "),
        new TextRun({ text: "________ ", bold: true }),
        new TextRun("on this "),
        new TextRun({ text: "________ ", bold: true }),
        new TextRun("day of "),
        new TextRun({ text: "________ 20__.", bold: true }),
      ]),

      spacer, spacer,

      new Paragraph({ alignment: AlignmentType.RIGHT,
        spacing: { after: 60 },
        children: [new TextRun({ text: "(Signature of the Client)", bold: true })] }),
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "Name: ________", bold: true })] }),
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun("Address: ________")] }),

      spacer, spacer,

      // ─── Acceptance by the Advocate ───
      // Without the advocate's acceptance, the Vakalatnama is
      // merely a unilateral offer by the client. The acceptance
      // converts it into a binding contract of representation.
      legalPara([
        new TextRun({ text: "ACCEPTED:", bold: true, underline: {} }),
      ]),

      legalPara([new TextRun(
        "I, the above-named advocate, hereby accept the appointment as advocate for the above-named client in the above-titled case, on the terms and conditions stated above."
      )]),

      spacer, spacer,

      new Paragraph({ alignment: AlignmentType.RIGHT,
        spacing: { after: 60 },
        children: [new TextRun({ text: "(Signature of the Advocate)", bold: true })] }),
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "Name: ________", bold: true })] }),
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun("Enrolment No.: ________")] }),
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun("Address: ________")] }),

      spacer, spacer,

      legalPara([
        new TextRun({ text: "[NOTE: ", bold: true, italics: true }),
        new TextRun({ text: "This Vakalatnama must be affixed with the requisite court fee stamp as prescribed by the relevant State law. The signatures of both the client and the advocate must be in the original. If the client is in jail, the Vakalatnama must be attested by the Jail Superintendent.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
