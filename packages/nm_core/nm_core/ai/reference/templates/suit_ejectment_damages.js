/**
 * SUIT FOR EJECTMENT AND DAMAGES FOR WRONGFUL USE AND OCCUPATION
 * ───────────────────────────────────────────────────────────────────
 * Category : Civil Pleading — Property Recovery
 * Court    : Civil Judge, Delhi
 * Statute  : Transfer of Property Act, 1882 (Section 106)
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * This template represents the LANDLORD's perspective in a tenancy
 * dispute and is the structural opposite of Template 01 (Suit for
 * Permanent Injunction). To see the contrast:
 *
 *   TEMPLATE 01 — filed BY a tenant against the landlord, seeking
 *   to PREVENT dispossession. The plaintiff is in possession and
 *   wants to keep it.
 *
 *   THIS TEMPLATE — filed BY a landlord against a tenant, seeking
 *   to RECOVER possession. The plaintiff has parted with possession
 *   and wants it back, plus damages for the period of overstay.
 *
 * Together, these two templates show how the same factual situation
 * (a tenant occupying a landlord's premises) can give rise to entirely
 * different legal proceedings depending on which side fires first.
 *
 * KEY CONCEPTS THIS TEMPLATE TEACHES:
 *
 *   1. MONTH-TO-MONTH TENANCY — When a written lease for a fixed
 *      term expires and the tenant continues in possession with the
 *      landlord's acquiescence, a "month-to-month tenancy" arises by
 *      operation of law. This kind of tenancy can be terminated by
 *      either party giving 15 clear days' notice expiring with the
 *      end of a tenancy month, under Section 106 of the Transfer of
 *      Property Act, 1882.
 *
 *   2. THE STATUTORY NOTICE — Before filing this suit, the landlord
 *      MUST send a notice under Section 106 TPA terminating the
 *      tenancy. Without this notice, the suit is non-maintainable.
 *      The notice is annexed as Annexure 'B' (Annexure 'A' is the
 *      original lease deed proving the tenancy).
 *
 *   3. DAMAGES ON A PER-DAY BASIS — Once the notice expires, every
 *      day the tenant continues in possession is "wrongful use and
 *      occupation." The landlord is entitled to mesne profits at
 *      the prevailing market rate of rent for that area. The plaint
 *      must justify the rate claimed by reference to a market survey.
 *
 *   4. RENT CONTROL ACT EXCEPTION — In Delhi, premises let out at
 *      a rent of more than Rs. 3,500 per month are NOT governed by
 *      the Delhi Rent Control Act, which means the civil court has
 *      jurisdiction. Below that threshold, the matter would go to
 *      the Rent Controller instead. This jurisdictional point must
 *      be specifically pleaded.
 *
 *   5. AD VALOREM COURT FEE — Court fee in such suits is calculated
 *      not on the value of the property but on the ANNUAL RENT
 *      (monthly rent multiplied by twelve). This is a quirk of the
 *      Court Fees Act that catches many junior lawyers out.
 *
 *   6. CONTINUING CAUSE OF ACTION — Each day of unauthorised
 *      occupation creates a fresh cause of action, which is why
 *      the plaint says "the cause of action is a continuing one."
 *      This protects the suit from limitation issues.
 */

const {
  Document, Paragraph, TextRun,
  AlignmentType, TabStopType, TabStopPosition,
  Footer, PageNumber, LevelFormat
} = require("docx");

// ───── Helpers ─────
// Same set of helpers used in earlier templates, kept here so each
// template file remains self-contained and runnable on its own.

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

// ───── Document ─────

module.exports = new Document({
  styles: { default: { document: { run: { font: "Times New Roman", size: 24 } } } },

  numbering: {
    config: [
      {
        // Body paragraphs of the plaint
        reference: "ejectment-paras",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
      },
      {
        // Prayer items use lowercase roman numerals — a convention common
        // in property recovery suits where multiple distinct reliefs are sought.
        reference: "prayer-roman",
        levels: [{ level: 0, format: LevelFormat.LOWER_ROMAN, text: "(%1)",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
      },
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
      centeredBold("IN THE COURT OF CIVIL JUDGE", 26),
      centeredBold("(DISTRICT ________), ________ COURT, DELHI", 22),
      spacer,
      centeredBold("SUIT NO. ________ OF 20__", 24),
      spacer,

      // ─── Parties ───
      // The landlords are the plaintiffs (note plural - this template
      // uses joint owners which is realistic for Indian families).
      legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      legalPara([new TextRun({ text: "1. Mrs. ________", bold: true })]),
      legalPara([new TextRun("   W/o Mr. ________")]),
      legalPara([new TextRun({ text: "2. Mr. ________", bold: true })]),
      legalPara([new TextRun("   S/o ________")]),
      legalPara([new TextRun("   Both R/o ________")]),
      legalPara([new TextRun({ text: "\u2026 PLAINTIFFS", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      centeredBold("VERSUS"),
      spacer,

      // The defendant — typically a corporate tenant who has overstayed
      legalPara([new TextRun({ text: "________ Corporation Ltd.", bold: true })]),
      legalPara([new TextRun("Through its Chairman / Managing Director")]),
      legalPara([new TextRun("Having its registered office at ________")]),
      legalPara([new TextRun({ text: "\u2026 DEFENDANT", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      spacer,

      // ─── Title ───
      centeredBold("SUIT FOR EJECTMENT AND DAMAGES FOR", 24),
      centeredBold("WRONGFUL USE AND OCCUPATION", 24),
      spacer,

      legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Body ───

      // Para 1: The original tenancy. Notice how this paragraph
      // establishes both the landlord-tenant relationship AND the
      // existence of a written lease (which becomes Annexure A).
      new Paragraph({ numbering: { reference: "ejectment-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That the Plaintiffs, being the owners of flat No. ________, ________, New Delhi, let out the said flat to the Defendant for a period of ________ years with effect from ________ (date) vide Lease Deed dated ________ (copy annexed as "
          ),
          new TextRun({ text: "Annexure 'A'", bold: true }),
          new TextRun("). The delivery of possession of the said premises was made on the same date."),
        ] }),

      // Para 2: Expiry of the lease and the creation of a month-to-month tenancy
      // by operation of law. This is a critical legal concept under TPA.
      new Paragraph({ numbering: { reference: "ejectment-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That the period of ________ years referred to above, starting from ________, expired on ________. After the expiry of the said Lease, the Defendant became a "
          ),
          new TextRun({ text: "month-to-month tenant ", bold: true, italics: true }),
          new TextRun("of the Plaintiffs."),
        ] }),

      // Para 3: Plaintiff's efforts to recover and the legal notice.
      // The landlord must show they tried informal recovery first.
      new Paragraph({ numbering: { reference: "ejectment-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That the Plaintiffs, being in need of the premises in question, approached the Defendant for vacation of the same on various dates. However, the Defendant did not agree to the Plaintiffs' demand. The Plaintiffs thereafter served a legal notice through their counsel (copy annexed as "
          ),
          new TextRun({ text: "Annexure 'B'", bold: true }),
          new TextRun(") "),
          new TextRun({ text: "under Section 106 of the Transfer of Property Act, 1882 ", bold: true, underline: {} }),
          new TextRun("terminating the said tenancy on the midnight of ________ (date)."),
        ] }),

      // Para 4: Service of the notice — the 15-day rule under Section 106
      // is critical for the validity of the notice.
      new Paragraph({ numbering: { reference: "ejectment-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Defendant received the Plaintiffs' legal notice under Section 106 of the Transfer of Property Act on ________ (date), i.e., a clear 15 days before the last day of ________ (month), and thus is a valid notice under the Transfer of Property Act. Proof of service of the legal notice is annexed."
        )] }),

      // Para 5: The wrongful occupation begins, and the calculation of damages.
      // The market survey justifies the rate at which damages are claimed.
      new Paragraph({ numbering: { reference: "ejectment-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That despite receiving the said legal notice, the Defendant has neither vacated the premises nor shown any intention to vacate. Thus, from ________ (date) onwards, the Defendant is in wrongful use and occupation of the premises. The Plaintiffs have conducted a market survey of the area and found that the prevailing rate of rent for similar premises is Rs. ________ per sq. ft. per month. The Plaintiffs' flat measuring ________ sq. ft. would, therefore, be available in the market at Rs. ________ per month, and the Plaintiffs have rightly assessed damages at Rs. ________ per day."
        )] }),

      // Para 6: The pre-eviction rent and the Rent Control Act exception.
      // This paragraph is what gives the civil court jurisdiction.
      new Paragraph({ numbering: { reference: "ejectment-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "The Defendant was paying a monthly rent of Rs. ________ per month for the Plaintiffs' flat measuring ________ sq. ft. "
          ),
          new TextRun({ text: "The Plaintiffs' premises are not governed by the Delhi Rent Control Act as the rate of rent is more than Rs. 3,500, ", bold: true }),
          new TextRun("and thus this Hon'ble Court has jurisdiction to try the matter."),
        ] }),

      // Para 7: Cause of action — note the careful phrasing about
      // "continuing cause of action," which protects the suit from
      // any limitation challenge.
      new Paragraph({ numbering: { reference: "ejectment-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "The cause of action in the present case arose on ________ when the Plaintiffs first approached the Defendant for vacation of the said flat. The cause of action further arose on ________ when the Plaintiffs served the legal notice through their advocate. The said notice was duly received on ________. However, the Defendant did not vacate the flat in question. "
          ),
          new TextRun({ text: "The cause of action in the present case is a continuing one.", bold: true }),
        ] }),

      // Para 8: Jurisdiction
      new Paragraph({ numbering: { reference: "ejectment-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That since the property whose possession is sought is situated in Delhi, the Lease for the premises was executed in Delhi, and delivery of possession was made in Delhi, and since the premises are not covered by the Delhi Rent Control Act, this Hon'ble Court has jurisdiction to try the matter."
        )] }),

      // Para 9: The unique court fee calculation. This is a quirk of the
      // Court Fees Act that students often miss — court fee in ejectment
      // suits is calculated on annual rent, not on property value.
      new Paragraph({ numbering: { reference: "ejectment-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "That the court fee payable has been calculated ad valorem ", italics: true }),
          new TextRun("as per the chart under Section 7 of the Court Fees Act on the annual rent received by the Plaintiffs. The annual rent is Rs. ________, arrived at by multiplying the monthly rent of Rs. ________ by 12. On this, a court fee of Rs. ________ is paid. The Plaintiffs undertake to pay any additional court fee that may be found due by this Hon'ble Court."),
        ] }),

      spacer,

      // ─── Prayer ───
      // The prayer asks for TWO distinct reliefs: ejectment (recovery
      // of possession) AND damages (mesne profits for the wrongful
      // occupation period). This dual prayer is what distinguishes
      // an ejectment suit from a pure possession suit.
      centeredBold("PRAYER:", 26),
      spacer,

      legalPara([new TextRun("It is, therefore, most respectfully prayed that this Hon'ble Court may be pleased to:")]),

      new Paragraph({ numbering: { reference: "prayer-roman", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "pass a decree for ejectment against the Defendant and in favour of the Plaintiffs;", bold: true })] }),

      new Paragraph({ numbering: { reference: "prayer-roman", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "pass a decree for payment of damages at the rate of Rs. ________ per day for wrongful use and occupation of the flat by the Defendant from ________ until actual vacation;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-roman", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("award costs of the suit to the Plaintiffs and against the Defendant; and")] }),

      new Paragraph({ numbering: { reference: "prayer-roman", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("pass any other relief deemed fit and proper in the facts and circumstances of the case.")] }),

      spacer, spacer,

      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Delhi"), new TextRun({ text: "\tPLAINTIFFS", bold: true })],
      }),
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Dated: ________"), new TextRun("\tThrough")],
      }),
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun("Advocate")] }),

      spacer,
      centeredBold("VERIFICATION:", 24), spacer,

      legalPara([new TextRun(
        "Verified at Delhi on ________ day of ________, 20__ that the contents of paras 1 to __ are true to our personal knowledge and those of paras __ to __ are true and correct on the basis of legal advice received and believed to be true. The last para is the prayer to this Hon'ble Court."
      )]),

      spacer,
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "PLAINTIFFS", bold: true })] }),

      spacer, spacer,
      legalPara([
        new TextRun({ text: "[NOTE: ", bold: true, italics: true }),
        new TextRun({ text: "This plaint has to be supported by an affidavit]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
