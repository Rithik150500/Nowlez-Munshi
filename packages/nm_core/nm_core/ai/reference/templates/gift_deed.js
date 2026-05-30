/**
 * GIFT DEED
 * ──────────
 * Category : Conveyancing — Gratuitous Transfer
 * Statute  : Transfer of Property Act, 1882 (Section 122)
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * A Gift Deed transfers property WITHOUT CONSIDERATION — in contrast
 * to a Sale Deed (which transfers for a price). This distinction affects:
 *
 *   1. The RECITALS — instead of "agreed to sell at a price," the
 *      WHEREAS clause states "natural love and affection" as the motive.
 *      Section 25 of the Indian Contract Act recognizes love and
 *      affection between near relatives as valid consideration.
 *
 *   2. The OPERATIVE WORDS — instead of "sells, conveys, transfers"
 *      the deed uses "donates, gifts" (the specific legal verb).
 *
 *   3. The ACCEPTANCE — Under Section 122 TPA, a gift is NOT complete
 *      until ACCEPTED by the donee. The deed must record this acceptance.
 *      (In a sale, acceptance is implicit in paying the price.)
 *
 *   4. STAMP DUTY — Gift deeds are chargeable with stamp duty
 *      (assessed on the market value, not consideration — since
 *      consideration is zero).
 *
 *   5. REGISTRATION — Compulsory for immovable property gifts
 *      (Section 17, Registration Act, 1908).
 *
 * The parties are labelled DONOR (transferor) and DONEE (transferee),
 * not Vendor/Purchaser or Lessor/Lessee.
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
      reference: "gift-clauses",
      levels: [{
        level: 0, format: LevelFormat.DECIMAL, text: "(%1)",
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
      // ─── Title ───
      centeredBold("GIFT DEED", 32),
      spacer,
      hrule(),

      // ─── Date and Place ───
      legalPara([
        new TextRun({ text: "THIS GIFT DEED ", bold: true }),
        new TextRun("is made and executed on this "),
        new TextRun({ text: "________ ", bold: true }),
        new TextRun("day of "),
        new TextRun({ text: "________ ", bold: true }),
        new TextRun("of the Year "),
        new TextRun({ text: "________, ", bold: true }),
        new TextRun("at "),
        new TextRun({ text: "________.", bold: true }),
      ]),

      spacer,

      // ─── Parties ───
      legalPara([new TextRun({ text: "BETWEEN", bold: true, size: 26 })], { alignment: AlignmentType.CENTER }),
      spacer,

      // DONOR — the person making the gift
      legalPara([
        new TextRun({ text: "________ (Name)", bold: true }),
        new TextRun(", S/o / D/o / W/o ________, Age ________, "),
        new TextRun("Marital Status ________, Occupation ________, "),
        new TextRun("Nationality ________, Resident of ________, "),
        new TextRun("holding Aadhaar Card No. ________"),
        new TextRun({ text: " (hereinafter called the ", italics: true }),
        new TextRun({ text: "'DONOR'", bold: true, italics: true }),
        new TextRun({ text: ")", italics: true }),
        new TextRun(" of the one part."),
      ]),

      spacer,
      legalPara([new TextRun({ text: "AND", bold: true, size: 26 })], { alignment: AlignmentType.CENTER }),
      spacer,

      // DONEE — the person receiving the gift
      legalPara([
        new TextRun({ text: "________ (Name)", bold: true }),
        new TextRun(", S/o / D/o / W/o ________, Age ________, "),
        new TextRun("Marital Status ________, Occupation ________, "),
        new TextRun("Nationality ________, Resident of ________, "),
        new TextRun("holding Aadhaar Card No. ________"),
        new TextRun({ text: " (hereinafter called the ", italics: true }),
        new TextRun({ text: "'DONEE'", bold: true, italics: true }),
        new TextRun({ text: ")", italics: true }),
        new TextRun(" of the other part."),
      ]),

      spacer,

      // Standard inclusive definition clause
      legalPara([
        new TextRun({ text: "The expressions of the DONOR and the DONEE shall mean and include their respective heirs, successors, executors, nominees, assignees, administrators and legal representatives etc.", italics: true }),
      ]),

      spacer,
      hrule(),

      // ─── Recitals (WHEREAS) ───
      // The recitals in a gift deed establish:
      // (1) how the donor acquired title,
      // (2) that the property is free from encumbrances,
      // (3) the MOTIVE — "natural love and affection" (the key distinction
      //     from a sale deed where the motive is monetary consideration).

      legalPara([
        new TextRun({ text: "AND WHEREAS ", bold: true }),
        new TextRun("the DONOR is the owner and in possession of the property, having been purchased / acquired vide registered sale deed as document No. ________, Addl. Book-I, Vol. No. ________, pages ________ to ________, on date ________, duly registered in the office of Sub-Registrar ________."),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS ", bold: true }),
        new TextRun("the above property, more particularly described in the Schedule herein below, is free from all sorts of encumbrances such as liens, charges, claims, liabilities, acquisitions, injunctions or attachments from any Court of Law, gifts, mortgages, demands, notices, notifications, legal disputes, prior sale and flaws etc. and the DONOR is fully entitled to dispose of the same."),
      ]),

      // THE KEY RECITAL — love and affection as the motive
      // This replaces the "consideration" recital in a sale deed.
      legalPara([
        new TextRun({ text: "AND WHEREAS ", bold: true }),
        new TextRun("the DONOR has great "),
        new TextRun({ text: "love and affection ", bold: true, underline: {} }),
        new TextRun("for the DONEE being his/her "),
        new TextRun({ text: "________ (Relation).", bold: true }),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS ", bold: true }),
        new TextRun("the DONOR has agreed to GIFT, "),
        new TextRun({ text: "without any monetary consideration, ", bold: true }),
        new TextRun("the property described in the Schedule herein below UNTO the DONEE and the DONEE has also agreed to accept the same."),
      ]),

      spacer,

      // ─── Testatum & Operative Clauses ───
      centeredBold("NOW THIS GIFT DEED WITNESSETH AS UNDER:", 22),
      spacer,

      // The operative word "donates/gifts" replaces "sells, conveys"
      new Paragraph({
        numbering: { reference: "gift-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun("That the DONOR does hereby "),
          new TextRun({ text: "donate / gift ", bold: true }),
          new TextRun("the property described in the Schedule below, UNTO ________ (Donee's name) on account of great love and affection for him/her, being his/her ________ (relation)."),
        ],
      }),

      // Transfer of possession — in a gift, this happens immediately
      // (unlike a sale where it may happen on a future date)
      new Paragraph({
        numbering: { reference: "gift-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("The possession of the aforesaid property under donation / gift has been handed over / delivered to the DONEE by the DONOR.")],
      }),

      // Absolute ownership vests in donee
      new Paragraph({
        numbering: { reference: "gift-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That the DONEE has now become the absolute and exclusive owner with all rights in the aforesaid property under donation / gift from today and shall also enjoy all rights of ownership therein.")],
      }),

      // Donor's divestiture — the donor retains NO rights
      new Paragraph({
        numbering: { reference: "gift-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("The DONOR has now been left with no right, title, interest or lien etc. whatsoever of any sort in the aforesaid property henceforth after the execution / registration of this Gift Deed. The property in question is free from acquisition, neither by the Government nor by any other authority.")],
      }),

      // Mutation rights — the donee can get revenue records changed
      new Paragraph({
        numbering: { reference: "gift-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That the DONEE with his/her own funds shall get the property transferred / mutated in his/her favour in the records of Rights of the Revenue Department on the basis of this Gift Deed and DONOR hereby conveys his/her No Objection for the mutation of the property herein below mentioned under the Schedule, in the name of the DONEE.")],
      }),

      // ACCEPTANCE — critical under Section 122 TPA.
      // A gift is void if the donee does not accept it.
      new Paragraph({
        numbering: { reference: "gift-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "That the DONEE has accepted the GIFT ", bold: true }),
          new TextRun("of the said property and has also taken over the possession of the same from the DONOR."),
        ],
      }),

      // Market value declaration — for stamp duty purposes
      new Paragraph({
        numbering: { reference: "gift-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That the market value of the above-mentioned property has been assessed at Rs. ________ as per Notification published in the Official Gazette, Series ________, No. ________, Dated ________.")],
      }),

      // Expenses
      new Paragraph({
        numbering: { reference: "gift-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That all the expenses of the Gift Deed such as Stamp Duty and Registration Fees etc. have been borne and paid by the DONOR / DONEE.")],
      }),

      // Future obligations
      new Paragraph({
        numbering: { reference: "gift-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That all future taxes, cesses, rates or any other Government or Municipal dues and demands in respect of the above-mentioned property shall be borne and paid by the DONEE.")],
      }),

      // Title deeds handed over
      new Paragraph({
        numbering: { reference: "gift-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That all the Title Deeds / papers including previous title deed (in originals) relating to the gifted property have been handed over / delivered to the DONEE by the DONOR.")],
      }),

      spacer,
      hrule(),

      // ─── Schedule of Property ───
      centeredBold("SCHEDULE", 26),
      spacer,

      legalPara([new TextRun({ text: "(Complete description of the property including Survey Nos., area, boundaries)", italics: true })]),
      spacer,
      legalPara([new TextRun("Property: ________")]),
      legalPara([new TextRun("Area: ________")]),
      legalPara([new TextRun("East: ________")]),
      legalPara([new TextRun("West: ________")]),
      legalPara([new TextRun("North: ________")]),
      legalPara([new TextRun("South: ________")]),

      spacer,
      hrule(),

      // ─── Signatures ───
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 60 },
        children: [
          new TextRun({ text: "DONOR", bold: true }),
          new TextRun({ text: "\tDONEE", bold: true }),
        ],
      }),

      spacer,
      spacer,

      legalPara([new TextRun({ text: "WITNESSES:", bold: true, underline: {} })]),
      spacer,
      legalPara([new TextRun("1. Mr. ________, S/o ________")]),
      legalPara([new TextRun("   Resident of ________")]),
      legalPara([new TextRun("   Signature: ________")]),
      spacer,
      legalPara([new TextRun("2. Mr. ________, S/o ________")]),
      legalPara([new TextRun("   Resident of ________")]),
      legalPara([new TextRun("   Signature: ________")]),
    ],
  }],
});
