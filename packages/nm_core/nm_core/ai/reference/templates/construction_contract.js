/**
 * CONSTRUCTION CONTRACT (WORKS CONTRACT AGREEMENT)
 * BETWEEN OWNER AND CONTRACTOR
 * ─────────────────────────────────────────────
 * Category : Real Estate / Construction — Commercial
 *            Works Contract
 * Type     : Bilateral owner-contractor agreement
 * Statute  : Indian Contract Act, 1872; Sale of Goods Act,
 *            1930 (for materials supplied); Specific Relief
 *            Act, 1963; Central Goods and Services Tax Act,
 *            2017 (Section 2(119) for the definition of
 *            "works contract")
 * Source   : Standard form developed in Indian construction
 *            practice, broadly aligned with FIDIC and other
 *            international construction standards
 *
 * The Construction Contract is the fifth and final template in
 * the real estate batch and it introduces the works contract
 * that is the principal vehicle for the actual physical
 * construction of buildings in India. To grasp where this
 * template fits, you should compare it with the other commercial
 * agreements in your library, particularly the Service Agreement
 * at Template 60 and the Joint Development Agreement at
 * Template 88. The construction contract is similar to the
 * Service Agreement in that it involves one party performing
 * services for another in exchange for payment, but it has a
 * number of distinctive features that reflect the particular
 * characteristics of construction work and that you should
 * understand.
 *
 * THE NATURE OF A WORKS CONTRACT:
 *
 *   A works contract is a hybrid kind of agreement that
 *   involves both the supply of services (the labour and
 *   skill of the contractor) and the supply of goods (the
 *   materials used in the construction). This hybrid
 *   character is reflected in the definition of "works
 *   contract" under Section 2(119) of the Central Goods and
 *   Services Tax Act, 2017, which defines it as a contract
 *   for building, construction, fabrication, completion,
 *   erection, installation, fitting out, improvement,
 *   modification, repair, maintenance, renovation,
 *   alteration, or commissioning of any immovable property
 *   wherein transfer of property in goods is involved in the
 *   execution of such contract. The hybrid character creates
 *   special tax treatment under the GST regime and creates
 *   special legal issues that pure service contracts do not
 *   raise.
 *
 *   The most important distinctive feature of a construction
 *   contract is that the work is performed over an extended
 *   period (typically months or years) and is divided into
 *   identifiable stages or milestones. This means that the
 *   payment cannot simply be made on completion (as in a
 *   typical service contract) but must be staged in
 *   accordance with the progress of the work, with each
 *   payment becoming due as a particular milestone is
 *   reached and certified by an appropriate authority.
 *
 * THE THREE PRINCIPAL CONTRACT STRUCTURES:
 *
 *   Construction contracts in Indian practice typically take
 *   one of three forms based on the way in which the price
 *   is determined. The first form is the LUMP SUM contract,
 *   in which the contractor agrees to perform the entire
 *   work for a fixed total price. This form is used when
 *   the scope of work can be clearly defined in advance and
 *   when the parties are willing to allocate the risk of
 *   cost overruns to the contractor. The second form is the
 *   ITEM RATE or BOQ contract, in which the contractor is
 *   paid at agreed rates for each item of work performed,
 *   based on a Bill of Quantities (BOQ) prepared by the
 *   owner's engineer. This form allows for adjustments based
 *   on the actual quantities of work performed and is used
 *   when the scope cannot be precisely defined in advance.
 *   The third form is the COST PLUS contract, in which the
 *   contractor is reimbursed for the actual costs incurred
 *   plus a fixed fee or a percentage as profit. This form
 *   transfers the cost risk to the owner and is used in
 *   complex projects where the risks cannot be reliably
 *   estimated.
 *
 *   This template is drafted as a lump sum contract because
 *   it is the most common form for residential and small
 *   commercial construction in India and because it
 *   illustrates the basic structural conventions clearly.
 *
 * THE KEY PROVISIONS OF A CONSTRUCTION CONTRACT:
 *
 *   The most important provisions in any construction
 *   contract are the scope of work, the contract price, the
 *   payment schedule, the timeline and milestones, the
 *   retention amount, the defect liability period, the
 *   liquidated damages for delay, the force majeure clause,
 *   the variation procedure, the termination provisions,
 *   and the dispute resolution mechanism. Each of these
 *   provisions has been the subject of substantial
 *   construction litigation in India, and a well-drafted
 *   construction contract should address each of them
 *   clearly and unambiguously.
 *
 *   The retention amount is a particularly distinctive
 *   feature of construction contracts that does not have
 *   an analogue in most other commercial agreements. The
 *   owner typically retains five to ten percent of each
 *   payment due to the contractor as security for the
 *   proper performance of the work. The retained amount
 *   is released in two parts: half upon the issuance of the
 *   completion certificate and the remaining half upon the
 *   expiry of the defect liability period. This arrangement
 *   provides the owner with a continuing financial incentive
 *   for the contractor to remedy any defects that may emerge
 *   during the defect liability period.
 *
 *   The defect liability period (DLP) is the period during
 *   which the contractor remains liable to rectify any
 *   defects in the work at no cost to the owner. The DLP
 *   typically runs for twelve months from the date of the
 *   completion certificate, although for major projects it
 *   can be longer.
 *
 * STRUCTURAL FEATURES OF THIS TEMPLATE:
 *
 *   The Construction Contract follows the basic structural
 *   conventions of commercial drafting. The distinctive
 *   features are the detailed scope of work in Schedule A,
 *   the contract price and payment schedule in Clauses 2
 *   and 3, the timeline and milestones in Clause 4, the
 *   retention amount in Clause 5, the liquidated damages
 *   in Clause 7, the defect liability period in Clause 9,
 *   the force majeure clause in Clause 10, and the
 *   variation procedure in Clause 11.
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
      reference: "cc-clauses",
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
      centeredBold("CONSTRUCTION CONTRACT", 30),
      centeredBold("(Works Contract Agreement)", 22),
      spacer, hrule(),

      // ─── Date ───
      legalPara([
        new TextRun({ text: "THIS CONSTRUCTION CONTRACT ", bold: true }),
        new TextRun("(hereinafter referred to as 'this Contract') is made and executed at "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" on this "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" day of "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(", 20__,"),
      ]),

      spacer,

      // ─── Parties ───
      legalPara([new TextRun({ text: "BY AND BETWEEN:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      spacer,

      legalPara([
        new TextRun({ text: "M/s ________ Developers Pvt. Ltd.", bold: true }),
        new TextRun(", a company duly incorporated under the Companies Act, 2013, having its registered office at "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" (hereinafter referred to as 'the "),
        new TextRun({ text: "Owner", bold: true }),
        new TextRun("') of the "),
        new TextRun({ text: "FIRST PART;", bold: true }),
      ]),

      spacer,

      legalPara([new TextRun({ text: "AND", bold: true })],
        { alignment: AlignmentType.CENTER }),

      spacer,

      legalPara([
        new TextRun({ text: "M/s ________ Construction Pvt. Ltd.", bold: true }),
        new TextRun(", a company duly incorporated under the Companies Act, 2013, having its registered office at "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" (hereinafter referred to as 'the "),
        new TextRun({ text: "Contractor", bold: true }),
        new TextRun("') of the "),
        new TextRun({ text: "SECOND PART.", bold: true }),
      ]),

      spacer,

      // ─── Recitals ───
      legalPara([new TextRun({ text: "RECITALS:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      spacer,

      legalPara([
        new TextRun({ text: "WHEREAS, ", bold: true }),
        new TextRun("the Owner is engaged in the development of a residential / commercial project at "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" (the 'said Project') and is desirous of engaging a contractor to undertake the construction of the building(s) forming part of the said Project;"),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS, ", bold: true }),
        new TextRun("the Contractor is engaged in the business of civil construction and has substantial experience, expertise, technical resources, and qualified personnel to undertake construction of the kind required for the said Project;"),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS, ", bold: true }),
        new TextRun("the Owner has invited tenders from qualified contractors for the construction work and has, after due evaluation, selected the Contractor as the most suitable contractor for the said work;"),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS, ", bold: true }),
        new TextRun("the Parties are now desirous of recording the terms and conditions of their contractual relationship in writing for the orderly performance of the construction work;"),
      ]),

      legalPara([
        new TextRun({ text: "NOW, THEREFORE, ", bold: true }),
        new TextRun("in consideration of the mutual covenants contained herein, the Parties hereby agree as follows:"),
      ]),

      spacer,

      // ─── Operative Clauses ───

      // Clause 1: Scope of Work
      new Paragraph({ numbering: { reference: "cc-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "SCOPE OF WORK", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Contractor shall execute, complete, and hand over to the Owner the construction of ________ (describe the work, e.g. a residential tower of ground plus twenty floors comprising one hundred twenty apartments along with common amenities and parking, etc.), as more particularly described in the scope of work, drawings, and specifications set out in Schedule A hereto. The work shall include all civil, electrical, plumbing, sanitary, and finishing works necessary for the completion of the building(s) in a habitable condition, but shall not include ________ (specify any exclusions, e.g. interior fit-outs, landscaping, external development works, etc.) which shall be undertaken by the Owner separately."
      )]),

      spacer,

      // Clause 2: Contract Price
      new Paragraph({ numbering: { reference: "cc-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "CONTRACT PRICE", bold: true, underline: {} })] }),

      legalPara([
        new TextRun({ text: "The total consideration for the work to be performed by the Contractor under this Contract shall be Rs. ________ (Rupees ________ only), exclusive of GST and other applicable taxes (the 'Contract Price'). ", bold: true }),
        new TextRun(
          "The Contract Price is a lump sum price and shall not be subject to any variation except as provided in the Variations clause below. The Contract Price includes the cost of all materials, labour, equipment, supervision, overheads, and profit, and the Contractor shall not be entitled to claim any additional amount for any item of work falling within the scope of the Contract."
        ),
      ]),

      spacer,

      // Clause 3: Payment Schedule
      new Paragraph({ numbering: { reference: "cc-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "PAYMENT SCHEDULE", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Owner shall pay the Contract Price to the Contractor in instalments linked to the construction milestones as follows: (a) ________ % as mobilisation advance against a bank guarantee of equivalent value; (b) ________ % on completion of foundation and plinth; (c) ________ % on completion of structural framework on a floor-by-floor basis; (d) ________ % on completion of brickwork; (e) ________ % on completion of plastering; (f) ________ % on completion of flooring and finishing works; (g) ________ % on issuance of the completion certificate; and (h) the balance ________ % at the end of the defect liability period. Each instalment shall be paid by the Owner within thirty days of the receipt of the Contractor's invoice accompanied by the certification of the Owner's engineer that the relevant milestone has been achieved."
      )]),

      spacer,

      // Clause 4: Timeline and milestones
      new Paragraph({ numbering: { reference: "cc-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "TIMELINE AND MILESTONES", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Contractor shall commence the work within fifteen days of the date of this Contract and shall complete the work within ________ months from the date of commencement, in accordance with the construction schedule set out in Schedule B hereto. The construction schedule includes specific milestones for each major component of the work, and the Contractor shall achieve each milestone within the time prescribed in the said schedule. Time shall be of the essence for the completion of each milestone and for the overall completion of the work."
      )]),

      spacer,

      // Clause 5: Retention Amount — distinctive feature of
      // construction contracts
      new Paragraph({ numbering: { reference: "cc-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "RETENTION AMOUNT", bold: true, underline: {} })] }),

      legalPara([
        new TextRun({ text: "The Owner shall retain ten percent (10%) of each running account bill of the Contractor as retention money, ", bold: true }),
        new TextRun(
          "as security for the proper performance of the work and for the rectification of any defects that may emerge during the defect liability period. The retention money shall be released to the Contractor in two equal instalments: the first half upon the issuance of the completion certificate by the Owner's engineer, and the second half upon the expiry of the defect liability period subject to the Contractor having satisfactorily rectified any defects notified by the Owner during the said period."
        ),
      ]),

      spacer,

      // Clause 6: Quality and specifications
      new Paragraph({ numbering: { reference: "cc-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "QUALITY AND SPECIFICATIONS", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Contractor shall execute the work using good quality materials and skilled workmanship, in strict accordance with the approved drawings, the specifications set out in Schedule A, and the relevant Indian Standards Institution (BIS) codes for civil construction. The Owner shall have the right to inspect the work at all reasonable times through the Owner's engineer and to reject any materials or workmanship that do not conform to the specifications. Any rejected work shall be promptly rectified or replaced by the Contractor at the Contractor's own cost."
      )]),

      spacer,

      // Clause 7: Liquidated damages for delay
      new Paragraph({ numbering: { reference: "cc-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "LIQUIDATED DAMAGES FOR DELAY", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "If the Contractor fails to complete the work within the time prescribed in this Contract (subject to extensions for force majeure as provided herein), the Contractor shall be liable to pay to the Owner liquidated damages at the rate of ________ % of the Contract Price for each week of delay, subject to a maximum of ten percent (10%) of the Contract Price. The liquidated damages represent a genuine pre-estimate of the loss that the Owner is likely to suffer by reason of the delay, in accordance with Section 74 of the Indian Contract Act, 1872, and shall not be construed as a penalty."
      )]),

      spacer,

      // Clause 8: Performance Bank Guarantee
      new Paragraph({ numbering: { reference: "cc-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "PERFORMANCE BANK GUARANTEE", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Contractor shall, within fifteen days of the date of this Contract, furnish to the Owner an unconditional and irrevocable bank guarantee from a scheduled commercial bank for an amount equal to ten percent (10%) of the Contract Price, valid for a period of the construction period plus the defect liability period plus three months, as security for the due performance of the Contractor's obligations under this Contract."
      )]),

      spacer,

      // Clause 9: Defect Liability Period
      new Paragraph({ numbering: { reference: "cc-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "DEFECT LIABILITY PERIOD", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The defect liability period shall commence from the date of issue of the completion certificate and shall continue for a period of twelve (12) months thereafter (the 'DLP'). During the DLP, the Contractor shall be liable to rectify, at the Contractor's own cost and within thirty days of being notified by the Owner, any defects in the workmanship or materials that may emerge in the work, including defects that are latent or that could not have been detected at the time of the completion certificate. If the Contractor fails to rectify the defects within the said period, the Owner may rectify the same and recover the cost from the Contractor or from the retention money or from the performance bank guarantee."
      )]),

      spacer,

      // Clause 10: Force Majeure
      new Paragraph({ numbering: { reference: "cc-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "FORCE MAJEURE", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "Neither Party shall be liable for any failure or delay in the performance of its obligations under this Contract to the extent that such failure or delay is caused by a force majeure event, namely an event beyond the reasonable control of the affected Party that could not have been anticipated or prevented by the exercise of reasonable diligence. Force majeure events include war, riots, civil disturbances, fire, flood, earthquake, cyclone, epidemic, pandemic, government action, lockdowns, and any other natural calamity. The affected Party shall give written notice to the other Party of the force majeure event within fifteen days of its occurrence, and the time for performance shall be extended by the period of the force majeure event."
      )]),

      spacer,

      // Clause 11: Variations
      new Paragraph({ numbering: { reference: "cc-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "VARIATIONS", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Owner may, by written variation order, require the Contractor to make additions, omissions, or changes to the scope of work. The Contractor shall execute such variations in accordance with the variation order, and the Contract Price shall be adjusted upwards or downwards based on the rates set out in Schedule C hereto for the relevant items of work, or, if no such rates are available, on a fair and reasonable basis to be agreed between the Parties. No variation shall be valid unless agreed in writing by both Parties."
      )]),

      spacer,

      // Clause 12: Indemnity and insurance
      new Paragraph({ numbering: { reference: "cc-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "INDEMNITY AND INSURANCE", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Contractor shall indemnify and hold harmless the Owner from and against any and all claims, damages, losses, costs, and expenses arising out of any death or injury to any person or damage to any property caused by the negligence or default of the Contractor or its employees, agents, or sub-contractors in the performance of the work. The Contractor shall, at its own cost, take out and maintain throughout the construction period a Contractor's All Risks (CAR) insurance policy, a workmen's compensation insurance policy, and a public liability insurance policy, each in such amounts and on such terms as the Owner may approve."
      )]),

      spacer,

      // Clause 13: Termination
      new Paragraph({ numbering: { reference: "cc-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "TERMINATION", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Owner may terminate this Contract by giving the Contractor thirty days' written notice in case of any material breach by the Contractor (including persistent failure to maintain the prescribed quality, persistent delay in achieving the construction milestones, insolvency or winding up of the Contractor, or any other breach that goes to the root of the Contract). Upon termination, the Owner shall be entitled to take possession of the site and to engage another contractor to complete the work, and the cost of such completion (to the extent it exceeds the unpaid balance of the Contract Price) shall be recovered from the Contractor."
      )]),

      spacer,

      // Clause 14: Dispute Resolution
      new Paragraph({ numbering: { reference: "cc-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "DISPUTE RESOLUTION", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "Any dispute arising out of or in connection with this Contract shall, in the first instance, be referred to the Owner's engineer for a determination, which shall be communicated to the Parties within thirty days. If either Party is dissatisfied with the engineer's determination, the dispute shall be resolved by arbitration in accordance with the provisions of the Arbitration and Conciliation Act, 1996, by a sole arbitrator to be appointed by mutual consent of the Parties, with the seat of arbitration at ________ and the language of arbitration in English."
      )]),

      spacer, hrule(),

      // ─── Testimonium ───
      legalPara([
        new TextRun({ text: "IN WITNESS WHEREOF, ", bold: true }),
        new TextRun("the Parties hereto have executed this Construction Contract at the place and on the date first above written."),
      ]),

      spacer, spacer,

      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 60 },
        children: [
          new TextRun({ text: "For the OWNER", bold: true }),
          new TextRun({ text: "\tFor the CONTRACTOR", bold: true }),
        ],
      }),
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 60 },
        children: [
          new TextRun({ text: "M/s ________ Developers Pvt. Ltd.", bold: true }),
          new TextRun({ text: "\tM/s ________ Construction Pvt. Ltd.", bold: true }),
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

      spacer, spacer,

      legalPara([new TextRun({ text: "WITNESSES:", bold: true, underline: {} })]),
      spacer,
      legalPara([new TextRun({ text: "1. Name: ________ | Address: ________ | Signature: ________", bold: true })]),
      spacer,
      legalPara([new TextRun({ text: "2. Name: ________ | Address: ________ | Signature: ________", bold: true })]),

      spacer, spacer,

      legalPara([
        new TextRun({ text: "[NOTE: ", bold: true, italics: true }),
        new TextRun({ text: "This contract should be executed on stamp paper of appropriate value as per the State stamp duty rates for works contracts. The schedules referred to in this contract (Schedule A — scope of work and specifications; Schedule B — construction schedule; Schedule C — variation rates) must be drafted separately and attached to the contract.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
