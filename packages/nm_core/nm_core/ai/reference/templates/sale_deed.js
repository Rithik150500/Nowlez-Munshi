/**
 * SALE DEED (COMPLETED CONVEYANCE)
 * ──────────────────────────────────
 * Category : Conveyancing — Transfer of Ownership
 * Statute  : Transfer of Property Act, 1882 (Section 54)
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * The Sale Deed is the FINAL INSTRUMENT that actually TRANSFERS
 * OWNERSHIP of immovable property. It completes the chain started
 * by the Agreement for Sale (Template 04).
 *
 * AGREEMENT FOR SALE vs SALE DEED:
 *   Agreement (Template 04)  → Creates an OBLIGATION to sell
 *   Sale Deed (this template) → ACTUALLY TRANSFERS ownership
 *
 * Under Section 54 TPA: "Sale is a transfer of ownership in exchange
 * for a price paid or promised." For property valued over Rs. 100,
 * it can only be made by a REGISTERED instrument.
 *
 * Key structural elements unique to Sale Deeds:
 *   - NARRATIVE RECITALS — detailed title history (how the vendor
 *     acquired the property, through which registered document)
 *   - OPERATIVE CLAUSE — "does hereby grant, convey and transfer
 *     all his rights, titles and interests" (the words of conveyance)
 *   - RECEIPT CLAUSE — acknowledgment of receipt of full consideration
 *   - WARRANTY AGAINST ENCUMBRANCES — the vendor guarantees the
 *     property is free from all claims, liens, charges
 *   - DETAILED SCHEDULE — boundaries, measurements, survey numbers
 *   - Must be executed on STAMP PAPER of appropriate value
 *   - Must be REGISTERED with the Sub-Registrar
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
      reference: "sale-clauses",
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
      centeredBold("SALE DEED", 32),
      spacer, hrule(),

      // ─── Date, Place & Parties ───
      legalPara([
        new TextRun({ text: "THIS SALE DEED ", bold: true }),
        new TextRun("is made at "),
        new TextRun({ text: "________ ", bold: true }),
        new TextRun("on this "),
        new TextRun({ text: "________ ", bold: true }),
        new TextRun("day of "),
        new TextRun({ text: "________.", bold: true }),
      ]),
      spacer,

      legalPara([new TextRun({ text: "BETWEEN", bold: true, size: 26 })], { alignment: AlignmentType.CENTER }),
      spacer,

      legalPara([
        new TextRun({ text: "Mr. ________", bold: true }),
        new TextRun(", aged ________, S/o ________, R/o ________"),
        new TextRun({ text: " (hereinafter referred to as the ", italics: true }),
        new TextRun({ text: "'VENDOR'", bold: true, italics: true }),
        new TextRun({ text: ", which expression shall, unless repugnant to the context, mean and include his heirs, executors, administrators and assigns)", italics: true }),
        new TextRun(" of the "),
        new TextRun({ text: "FIRST PART.", bold: true }),
      ]),

      spacer,
      legalPara([new TextRun({ text: "AND", bold: true, size: 26 })], { alignment: AlignmentType.CENTER }),
      spacer,

      legalPara([
        new TextRun({ text: "Mr. ________", bold: true }),
        new TextRun(", aged ________, S/o ________, R/o ________"),
        new TextRun({ text: " (hereinafter referred to as the ", italics: true }),
        new TextRun({ text: "'VENDEE / PURCHASER'", bold: true, italics: true }),
        new TextRun({ text: ")", italics: true }),
        new TextRun(" of the "),
        new TextRun({ text: "SECOND PART.", bold: true }),
      ]),

      spacer, hrule(),

      // ─── NARRATIVE RECITALS ───
      // Unlike Agreement for Sale recitals (which are brief), Sale Deed
      // recitals include the COMPLETE TITLE HISTORY of the property.
      legalPara([
        new TextRun({ text: "WHEREAS ", bold: true }),
        new TextRun("the Vendor purchased a freehold residential plot measuring ________ sq. yds. and bearing No. ________ in ________ Block of the residential colony known as ________, New Delhi, vide sale deed dated ________ registered in the office of the Sub-Registrar, New Delhi, as Document No. ________, Addl. Book No. ________, Vol. No. ________, at pages ________ to ________ on ________."),
      ]),

      // Boundaries — identifying the property with precision
      legalPara([new TextRun("The aforementioned plot is bounded as under:")]),
      legalPara([new TextRun({ text: "   EAST: ________" })]),
      legalPara([new TextRun({ text: "   WEST: ________" })]),
      legalPara([new TextRun({ text: "   NORTH: ________" })]),
      legalPara([new TextRun({ text: "   SOUTH: ________" })]),

      legalPara([
        new TextRun({ text: "AND WHEREAS ", bold: true }),
        new TextRun("the Vendor, after purchasing the said plot, got the building plan sanctioned from the Municipal Corporation of Delhi vide their letter/file No. ________ dated ________ and caused construction thereon of a residential building on different floor levels."),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS ", bold: true }),
        new TextRun("the Vendor has agreed to sell and the Vendee has agreed to purchase ________ (description of portion) of the said building on an 'as is where is' basis for a total consideration of "),
        new TextRun({ text: "Rs. ________", bold: true }),
        new TextRun(" on the terms and conditions set forth hereinafter."),
      ]),

      spacer,

      // ─── Testatum ───
      centeredBold("NOW THIS SALE DEED WITNESSES AS FOLLOWS:", 22),
      spacer,

      // ─── Operative Clauses ───

      // RECEIPT CLAUSE — acknowledgment of consideration
      new Paragraph({ numbering: { reference: "sale-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That in pursuance of the agreement, the Vendor has already received from the Vendee a sum of Rs. ________ as part sale consideration, the receipt of which the Vendor hereby admits and acknowledges."
        )] }),

      new Paragraph({ numbering: { reference: "sale-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "The balance amount of Rs. ________ has been paid by the Vendee to the Vendor by Cheque No. ________ dated ________ drawn on ________ (Bank Name and Branch)."
        )] }),

      // THE OPERATIVE CLAUSE — the actual words of conveyance
      // "grant, convey and transfer all his rights, titles and interests"
      new Paragraph({ numbering: { reference: "sale-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun("That in view of the amount of sale consideration received, "),
          new TextRun({ text: "the Vendor hereby grants, conveys and transfers all his rights, titles and interests ", bold: true }),
          new TextRun("as held on the date hereof in the said ________ of the said property, together with undivided, indivisible and impartible proportionate ownership rights on the land underneath the said building, on the terms and conditions contained herein."),
        ] }),

      // Common amenities
      new Paragraph({ numbering: { reference: "sale-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Vendor is free to sell the remaining portion(s) of the said residential building to any other party/parties with common rights for use of common entrances, passages, staircases, water tanks, common facilities etc., and the Vendee will not make any objection thereto."
        )] }),

      // WARRANTY AGAINST ENCUMBRANCES — the vendor's guarantee
      new Paragraph({ numbering: { reference: "sale-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun("That the Vendor assures that the sale of the said residential portion is "),
          new TextRun({ text: "free from attachment, tenancies, gifts, decree, prior sale and religious disputes ", bold: true }),
          new TextRun("and if it is proved otherwise at any time and the Vendee suffers any loss due to any of the aforementioned reasons, then the Vendor shall be liable to make good the loss thus suffered by the Vendee."),
        ] }),

      // Vendee's satisfaction
      new Paragraph({ numbering: { reference: "sale-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Vendee has perused the original title deed, sanctioned plans, sale plans etc. and has fully satisfied herself."
        )] }),

      // Usage restrictions
      new Paragraph({ numbering: { reference: "sale-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Vendee shall keep the said property in properly repaired and good condition and shall not do anything or omit to do anything which may endanger or affect the other portions of the said building."
        )] }),

      // Expenses
      new Paragraph({ numbering: { reference: "sale-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That all expenses of registration, stamp duty, Corporation tax etc. have been borne and paid by the Vendee."
        )] }),

      // Taxes
      new Paragraph({ numbering: { reference: "sale-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That all taxes from the date of this Sale Deed shall be borne and paid by the Vendee."
        )] }),

      // Possession and title deeds
      new Paragraph({ numbering: { reference: "sale-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That photostat copies of title deeds etc. have been handed over by the Vendor to the Vendee and physical, vacant possession of the said floor/portion has also been taken by the Vendee."
        )] }),

      // Jurisdiction
      new Paragraph({ numbering: { reference: "sale-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That this transaction has taken place at New Delhi. As such, Delhi Courts shall have exclusive jurisdiction to entertain any dispute arising out of or in any way touching or concerning this deed."
        )] }),

      spacer, hrule(),

      // ─── Schedule of Property ───
      centeredBold("SCHEDULE OF PROPERTY", 26),
      spacer,
      legalPara([new TextRun({ text: "(Details of the property to be mentioned with complete particulars)", italics: true })]),
      legalPara([new TextRun("Property: ________")]),
      legalPara([new TextRun("Area: ________")]),
      legalPara([new TextRun("Boundaries: East: ________, West: ________, North: ________, South: ________")]),

      spacer, hrule(),

      // ─── Testimonium & Signatures ───
      legalPara([
        new TextRun({ text: "IN WITNESS WHEREOF ", bold: true }),
        new TextRun("the parties hereunto have signed this document on the date and place first above written in the presence of the following witnesses."),
      ]),

      spacer, spacer,

      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 60 },
        children: [
          new TextRun({ text: "VENDOR", bold: true }),
          new TextRun({ text: "\tVENDEE", bold: true }),
        ],
      }),
      spacer, spacer,

      legalPara([new TextRun({ text: "WITNESSES:", bold: true, underline: {} })]),
      legalPara([new TextRun("(1) ________")]),
      legalPara([new TextRun("(2) ________")]),
    ],
  }],
});
