/**
 * NON-DISCLOSURE AGREEMENT (NDA) — MUTUAL
 * ──────────────────────────────────────────
 * Category : Commercial Drafting — Confidentiality Protection
 * Type     : Mutual (both parties disclose) bilateral agreement
 * Statute  : Indian Contract Act, 1872; tort of breach of confidence
 * Source   : Standard form used in Indian commercial practice
 *
 * The Non-Disclosure Agreement, almost universally called an NDA
 * in commercial practice, is the second commercial drafting
 * template in your library and it is by some distance the most
 * common commercial document signed in India today. Every
 * significant business interaction, from the first meeting
 * between a startup and a venture capitalist to the most
 * sophisticated corporate due diligence exercise, typically
 * begins with the parties signing an NDA. The reason is that
 * almost any meaningful commercial discussion requires the
 * parties to share some kind of sensitive information with each
 * other, and neither party wants to share that information
 * without some legal protection against its misuse.
 *
 * UNILATERAL vs MUTUAL NDAs:
 *
 *   The first thing you need to understand about NDAs is that
 *   they come in two distinct varieties. A UNILATERAL NDA, also
 *   called a one-way NDA, is used when only one party will be
 *   disclosing confidential information to the other. The
 *   typical scenario is a company sharing its trade secrets
 *   with a potential vendor, supplier, or service provider.
 *   In a unilateral NDA, only the receiving party has
 *   confidentiality obligations, and the disclosing party has
 *   no symmetric obligations because it is not receiving any
 *   confidential information from the other side. A MUTUAL
 *   NDA, also called a two-way NDA, is used when both parties
 *   will be exchanging confidential information with each
 *   other. The typical scenario is two companies discussing a
 *   potential business partnership, joint venture, or merger,
 *   where each side needs to share its own proprietary
 *   information in order to evaluate the proposed transaction.
 *   In a mutual NDA, both parties have symmetric
 *   confidentiality obligations.
 *
 *   This template is drafted as a mutual NDA because that is
 *   the more common form in practice, and because the mutual
 *   form covers the unilateral form as a special case (you
 *   can always use a mutual NDA in a one-way disclosure
 *   situation, but the reverse is not true).
 *
 * THE LEGAL FOUNDATIONS:
 *
 *   The enforceability of NDAs in India rests on three legal
 *   foundations that you should be aware of. First, NDAs are
 *   contracts and are therefore enforceable as such under the
 *   Indian Contract Act, 1872. The usual contractual
 *   requirements of offer, acceptance, consideration,
 *   capacity, and free consent must all be satisfied. Second,
 *   even in the absence of an express NDA, Indian law
 *   recognises a tort of breach of confidence which protects
 *   information that has been disclosed in circumstances
 *   importing an obligation of confidence. The leading case
 *   is the English decision in Coco v. AN Clark (Engineers)
 *   Ltd, which has been followed by Indian courts. Third,
 *   certain kinds of confidential information are protected
 *   by specific statutes, such as the Information Technology
 *   Act, 2000 (which protects sensitive personal data) and
 *   sectoral regulations governing banking, telecommunications,
 *   and so on.
 *
 *   In practice, parties prefer to have an express NDA rather
 *   than relying on the tort of breach of confidence because
 *   the express NDA provides much greater certainty about what
 *   information is protected, what uses are permitted, how
 *   long the obligation lasts, and what remedies are available
 *   in the event of breach.
 *
 * THE FIVE KEY CLAUSES:
 *
 *   A well-drafted NDA contains five clauses that you should
 *   learn to recognise and to draft yourself. These are the
 *   clauses that do the real work of the document and that
 *   determine its scope and effectiveness.
 *
 *   First is the DEFINITION OF CONFIDENTIAL INFORMATION. This
 *   is the most heavily negotiated clause in any NDA because it
 *   determines what is actually protected by the agreement. The
 *   definition needs to be broad enough to cover everything the
 *   disclosing party wants to protect but specific enough to
 *   give the receiving party fair notice of what they cannot
 *   disclose. A typical definition includes business plans,
 *   financial information, customer and supplier information,
 *   technical know-how, trade secrets, intellectual property,
 *   and any other information marked or identified as
 *   confidential.
 *
 *   Second are the EXCEPTIONS to the definition. These are the
 *   categories of information that, despite falling within the
 *   broad definition, are not treated as confidential because
 *   they are already in the public domain, were independently
 *   developed by the receiving party, or were lawfully obtained
 *   from a third party. The exceptions clause is essential
 *   because without it the receiving party would be in a
 *   constant state of legal jeopardy whenever it dealt with
 *   information that overlapped with publicly available
 *   knowledge.
 *
 *   Third are the OBLIGATIONS OF THE RECEIVING PARTY. These
 *   are the actual duties that the receiving party agrees to
 *   undertake in respect of the confidential information. The
 *   typical obligations include not disclosing the information
 *   to third parties, not using the information for any
 *   purpose other than evaluating the contemplated transaction,
 *   protecting the information with the same degree of care
 *   that the receiving party uses for its own confidential
 *   information, and limiting access to the information to
 *   employees who have a need to know.
 *
 *   Fourth is the TERM clause, which specifies how long the
 *   confidentiality obligations last. Some NDAs have a fixed
 *   term such as three years or five years. Others provide that
 *   the obligations continue indefinitely or until the
 *   information ceases to be confidential. The choice depends
 *   on the nature of the information and the expectations of
 *   the parties.
 *
 *   Fifth is the RETURN OR DESTRUCTION clause, which requires
 *   the receiving party to return or destroy all confidential
 *   information at the end of the relationship. This clause
 *   ensures that the disclosing party is not left with the
 *   indefinite risk of its information sitting in the
 *   receiving party's files long after the original purpose
 *   for the disclosure has ended.
 *
 * THE REMEDIES QUESTION:
 *
 *   One of the most difficult practical issues with NDAs is
 *   what remedies are actually available if the receiving
 *   party breaches the agreement. The challenge is that
 *   monetary damages are often very difficult to prove in
 *   confidentiality cases because the harm caused by
 *   unauthorised disclosure is intangible and may take years
 *   to manifest. For this reason, most NDAs include a clause
 *   acknowledging that monetary damages would be inadequate
 *   and that the disclosing party shall be entitled to seek
 *   injunctive relief without having to prove actual damages.
 *   This injunctive relief clause is enforceable in India
 *   under Section 38 of the Specific Relief Act, 1963, which
 *   permits perpetual injunctions to prevent the breach of
 *   a contractual obligation.
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
      reference: "nda-clauses",
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
      centeredBold("MUTUAL NON-DISCLOSURE AGREEMENT", 30),
      spacer, hrule(),

      // ─── Date and Place ───
      legalPara([
        new TextRun({ text: "THIS MUTUAL NON-DISCLOSURE AGREEMENT ", bold: true }),
        new TextRun("(hereinafter referred to as 'this Agreement') is made and executed at "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" on this "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" day of "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(", 20__ (hereinafter referred to as 'the Effective Date'),"),
      ]),

      spacer,

      // ─── Parties Clause ───
      legalPara([new TextRun({ text: "BY AND BETWEEN:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      spacer,

      legalPara([
        new TextRun({ text: "M/s ABC Pvt. Ltd.", bold: true }),
        new TextRun(", a company duly incorporated under the Companies Act, 2013, having its registered office at "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(", through its authorised representative "),
        new TextRun({ text: "Sh. ________", bold: true }),
        new TextRun(" (hereinafter referred to as 'the "),
        new TextRun({ text: "First Party", bold: true }),
        new TextRun("') of the "),
        new TextRun({ text: "FIRST PART;", bold: true }),
      ]),

      spacer,

      legalPara([new TextRun({ text: "AND", bold: true })],
        { alignment: AlignmentType.CENTER }),

      spacer,

      legalPara([
        new TextRun({ text: "M/s XYZ Ltd.", bold: true }),
        new TextRun(", a company duly incorporated under the Companies Act, 2013, having its registered office at "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(", through its authorised representative "),
        new TextRun({ text: "Sh. ________", bold: true }),
        new TextRun(" (hereinafter referred to as 'the "),
        new TextRun({ text: "Second Party", bold: true }),
        new TextRun("') of the "),
        new TextRun({ text: "SECOND PART.", bold: true }),
      ]),

      spacer,

      legalPara([new TextRun(
        "The First Party and the Second Party are hereinafter individually referred to as 'a Party' and collectively as 'the Parties'. The Party disclosing Confidential Information at any time is referred to as the 'Disclosing Party' and the Party receiving such Confidential Information is referred to as the 'Receiving Party'."
      )]),

      spacer,

      // ─── Recitals ───
      legalPara([new TextRun({ text: "RECITALS:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      spacer,

      legalPara([
        new TextRun({ text: "WHEREAS, ", bold: true }),
        new TextRun("the Parties are exploring the possibility of entering into a business relationship for the purpose of "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" (hereinafter referred to as 'the Purpose');"),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS, ", bold: true }),
        new TextRun("in connection with the Purpose, each Party may disclose to the other Party certain confidential and proprietary information;"),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS, ", bold: true }),
        new TextRun("the Parties wish to ensure that such confidential and proprietary information is protected from unauthorised disclosure or use, and accordingly desire to enter into this Agreement to define their respective rights and obligations in respect of such information;"),
      ]),

      legalPara([
        new TextRun({ text: "NOW, THEREFORE, ", bold: true }),
        new TextRun("in consideration of the mutual covenants and undertakings contained herein, the Parties hereby agree as follows:"),
      ]),

      spacer,

      // ─── Operative Clauses ───

      // Clause 1: Definition of Confidential Information — the
      // single most important clause in the entire NDA
      new Paragraph({ numbering: { reference: "nda-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "DEFINITION OF CONFIDENTIAL INFORMATION", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "For the purposes of this Agreement, 'Confidential Information' shall mean any and all information, whether oral, written, electronic, visual or in any other form, disclosed by one Party to the other Party in connection with the Purpose, including but not limited to: (a) business plans, strategies, financial information, projections and budgets; (b) customer lists, supplier lists, pricing information and marketing plans; (c) technical information, know-how, trade secrets, formulas, processes, designs, drawings, specifications and software; (d) intellectual property in any form, including patents, copyrights, trademarks and proprietary methods; (e) personnel information including details of employees, consultants and contractors; and (f) any other information that a reasonable person would understand to be confidential by virtue of its nature or the circumstances of its disclosure."
      )]),

      spacer,

      // Clause 2: Exceptions — equally important because they
      // limit the scope of the receiving party's obligations
      new Paragraph({ numbering: { reference: "nda-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "EXCEPTIONS TO CONFIDENTIAL INFORMATION", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "Confidential Information shall NOT include any information which: (a) is or becomes generally available to the public through no fault or breach of this Agreement by the Receiving Party; (b) was already in the lawful possession of the Receiving Party prior to the disclosure by the Disclosing Party, as evidenced by written records; (c) is independently developed by the Receiving Party without any reference to or use of the Confidential Information of the Disclosing Party; (d) is rightfully obtained by the Receiving Party from a third party who has the right to disclose such information without any obligation of confidentiality; or (e) is required to be disclosed by law, court order or governmental regulation, provided that the Receiving Party gives the Disclosing Party prompt prior written notice of such required disclosure to enable the Disclosing Party to seek appropriate protective measures."
      )]),

      spacer,

      // Clause 3: Obligations of the Receiving Party
      new Paragraph({ numbering: { reference: "nda-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "OBLIGATIONS OF THE RECEIVING PARTY", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Receiving Party hereby undertakes and agrees: (a) to hold all Confidential Information of the Disclosing Party in strict confidence and to protect the same with the same degree of care that the Receiving Party uses to protect its own confidential information of similar importance, but in no event with less than reasonable care; (b) not to disclose or otherwise make available the Confidential Information to any third party without the prior written consent of the Disclosing Party; (c) not to use the Confidential Information for any purpose whatsoever other than for evaluating and pursuing the Purpose; (d) to limit access to the Confidential Information to those of its directors, officers, employees, advisors and consultants who have a clear need to know such information for the Purpose, and only after such persons have been informed of the confidential nature of the information and have agreed to be bound by confidentiality obligations no less restrictive than those contained in this Agreement; and (e) to be responsible for any breach of this Agreement by any of its directors, officers, employees, advisors or consultants."
      )]),

      spacer,

      // Clause 4: Term
      new Paragraph({ numbering: { reference: "nda-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "TERM AND DURATION", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "This Agreement shall commence on the Effective Date and shall continue in force for a period of ________ years from the Effective Date, unless earlier terminated in accordance with the terms hereof. Notwithstanding the termination or expiration of this Agreement, the obligations of confidentiality and non-use set out in Clauses 1, 2 and 3 above shall survive and continue to bind the Receiving Party for a further period of ________ years after such termination or expiration, or in the case of trade secrets, for as long as such information remains a trade secret under applicable law."
      )]),

      spacer,

      // Clause 5: Return or destruction of confidential information
      new Paragraph({ numbering: { reference: "nda-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "RETURN OR DESTRUCTION OF CONFIDENTIAL INFORMATION", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "Upon the termination or expiration of this Agreement, or upon the written request of the Disclosing Party at any time, the Receiving Party shall promptly: (a) return to the Disclosing Party all originals and copies of any Confidential Information in any form; (b) permanently destroy all electronic copies of the Confidential Information stored in any of its systems and provide a written certificate of destruction signed by an authorised officer; and (c) cease all use of the Confidential Information for any purpose whatsoever."
      )]),

      spacer,

      // Clause 6: No license or transfer of rights
      new Paragraph({ numbering: { reference: "nda-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "NO LICENSE OR TRANSFER OF RIGHTS", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "Nothing in this Agreement shall be construed as granting to the Receiving Party any licence, ownership, or any other right or interest in or to the Confidential Information of the Disclosing Party. All Confidential Information shall remain the sole and exclusive property of the Disclosing Party. The disclosure of Confidential Information under this Agreement shall not constitute any commitment by either Party to enter into any further business relationship with the other Party."
      )]),

      spacer,

      // Clause 7: Remedies — injunctive relief is critical here
      new Paragraph({ numbering: { reference: "nda-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "REMEDIES FOR BREACH", bold: true, underline: {} })] }),

      legalPara([
        new TextRun(
          "Each Party acknowledges and agrees that any breach or threatened breach of this Agreement by the Receiving Party would cause immediate, substantial and irreparable harm to the Disclosing Party for which monetary damages would be inadequate. Accordingly, in addition to any other remedies that may be available at law or in equity, "
        ),
        new TextRun({ text: "the Disclosing Party shall be entitled to seek injunctive relief from a court of competent jurisdiction to prevent or restrain any actual or threatened breach of this Agreement, without the need to prove actual damages or to post any bond or other security.", bold: true }),
      ]),

      spacer,

      // Clause 8: Indemnification
      new Paragraph({ numbering: { reference: "nda-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "INDEMNIFICATION", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "Each Party agrees to indemnify and hold harmless the other Party from and against any and all losses, damages, costs and expenses (including reasonable attorney fees) suffered or incurred by the other Party as a direct or indirect result of any breach of this Agreement by the indemnifying Party, its directors, officers, employees, advisors or consultants."
      )]),

      spacer,

      // Clause 9: Governing law and jurisdiction
      new Paragraph({ numbering: { reference: "nda-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "GOVERNING LAW AND JURISDICTION", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "This Agreement shall be governed by and construed in accordance with the laws of India. Any dispute arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the courts at New Delhi."
      )]),

      spacer,

      // Clause 10: Entire agreement and amendments
      new Paragraph({ numbering: { reference: "nda-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "ENTIRE AGREEMENT AND AMENDMENTS", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "This Agreement constitutes the entire agreement between the Parties with respect to the subject matter hereof and supersedes all prior or contemporaneous oral or written communications, proposals or agreements between the Parties on the subject matter. No amendment or modification of this Agreement shall be valid unless made in writing and signed by both Parties."
      )]),

      spacer, hrule(),

      // ─── Testimonium and Signature Block ───
      legalPara([
        new TextRun({ text: "IN WITNESS WHEREOF, ", bold: true }),
        new TextRun("the Parties hereto have caused this Mutual Non-Disclosure Agreement to be executed by their respective duly authorised representatives on the day, month and year first written above."),
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
          new TextRun({ text: "M/s ABC Pvt. Ltd.", bold: true }),
          new TextRun({ text: "\tM/s XYZ Ltd.", bold: true }),
        ],
      }),
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 60 },
        children: [
          new TextRun({ text: "(First Party)", italics: true }),
          new TextRun({ text: "\t(Second Party)", italics: true }),
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

      // ─── Witnesses ───
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
