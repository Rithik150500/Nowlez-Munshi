/**
 * NOTICE UNDER SECTION 80 OF THE CODE OF CIVIL PROCEDURE, 1908
 * ────────────────────────────────────────────────────────────────
 * Category : Pre-litigation Notice — Statutory Requirement
 * Statute  : Section 80, Code of Civil Procedure, 1908
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * Section 80 of the Code of Civil Procedure is one of the most
 * unusual provisions in Indian civil law because it imposes a
 * mandatory waiting period BEFORE a suit can be filed against the
 * Government. To understand why this section exists, you have to
 * appreciate the historical context. In British India, suits against
 * the Crown were already restricted, and the framers of the original
 * Civil Procedure Code wanted to give the Government an opportunity
 * to settle claims out of court rather than be ambushed by lawsuits.
 * Section 80 was their solution: anyone wanting to sue the Government
 * must first send a notice and then wait two full months before
 * filing the suit. This gives the Government time to investigate the
 * claim, consult its legal advisors, and decide whether to settle,
 * defend, or perhaps remedy the underlying grievance administratively.
 *
 * THE STATUTORY REQUIREMENTS:
 *
 *   Under Section 80(1), no suit shall be instituted against the
 *   Government or against a public officer in respect of any act
 *   purporting to be done by such public officer in his official
 *   capacity, until the expiration of TWO MONTHS after notice in
 *   writing has been delivered to or left at the office of:
 *
 *     - The Secretary to the Government concerned (in the case of a
 *       suit against the Central Government or a State Government);
 *     - The General Manager (in the case of a suit against a railway);
 *     - The Collector of the District (in the case of a suit against
 *       a public officer); or
 *     - The Government Pleader (in such other cases as may be
 *       prescribed).
 *
 *   The notice must state, in precise terms:
 *
 *     1. The name, description and place of residence of the
 *        intended plaintiff;
 *
 *     2. The cause of action; and
 *
 *     3. The relief which is claimed.
 *
 *   These three particulars must be stated as three numbered points
 *   in the body of the notice, mirroring the statutory language. If
 *   any of them is missing or vague, the courts have repeatedly held
 *   that the notice is defective and the resulting suit is liable
 *   to be dismissed.
 *
 * THE TWO-MONTH WAIT — A DELIBERATE FRICTION:
 *
 *   The two-month period is not a mere formality. It exists to give
 *   the Government a real opportunity to do something. If the
 *   plaintiff files the suit before the two months expire, the suit
 *   is non-maintainable and will be dismissed without going into the
 *   merits. The courts have been strict about this requirement
 *   because they view it as a substantive safeguard rather than a
 *   procedural technicality.
 *
 * THE EXCEPTION FOR URGENT RELIEF:
 *
 *   Section 80(2) creates a narrow exception. If the plaintiff
 *   needs urgent or immediate relief, they may file the suit
 *   without serving the notice, but only with the leave of the
 *   court. Even in such cases, the court must hear the Government
 *   first before granting any relief. In practice, this exception
 *   is rarely invoked successfully.
 *
 * STRUCTURAL FEATURES OF THIS TEMPLATE:
 *
 *   1. ADVOCATE'S LETTERHEAD — Like Template 14 (Section 138 NI
 *      Act notice), this notice is sent on the advocate's
 *      letterhead, not on plain paper. The lawyer's letterhead
 *      establishes professional accountability and creates a
 *      paper trail.
 *
 *   2. REGISTERED POST WITH ACKNOWLEDGEMENT DUE — The notice
 *      should be sent by Regd. A/D post so that proof of service
 *      is preserved. Without proof of service, the two-month
 *      period cannot be computed, and the resulting suit will fail.
 *
 *   3. THE THREE NUMBERED PARTICULARS — Notice that the notice has
 *      a body and then THREE numbered particulars at the end. This
 *      structure exactly mirrors Section 80(1)(a)-(c) and is the
 *      conventional way of demonstrating compliance with the
 *      statute on the face of the document.
 *
 *   4. ADDRESSED TO THE SECRETARY — The notice is addressed to a
 *      named office (the Secretary of the relevant Government
 *      Department), not to a person. This is because the
 *      Government acts through its officials, and the notice
 *      becomes effective on receipt at the office of the proper
 *      officer.
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
      reference: "particulars",
      levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "(%1)",
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
      // ─── Advocate's Letterhead ───
      // Same structure as Template 14 (Section 138 NI Act notice).
      // The letterhead establishes professional accountability and
      // creates a clear paper trail.
      centeredBold("________ & ASSOCIATES", 28),
      centeredBold("ADVOCATES", 22),
      centeredBold("Address: ________, New Delhi", 20),
      centeredBold("Phone: ________ | Email: ________", 20),
      hrule(),

      // ─── Reference and Date ───
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 120 },
        children: [
          new TextRun("Ref. No.: ________"),
          new TextRun("\tDated: ________"),
        ],
      }),

      spacer,

      // ─── Mode of Service — REGISTERED A/D POST ───
      // Critical to preserve proof of service. The two-month period
      // is calculated from the date of receipt of the notice.
      legalPara([new TextRun({ text: "BY REGISTERED A/D POST", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      spacer,

      // ─── Addressee ───
      // Notice is addressed to a NAMED OFFICE, not a person. This is
      // because the Government acts through its officials, and the
      // notice becomes effective on receipt at the proper office.
      legalPara([new TextRun({ text: "To,", bold: true })]),
      legalPara([new TextRun("The Secretary,")]),
      legalPara([new TextRun("Department of ________,")]),
      legalPara([new TextRun("Government of ________,")]),
      legalPara([new TextRun("________ Bhawan,")]),
      legalPara([new TextRun("New Delhi - ________")]),

      spacer,

      // ─── Subject Line ───
      // The subject line MUST mention Section 80 CPC explicitly so
      // that the receiving office immediately recognises the document
      // as a statutory notice and routes it appropriately.
      legalPara([
        new TextRun({ text: "Subject: ", bold: true }),
        new TextRun({ text: "Notice under Section 80 of the Code of Civil Procedure, 1908, prior to the institution of a suit against the Government of ________.", bold: true }),
      ]),

      spacer,

      legalPara([new TextRun({ text: "Sir,", bold: true })]),

      spacer,

      // ─── Body of the Notice ───

      // Para 1: Identification of the client and the lawyer's instructions
      legalPara([
        new TextRun(
          "Under instructions from and on behalf of my client Mr. ________, S/o ________, R/o ________, I do hereby serve upon you this notice under Section 80 of the Code of Civil Procedure, 1908, for and on behalf of my client in respect of the matter set out hereinafter."
        ),
      ]),

      // Para 2: The factual narrative — establishing what happened
      // and how the Government's act gave rise to the cause of action.
      legalPara([new TextRun(
        "That my client is the absolute and lawful owner of the property bearing No. ________, situated at ________, New Delhi, and has been in peaceful possession and enjoyment of the same since ________."
      )]),

      // Para 3: The wrong complained of
      legalPara([new TextRun(
        "That on ________ (date), the officials of the ________ Department of the Government of ________ entered upon the property of my client without any prior notice, intimation or authority of law, and proceeded to demolish a portion of the construction standing on the said property. The said action of the Department's officials was wholly arbitrary, illegal, malafide and contrary to the principles of natural justice."
      )]),

      // Para 4: The harm caused
      legalPara([new TextRun(
        "That as a direct result of the aforesaid illegal action of the Department's officials, my client has suffered substantial monetary loss as well as mental agony and harassment. The estimated value of the demolished construction is approximately Rs. ________, and my client has further incurred consequential losses estimated at Rs. ________."
      )]),

      // Para 5: Prior efforts at administrative redress
      legalPara([new TextRun(
        "That my client made several representations to the concerned officials of the Department on ________, ________ and ________ requesting them to assess the damage and pay appropriate compensation. However, no response has been received from the Department, and the grievance of my client has remained unredressed."
      )]),

      // Para 6: The legal demand
      legalPara([new TextRun(
        "That in view of the foregoing, my client is constrained to institute a civil suit against the Government of ________ for recovery of damages and compensation. Before doing so, this notice is being served as required by Section 80 of the Code of Civil Procedure, 1908."
      )]),

      spacer,

      // ─── THE THREE STATUTORY PARTICULARS ───
      // These three numbered points are MANDATORY under Section 80(1).
      // Their structure mirrors the statutory language exactly. If any
      // particular is missing or vague, the notice is defective and
      // the resulting suit is liable to be dismissed.
      legalPara([
        new TextRun({ text: "The particulars required by Section 80(1) of the Code of Civil Procedure, 1908 are as follows:", bold: true, underline: {} }),
      ]),

      spacer,

      // Particular 1: Name, description and residence of the intended plaintiff
      new Paragraph({ numbering: { reference: "particulars", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "Name, description and place of residence of the intended Plaintiff: ", bold: true }),
          new TextRun(
            "Mr. ________, S/o ________, aged about ________ years, by occupation ________, resident of ________, New Delhi."
          ),
        ] }),

      // Particular 2: The cause of action
      new Paragraph({ numbering: { reference: "particulars", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "The cause of action: ", bold: true }),
          new TextRun(
            "The cause of action arose on ________ (date) when the officials of the ________ Department of the Government of ________ illegally demolished a portion of my client's construction at the aforesaid property, without any authority of law and in violation of the principles of natural justice. The cause of action further arose on each occasion when my client made representations to the Department which went unredressed, and the cause of action is still continuing."
          ),
        ] }),

      // Particular 3: The relief claimed
      new Paragraph({ numbering: { reference: "particulars", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "The relief claimed: ", bold: true }),
          new TextRun(
            "My client will pray for a decree of recovery of Rs. ________ towards the value of the demolished construction, Rs. ________ towards consequential losses, and Rs. ________ towards damages for mental agony and harassment, together with interest at ________% per annum from the date of the cause of action till the date of realisation, and the costs of the suit."
          ),
        ] }),

      spacer,

      // ─── The Demand and the Two-Month Notice ───
      // This is the operative part of the notice. It demands compliance
      // and explicitly invokes the two-month waiting period.
      legalPara([
        new TextRun(
          "You are hereby called upon to pay the aforesaid sum of Rs. ________ along with interest within a period of "
        ),
        new TextRun({ text: "TWO MONTHS ", bold: true, underline: {} }),
        new TextRun(
          "from the date of receipt of this notice, failing which my client shall be constrained to institute appropriate legal proceedings against the Government of ________ in the competent court of law for recovery of the aforesaid amount, along with interest and costs, entirely at your risk and consequence, including all expenses incurred in such legal proceedings."
        ),
      ]),

      // The closing paragraph — preserves proof of compliance
      legalPara([new TextRun(
        "A copy of this notice has been retained in my office for record and for production in the court if and when the proposed suit is filed."
      )]),

      spacer, spacer,

      // ─── Signature Block ───
      legalPara([new TextRun({ text: "Yours faithfully,", bold: true })]),
      spacer, spacer,
      legalPara([new TextRun({ text: "( ________ )", bold: true })]),
      legalPara([new TextRun("Advocate")]),
      legalPara([new TextRun("Enrolment No.: ________")]),
      legalPara([new TextRun("Counsel for Mr. ________")]),

      spacer, spacer,

      legalPara([
        new TextRun({ text: "[NOTE: ", bold: true, italics: true }),
        new TextRun({ text: "This notice must be sent by Registered A/D post and a copy retained for use in court. The suit cannot be filed until the expiry of two months from the date of receipt of this notice, except with leave of the court under Section 80(2) CPC.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
