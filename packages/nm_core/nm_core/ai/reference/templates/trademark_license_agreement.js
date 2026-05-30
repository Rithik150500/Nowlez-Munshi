/**
 * TRADEMARK LICENSE AGREEMENT
 * ──────────────────────────────
 * Category : Intellectual Property — Commercial IP Transaction
 * Type     : Bilateral licensor-licensee agreement
 * Statute  : Trade Marks Act, 1999 (Sections 48 to 55);
 *            Indian Contract Act, 1872
 * Source   : Standard form used in Indian commercial practice
 *
 * The Trademark License Agreement is the fourth IP template in
 * your library and it introduces the commercial transactional
 * dimension of intellectual property practice. To grasp where the
 * trademark licence fits, you should compare it with the other
 * commercial drafting templates in your library at 56 to 60. The
 * trademark licence shares the basic structural conventions of
 * commercial drafting (date, parties, recitals, operative
 * provisions, testimonium, signature block) that you have already
 * learned, but it has its own distinctive features that reflect
 * the peculiar nature of trademark rights.
 *
 * THE COMMERCIAL FUNCTION OF TRADEMARK LICENSING:
 *
 *   To grasp why trademark licensing matters, you have to
 *   understand that a trademark is not just a legal right but
 *   also a commercial asset of substantial value. Many of the
 *   most valuable companies in the world derive a significant
 *   portion of their value from their trademarks, and the
 *   licensing of these trademarks to third parties is one of
 *   the principal ways in which the commercial value is
 *   monetised. The owner of a famous trademark can license
 *   the right to use the mark to manufacturers, retailers,
 *   franchisees, and other commercial partners in exchange
 *   for royalty payments, and in many industries the
 *   licensing income exceeds the income from the direct sale
 *   of products bearing the mark.
 *
 *   The trademark licence is the legal instrument that
 *   formalises this commercial relationship. It grants the
 *   licensee a defined right to use the licensor's trademark
 *   in connection with specified goods or services, subject
 *   to specified conditions, in exchange for specified
 *   payments. Without a written licence, the use of someone
 *   else's trademark would constitute infringement under
 *   Section 29 of the Trade Marks Act, 1999, and the user
 *   would face the risk of an injunction, damages, and other
 *   remedies of the kind that you saw at Template 72.
 *
 * THE QUALITY CONTROL REQUIREMENT:
 *
 *   The most distinctive legal issue in trademark licensing
 *   is the QUALITY CONTROL requirement. Unlike a copyright
 *   licence or a patent licence, a trademark licence carries
 *   with it an inherent obligation on the part of the
 *   licensor to maintain quality control over the goods or
 *   services sold under the licensed mark. This requirement
 *   arises because trademarks function as indicators of
 *   commercial origin and as guarantees of consistent quality
 *   to consumers, and a trademark that is used by multiple
 *   licensees without quality control would lose its ability
 *   to perform these functions and would risk being
 *   considered abandoned or generic.
 *
 *   In Indian law, the quality control requirement is
 *   reflected in the concept of "registered user" under
 *   Sections 48 to 55 of the Trade Marks Act, 1999. A
 *   registered user is a person other than the registered
 *   proprietor who has been authorised to use the mark on
 *   particular goods or services in connection with which
 *   the mark is registered, and the registration of the
 *   user is meant to formalise the licensor's quality
 *   control over the licensee's use of the mark. The 1999
 *   Act made the registered user provisions less mandatory
 *   than they were under the earlier 1958 Act, and in
 *   modern practice, most trademark licences are not
 *   formally registered as registered user agreements but
 *   rather operate as ordinary contractual licences.
 *   However, the quality control requirement remains
 *   important as a substantive matter even in unregistered
 *   licences, because the licensor must be able to show
 *   that it actually controls the use of the mark by the
 *   licensee in order to maintain its rights in the mark.
 *
 *   This is why every well-drafted trademark licence
 *   contains detailed quality control provisions that
 *   require the licensee to use the mark only in the manner
 *   approved by the licensor, to submit samples for approval
 *   before use, to maintain specified quality standards in
 *   the manufacture of the licensed goods, and to permit
 *   the licensor to inspect the licensee's premises and
 *   records.
 *
 * EXCLUSIVITY AND SCOPE:
 *
 *   Trademark licences come in three main varieties based
 *   on the degree of exclusivity granted to the licensee.
 *   An EXCLUSIVE LICENCE gives the licensee the sole right
 *   to use the mark in the licensed territory and for the
 *   licensed goods or services, and the licensor itself is
 *   excluded from competing with the licensee in that
 *   defined scope. A SOLE LICENCE gives the licensee the
 *   right to use the mark to the exclusion of all other
 *   licensees, but the licensor itself retains the right
 *   to use the mark alongside the licensee. A NON-EXCLUSIVE
 *   LICENCE gives the licensee the right to use the mark
 *   but does not exclude the licensor or any other
 *   licensees from competing.
 *
 *   The choice between these three varieties depends on
 *   the commercial bargain between the parties and on the
 *   royalty rate that the parties have agreed. Exclusive
 *   licences command the highest royalties because they
 *   give the licensee the most valuable rights, while
 *   non-exclusive licences command lower royalties because
 *   they give the licensee less protection from
 *   competition.
 *
 * THE ROYALTY STRUCTURE:
 *
 *   Trademark royalties are typically calculated as a
 *   percentage of the licensee's net sales of the licensed
 *   goods or services, with rates ranging from one or two
 *   percent for industrial products with thin margins to
 *   ten or fifteen percent or more for premium consumer
 *   brands. The licence agreement typically also provides
 *   for a minimum guaranteed royalty payable regardless of
 *   actual sales, to ensure that the licensor receives a
 *   minimum return even if the licensee fails to develop
 *   the market effectively.
 *
 * STRUCTURAL FEATURES OF THIS TEMPLATE:
 *
 *   Look at how Template 74 reflects all the commercial
 *   drafting conventions you learned at Templates 56 to 60,
 *   while adding the IP-specific features that make it a
 *   trademark licence rather than a generic commercial
 *   agreement.
 *
 *   The recitals identify the licensor as the registered
 *   proprietor of specific trademarks and explain the
 *   commercial context in which the licence is being
 *   granted. The grant clause defines the scope of the
 *   licence including the territory, the goods or services,
 *   the term, and the degree of exclusivity. The quality
 *   control clause sets out the licensor's continuing
 *   control over the use of the mark by the licensee. The
 *   royalty clause specifies the financial terms. The
 *   reporting and inspection clauses ensure that the
 *   licensor has visibility into the licensee's use of the
 *   mark. And the termination clause defines the
 *   circumstances in which the licence can be terminated
 *   and the consequences of termination.
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
      reference: "tml-clauses",
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
      centeredBold("TRADEMARK LICENSE AGREEMENT", 30),
      spacer, hrule(),

      // ─── Date ───
      legalPara([
        new TextRun({ text: "THIS TRADEMARK LICENSE AGREEMENT ", bold: true }),
        new TextRun("(hereinafter referred to as 'this Agreement') is made and executed at "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" on this "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" day of "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(", 20__ (the 'Effective Date'),"),
      ]),

      spacer,

      // ─── Parties ───
      legalPara([new TextRun({ text: "BY AND BETWEEN:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      spacer,

      legalPara([
        new TextRun({ text: "M/s ABC Brands Pvt. Ltd.", bold: true }),
        new TextRun(", a company duly incorporated under the Companies Act, 2013, having its registered office at "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(", through its authorised representative "),
        new TextRun({ text: "Sh. ________", bold: true }),
        new TextRun(" (hereinafter referred to as 'the "),
        new TextRun({ text: "Licensor", bold: true }),
        new TextRun("') of the "),
        new TextRun({ text: "FIRST PART;", bold: true }),
      ]),

      spacer,

      legalPara([new TextRun({ text: "AND", bold: true })],
        { alignment: AlignmentType.CENTER }),

      spacer,

      legalPara([
        new TextRun({ text: "M/s XYZ Manufacturing Pvt. Ltd.", bold: true }),
        new TextRun(", a company duly incorporated under the Companies Act, 2013, having its registered office at "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(", through its authorised representative "),
        new TextRun({ text: "Sh. ________", bold: true }),
        new TextRun(" (hereinafter referred to as 'the "),
        new TextRun({ text: "Licensee", bold: true }),
        new TextRun("') of the "),
        new TextRun({ text: "SECOND PART.", bold: true }),
      ]),

      spacer,

      legalPara([new TextRun(
        "The Licensor and the Licensee are hereinafter individually referred to as 'a Party' and collectively as 'the Parties'."
      )]),

      spacer,

      // ─── Recitals ───
      legalPara([new TextRun({ text: "RECITALS:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      spacer,

      legalPara([
        new TextRun({ text: "WHEREAS, ", bold: true }),
        new TextRun("the Licensor is the registered proprietor of the trade mark "),
        new TextRun({ text: "'________' ", bold: true, underline: {} }),
        new TextRun("(the 'Licensed Mark') registered under No. ________ in Class ________ in respect of "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(", and has been continuously using the said mark in India since "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(";"),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS, ", bold: true }),
        new TextRun("the Licensed Mark has acquired substantial reputation and goodwill in India and is associated by the trade and the public exclusively with the Licensor's goods/services;"),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS, ", bold: true }),
        new TextRun("the Licensee is engaged in the business of manufacturing and selling "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" and is desirous of obtaining a licence from the Licensor to use the Licensed Mark in connection with the said business;"),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS, ", bold: true }),
        new TextRun("the Licensor is willing to grant such a licence to the Licensee on the terms and conditions set out herein;"),
      ]),

      legalPara([
        new TextRun({ text: "NOW, THEREFORE, ", bold: true }),
        new TextRun("in consideration of the mutual covenants and undertakings contained herein, the Parties hereby agree as follows:"),
      ]),

      spacer,

      // ─── Operative Clauses ───

      // Clause 1: Grant of Licence
      new Paragraph({ numbering: { reference: "tml-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "GRANT OF LICENCE", bold: true, underline: {} })] }),

      legalPara([
        new TextRun(
          "Subject to the terms and conditions of this Agreement, the Licensor hereby grants to the Licensee a "
        ),
        new TextRun({ text: "non-exclusive, non-transferable, revocable licence ", bold: true }),
        new TextRun(
          "to use the Licensed Mark solely in connection with the manufacture, marketing, distribution and sale of ________ (the 'Licensed Products') in the Territory of India during the Term of this Agreement. The Licensee shall not have the right to use the Licensed Mark for any other goods or services or in any other territory without the prior written consent of the Licensor."
        ),
      ]),

      spacer,

      // Clause 2: Reservation of Rights
      new Paragraph({ numbering: { reference: "tml-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "RESERVATION OF RIGHTS", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "All rights in and to the Licensed Mark not expressly granted to the Licensee under this Agreement are reserved by the Licensor. Nothing in this Agreement shall be construed as transferring any ownership in the Licensed Mark to the Licensee. The Licensee acknowledges that the Licensor is and shall remain the sole and exclusive owner of all right, title and interest in and to the Licensed Mark, including all goodwill associated with the use of the Licensed Mark by the Licensee, which goodwill shall enure exclusively to the benefit of the Licensor."
      )]),

      spacer,

      // Clause 3: Term
      new Paragraph({ numbering: { reference: "tml-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "TERM", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "This Agreement shall commence on the Effective Date and shall continue in force for an initial term of ________ years (the 'Initial Term'), unless earlier terminated in accordance with the provisions of this Agreement. The Parties may extend the Initial Term by mutual written agreement on terms to be agreed at the time of extension."
      )]),

      spacer,

      // Clause 4: Quality Control — the most distinctive
      // trademark-specific clause
      new Paragraph({ numbering: { reference: "tml-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "QUALITY CONTROL", bold: true, underline: {} })] }),

      legalPara([
        new TextRun({ text: "The Licensee acknowledges that the Licensed Mark is a valuable asset of the Licensor and that the maintenance of high quality standards in the Licensed Products is essential to the protection of the goodwill associated with the Licensed Mark. ", bold: true }),
        new TextRun(
          "Accordingly, the Licensee shall manufacture and sell the Licensed Products in strict accordance with the quality standards, specifications, and guidelines provided by the Licensor from time to time. Before commencing the manufacture of any Licensed Products, the Licensee shall submit prototypes and samples to the Licensor for approval, and shall not commence commercial production until written approval has been received from the Licensor. The Licensor shall have the right at all reasonable times to inspect the manufacturing facilities, quality control records, and finished products of the Licensee, either through its own representatives or through independent third-party inspectors, to verify compliance with the quality standards. If the Licensor finds that the Licensee is not maintaining the prescribed quality standards, the Licensor shall give written notice to the Licensee specifying the deficiencies, and the Licensee shall remedy the deficiencies within thirty days of the receipt of such notice."
        ),
      ]),

      spacer,

      // Clause 5: Manner of Use of the Licensed Mark
      new Paragraph({ numbering: { reference: "tml-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "MANNER OF USE OF THE LICENSED MARK", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Licensee shall use the Licensed Mark only in the form, style, colour, and manner approved in writing by the Licensor. The Licensee shall not modify, alter, abbreviate, or create any derivative version of the Licensed Mark, and shall not combine the Licensed Mark with any other trademark, brand name, or symbol without the prior written consent of the Licensor. The Licensee shall ensure that every use of the Licensed Mark is accompanied by an appropriate notice of trademark registration, such as the symbol \u00ae or the words 'Registered Trade Mark', and shall acknowledge the Licensor's ownership of the Licensed Mark on all packaging, advertising, and promotional materials."
      )]),

      spacer,

      // Clause 6: Royalty
      new Paragraph({ numbering: { reference: "tml-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "ROYALTY", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "In consideration of the licence granted hereunder, the Licensee shall pay to the Licensor a royalty equal to ________ % (________ percent) of the Net Sales of the Licensed Products by the Licensee during each calendar quarter. For the purposes of this Agreement, 'Net Sales' shall mean the gross invoice value of the Licensed Products sold by the Licensee, less applicable taxes, returns, allowances, and trade discounts. The Licensee shall also pay a minimum guaranteed royalty of Rs. ________ per annum, payable in equal quarterly instalments, regardless of the actual Net Sales achieved during the year."
      )]),

      spacer,

      // Clause 7: Reporting and Records
      new Paragraph({ numbering: { reference: "tml-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "REPORTING AND RECORDS", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Licensee shall maintain accurate books and records of all sales of the Licensed Products and shall provide the Licensor with quarterly reports of the Net Sales achieved during each calendar quarter, along with the calculation of the royalty payable. The Licensor shall have the right, at its own cost, to appoint an independent chartered accountant to audit the books and records of the Licensee for the purpose of verifying the accuracy of the royalty payments. If any audit reveals an underpayment of royalties of more than five percent of the amount actually due, the Licensee shall bear the cost of the audit and shall pay the underpaid amount along with interest at the rate of ________ % per annum."
      )]),

      spacer,

      // Clause 8: Marking and Notice
      new Paragraph({ numbering: { reference: "tml-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "MARKING AND NOTICE", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Licensee shall ensure that all Licensed Products and all packaging, labels, advertising materials, and promotional materials bearing the Licensed Mark contain a clear notice that the Licensed Mark is the registered trademark of the Licensor and that the Licensee is using the same under licence from the Licensor. The form of the notice shall be as approved by the Licensor in writing."
      )]),

      spacer,

      // Clause 9: Infringement and Enforcement
      new Paragraph({ numbering: { reference: "tml-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "INFRINGEMENT AND ENFORCEMENT", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Licensee shall promptly notify the Licensor of any actual or suspected infringement of the Licensed Mark by any third party that comes to its attention. The Licensor shall have the sole right to decide whether to take any enforcement action against any such infringement, and the Licensee shall provide reasonable cooperation to the Licensor in any such enforcement action. The Licensee shall not initiate any enforcement action in its own name without the prior written consent of the Licensor."
      )]),

      spacer,

      // Clause 10: Termination
      new Paragraph({ numbering: { reference: "tml-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "TERMINATION", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "Either Party may terminate this Agreement by giving the other Party ninety days' written notice. Notwithstanding the foregoing, the Licensor may terminate this Agreement immediately by written notice to the Licensee in the event of (a) any material breach of this Agreement by the Licensee that is not remedied within thirty days of written notice; (b) any failure by the Licensee to maintain the prescribed quality standards; (c) any failure by the Licensee to pay the royalties when due; (d) the insolvency, bankruptcy, or winding up of the Licensee; (e) any change in the control or ownership of the Licensee; or (f) any act or omission of the Licensee that brings the Licensor or the Licensed Mark into disrepute."
      )]),

      spacer,

      // Clause 11: Effect of Termination
      new Paragraph({ numbering: { reference: "tml-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "EFFECT OF TERMINATION", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "Upon termination of this Agreement for any reason, the Licensee shall immediately cease all use of the Licensed Mark, shall destroy or return to the Licensor all materials bearing the Licensed Mark, and shall pay all royalties accrued up to the date of termination. The Licensee shall also be entitled to a sell-off period of ninety days during which it may sell off any Licensed Products in stock at the time of termination, subject to the continued payment of royalties on such sales."
      )]),

      spacer,

      // Clause 12: Governing Law and Dispute Resolution
      new Paragraph({ numbering: { reference: "tml-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "GOVERNING LAW AND DISPUTE RESOLUTION", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "This Agreement shall be governed by and construed in accordance with the laws of India. Any dispute arising out of or in connection with this Agreement shall be resolved by arbitration in accordance with the provisions of the Arbitration and Conciliation Act, 1996, by a sole arbitrator to be appointed by mutual consent of the Parties, with the seat of arbitration at New Delhi and the language of arbitration in English. Notwithstanding the foregoing, the Licensor shall have the right to seek interim injunctive relief from any court of competent jurisdiction to prevent any unauthorised use of the Licensed Mark."
      )]),

      spacer, hrule(),

      // ─── Testimonium and Signature Block ───
      legalPara([
        new TextRun({ text: "IN WITNESS WHEREOF, ", bold: true }),
        new TextRun("the Parties hereto have caused this Trademark License Agreement to be executed by their respective duly authorised representatives on the day, month and year first written above."),
      ]),

      spacer, spacer,

      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 60 },
        children: [
          new TextRun({ text: "For and on behalf of", bold: true }),
          new TextRun({ text: "\tFor and on behalf of", bold: true }),
        ],
      }),
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 60 },
        children: [
          new TextRun({ text: "M/s ABC Brands Pvt. Ltd.", bold: true }),
          new TextRun({ text: "\tM/s XYZ Manufacturing Pvt. Ltd.", bold: true }),
        ],
      }),
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 60 },
        children: [
          new TextRun({ text: "(The Licensor)", italics: true }),
          new TextRun({ text: "\t(The Licensee)", italics: true }),
        ],
      }),

      spacer, spacer, spacer,

      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 60 },
        children: [
          new TextRun("________________________"),
          new TextRun("\t________________________"),
        ],
      }),
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 60 },
        children: [
          new TextRun({ text: "Authorised Signatory", bold: true }),
          new TextRun({ text: "\tAuthorised Signatory", bold: true }),
        ],
      }),
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 60 },
        children: [
          new TextRun("Name: ________"),
          new TextRun("\tName: ________"),
        ],
      }),
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 60 },
        children: [
          new TextRun("Designation: ________"),
          new TextRun("\tDesignation: ________"),
        ],
      }),

      spacer, spacer,

      legalPara([new TextRun({ text: "WITNESSES:", bold: true, underline: {} })]),
      spacer,
      legalPara([new TextRun({ text: "1. Name: ________", bold: true })]),
      legalPara([new TextRun("   Address: ________")]),
      legalPara([new TextRun("   Signature: ________")]),
      spacer,
      legalPara([new TextRun({ text: "2. Name: ________", bold: true })]),
      legalPara([new TextRun("   Address: ________")]),
      legalPara([new TextRun("   Signature: ________")]),
    ],
  }],
});
