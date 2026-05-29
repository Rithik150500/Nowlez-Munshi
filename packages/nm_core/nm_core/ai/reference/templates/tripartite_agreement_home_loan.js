/**
 * TRIPARTITE AGREEMENT BETWEEN BUYER, BUILDER,
 * AND BANK FOR HOME LOAN
 * ─────────────────────────────────────────────
 * Category : Real Estate / Banking — Three-Party Agreement
 * Type     : Multilateral commercial agreement
 * Statute  : Indian Contract Act, 1872; Transfer of Property
 *            Act, 1882; Banking Regulation Act, 1949;
 *            Real Estate (Regulation and Development) Act, 2016
 * Source   : Standard form developed in Indian banking and
 *            real estate practice
 *
 * The Tripartite Agreement for Home Loan is the fourth template
 * in the real estate batch and it introduces an unusual kind of
 * commercial agreement that involves three parties rather than
 * two. To grasp where this template fits, you have to understand
 * the practical problem that it solves and the way in which the
 * three parties' interests are aligned and protected by the
 * agreement.
 *
 * THE PRACTICAL PROBLEM THAT THE TRIPARTITE ADDRESSES:
 *
 *   In a typical apartment purchase in modern India, the buyer
 *   does not have sufficient cash to pay the entire
 *   consideration upfront and therefore borrows a substantial
 *   portion of the consideration from a bank in the form of a
 *   home loan. The home loan is typically structured as a
 *   loan against the security of the apartment being purchased,
 *   with the apartment being mortgaged to the bank to secure
 *   the loan. This creates a chicken-and-egg problem because
 *   the apartment does not yet exist (it is still being
 *   constructed by the builder), and even if it did exist,
 *   the buyer does not yet own it (the title will pass only
 *   after the builder receives the entire consideration and
 *   executes the sale deed). So the buyer cannot mortgage
 *   what he does not yet own, and the bank cannot lend
 *   without security.
 *
 *   The Tripartite Agreement is the legal instrument that
 *   solves this problem by creating a coordinated arrangement
 *   between the three parties. The bank agrees to disburse
 *   the loan in instalments directly to the builder, linked
 *   to the construction milestones, in exchange for the
 *   builder's undertaking to deliver the apartment to the
 *   buyer and to facilitate the creation of a mortgage in
 *   favour of the bank upon the registration of the sale
 *   deed. The buyer agrees to repay the loan with interest
 *   and to mortgage the apartment to the bank upon receipt
 *   of title. The builder agrees to refund the loan amounts
 *   to the bank if the buyer cancels the booking or if the
 *   project is not completed.
 *
 * THE INTERLOCKING UNDERTAKINGS:
 *
 *   The most distinctive feature of the Tripartite Agreement
 *   is the set of interlocking undertakings that the three
 *   parties give to each other. The bank undertakes to
 *   disburse the loan to the builder on behalf of the buyer
 *   in instalments linked to the construction milestones,
 *   so that the builder receives funds as the construction
 *   progresses rather than having to wait until the
 *   completion of the project. The buyer undertakes to repay
 *   the loan to the bank with interest in equated monthly
 *   instalments and to mortgage the apartment to the bank
 *   upon obtaining title. The builder undertakes to deliver
 *   the apartment to the buyer in accordance with the
 *   Builder-Buyer Agreement and to refund any disbursed loan
 *   amounts to the bank in case the buyer cancels the
 *   booking or in case the project is not completed.
 *
 *   These interlocking undertakings create a structure in
 *   which each party's obligations are conditional on the
 *   performance of the other parties, and in which the
 *   risks of the transaction are allocated between the
 *   three parties in a way that protects the legitimate
 *   interests of all of them.
 *
 * THE EQUITABLE MORTGAGE:
 *
 *   Until the sale deed is registered and the apartment
 *   becomes the property of the buyer, the bank cannot
 *   create a formal mortgage over the apartment. However,
 *   the bank needs some form of security for the loan in
 *   the meantime. This problem is typically solved by the
 *   buyer creating an equitable mortgage in favour of the
 *   bank by depositing the original Builder-Buyer Agreement
 *   and any other relevant documents with the bank, with
 *   the intent to create security over the buyer's interest
 *   in the apartment under the Builder-Buyer Agreement.
 *   This equitable mortgage is then converted into a formal
 *   registered mortgage upon the registration of the sale
 *   deed, when the buyer actually owns the apartment.
 *
 * STRUCTURAL FEATURES OF THIS TEMPLATE:
 *
 *   The Tripartite Agreement has a more complex structure
 *   than the bilateral commercial agreements you have seen
 *   in earlier templates because it involves three parties
 *   rather than two. The parties clause identifies all
 *   three parties and gives each of them a defined role
 *   (buyer, builder, bank). The recitals establish the
 *   commercial context including the existence of the
 *   Builder-Buyer Agreement and the buyer's loan
 *   application to the bank. The operative provisions are
 *   organised into separate clauses for each party's
 *   obligations, with cross-references to the obligations
 *   of the other parties. The signature block requires
 *   signatures from all three parties.
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
      reference: "tri-clauses",
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
      centeredBold("TRIPARTITE AGREEMENT", 30),
      centeredBold("(Between the Buyer, the Builder, and the Bank for the", 22),
      centeredBold("Disbursement of a Home Loan)", 22),
      spacer, hrule(),

      // ─── Date ───
      legalPara([
        new TextRun({ text: "THIS TRIPARTITE AGREEMENT ", bold: true }),
        new TextRun("(hereinafter referred to as 'this Agreement') is made and executed at "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" on this "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" day of "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(", 20__,"),
      ]),

      spacer,

      // ─── Parties ───
      legalPara([new TextRun({ text: "BY AND AMONG:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      spacer,

      legalPara([
        new TextRun({ text: "Sh./Smt. ________", bold: true }),
        new TextRun(", S/o or D/o ________, aged about ________ years, residing at "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" (hereinafter referred to as 'the "),
        new TextRun({ text: "Buyer", bold: true }),
        new TextRun("') of the "),
        new TextRun({ text: "FIRST PART;", bold: true }),
      ]),

      spacer,

      legalPara([new TextRun({ text: "AND", bold: true })],
        { alignment: AlignmentType.CENTER }),

      spacer,

      legalPara([
        new TextRun({ text: "M/s ________ Developers Pvt. Ltd.", bold: true }),
        new TextRun(", a company duly incorporated under the Companies Act, 2013, having its registered office at "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(", through its authorised signatory "),
        new TextRun({ text: "Sh. ________", bold: true }),
        new TextRun(" (hereinafter referred to as 'the "),
        new TextRun({ text: "Builder", bold: true }),
        new TextRun("') of the "),
        new TextRun({ text: "SECOND PART;", bold: true }),
      ]),

      spacer,

      legalPara([new TextRun({ text: "AND", bold: true })],
        { alignment: AlignmentType.CENTER }),

      spacer,

      legalPara([
        new TextRun({ text: "________ Bank Ltd.", bold: true }),
        new TextRun(", a banking company incorporated under the Banking Regulation Act, 1949, having its registered office at "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" and a branch office at "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(", through its Branch Manager "),
        new TextRun({ text: "Sh. ________", bold: true }),
        new TextRun(" (hereinafter referred to as 'the "),
        new TextRun({ text: "Bank", bold: true }),
        new TextRun("') of the "),
        new TextRun({ text: "THIRD PART.", bold: true }),
      ]),

      spacer,

      // ─── Recitals ───
      legalPara([new TextRun({ text: "RECITALS:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      spacer,

      legalPara([
        new TextRun({ text: "WHEREAS, ", bold: true }),
        new TextRun("the Builder is the developer of a residential project known as '"),
        new TextRun({ text: "________", bold: true }),
        new TextRun("' situated at "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" (the 'said Project'), registered with the State RERA under Registration No. "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(";"),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS, ", bold: true }),
        new TextRun("the Buyer has booked Apartment No. "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" in the said Project (the 'said Apartment') and has executed a Builder-Buyer Agreement dated "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" with the Builder for a total consideration of Rs. "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(";"),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS, ", bold: true }),
        new TextRun("the Buyer has applied to the Bank for a home loan of Rs. "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" (the 'Loan') for the purpose of purchasing the said Apartment, and the Bank has approved the said Loan vide Sanction Letter dated "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(", subject to the execution of this Agreement and the Buyer's compliance with the Bank's standard loan documentation;"),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS, ", bold: true }),
        new TextRun("the Bank requires the Builder to undertake certain obligations in respect of the said Apartment as a condition of the disbursement of the Loan, and the Builder is willing to undertake the said obligations on the terms and conditions set out herein;"),
      ]),

      legalPara([
        new TextRun({ text: "NOW, THEREFORE, ", bold: true }),
        new TextRun("the Parties hereby agree as follows:"),
      ]),

      spacer,

      // ─── Operative Clauses ───

      // Clause 1: Disbursement of the Loan
      new Paragraph({ numbering: { reference: "tri-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "DISBURSEMENT OF THE LOAN", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Bank shall disburse the Loan in instalments directly to the Builder on behalf of the Buyer, in accordance with the construction-linked payment schedule set out in the Builder-Buyer Agreement. Each instalment shall be disbursed by the Bank within fifteen days of receipt of a written demand from the Builder accompanied by an architect's certificate confirming the completion of the relevant construction milestone, and a no-objection from the Buyer authorising the disbursement."
      )]),

      spacer,

      // Clause 2: Buyer's contribution
      new Paragraph({ numbering: { reference: "tri-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "BUYER'S CONTRIBUTION (MARGIN MONEY)", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Buyer shall pay the Buyer's own contribution (commonly called 'margin money') towards the consideration of the said Apartment, being Rs. ________, directly to the Builder. The Buyer's contribution shall be paid before any disbursement is made by the Bank, and the Buyer shall produce evidence of such payment to the satisfaction of the Bank."
      )]),

      spacer,

      // Clause 3: Repayment of the Loan
      new Paragraph({ numbering: { reference: "tri-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "REPAYMENT OF THE LOAN", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Buyer shall repay the Loan to the Bank in equated monthly instalments (EMIs) of Rs. ________ each, commencing from the month following the first disbursement of the Loan, in accordance with the repayment schedule set out in the Loan Agreement between the Buyer and the Bank. The Loan shall carry interest at the rate prescribed by the Bank from time to time, calculated on a monthly reducing balance basis."
      )]),

      spacer,

      // Clause 4: Pre-EMI interest
      new Paragraph({ numbering: { reference: "tri-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "PRE-EMI INTEREST", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "Until the entire Loan amount has been disbursed, the Buyer shall pay to the Bank only the interest on the disbursed portion of the Loan (commonly called 'pre-EMI interest'). The full EMIs (consisting of both principal and interest) shall commence from the month following the final disbursement of the Loan or from the month following the receipt of the occupancy certificate, whichever is earlier."
      )]),

      spacer,

      // Clause 5: Builder's undertakings
      new Paragraph({ numbering: { reference: "tri-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "BUILDER'S UNDERTAKINGS TO THE BANK", bold: true, underline: {} })] }),

      legalPara([
        new TextRun({ text: "The Builder hereby undertakes to the Bank as follows: ", bold: true }),
        new TextRun(
          "(a) to complete the construction of the said Apartment in accordance with the Builder-Buyer Agreement and to deliver vacant peaceful possession of the said Apartment to the Buyer by the agreed date; (b) to obtain the occupancy certificate and all other necessary clearances for the said Apartment; (c) to execute and register a Sale Deed in favour of the Buyer in respect of the said Apartment immediately upon the receipt of the entire consideration; (d) to permit the Bank to create a charge or mortgage on the said Apartment in favour of the Bank to secure the Loan; (e) not to mortgage, sell, alienate, or encumber the said Apartment to any person other than the Buyer; and (f) not to make any structural changes to the said Apartment without the prior written consent of the Bank."
        ),
      ]),

      spacer,

      // Clause 6: Refund obligation of the Builder
      new Paragraph({ numbering: { reference: "tri-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "BUILDER'S REFUND OBLIGATION", bold: true, underline: {} })] }),

      legalPara([
        new TextRun({ text: "If the Builder fails to complete the construction or to deliver possession of the said Apartment to the Buyer for any reason, ", bold: true }),
        new TextRun(
          "or if the Buyer cancels the booking of the said Apartment for any valid reason, the Builder shall refund directly to the Bank the entire amount disbursed by the Bank to the Builder under this Agreement, along with interest at the rate prescribed by the Bank from the dates of the respective disbursements till the dates of the refunds. The Bank shall have a first charge on all such refunds, and the Buyer shall not be entitled to receive any refund directly from the Builder until the Bank has been fully repaid."
        ),
      ]),

      spacer,

      // Clause 7: Equitable mortgage
      new Paragraph({ numbering: { reference: "tri-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "EQUITABLE MORTGAGE OVER THE BUYER'S RIGHTS", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "Pending the registration of the Sale Deed and the creation of a formal mortgage over the said Apartment, the Buyer hereby creates an equitable mortgage in favour of the Bank by depositing with the Bank the original Builder-Buyer Agreement and all other relevant documents pertaining to the said Apartment, with the intent of creating security over the Buyer's rights, interest, and beneficial ownership in the said Apartment under the Builder-Buyer Agreement. The said equitable mortgage shall continue until it is replaced by a formal registered mortgage upon the registration of the Sale Deed."
      )]),

      spacer,

      // Clause 8: Formal mortgage upon registration of sale deed
      new Paragraph({ numbering: { reference: "tri-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "REGISTERED MORTGAGE UPON SALE DEED", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "Upon the registration of the Sale Deed in favour of the Buyer, the Buyer shall, within thirty days, execute and register a Mortgage Deed in favour of the Bank in respect of the said Apartment, in such form and on such terms as the Bank may prescribe. The Buyer shall bear the cost of the Mortgage Deed including stamp duty and registration charges. The Buyer shall also deposit the original Sale Deed and all other title documents with the Bank, to remain in the custody of the Bank until the Loan has been fully repaid."
      )]),

      spacer,

      // Clause 9: Insurance
      new Paragraph({ numbering: { reference: "tri-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "INSURANCE", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Buyer shall, at his own cost, take out a comprehensive insurance policy covering the said Apartment against fire, earthquake, flood, and other natural calamities, for an amount not less than the outstanding Loan amount, with the Bank named as the loss payee. The insurance shall be maintained in force throughout the duration of the Loan, and the Buyer shall produce evidence of such insurance to the Bank annually."
      )]),

      spacer,

      // Clause 10: Default and consequences
      new Paragraph({ numbering: { reference: "tri-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "DEFAULT AND CONSEQUENCES", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "If the Buyer defaults in the repayment of any EMI or commits any other material breach of this Agreement, the Bank shall be entitled to recall the entire outstanding Loan amount, to enforce the security created in its favour, and to sell the said Apartment in accordance with the SARFAESI Act, 2002 or any other applicable law to recover the dues. The Builder shall provide all necessary cooperation to the Bank in such enforcement proceedings."
      )]),

      spacer,

      // Clause 11: Independent obligations
      new Paragraph({ numbering: { reference: "tri-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "INDEPENDENT OBLIGATIONS", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "Nothing in this Agreement shall affect the independent rights and obligations of the Buyer and the Builder under the Builder-Buyer Agreement, or the independent rights and obligations of the Buyer and the Bank under the Loan Agreement. This Agreement is intended to coordinate the relationship between the three Parties and to facilitate the disbursement of the Loan and the construction and delivery of the said Apartment, and shall not be construed to alter the substantive rights of the Parties under the said other agreements."
      )]),

      spacer, hrule(),

      // ─── Testimonium ───
      legalPara([
        new TextRun({ text: "IN WITNESS WHEREOF, ", bold: true }),
        new TextRun("the Parties hereto have executed this Tripartite Agreement at the place and on the date first above written."),
      ]),

      spacer, spacer,

      legalPara([new TextRun({ text: "For the BUYER:", bold: true, underline: {} })]),
      legalPara([new TextRun("________________________")]),
      legalPara([new TextRun({ text: "Name: ________ | Signature: ________", bold: true })]),

      spacer,

      legalPara([new TextRun({ text: "For the BUILDER:", bold: true, underline: {} })]),
      legalPara([new TextRun("For M/s ________ Developers Pvt. Ltd.")]),
      legalPara([new TextRun("________________________")]),
      legalPara([new TextRun({ text: "Authorised Signatory", bold: true })]),

      spacer,

      legalPara([new TextRun({ text: "For the BANK:", bold: true, underline: {} })]),
      legalPara([new TextRun("For ________ Bank Ltd.")]),
      legalPara([new TextRun("________________________")]),
      legalPara([new TextRun({ text: "Branch Manager / Authorised Officer", bold: true })]),

      spacer, spacer,

      legalPara([new TextRun({ text: "WITNESSES:", bold: true, underline: {} })]),
      spacer,
      legalPara([new TextRun({ text: "1. Name: ________ | Address: ________ | Signature: ________", bold: true })]),
      spacer,
      legalPara([new TextRun({ text: "2. Name: ________ | Address: ________ | Signature: ________", bold: true })]),

      spacer, spacer,

      legalPara([
        new TextRun({ text: "[NOTE: ", bold: true, italics: true }),
        new TextRun({ text: "This agreement should be executed on stamp paper of appropriate value as per the State stamp duty rates. The agreement is typically not registered separately because the substantive transaction (the sale of the apartment) is already covered by the Builder-Buyer Agreement and will be further covered by the Sale Deed and the Mortgage Deed in due course.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
