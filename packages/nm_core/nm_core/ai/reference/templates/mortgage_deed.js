/**
 * DEED OF MORTGAGE (SIMPLE MORTGAGE)
 * ─────────────────────────────────────
 * Category : Conveyancing — Security Instrument
 * Statute  : Transfer of Property Act, 1882 (Section 58)
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * A Mortgage Deed is fundamentally different from a Sale or Gift Deed:
 *
 *   SALE DEED  → Transfers OWNERSHIP (title passes to the vendee)
 *   GIFT DEED  → Transfers OWNERSHIP (title passes to the donee)
 *   MORTGAGE   → Creates a CHARGE on property (title stays with
 *                the mortgagor; the mortgagee gets a security interest)
 *
 * Section 58 TPA defines mortgage as "the transfer of an interest in
 * specific immovable property for the purpose of securing the payment
 * of money advanced or to be advanced by way of loan."
 *
 * This template demonstrates a SIMPLE MORTGAGE (Section 58(b)):
 *   - The mortgagor binds himself personally to repay
 *   - The mortgagor agrees that if he fails, the mortgagee may
 *     cause the property to be sold (with or without court intervention)
 *   - The property is NOT delivered to the mortgagee
 *
 * Unique structural elements:
 *   1. The deed is executed BY the Mortgagor (borrower) IN FAVOUR OF
 *      the Mortgagee (lender) — note "BY...IN FAVOUR OF" instead of
 *      the bilateral "BETWEEN...AND" used in Sale/Lease deeds.
 *   2. WHEREAS recitals trace both the property title AND the
 *      reason for borrowing (construction, business, etc.)
 *   3. Repayment terms (EMIs, interest rate, half-yearly payments)
 *   4. COVENANTS include insurance obligation and power-of-sale clause
 *   5. The property schedule describes BOTH existing structures AND
 *      future constructions (which also become part of the security)
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
    config: [
      { reference: "mortgage-clauses", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      // Sub-covenants under the main covenant clause
      { reference: "covenants", levels: [{ level: 0, format: LevelFormat.LOWER_ROMAN, text: "(%1)",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 1080, hanging: 400 } } } }] },
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
      centeredBold("DEED OF MORTGAGE", 32),
      spacer, hrule(),

      // ─── Date ───
      legalPara([
        new TextRun({ text: "THIS DEED OF MORTGAGE ", bold: true }),
        new TextRun("is executed at "),
        new TextRun({ text: "Delhi ", bold: true }),
        new TextRun("on this "),
        new TextRun({ text: "________ ", bold: true }),
        new TextRun("day of "),
        new TextRun({ text: "________.", bold: true }),
      ]),

      spacer,

      // ─── Parties ───
      // NOTE: A Mortgage Deed uses "BY... IN FAVOUR OF" — NOT "BETWEEN...AND"
      // This reflects that it is essentially unilateral in character
      // (the mortgagor creates the charge; the mortgagee merely receives it).

      legalPara([new TextRun({ text: "BY", bold: true, size: 26 })], { alignment: AlignmentType.CENTER }),
      spacer,

      // MORTGAGOR (the borrower who pledges property)
      legalPara([
        new TextRun({ text: "Mr. A", bold: true }),
        new TextRun(", S/o Sh. ________, R/o ________"),
        new TextRun({ text: " (hereinafter called the ", italics: true }),
        new TextRun({ text: "'MORTGAGOR'", bold: true, italics: true }),
        new TextRun({ text: ", which expression shall mean and include his heirs, legal representatives, executors, administrators and assigns)", italics: true }),
        new TextRun(" of the "),
        new TextRun({ text: "First Part;", bold: true }),
      ]),

      spacer,
      legalPara([new TextRun({ text: "IN FAVOUR OF", bold: true, size: 26 })], { alignment: AlignmentType.CENTER }),
      spacer,

      // MORTGAGEE (the lender who receives the security interest)
      legalPara([
        new TextRun({ text: "M/s ABC Ltd.", bold: true }),
        new TextRun(", a company incorporated under the Companies Act, having its registered office at ________"),
        new TextRun({ text: " (hereinafter called the ", italics: true }),
        new TextRun({ text: "'MORTGAGEE'", bold: true, italics: true }),
        new TextRun({ text: ", which expression shall mean and include its successors)", italics: true }),
        new TextRun("."),
      ]),

      spacer, hrule(),

      // ─── Recitals ───
      // Mortgage recitals are more elaborate because they must establish:
      // (a) the mortgagor's title to the property,
      // (b) the PURPOSE of the loan (why the money is being borrowed),
      // (c) the agreement to create the mortgage as security.

      legalPara([
        new TextRun({ text: "WHEREAS ", bold: true }),
        new TextRun("the Mortgagor has vide sale deed dated ________ purchased a vacant residential plot bearing No. ________."),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS ", bold: true }),
        new TextRun("the Mortgagor wants to construct a residential building on the aforesaid vacant plot of land;"),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS ", bold: true }),
        new TextRun("the Mortgagor does not have sufficient financial means to undertake the construction of the residential building on the aforesaid plot of land;"),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS ", bold: true }),
        new TextRun("the Mortgagee has agreed to advance a loan of "),
        new TextRun({ text: "Rs. ________", bold: true }),
        new TextRun(" to the Mortgagor, which loan shall be utilized by the Mortgagor towards the construction of a residential house on the above vacant plot of land;"),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS ", bold: true }),
        new TextRun("in consideration of the aforesaid amount borrowed by the Mortgagor from the Mortgagee, the Mortgagor has agreed to execute this Mortgage Deed of the vacant plot of land in favour of the Mortgagee."),
      ]),

      spacer,

      // ─── Testatum & Operative Clauses ───
      centeredBold("NOW THIS DEED, THEREFORE, WITNESSES AS UNDER:", 22),
      spacer,

      // Clause 1: Acknowledgment of debt
      new Paragraph({ numbering: { reference: "mortgage-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "The Mortgagor admits and acknowledges that he owes a sum of Rs. ________ to the Mortgagee on the basis of promissory note and receipt dated ________ executed by him in favour of the Mortgagee."
        )] }),

      // Clause 2: Interest — the cost of borrowing
      new Paragraph({ numbering: { reference: "mortgage-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "The Mortgagor shall be liable to pay interest on the above stated principal sum of Rs. ________ @ ________% per annum from the date of the loan until payment, and in this manner the total charge on the referred property of the Mortgagor shall be the principal sum of Rs. ________ and interest accruing thereupon."
        )] }),

      // Clause 3: Repayment terms (EMIs)
      new Paragraph({ numbering: { reference: "mortgage-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "The Mortgagor will pay to the Mortgagee the said sum of Rs. ________ in equal monthly installments of Rs. ________ per month on or before the ________ of each month, and in the meantime interest thereon at the rate of ________% per annum by half-yearly payments."
        )] }),

      // Clause 4: Compound interest
      new Paragraph({ numbering: { reference: "mortgage-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That any interest not paid on the due dates shall be treated as principal and added to the principal sum hereby secured, and shall bear interest at the rate and payable on the half-yearly days aforesaid."
        )] }),

      // Clause 5: THE OPERATIVE MORTGAGE CLAUSE — creating the charge
      // Unlike a sale deed which says "transfers ownership," a mortgage
      // says "transfers BY WAY OF SIMPLE MORTGAGE" — creating a charge,
      // not transferring title.
      new Paragraph({ numbering: { reference: "mortgage-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun("In consideration of the aforesaid, the Mortgagor hereby "),
          new TextRun({ text: "transfers by way of simple mortgage ", bold: true }),
          new TextRun("to the Mortgagee, a vacant residential plot bearing No. ________."),
        ] }),

      // Clause 6: Future constructions also mortgaged
      new Paragraph({ numbering: { reference: "mortgage-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "By this deed, the Mortgagor also mortgages to the Mortgagee any building and all other permanent structures that shall be built on the aforesaid vacant plot by the Mortgagor."
        )] }),

      // Clause 7: Mortgagor's covenants
      new Paragraph({ numbering: { reference: "mortgage-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "The Mortgagor hereby covenants with the Mortgagee as follows:", bold: true })] }),

      // Sub-covenant (i): No further encumbrances
      new Paragraph({ numbering: { reference: "covenants", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the said premises are free from all encumbrances and the Mortgagor undertakes that, until the entire principal amount and interest due is paid back to the Mortgagee, the Mortgagor shall not create any fresh mortgage, charge, pledge, or in any other manner alienate the corpus or his interest in the aforesaid property to any third person."
        )] }),

      // Sub-covenant (ii): POWER OF SALE — the most significant clause
      // In a simple mortgage with power of sale, the mortgagee can sell
      // the property WITHOUT going to court if the mortgagor defaults.
      new Paragraph({ numbering: { reference: "covenants", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun("If the Mortgagor fails to pay the sum with interest after it has become payable under the provisions of this deed, the Mortgagee shall, in addition to any other remedy available to him under the law, "),
          new TextRun({ text: "have the power to sell without the intervention of a Court ", bold: true }),
          new TextRun("the mortgaged property or any part thereof for the realization of the money due to it hereunder."),
        ] }),

      // Sub-covenant (iii): Insurance obligation
      new Paragraph({ numbering: { reference: "covenants", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "During the continuance of the Mortgage, the Mortgagor shall keep any building or permanent structure erected on the aforesaid plot of land insured against damage by fire in the name of the Mortgagor with an Insurance Company, and shall punctually pay all premiums on such insurance and shall produce to the Mortgagee on demand the policy of such insurance and the receipts for the premiums so paid."
        )] }),

      // Proviso — if mortgagor defaults on insurance, mortgagee can insure
      legalPara([
        new TextRun({ text: "Provided always, ", bold: true, italics: true }),
        new TextRun({ text: "that if the Mortgagor shall make default in any of the above matters, the Mortgagee may, in its discretion, insure and keep insured all or any of the said buildings and permanent structures, and the expenses of doing so shall be repaid by the Mortgagor on demand, and until so paid shall be added to the principal money hereby secured and bear interest accordingly.", italics: true }),
      ]),

      spacer, hrule(),

      // ─── Testimonium & Signatures ───
      legalPara([
        new TextRun({ text: "IN WITNESS WHEREOF ", bold: true }),
        new TextRun("the Mortgagor has executed this document on the date first above written."),
      ]),

      spacer, spacer,

      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 60 },
        children: [
          new TextRun({ text: "MORTGAGOR", bold: true }),
          new TextRun({ text: "\tMORTGAGEE", bold: true }),
        ],
      }),

      spacer, spacer,

      legalPara([new TextRun({ text: "WITNESSES:", bold: true, underline: {} })]),
      legalPara([new TextRun("1. ________")]),
      legalPara([new TextRun("2. ________")]),
    ],
  }],
});
