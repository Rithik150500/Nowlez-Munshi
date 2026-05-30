/**
 * MEMORANDUM OF UNDERSTANDING (MOU)
 * ────────────────────────────────────
 * Category : Commercial Drafting — Pre-contractual Document
 * Type     : Bilateral framework agreement
 * Statute  : Indian Contract Act, 1872 (for enforceability questions)
 * Source   : Standard form used in Indian commercial practice
 *
 * The Memorandum of Understanding, almost universally called an
 * MOU in Indian practice, is the first commercial drafting
 * template in your library and it introduces several conventions
 * that you should notice immediately because they are quite
 * different from anything in the litigation templates you have
 * built so far. Litigation documents are addressed to a court
 * and are written in a formal, third-person style with a clear
 * cause title and a structured hierarchy of paragraphs leading
 * to a prayer. Commercial documents, by contrast, are addressed
 * to the other party (or parties) and are written in a
 * contractual style that records the meeting of minds between
 * the parties. There is no court header, no cause title, no
 * prayer, and no verification. Instead, there is a date, a
 * description of the parties, a series of recitals explaining
 * the background, a set of operative provisions setting out
 * what the parties have agreed, and a signature block at the
 * end.
 *
 * THE FUNCTION OF AN MOU:
 *
 *   To grasp where the MOU fits in commercial practice, you
 *   have to understand the typical sequence of events in any
 *   significant business transaction. Two parties identify a
 *   potential opportunity to do business together. They have
 *   preliminary discussions. They reach a general
 *   understanding about what each party wants to achieve and
 *   how they might work together, but neither party is yet
 *   ready to commit to a final binding agreement because there
 *   are still many details to be worked out, due diligence to
 *   be conducted, regulatory approvals to be obtained, internal
 *   board approvals to be secured, and so on. Yet both parties
 *   want some kind of formal document to record their
 *   preliminary understanding so that they can move forward
 *   confidently and so that the other party cannot easily walk
 *   away from the discussions. This is the gap that an MOU
 *   fills. It records the framework of what the parties have
 *   agreed in principle, identifies the matters that still need
 *   to be worked out in the final agreement, and provides
 *   enough certainty to allow the parties to invest time and
 *   resources in moving the deal forward.
 *
 * THE BINDING VS NON-BINDING QUESTION:
 *
 *   The single most important question in MOU drafting is
 *   whether the document is intended to be legally binding or
 *   not. This question matters enormously because if the
 *   parties subsequently fall out and one of them sues the
 *   other for breach of the MOU, the court will have to
 *   determine whether the MOU created enforceable obligations
 *   in the first place. The Indian courts have been somewhat
 *   inconsistent on this point but the dominant approach can
 *   be summarised as follows.
 *
 *   First, the courts will look at the express language of the
 *   MOU itself. If the MOU contains a clear statement that it
 *   is non-binding or "subject to a definitive agreement," the
 *   courts will generally respect that intention and refuse to
 *   enforce the document as a contract. Conversely, if the MOU
 *   contains language stating that it is binding or that the
 *   parties intend to be bound by its terms, the courts will
 *   treat it as a contract.
 *
 *   Second, in the absence of express language one way or the
 *   other, the courts will examine the substance of the MOU
 *   to determine whether the essential terms of the
 *   transaction are sufficiently certain to constitute a
 *   contract. The Supreme Court has held in cases like Kollipara
 *   Sriramulu v. T. Aswatha Narayana that if all essential
 *   terms have been agreed and there is nothing left for
 *   further negotiation except matters of detail, the MOU may
 *   be treated as a binding contract even if the parties
 *   contemplated a more formal document later. If, on the
 *   other hand, important terms are left open for future
 *   negotiation, the MOU will be treated as a mere "agreement
 *   to agree" which is not enforceable.
 *
 *   The practical lesson is that a well-drafted MOU should
 *   make its binding or non-binding status absolutely clear,
 *   and should also identify which specific provisions (if
 *   any) are intended to be binding even if the rest of the
 *   document is not. The most common drafting approach is to
 *   state that the MOU as a whole is non-binding except for
 *   certain specifically identified provisions such as
 *   confidentiality, exclusivity, and dispute resolution.
 *   These "carved out" binding provisions are the parts of the
 *   MOU that the parties really do want to enforce immediately,
 *   while the substantive commercial terms remain non-binding
 *   until the final agreement is signed.
 *
 * THE STRUCTURE OF AN MOU:
 *
 *   A well-drafted MOU typically follows a structure that you
 *   should learn to recognise because it is the same basic
 *   structure used by virtually every commercial document in
 *   Indian practice.
 *
 *   First comes the title and date. The title says
 *   "Memorandum of Understanding" or sometimes "Heads of
 *   Terms" or "Term Sheet." The date is the date on which the
 *   document is signed by the parties, and it is important
 *   because it determines when the parties' obligations
 *   commence.
 *
 *   Second comes the parties clause, which identifies the
 *   parties to the MOU with their full legal names,
 *   incorporation details if they are companies, and registered
 *   addresses. The parties clause typically introduces
 *   shorthand names that will be used in the rest of the
 *   document, such as "the First Party" and "the Second
 *   Party" or "Party A" and "Party B."
 *
 *   Third come the recitals, which are paragraphs beginning
 *   with the word "WHEREAS" that explain the background to the
 *   MOU. The recitals are not operative provisions and do not
 *   themselves create rights or obligations. Their purpose is
 *   to set the scene so that the operative provisions can be
 *   understood in context. A good recital section explains who
 *   the parties are, what they do, why they are entering into
 *   the MOU, and what they hope to achieve.
 *
 *   Fourth comes the operative part, introduced by a phrase
 *   like "NOW IT IS HEREBY AGREED AS FOLLOWS:" The operative
 *   provisions are organised into numbered clauses, each
 *   covering one topic. The clauses are typically written in
 *   the present tense and use language like "the parties shall"
 *   or "the parties agree."
 *
 *   Fifth and finally comes the testimonium and signature
 *   block, which records the date of execution and the
 *   signatures of the parties or their authorised
 *   representatives.
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
      reference: "mou-clauses",
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
      // Notice the absence of any court header. This is a private
      // commercial document and is not addressed to any court.
      centeredBold("MEMORANDUM OF UNDERSTANDING", 32),
      spacer, hrule(),

      // ─── Date and Place ───
      // The date is critical because it determines when the
      // parties' obligations commence
      legalPara([
        new TextRun({ text: "THIS MEMORANDUM OF UNDERSTANDING ", bold: true }),
        new TextRun("(hereinafter referred to as 'the MOU') is made and executed at "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" on this "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" day of "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(", 20__ (hereinafter referred to as 'the Effective Date'),"),
      ]),

      spacer,

      // ─── Parties Clause ───
      // The parties clause uses "BY AND BETWEEN" — the standard
      // Indian commercial drafting convention. Notice how each
      // party is introduced with its full legal name, its
      // incorporation/registration details, and a defined short
      // name in brackets.
      legalPara([new TextRun({ text: "BY AND BETWEEN:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      spacer,

      legalPara([
        new TextRun({ text: "M/s ABC Pvt. Ltd.", bold: true }),
        new TextRun(", a company duly incorporated under the Companies Act, 2013, having its registered office at "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(", through its authorised representative "),
        new TextRun({ text: "Sh. ________", bold: true }),
        new TextRun(", duly authorised by Board Resolution dated "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" (hereinafter referred to as 'the "),
        new TextRun({ text: "First Party", bold: true }),
        new TextRun("' which expression shall, unless repugnant to the context or meaning thereof, be deemed to mean and include its successors and permitted assigns) of the "),
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
        new TextRun(", duly authorised by Board Resolution dated "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" (hereinafter referred to as 'the "),
        new TextRun({ text: "Second Party", bold: true }),
        new TextRun("' which expression shall, unless repugnant to the context or meaning thereof, be deemed to mean and include its successors and permitted assigns) of the "),
        new TextRun({ text: "SECOND PART.", bold: true }),
      ]),

      spacer,

      legalPara([new TextRun(
        "The First Party and the Second Party are hereinafter individually referred to as 'a Party' and collectively referred to as 'the Parties.'"
      )]),

      spacer,

      // ─── Recitals (WHEREAS clauses) ───
      // The recitals set the scene. They are not operative
      // provisions and do not themselves create rights or
      // obligations, but they explain the background so that the
      // operative provisions can be understood in context.
      legalPara([new TextRun({ text: "RECITALS:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      spacer,

      legalPara([
        new TextRun({ text: "WHEREAS, ", bold: true }),
        new TextRun("the First Party is engaged in the business of "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" and has substantial expertise, experience and resources in the field of "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(";"),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS, ", bold: true }),
        new TextRun("the Second Party is engaged in the business of "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" and has substantial expertise, experience and resources in the field of "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(";"),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS, ", bold: true }),
        new TextRun(
          "the Parties have had preliminary discussions and have arrived at a general understanding regarding the possibility of working together for the mutual benefit of both Parties in connection with "
        ),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" (hereinafter referred to as 'the Proposed Transaction');"),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS, ", bold: true }),
        new TextRun("the Parties wish to record their preliminary understanding and the framework of their proposed cooperation in writing through this MOU, with the intention of subsequently entering into a definitive agreement that will set out the binding terms and conditions of their relationship in detail;"),
      ]),

      legalPara([
        new TextRun({ text: "NOW, THEREFORE, ", bold: true }),
        new TextRun("in consideration of the mutual covenants and undertakings contained herein, and for other good and valuable consideration, the receipt and sufficiency of which is hereby acknowledged, the Parties hereby agree as follows:"),
      ]),

      spacer,

      // ─── Operative Provisions ───
      // Now the actual terms of the MOU begin. Each clause covers
      // one topic and is numbered for easy reference.

      // Clause 1: Purpose
      new Paragraph({ numbering: { reference: "mou-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "PURPOSE", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The purpose of this MOU is to record the preliminary understanding of the Parties regarding the Proposed Transaction and to provide a framework for the further negotiation and execution of a definitive agreement between the Parties. This MOU sets out the key terms on which the Parties intend to proceed and identifies the matters that will be addressed in greater detail in the definitive agreement."
      )]),

      spacer,

      // Clause 2: Scope of cooperation
      new Paragraph({ numbering: { reference: "mou-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "SCOPE OF COOPERATION", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Parties propose to cooperate with each other in the following manner: ________ (state in detail the nature and scope of the proposed cooperation, including the specific activities each Party will undertake, the resources each Party will contribute, the geographical scope of the cooperation, and the duration of the cooperation)."
      )]),

      spacer,

      // Clause 3: Roles and responsibilities
      new Paragraph({ numbering: { reference: "mou-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "ROLES AND RESPONSIBILITIES", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The First Party shall be responsible for ________ (state the specific responsibilities of the First Party). The Second Party shall be responsible for ________ (state the specific responsibilities of the Second Party). The Parties shall jointly be responsible for ________ (state any joint responsibilities)."
      )]),

      spacer,

      // Clause 4: Financial arrangements
      new Paragraph({ numbering: { reference: "mou-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "FINANCIAL ARRANGEMENTS", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The financial arrangements between the Parties, including the contribution of capital, the sharing of revenues and profits, and the allocation of costs and expenses, shall be as follows: ________ (state the financial framework). The detailed financial terms shall be set out in the definitive agreement to be executed between the Parties."
      )]),

      spacer,

      // Clause 5: Definitive agreement
      new Paragraph({ numbering: { reference: "mou-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "DEFINITIVE AGREEMENT", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Parties agree to negotiate in good faith and to use their best efforts to enter into a definitive agreement (hereinafter referred to as 'the Definitive Agreement') which shall set out the binding terms and conditions of their relationship in detail. The Parties shall endeavour to execute the Definitive Agreement on or before ________ (date), failing which either Party may terminate this MOU by giving written notice to the other Party."
      )]),

      spacer,

      // Clause 6: Confidentiality — typically a binding clause
      new Paragraph({ numbering: { reference: "mou-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "CONFIDENTIALITY", bold: true, underline: {} })] }),

      legalPara([
        new TextRun(
          "Each Party acknowledges that during the course of discussions relating to the Proposed Transaction, each Party may disclose to the other Party certain confidential information including but not limited to business plans, financial information, customer lists, technical know-how, trade secrets and other proprietary information. Each Party agrees to maintain the confidentiality of such information and shall not disclose it to any third party without the prior written consent of the disclosing Party. "
        ),
        new TextRun({ text: "This Clause 6 shall be binding on the Parties notwithstanding the non-binding nature of the rest of this MOU and shall survive the termination of this MOU.", bold: true }),
      ]),

      spacer,

      // Clause 7: Exclusivity — typically also a binding clause
      new Paragraph({ numbering: { reference: "mou-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "EXCLUSIVITY", bold: true, underline: {} })] }),

      legalPara([
        new TextRun(
          "During the period from the Effective Date until the earlier of the execution of the Definitive Agreement or the termination of this MOU, neither Party shall, directly or indirectly, solicit, negotiate or enter into any agreement with any third party in relation to the Proposed Transaction or any similar transaction. "
        ),
        new TextRun({ text: "This Clause 7 shall be binding on the Parties notwithstanding the non-binding nature of the rest of this MOU.", bold: true }),
      ]),

      spacer,

      // Clause 8: Costs and expenses
      new Paragraph({ numbering: { reference: "mou-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "COSTS AND EXPENSES", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "Each Party shall bear its own costs and expenses incurred in connection with the negotiation and execution of this MOU and the Definitive Agreement, including legal fees, due diligence costs and other professional fees."
      )]),

      spacer,

      // Clause 9: THE BINDING/NON-BINDING CLAUSE
      // This is the most important clause in the entire MOU
      // because it determines the legal status of the document
      new Paragraph({ numbering: { reference: "mou-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "BINDING NATURE OF THIS MOU", bold: true, underline: {} })] }),

      legalPara([
        new TextRun({ text: "Except for Clauses 6 (Confidentiality), 7 (Exclusivity), 10 (Governing Law) and 11 (Dispute Resolution), which are intended to be legally binding on the Parties, ", bold: true }),
        new TextRun({ text: "this MOU is intended only as a statement of the preliminary understanding of the Parties and is NOT intended to be legally binding on either Party. ", bold: true, underline: {} }),
        new TextRun(
          "No legal rights or obligations shall arise between the Parties in respect of the Proposed Transaction except pursuant to the terms of the Definitive Agreement when and if it is executed by both Parties."
        ),
      ]),

      spacer,

      // Clause 10: Governing law
      new Paragraph({ numbering: { reference: "mou-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "GOVERNING LAW", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "This MOU shall be governed by and construed in accordance with the laws of India. The courts at New Delhi shall have exclusive jurisdiction in respect of any matter or dispute arising out of or in connection with this MOU."
      )]),

      spacer,

      // Clause 11: Dispute resolution
      new Paragraph({ numbering: { reference: "mou-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "DISPUTE RESOLUTION", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "Any dispute or difference arising out of or in connection with this MOU shall first be attempted to be resolved through good faith negotiations between the Parties. If the dispute cannot be resolved through negotiations within thirty days, the dispute shall be referred to and finally resolved by arbitration in accordance with the provisions of the Arbitration and Conciliation Act, 1996. The arbitration shall be conducted by a sole arbitrator to be appointed by mutual consent of the Parties, with the seat of arbitration at New Delhi and the language of arbitration in English."
      )]),

      spacer, hrule(),

      // ─── Testimonium and Signature Block ───
      // Notice how this differs from litigation documents. There
      // is no verification, no prayer, no court address. Just
      // the formal recital of execution and the signature lines.
      legalPara([
        new TextRun({ text: "IN WITNESS WHEREOF, ", bold: true }),
        new TextRun("the Parties hereto have caused this Memorandum of Understanding to be executed by their respective duly authorised representatives on the day, month and year first written above."),
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
      // Two witnesses are typically required for the execution
      // of important commercial documents in India
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
