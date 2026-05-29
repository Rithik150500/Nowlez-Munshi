/**
 * NOTICE OF EJECTMENT UNDER SECTION 106 OF THE
 * TRANSFER OF PROPERTY ACT, 1882
 * ──────────────────────────────────────────────────
 * Category : Pre-litigation Notice — Tenancy Termination
 * Statute  : Section 106, Transfer of Property Act, 1882
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * This Notice of Ejectment is the pre-litigation companion of the
 * Suit for Ejectment at Template 26. To understand why this notice
 * needs to be a separate document with its own structure, you have
 * to think about the legal mechanics of how a tenancy actually ends
 * in Indian law. A tenancy is a contractual relationship that
 * confers on the tenant a legal right to remain in possession of the
 * property. So long as that contract subsists, the tenant is in
 * LAWFUL possession, and the landlord cannot recover the premises
 * by force or by going to court directly. The contract must first
 * be brought to an end. Only then does the tenant become a
 * trespasser, and only then does the landlord have a cause of
 * action to file a suit for ejectment.
 *
 * THE LEGAL FUNCTION OF THE NOTICE:
 *
 *   Under Section 106 of the Transfer of Property Act, 1882, every
 *   tenancy of immovable property either continues for the period
 *   for which it was originally granted (in the case of a
 *   fixed-term lease) or until it is terminated by notice. For
 *   month-to-month tenancies arising by operation of law after the
 *   expiry of a written lease, the tenancy continues indefinitely
 *   until either the landlord or the tenant serves a fifteen-day
 *   notice expiring with the end of a tenancy month. The notice is
 *   what actually terminates the tenancy. Without it, the tenant
 *   remains in lawful possession, and any suit filed by the landlord
 *   will be dismissed as premature.
 *
 * THE FIFTEEN-DAY RULE:
 *
 *   Section 106 originally required thirty days' notice for monthly
 *   tenancies, but this was amended in 2002 and the period is now
 *   fifteen days. The notice must be such that it expires with the
 *   end of a tenancy month, meaning that if the rent is payable on
 *   the first of every month, the notice must terminate the tenancy
 *   on the last day of some month, not in the middle of a month.
 *   Indian courts used to be very strict about this requirement,
 *   but the 2002 amendment also added a saving clause stating that
 *   no notice of termination shall be deemed invalid merely because
 *   the period mentioned therein falls short of the period
 *   specified, provided the suit is filed after the expiry of that
 *   period. This makes the law somewhat more forgiving than it
 *   used to be.
 *
 * THE FOUR ESSENTIAL ELEMENTS OF A SECTION 106 NOTICE:
 *
 *   For the notice to be legally effective, it must do four things,
 *   each of which is captured in a numbered paragraph of this
 *   template:
 *
 *     First, it must identify the parties and the property, so that
 *     there is no doubt about whose tenancy is being terminated and
 *     in respect of what premises.
 *
 *     Second, it must specify the rent and any other essential
 *     terms of the tenancy, so that the recipient cannot later
 *     claim that some other tenancy is being referred to.
 *
 *     Third, it must clearly demand vacation of the premises by a
 *     specific date that complies with the fifteen-day-end-of-month
 *     rule.
 *
 *     Fourth, it must declare that the tenancy will stand terminated
 *     on that date and that the relationship of landlord and tenant
 *     will absolutely cease.
 *
 * THE TRESPASSER WARNING:
 *
 *   Look at paragraph 6 of the template. It states that if the
 *   tenant fails to vacate as required, they will be considered a
 *   trespasser and ejected through court proceedings, and they
 *   will have to pay damages at a specified rate until eviction.
 *   This warning serves two purposes. First, it puts the tenant on
 *   formal notice of the consequences, which strengthens the
 *   landlord's later claim for damages by showing that the
 *   continued occupation was wilful. Second, it sets the rate at
 *   which damages will be claimed, which becomes part of the
 *   plaintiff's case in any subsequent ejectment suit.
 *
 * THE LANDLORD'S TWO USES OF THIS NOTICE:
 *
 *   In practice, this notice serves two distinct functions. First,
 *   it is a genuine pre-litigation step. Many tenants, when faced
 *   with a formal lawyer's notice quoting Section 106, will simply
 *   vacate without forcing the landlord to file a suit. The notice
 *   is therefore often the cheapest and fastest way to recover
 *   possession. Second, even when the tenant ignores the notice and
 *   forces a suit, the notice itself becomes the centrepiece of the
 *   landlord's case. It is annexed to the plaint as Annexure B (you
 *   can see this in Template 26), and the landlord must prove its
 *   service to establish that the tenancy was lawfully terminated
 *   before the suit was filed.
 *
 * THE STRUCTURAL PARALLEL WITH OTHER NOTICES IN YOUR LIBRARY:
 *
 *   Your library now has three pre-litigation notices that share a
 *   common structural skeleton: this Section 106 notice, the
 *   Section 138 NI Act notice at Template 14, and the Section 80
 *   CPC notice at Template 34. All three are sent on advocate's
 *   letterhead, all three are sent by Registered A/D post, all
 *   three open with "Under instructions from and on behalf of my
 *   client," and all three close with a statement that a copy has
 *   been kept in the lawyer's office for future reference. By
 *   studying these three notices together, you can see how the
 *   common drafting conventions for legal notices have evolved
 *   into a recognisable Indian style.
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
      reference: "notice-paras",
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
      // ─── Advocate's Letterhead ───
      // Same letterhead structure as Templates 14 and 34. The
      // letterhead establishes professional accountability and
      // creates a paper trail for the court.
      centeredBold("________ & ASSOCIATES", 28),
      centeredBold("ADVOCATES", 22),
      centeredBold("Chamber No. ________, ________ Courts, New Delhi", 20),
      centeredBold("Phone: ________ | Email: ________", 20),
      hrule(),

      // ─── Title ───
      centeredBold("NOTICE OF EJECTMENT THROUGH ADVOCATE", 24),
      centeredBold("(Section 106 of the Transfer of Property Act, 1882)", 22),
      spacer,

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

      // ─── Mode of Service ───
      legalPara([new TextRun({ text: "BY REGISTERED A/D POST AND BY UNDER POSTAL CERTIFICATE (U.P.C.)", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      spacer,

      // ─── Addressee ───
      // The notice is addressed to the tenant by name and at the
      // address of the tenanted premises. Sending it to the right
      // address is critical because the period of fifteen days runs
      // from the date of receipt.
      legalPara([new TextRun({ text: "To,", bold: true })]),
      legalPara([new TextRun("Sh. ________")]),
      legalPara([new TextRun("S/o ________")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara([new TextRun("(at the tenanted premises)")]),

      spacer,

      // ─── Subject Line ───
      // The subject line must mention Section 106 explicitly so
      // that the recipient cannot later claim ignorance of the
      // legal nature of the document.
      legalPara([
        new TextRun({ text: "Subject: ", bold: true }),
        new TextRun({ text: "Notice under Section 106 of the Transfer of Property Act, 1882 for ejectment from premises bearing No. ________, situated at ________.", bold: true }),
      ]),

      spacer,

      legalPara([new TextRun({ text: "Dear Sir,", bold: true })]),

      spacer,

      // ─── Opening — the standard "instructions" formula ───
      // This formula appears in all three notices in your library
      // (Templates 14, 34, and now this one). It establishes that
      // the lawyer is acting on the client's instructions and not
      // on their own behalf.
      legalPara([new TextRun(
        "Under instructions from and on behalf of my client Sh. ________, S/o ________, R/o ________ (hereinafter referred to as 'my client'), I do hereby serve upon you the following notice:"
      )]),

      spacer,

      // ─── Body — the four essential elements ───

      // Element 1: Identifying the parties and the property
      new Paragraph({ numbering: { reference: "notice-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the house bearing No. ________, situated at ________ in ________ city (hereinafter referred to as 'the said property') is owned by my client. You approached my client and requested him to give the said property on lease to you for residential purposes."
        )] }),

      // Element 2: Specifying the tenancy and the rent
      new Paragraph({ numbering: { reference: "notice-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That my client has inducted you as the tenant in respect of the said property at an agreed monthly rent of Rs. ________ per month, exclusive of electricity and water charges. You have been in possession of the said property as a monthly tenant under my client since ________ (date)."
        )] }),

      // Element 3: The termination demand — the operative paragraph
      // The phrasing here is conventional and tracks the language of
      // Section 106 itself. The tenant is required to "quit and
      // vacate" the property by a specified date.
      new Paragraph({ numbering: { reference: "notice-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "I hereby give you notice ", bold: true }),
          new TextRun(
            "that you are to "
          ),
          new TextRun({ text: "quit, vacate and deliver vacant possession ", bold: true, underline: {} }),
          new TextRun(
            "of the said property of which you are now in possession as a monthly tenant under my client, immediately on the expiry of the last day of ________ (month and year)."
          ),
        ] }),

      // Element 4: The termination declaration — the legal effect
      new Paragraph({ numbering: { reference: "notice-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "On and from the first day of ________ (the month next following the last day of the month on which you are required to quit), the tenancy hereto before subsisting between my client and you shall stand terminated, and all relationship of landlord and tenant between my client and you shall absolutely cease."
        )] }),

      // Para 5: Demand for vacant possession
      new Paragraph({ numbering: { reference: "notice-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "You are hereby requested to deliver vacant and peaceful possession of the said premises unto my client on the date stated above."
        )] }),

      // Para 6: The trespasser warning — sets up the damages claim
      // for any subsequent ejectment suit
      new Paragraph({ numbering: { reference: "notice-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "In case of your failure to quit the premises as desired above, you will be considered as a "
          ),
          new TextRun({ text: "trespasser ", bold: true, underline: {} }),
          new TextRun(
            "and ejected through due process of law, and you will be liable to pay "
          ),
          new TextRun({ text: "damages at the rate of Rs. ________ per day ", bold: true }),
          new TextRun(
            "for wrongful use and occupation of the said premises until you are evicted, in addition to the costs of the legal proceedings, all of which will be entirely at your risk and consequence."
          ),
        ] }),

      spacer, spacer,

      // ─── Closing ───
      legalPara([new TextRun({ text: "Yours sincerely,", bold: true })]),

      spacer, spacer,

      legalPara([new TextRun({ text: "( ________ )", bold: true })]),
      legalPara([new TextRun("Advocate")]),
      legalPara([new TextRun("Enrolment No.: ________")]),
      legalPara([new TextRun("Counsel for Sh. ________")]),

      spacer, spacer,

      // The "copy retained" line — appears in all three notices in
      // your library and is documentary evidence that the notice
      // was actually issued.
      legalPara([
        new TextRun({ text: "Copy kept in my office for future reference and use.", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
