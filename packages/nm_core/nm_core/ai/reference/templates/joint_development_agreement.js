/**
 * JOINT DEVELOPMENT AGREEMENT (JDA) BETWEEN
 * LANDOWNER AND DEVELOPER
 * ─────────────────────────────────────────────
 * Category : Real Estate — Commercial Collaboration
 * Type     : Bilateral landowner-developer agreement
 * Statute  : Indian Contract Act, 1872; Transfer of Property
 *            Act, 1882; Specific Relief Act, 1963; Section
 *            45(5A), Income Tax Act, 1961
 * Source   : Standard form developed in Indian real estate
 *            practice
 *
 * The Joint Development Agreement is the third template in the
 * real estate batch and it introduces the most important
 * commercial structure in modern Indian urban real estate
 * development. To grasp where this template fits, you have to
 * understand the basic problem that joint development addresses
 * and the way in which Indian real estate developers have
 * structured their relationship with landowners in response.
 *
 * THE BASIC PROBLEM AND THE JDA SOLUTION:
 *
 *   Real estate development requires two principal inputs:
 *   land and capital. Land is typically owned by individuals
 *   or families who have inherited it over generations and
 *   who often lack the financial resources, the technical
 *   expertise, and the regulatory know-how to develop it
 *   themselves. Capital and expertise, on the other hand,
 *   are typically held by professional developers who have
 *   the resources to construct buildings but who do not
 *   themselves own much land. The Joint Development Agreement
 *   is the legal instrument that brings these two
 *   complementary inputs together in a structured way that
 *   protects the interests of both parties.
 *
 *   Under a typical Joint Development Agreement, the
 *   landowner contributes the land and the developer
 *   contributes the capital, the construction expertise, and
 *   the project management. The developer obtains the
 *   necessary sanctions and approvals, designs the project,
 *   constructs the building, markets the apartments to
 *   buyers, and manages the entire development process. In
 *   exchange, the developer receives a share of the
 *   developed property or of the proceeds from its sale.
 *
 * THE TWO STRUCTURES — AREA SHARING AND REVENUE SHARING:
 *
 *   Joint Development Agreements in Indian practice are
 *   typically structured in one of two ways. The first is
 *   AREA SHARING, in which the developed area of the project
 *   is divided between the landowner and the developer in
 *   an agreed ratio (typically anywhere from 30:70 to 60:40
 *   depending on the location, the size of the land, and
 *   the bargaining position of the parties). Each party
 *   then becomes the owner of their respective share of the
 *   apartments and is free to sell, lease, or retain them
 *   as they wish. Area sharing has the advantage of giving
 *   the landowner a clear and predictable share of the
 *   project that does not depend on the marketing efforts
 *   of the developer, but it has the disadvantage of
 *   creating two separate sales channels for the same
 *   project which can complicate marketing and pricing.
 *
 *   The second structure is REVENUE SHARING, in which all
 *   the apartments are marketed and sold by the developer,
 *   and the gross sale proceeds are divided between the
 *   landowner and the developer in an agreed ratio
 *   (typically anywhere from 20:80 to 40:60). Revenue
 *   sharing has the advantage of giving the landowner the
 *   benefit of any upside in the market while leaving the
 *   marketing and pricing decisions to the developer. It
 *   has the disadvantage of making the landowner's return
 *   dependent on the developer's marketing performance and
 *   on the integrity of the developer in accounting for
 *   the sales.
 *
 *   This template is drafted as an area-sharing JDA because
 *   that is the more common structure in modern Indian
 *   practice and because it is structurally cleaner from a
 *   drafting perspective.
 *
 * THE POWER OF ATTORNEY ARRANGEMENT:
 *
 *   The most distinctive legal feature of a Joint Development
 *   Agreement is the power of attorney that the landowner
 *   typically grants to the developer to enable the developer
 *   to obtain sanctions, execute documents, and ultimately
 *   transfer apartments to buyers without having to go back
 *   to the landowner for each transaction. This power of
 *   attorney is a critical commercial element of the JDA
 *   because without it the developer would have to involve
 *   the landowner in every interaction with the regulatory
 *   authorities and every sale of an apartment, which would
 *   be impractical and would undermine the entire purpose
 *   of the joint development arrangement.
 *
 *   The power of attorney is typically irrevocable for a
 *   specified period (typically the duration of the project
 *   plus a sell-off period) and is supported by consideration
 *   under Section 202 of the Indian Contract Act, 1872, which
 *   makes it irrevocable as a power coupled with an
 *   interest. This is an important legal feature because
 *   it prevents the landowner from withdrawing from the
 *   project midway and leaving the developer with sunk
 *   costs and no way to recover them.
 *
 * TAX IMPLICATIONS UNDER SECTION 45(5A):
 *
 *   The taxation of joint development arrangements is
 *   governed by Section 45(5A) of the Income Tax Act, 1961,
 *   which was introduced in 2017 to address a longstanding
 *   ambiguity about the timing of capital gains taxation in
 *   such arrangements. Under Section 45(5A), the capital
 *   gains arising to the landowner from the transfer of
 *   land under a JDA are deemed to arise in the year in
 *   which the certificate of completion for the whole or
 *   any part of the project is issued by the competent
 *   authority. This provision allows the landowner to defer
 *   the capital gains tax until the project is actually
 *   completed, which is a significant tax benefit and which
 *   has made the JDA structure even more attractive in
 *   modern practice.
 *
 *   This provision also has implications for the drafting of
 *   the JDA because it requires the agreement to clearly
 *   identify the project, the consideration, and the timing
 *   of the various rights and obligations to ensure that the
 *   arrangement qualifies for the Section 45(5A) treatment.
 *
 * STRUCTURAL FEATURES OF THIS TEMPLATE:
 *
 *   The Joint Development Agreement follows the basic
 *   structural conventions of commercial drafting that you
 *   have seen in the earlier commercial templates. The
 *   distinctive features are the recital paragraphs that
 *   establish the landowner's title and the developer's
 *   technical credentials, the grant of development rights
 *   in the operative provisions, the area sharing ratio, the
 *   power of attorney clause, the timeline for various
 *   milestones, and the consequences of default.
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
      reference: "jda-clauses",
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
      centeredBold("JOINT DEVELOPMENT AGREEMENT", 30),
      spacer, hrule(),

      // ─── Date ───
      legalPara([
        new TextRun({ text: "THIS JOINT DEVELOPMENT AGREEMENT ", bold: true }),
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
      legalPara([new TextRun({ text: "BY AND BETWEEN:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      spacer,

      legalPara([
        new TextRun({ text: "Sh./Smt. ________", bold: true }),
        new TextRun(", S/o or D/o ________, aged about ________ years, residing at "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" (hereinafter referred to as 'the "),
        new TextRun({ text: "Landowner", bold: true }),
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
        new TextRun({ text: "Developer", bold: true }),
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
        new TextRun("the Landowner is the absolute owner in lawful possession of all that piece and parcel of land admeasuring "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" square metres situated at "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" (the 'said Land'), as more particularly described in Schedule A hereto, having acquired the same by way of "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" (state the mode of acquisition, e.g. inheritance, sale deed dated ________, etc.);"),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS, ", bold: true }),
        new TextRun("the title of the Landowner to the said Land is clear, marketable, and free from all encumbrances, charges, mortgages, liens, attachments, claims, demands, and litigation of any nature whatsoever;"),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS, ", bold: true }),
        new TextRun("the Developer is engaged in the business of real estate development and has substantial experience, expertise, technical know-how, and financial resources to undertake the development of the said Land into a residential complex;"),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS, ", bold: true }),
        new TextRun("the Landowner is desirous of developing the said Land into a residential complex but does not have the financial resources, technical expertise, or regulatory know-how to do so independently, and therefore wishes to engage the Developer for the said purpose on the terms and conditions set out herein;"),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS, ", bold: true }),
        new TextRun("the Developer has agreed to undertake the development of the said Land at its own cost and risk in exchange for a share of the developed property as more particularly set out herein;"),
      ]),

      legalPara([
        new TextRun({ text: "NOW, THEREFORE, ", bold: true }),
        new TextRun("in consideration of the mutual covenants and undertakings contained herein, the Parties hereby agree as follows:"),
      ]),

      spacer,

      // ─── Operative Clauses ───

      // Clause 1: Grant of Development Rights
      new Paragraph({ numbering: { reference: "jda-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "GRANT OF DEVELOPMENT RIGHTS", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Landowner hereby grants to the Developer the exclusive and irrevocable right to develop the said Land into a residential complex (the 'said Project') comprising approximately ________ residential apartments along with common amenities and facilities, in accordance with the building plans to be sanctioned by the competent authorities. The Developer shall have the right to enter upon the said Land for the purpose of carrying out the development and to do all acts necessary or incidental to the said development."
      )]),

      spacer,

      // Clause 2: Area Sharing Ratio
      new Paragraph({ numbering: { reference: "jda-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "AREA SHARING ARRANGEMENT", bold: true, underline: {} })] }),

      legalPara([
        new TextRun({ text: "The total constructed area of the said Project (excluding common areas) shall be divided between the Landowner and the Developer in the ratio of ________ : ________ (Landowner : Developer). ", bold: true }),
        new TextRun(
          "The specific apartments to be allocated to each party shall be identified in a Supplementary Agreement to be executed by the Parties within thirty days of the sanction of the building plans, taking into account the floor, location, size, and other relevant factors so as to ensure a fair allocation. The Landowner's share shall include a proportionate share of the car parking spaces and other common amenities."
        ),
      ]),

      spacer,

      // Clause 3: Cost and risk
      new Paragraph({ numbering: { reference: "jda-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "COST AND RISK OF DEVELOPMENT", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Developer shall bear the entire cost and risk of the development of the said Project, including the cost of obtaining sanctions and approvals, the cost of construction, the cost of materials, the cost of labour, the cost of marketing the Developer's share of the apartments, and all other costs of any nature whatsoever. The Landowner shall not be liable to contribute any amount towards the cost of development, and shall not bear any risk in relation to the construction or completion of the said Project."
      )]),

      spacer,

      // Clause 4: Sanctions and approvals
      new Paragraph({ numbering: { reference: "jda-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "SANCTIONS AND APPROVALS", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Developer shall, at its own cost and effort, obtain all the necessary sanctions, approvals, and permissions from the competent authorities for the development of the said Land, including but not limited to building plan approval, environmental clearance, fire safety clearance, RERA registration, and any other approval required under the applicable laws. The Landowner shall provide all necessary cooperation and shall execute all such documents as may be required by the Developer for the purpose of obtaining the said sanctions and approvals."
      )]),

      spacer,

      // Clause 5: Power of attorney — the critical commercial
      // element
      new Paragraph({ numbering: { reference: "jda-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "POWER OF ATTORNEY", bold: true, underline: {} })] }),

      legalPara([
        new TextRun({ text: "Simultaneously with the execution of this Agreement, the Landowner shall execute and register an irrevocable Special Power of Attorney in favour of the Developer, ", bold: true }),
        new TextRun(
          "authorising the Developer to do all acts necessary for the development of the said Land, including the obtaining of sanctions and approvals, the execution of documents with statutory authorities, the marketing of the Developer's share of the apartments, the receipt of consideration from buyers of the Developer's share, and the execution and registration of sale deeds in favour of such buyers in respect of the Developer's share of the apartments. The said Power of Attorney shall be irrevocable as a power coupled with an interest within the meaning of Section 202 of the Indian Contract Act, 1872, and shall continue in force until the completion of the said Project and the sale of all the Developer's share of the apartments."
        ),
      ]),

      spacer,

      // Clause 6: Timeline and milestones
      new Paragraph({ numbering: { reference: "jda-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "TIMELINE AND MILESTONES", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Developer shall complete the development of the said Project in accordance with the following timeline: (a) obtaining all sanctions and approvals: within ________ months from the date of this Agreement; (b) commencement of construction: within ________ months from the date of obtaining the sanctions; (c) completion of construction: within ________ months from the date of commencement; and (d) handing over of possession of the Landowner's share: within ________ days of the receipt of the occupancy certificate. The Developer shall be entitled to a grace period of six months for any delay caused by force majeure events."
      )]),

      spacer,

      // Clause 7: Quality of construction
      new Paragraph({ numbering: { reference: "jda-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "QUALITY OF CONSTRUCTION", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Developer shall construct the said Project using good quality materials and workmanship in accordance with the specifications set out in Schedule B hereto and in compliance with all the applicable building codes and regulations. The Landowner shall have the right to inspect the construction at any reasonable time and to raise any concerns about the quality of the construction with the Developer."
      )]),

      spacer,

      // Clause 8: Refundable security deposit
      new Paragraph({ numbering: { reference: "jda-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "REFUNDABLE SECURITY DEPOSIT", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Developer shall pay to the Landowner a refundable interest-free security deposit of Rs. ________ on the date of execution of this Agreement, as security for the due performance of the obligations of the Developer under this Agreement. The said deposit shall be refunded by the Landowner to the Developer upon the handover of the Landowner's share of the apartments to the Landowner upon completion of the said Project."
      )]),

      spacer,

      // Clause 9: Title transfer
      new Paragraph({ numbering: { reference: "jda-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "TITLE TO THE LAND AND THE APARTMENTS", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Landowner shall remain the legal owner of the said Land throughout the duration of this Agreement. Upon completion of the said Project, the Landowner shall execute a Sale Deed in favour of each buyer of the Developer's share of the apartments in respect of the proportionate undivided share of the Land attributable to such apartment, in exchange for the Developer paying the consideration to the relevant buyer. The Landowner shall retain absolute ownership of the proportionate undivided share of the Land attributable to the Landowner's share of the apartments."
      )]),

      spacer,

      // Clause 10: Default and termination
      new Paragraph({ numbering: { reference: "jda-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "DEFAULT AND TERMINATION", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "If the Developer fails to complete the said Project within the agreed timeline (with the grace period for force majeure), or commits any other material breach of this Agreement, the Landowner may, after giving the Developer ninety days' written notice to cure the breach, terminate this Agreement and take back the said Land along with any partially completed construction without any obligation to compensate the Developer. The Developer's only remedy in such case shall be a refund of the security deposit and a claim for the value of any work completed, less the costs incurred by the Landowner in completing the project."
      )]),

      spacer,

      // Clause 11: RERA compliance
      new Paragraph({ numbering: { reference: "jda-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "RERA COMPLIANCE", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Developer shall be solely responsible for the registration of the said Project under the Real Estate (Regulation and Development) Act, 2016, and for compliance with all the obligations of a promoter under the said Act. The Landowner shall not be deemed to be a 'promoter' for the purposes of the RERA Act and shall have no liability under the said Act in respect of the said Project."
      )]),

      spacer,

      // Clause 12: Dispute resolution
      new Paragraph({ numbering: { reference: "jda-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "DISPUTE RESOLUTION", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "Any dispute arising out of or in connection with this Agreement shall be resolved by arbitration in accordance with the provisions of the Arbitration and Conciliation Act, 1996, by a sole arbitrator to be appointed by mutual consent of the Parties, with the seat of arbitration at ________ and the language of arbitration in English."
      )]),

      spacer, hrule(),

      // ─── Testimonium ───
      legalPara([
        new TextRun({ text: "IN WITNESS WHEREOF, ", bold: true }),
        new TextRun("the Parties hereto have executed this Joint Development Agreement at the place and on the date first above written."),
      ]),

      spacer, spacer,

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
          new TextRun({ text: "THE LANDOWNER", bold: true }),
          new TextRun({ text: "\tFor M/s ________ Developers Pvt. Ltd.", bold: true }),
        ],
      }),
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [
          new TextRun(""),
          new TextRun("\tAuthorised Signatory"),
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
        new TextRun({ text: "This agreement must be registered under the Registration Act, 1908. Stamp duty is payable on the agreement at the rates prescribed by the State Government, and the rates for JDAs are typically lower than for outright sale deeds because no transfer of title takes place at the time of the JDA. The Special Power of Attorney must also be separately registered.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
