/**
 * DEED OF PARTNERSHIP
 * ─────────────────────
 * Category : Conveyancing — Business Instrument
 * Statute  : Indian Partnership Act, 1932
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * The Partnership Deed is structurally distinct from every other
 * conveyancing instrument in this library. Unlike Sale, Gift, Lease,
 * or Mortgage Deeds — which all transfer a property interest from
 * one party to another at a single moment — a Partnership Deed
 * CREATES AN ONGOING BUSINESS RELATIONSHIP between two or more
 * persons who agree to share profits and losses from a common venture.
 *
 * UNDER THE INDIAN PARTNERSHIP ACT, 1932:
 *
 *   Section 4 defines partnership as "the relation between persons
 *   who have agreed to share the profits of a business carried on
 *   by all or any of them acting for all."
 *
 *   The three essential elements are:
 *     (a) An agreement between two or more persons,
 *     (b) The agreement must be to share profits of a business, and
 *     (c) The business must be carried on by all or any of them
 *         acting for all (the "mutual agency" principle).
 *
 * KEY DRAFTING REQUIREMENTS:
 *
 *   Every partnership deed must address the following matters,
 *   which are reflected as numbered clauses in this template:
 *
 *     1. Name of the firm
 *     2. Date of commencement of business
 *     3. Place of business
 *     4. Nature of business
 *     5. Profit-sharing ratios (the most important clause)
 *     6. Capital contributions and interest on capital
 *     7. Drawings allowed to each partner
 *     8. Bank account operation rules
 *     9. Maintenance of accounts and accounting period
 *     10. Restrictions on competing businesses
 *     11. Duration of partnership (or whether at-will)
 *     12. Dissolution and notice period
 *     13. Arbitration clause for internal disputes
 *
 * PARTNERSHIP-AT-WILL vs FIXED-TERM:
 *
 *   This template creates a "partnership-at-will" — meaning either
 *   partner can dissolve it by giving notice. A fixed-term partnership
 *   would specify a definite duration (e.g., "5 years from this date").
 *
 * REGISTRATION:
 *
 *   Registration of a partnership firm under Section 58 of the
 *   Partnership Act is OPTIONAL. However, an unregistered firm
 *   suffers serious disabilities under Section 69 — it cannot sue
 *   third parties to enforce contractual rights. (Note: this is
 *   the very reason cited as a preliminary objection in Template 16,
 *   the Written Statement.)
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
      reference: "partnership-clauses",
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
      // ─── Title ───
      centeredBold("DEED OF PARTNERSHIP", 32),
      spacer, hrule(),

      // ─── Date and Place ───
      legalPara([
        new TextRun({ text: "THIS DEED OF PARTNERSHIP ", bold: true }),
        new TextRun("is executed at "),
        new TextRun({ text: "New Delhi ", bold: true }),
        new TextRun("on this "),
        new TextRun({ text: "________ ", bold: true }),
        new TextRun("day of "),
        new TextRun({ text: "________.", bold: true }),
      ]),

      spacer,

      // ─── Parties ───
      // A partnership deed can have any number of parties. They are
      // labelled as "First Party," "Second Party," etc. — distinct
      // from sale deeds which use Vendor/Vendee labels.
      legalPara([new TextRun({ text: "BETWEEN", bold: true, size: 26 })], { alignment: AlignmentType.CENTER }),
      spacer,

      legalPara([
        new TextRun({ text: "Sh. X ________", bold: true }),
        new TextRun(", S/o ________, R/o ________"),
        new TextRun({ text: ", hereinafter called the ", italics: true }),
        new TextRun({ text: "'FIRST PARTY'", bold: true, italics: true }),
        new TextRun({ text: ", which expression shall mean and include his heirs, successors, executors and legal representatives.", italics: true }),
      ]),

      spacer,
      legalPara([new TextRun({ text: "AND", bold: true, size: 26 })], { alignment: AlignmentType.CENTER }),
      spacer,

      legalPara([
        new TextRun({ text: "Sh. Y ________", bold: true }),
        new TextRun(", S/o Sh. ________, R/o ________"),
        new TextRun({ text: ", hereinafter called the ", italics: true }),
        new TextRun({ text: "'SECOND PARTY'", bold: true, italics: true }),
        new TextRun({ text: ", which expression shall mean and include his heirs, successors, executors and legal representatives.", italics: true }),
      ]),

      spacer, hrule(),

      // ─── Recitals ───
      legalPara([
        new TextRun({ text: "WHEREAS ", bold: true }),
        new TextRun("the First Party is in occupation as a tenant of property measuring ________ sq. ft. on the ground floor bearing No. ________."),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS ", bold: true }),
        new TextRun("the First Party is desirous of carrying on the business of ________, and the Second Party, being experienced in this trade, has approached the First Party to run this business with him jointly in partnership."),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS ", bold: true }),
        new TextRun("the parties have agreed to commence and run the business of ________ in partnership."),
      ]),

      spacer,

      // ─── Testatum ───
      centeredBold("NOW, THEREFORE, THIS DEED WITNESSES AS UNDER:", 22),
      spacer,

      // ─── The Operative Clauses ───
      // These clauses cover all the matters required by good
      // partnership drafting practice.

      // Clause 1: Firm name — under the Partnership Act, the firm
      // name must not be such as to mislead about the constitution
      // of the firm or imply patronage of the government.
      new Paragraph({ numbering: { reference: "partnership-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("The name and style of this partnership business shall be M/s ________.")] }),

      // Clause 2: Date of commencement
      new Paragraph({ numbering: { reference: "partnership-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("The business of this partnership shall be considered to have commenced on ________.")] }),

      // Clause 3: Place of business
      new Paragraph({ numbering: { reference: "partnership-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the principal place of business of this partnership shall be at ________. However, the same may be shifted or carried on elsewhere as well with the mutual consent of both the parties from time to time."
        )] }),

      // Clause 4: Nature of business
      new Paragraph({ numbering: { reference: "partnership-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the business of the partnership shall be ________. However, the parties will also be entitled to extend their activities into the business or manufacturing of any other item as well, by mutual consent."
        )] }),

      // Clause 5: Profit-sharing ratios — the MOST IMPORTANT clause
      // Without this clause, the Partnership Act presumes equal
      // sharing among all partners (Section 13(b)).
      new Paragraph({ numbering: { reference: "partnership-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "The shares of the parties in the profits and losses ", bold: true }),
          new TextRun("shall be as follows:"),
        ] }),

      legalPara([new TextRun("   (i)  First Party  – ________%")], { indent: { left: 1080 } }),
      legalPara([new TextRun("   (ii) Second Party – ________%")], { indent: { left: 1080 } }),

      // Clause 6: Capital contribution and interest
      new Paragraph({ numbering: { reference: "partnership-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "The initial capital has been contributed by both the parties by investing a sum of Rs. ________ each. If and when more funds are required for the business, the partners shall invest the same. However, any capital investment of the partners shall not carry any interest. In case loans or deposits are raised from outside (e.g. friends, relations, or financial institutions), only those loans or deposits which are taken with the written consent of both the partners and entered in the books of accounts of the partnership shall be binding on the firm."
        )] }),

      // Clause 7: Books of accounts
      new Paragraph({ numbering: { reference: "partnership-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "The partnership shall maintain regular books of accounts in accordance with the customs of trade, and all dealings of the partnership shall be duly recorded in the same. The account books etc. shall be maintained at the principal place of business."
        )] }),

      // Clause 8: Drawings — partners need monthly money to live on
      new Paragraph({ numbering: { reference: "partnership-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Each of the partners shall be entitled to withdraw a sum of Rs. ________ every month, which shall be adjustable in the final profit and loss account to be prepared every year."
        )] }),

      // Clause 9: Special withdrawal for the property tenant
      // (because the First Party is paying rent on the business premises)
      new Paragraph({ numbering: { reference: "partnership-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "The First Party shall also be entitled to withdraw a sum of Rs. ________ per month towards the rent he is paying to the landlord in respect of the portion of the property used by the partnership."
        )] }),

      // Clause 10: Tenancy rights remain personal — protects the First Party
      new Paragraph({ numbering: { reference: "partnership-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "The tenancy rights in respect of the property shall always vest in the First Party. Whenever the partnership is dissolved for any reason whatsoever, the Second Party shall not be entitled to any right, title or interest in the same."
        )] }),

      // Clause 11: Inspection rights
      new Paragraph({ numbering: { reference: "partnership-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the partnership shall maintain proper books of accounts in the normal course of business at the principal place of its business, and the same shall always be open for inspection to the partners."
        )] }),

      // Clause 12: Accounting period
      new Paragraph({ numbering: { reference: "partnership-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the first accounting period of the partnership shall close on 31st March ________, and thereafter the financial year shall run from 1st April every year to 31st March of the subsequent year."
        )] }),

      // Clause 13: Bank account operation
      new Paragraph({ numbering: { reference: "partnership-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the bank accounts of the partnership and/or its branches shall be operated under the signatures of any of the partners."
        )] }),

      // Clause 14: Annual accounts preparation
      new Paragraph({ numbering: { reference: "partnership-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That at the close of the accounting period, a trial balance, profit and loss account and balance sheet shall be prepared, and the profit and loss in the ratio enumerated above shall be credited/debited to the capital accounts of the partners."
        )] }),

      // Clause 15: Non-compete clause
      new Paragraph({ numbering: { reference: "partnership-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That neither party shall be entitled to carry on a similar or competitive trade individually or in partnership with any other person."
        )] }),

      // Clause 16: Partnership at will and dissolution notice
      new Paragraph({ numbering: { reference: "partnership-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "The partnership shall be at will. ", bold: true }),
          new TextRun("However, whenever any party intends to dissolve the same or retire from the same, he shall give an advance notice of 15 days to the other party, and during the period of notice, the profit and loss account and balance sheet shall be completed to finalize the accounts between the partners as well as with outsiders."),
        ] }),

      // Clause 17: Arbitration clause for disputes
      new Paragraph({ numbering: { reference: "partnership-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That in the event of any dispute arising between the parties with respect to any clause of this document or the working of the partnership or anything incidental thereto, the same shall be decided by arbitration in accordance with the provisions of the Arbitration and Conciliation Act, 1996, and by no other process."
        )] }),

      // Clause 18: Governing law
      new Paragraph({ numbering: { reference: "partnership-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That in all other matters not provided herein, the partnership shall be governed by the Indian Partnership Act, 1932, as applicable from time to time."
        )] }),

      spacer, hrule(),

      // ─── Testimonium & Signatures ───
      legalPara([
        new TextRun({ text: "IN WITNESS WHEREOF ", bold: true }),
        new TextRun("the parties have signed this document on the date first above written in the presence of the following witnesses."),
      ]),

      spacer, spacer,

      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 60 },
        children: [
          new TextRun({ text: "FIRST PARTY", bold: true }),
          new TextRun({ text: "\tSECOND PARTY", bold: true }),
        ],
      }),

      spacer, spacer,

      legalPara([new TextRun({ text: "WITNESSES:", bold: true, underline: {} })]),
      legalPara([new TextRun("(1) ________")]),
      legalPara([new TextRun("(2) ________")]),
    ],
  }],
});
