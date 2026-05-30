/**
 * COMPLAINT TO THE REAL ESTATE REGULATORY AUTHORITY
 * UNDER SECTION 31 OF THE REAL ESTATE (REGULATION AND
 * DEVELOPMENT) ACT, 2016
 * ─────────────────────────────────────────────────────
 * Category : Real Estate — Consumer Remedy
 * Forum    : Real Estate Regulatory Authority (RERA)
 *            of the relevant State
 * Statute  : Section 31, Real Estate (Regulation and
 *            Development) Act, 2016
 * Source   : Standard form used in Indian RERA practice
 *
 * The Complaint to the Real Estate Regulatory Authority under
 * Section 31 of the RERA Act, 2016 is the first template in
 * this real estate batch and it introduces what has become the
 * single most important consumer remedy in modern Indian real
 * estate practice. To grasp where this template fits, you have
 * to understand the historical situation of Indian apartment
 * buyers before RERA and the dramatic change that the 2016 Act
 * brought about.
 *
 * THE PRE-RERA SITUATION:
 *
 *   Until the enactment of the Real Estate (Regulation and
 *   Development) Act, 2016, Indian apartment buyers were in
 *   an extraordinarily vulnerable position relative to
 *   developers. The standard practice in Indian real estate
 *   was for developers to collect substantial advances from
 *   buyers (sometimes the entire consideration) before
 *   construction had even begun, to use those funds for
 *   purposes other than the construction of the project for
 *   which they had been collected, and then to delay the
 *   delivery of possession by months or years beyond the
 *   promised date. Buyers had limited remedies because the
 *   builder-buyer agreements were typically drafted entirely
 *   in favour of the developer, the consumer protection law
 *   was inadequate to deal with the complexity of real
 *   estate transactions, and the civil courts were too slow
 *   and expensive to provide effective relief. The result
 *   was that many buyers waited five, ten, or even fifteen
 *   years for possession of apartments for which they had
 *   long since paid the full price, and many projects
 *   simply collapsed leaving buyers with nothing.
 *
 *   The Real Estate (Regulation and Development) Act, 2016
 *   was enacted to address these systemic problems and to
 *   bring discipline, transparency, and accountability to
 *   the Indian real estate sector. The Act creates a
 *   comprehensive regulatory framework that requires every
 *   real estate project of a specified size to be registered
 *   with the Real Estate Regulatory Authority of the
 *   relevant State, requires every developer to be
 *   registered with the Authority, requires the developer
 *   to deposit seventy percent of the funds collected from
 *   buyers in a separate escrow account that can only be
 *   used for the construction of the specific project,
 *   prescribes minimum disclosure requirements for the
 *   developer, and prohibits the developer from making any
 *   alteration to the sanctioned plans without the consent
 *   of two-thirds of the buyers.
 *
 * THE COMPLAINT MECHANISM UNDER SECTION 31:
 *
 *   The principal enforcement mechanism under RERA is the
 *   complaint procedure under Section 31 of the Act, which
 *   provides that any aggrieved person may file a complaint
 *   with the Authority or the adjudicating officer for any
 *   violation or contravention of the provisions of the Act
 *   or the rules and regulations made thereunder against any
 *   promoter, allottee, or real estate agent. The expression
 *   "aggrieved person" has been interpreted broadly by the
 *   RERA authorities to include not just the immediate
 *   buyer but also any person who has a legitimate interest
 *   in the project, including buyers' associations and
 *   prospective buyers.
 *
 *   The complaint is filed in the prescribed form (which
 *   varies from State to State because RERA is administered
 *   by State authorities under their respective State RERA
 *   Rules) and is accompanied by the prescribed filing fee
 *   (typically nominal, ranging from Rs. 1,000 to Rs.
 *   5,000 depending on the State). The Authority is
 *   required to dispose of the complaint within sixty days
 *   from the date of the filing of the complaint, although
 *   in practice this timeline is often extended.
 *
 * THE TYPES OF RELIEF AVAILABLE:
 *
 *   The relief available under RERA is comprehensive and
 *   includes both monetary and non-monetary remedies. The
 *   most commonly sought reliefs are as follows. First, the
 *   refund of the entire amount paid by the buyer along
 *   with interest and compensation, where the developer has
 *   failed to deliver possession by the agreed date or has
 *   committed some other material breach of the agreement.
 *   This is the most powerful remedy and is the practical
 *   equivalent of a rescission of the contract. Second, the
 *   delivery of possession of the apartment along with
 *   interest for the period of delay, where the buyer
 *   prefers to take possession rather than to seek a
 *   refund. Third, the completion of incomplete construction
 *   and the rectification of defects. Fourth, compensation
 *   for any loss caused to the buyer by the developer's
 *   breach. Fifth, directions to the developer to comply
 *   with the provisions of the Act, including the obligation
 *   to obtain registration, to disclose information, and
 *   to deposit funds in escrow.
 *
 *   The interest payable under RERA is typically calculated
 *   at the State Bank of India's marginal cost of lending
 *   rate plus two percent, although the exact formula varies
 *   from State to State.
 *
 * THE APPELLATE TRIBUNAL:
 *
 *   Decisions of the Real Estate Regulatory Authority can
 *   be appealed to the Real Estate Appellate Tribunal under
 *   Section 44 of the Act, and decisions of the Appellate
 *   Tribunal can be further appealed to the High Court
 *   under Section 58 of the Act on questions of law. This
 *   three-tier structure (RERA, Appellate Tribunal, High
 *   Court) provides multiple levels of scrutiny and is
 *   broadly similar to the appellate structure for other
 *   regulatory tribunals that you have seen in earlier
 *   templates.
 *
 * STRUCTURAL FEATURES OF THIS TEMPLATE:
 *
 *   First, look at the parties. The complainant is the
 *   apartment buyer (the "allottee" in RERA terminology) and
 *   the respondent is typically the developer (the
 *   "promoter" in RERA terminology). In some cases the
 *   complaint may also be against the real estate agent who
 *   facilitated the transaction.
 *
 *   Second, look at the body. Paragraph 1 establishes the
 *   complainant. Paragraph 2 identifies the project and the
 *   apartment being purchased. Paragraph 3 narrates the
 *   builder-buyer agreement and the payments made.
 *   Paragraph 4 describes the breach committed by the
 *   developer. Paragraph 5 sets out the legal basis for the
 *   complaint under specific provisions of the RERA Act.
 *
 *   Third, look at the prayer. The prayer typically asks
 *   for both a refund (as the principal relief) and for
 *   compensation, interest, and other consequential reliefs.
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
      { reference: "rera-paras", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "prayer-items", levels: [{ level: 0, format: LevelFormat.LOWER_LETTER, text: "%1)",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
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
      // ─── Forum Header ───
      // RERA is administered by State authorities, so the
      // complaint is filed before the relevant State RERA
      centeredBold("BEFORE THE HON'BLE ________ STATE", 24),
      centeredBold("REAL ESTATE REGULATORY AUTHORITY", 24),
      centeredBold("AT ________", 22),
      spacer,
      centeredBold("COMPLAINT NO. ________ OF 20__", 24),
      spacer,
      legalPara([
        new TextRun({ text: "(Complaint under Section 31 of the Real Estate (Regulation and Development) Act, 2016, read with Rule ________ of the ________ State Real Estate (Regulation and Development) Rules)", italics: true, size: 22 }),
      ], { alignment: AlignmentType.CENTER }),

      spacer, hrule(),

      // ─── Particulars ───
      legalPara([new TextRun({ text: "PARTICULARS OF THE PROJECT:", bold: true, underline: {} })]),

      spacer,

      legalPara([
        new TextRun({ text: "Name of the Project: ", bold: true }),
        new TextRun("________"),
      ]),

      legalPara([
        new TextRun({ text: "RERA Registration No.: ", bold: true }),
        new TextRun("________"),
      ]),

      legalPara([
        new TextRun({ text: "Location of the Project: ", bold: true }),
        new TextRun("________"),
      ]),

      legalPara([
        new TextRun({ text: "Promoter: ", bold: true }),
        new TextRun("M/s ________"),
      ]),

      spacer,

      // ─── Parties ───
      legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      legalPara([new TextRun({ text: "Sh./Smt. ________", bold: true })]),
      legalPara([new TextRun("S/o or D/o ________")]),
      legalPara([new TextRun("Aged about ________ years")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara([new TextRun({ text: "(Allottee of Unit No. ________ in the said project)", italics: true })]),
      legalPara([new TextRun({ text: "\u2026 COMPLAINANT", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      centeredBold("VERSUS"),
      spacer,

      legalPara([new TextRun({ text: "M/s ________ Developers Pvt. Ltd.", bold: true })]),
      legalPara([new TextRun("A company incorporated under the Companies Act, 2013,")]),
      legalPara([new TextRun("having its registered office at ________")]),
      legalPara([new TextRun("CIN: ________")]),
      legalPara([new TextRun("Through its Managing Director")]),
      legalPara([new TextRun({ text: "\u2026 RESPONDENT (PROMOTER)", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      spacer,

      // ─── Title ───
      centeredBold("COMPLAINT UNDER SECTION 31 OF THE REAL ESTATE", 22),
      centeredBold("(REGULATION AND DEVELOPMENT) ACT, 2016, SEEKING", 22),
      centeredBold("REFUND OF THE AMOUNT PAID BY THE COMPLAINANT", 22),
      centeredBold("ALONG WITH INTEREST AND COMPENSATION", 22),
      spacer,

      legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Body ───

      // Para 1: Identification of the complainant
      new Paragraph({ numbering: { reference: "rera-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Complainant is an adult Indian citizen and is an 'allottee' within the meaning of Section 2(d) of the Real Estate (Regulation and Development) Act, 2016 (hereinafter referred to as 'the RERA Act'), in respect of Unit No. ________ in the project of the Respondent. The Complainant is filing the present complaint as an aggrieved person under Section 31 of the RERA Act."
        )] }),

      // Para 2: The project
      new Paragraph({ numbering: { reference: "rera-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Respondent is a 'promoter' within the meaning of Section 2(zk) of the RERA Act and is engaged in the business of real estate development. The Respondent is the developer of a real estate project known as '________' situated at ________ (the 'said Project'). The said Project is registered with the ________ State RERA under Registration No. ________ dated ________."
        )] }),

      // Para 3: The booking and the agreement
      new Paragraph({ numbering: { reference: "rera-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That on or about ________ (date), relying upon the brochures, advertisements, and representations made by the Respondent regarding the said Project and the timely completion of construction, the Complainant booked Unit No. ________ in the said Project (the 'said Unit') having a super built-up area of ________ square feet, for a total consideration of Rs. ________. The Complainant entered into a Builder-Buyer Agreement dated ________ with the Respondent in respect of the said Unit, which was duly executed and registered. A true copy of the said Builder-Buyer Agreement is annexed herewith and marked as "
          ),
          new TextRun({ text: "Annexure C-1.", bold: true }),
        ] }),

      // Para 4: Payments made by the complainant
      new Paragraph({ numbering: { reference: "rera-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That in accordance with the payment schedule set out in the said Builder-Buyer Agreement, the Complainant has paid to the Respondent a total sum of Rs. ________ towards the consideration for the said Unit, representing approximately ________ % of the total consideration. The said payments have been made in instalments between ________ and ________, partly from the Complainant's own funds and partly from a home loan obtained from ________ Bank. Copies of the receipts issued by the Respondent acknowledging the said payments are annexed herewith as Annexures C-2 to C-________."
        )] }),

      // Para 5: The promised date of possession
      new Paragraph({ numbering: { reference: "rera-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "PROMISED DATE OF POSSESSION: ", bold: true, underline: {} }),
          new TextRun(
            "That under Clause ________ of the Builder-Buyer Agreement and as represented in the project disclosures filed by the Respondent with the State RERA, the Respondent had agreed and undertaken to deliver possession of the said Unit to the Complainant on or before ________ (date), with a grace period of six months. The said date of possession is also reflected in the project registration filed with the State RERA, which is binding on the Respondent under Section 11 of the RERA Act."
          ),
        ] }),

      // Para 6: The breach by the respondent
      new Paragraph({ numbering: { reference: "rera-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "BREACH BY THE RESPONDENT: ", bold: true, underline: {} }),
          new TextRun(
            "That despite the lapse of more than ________ years from the agreed date of possession, the Respondent has failed to complete the construction of the said Project and to deliver possession of the said Unit to the Complainant. The construction of the said Project is far from complete, and there is no realistic prospect of the Respondent being able to deliver possession in the foreseeable future. Several other allottees in the said Project have also been kept waiting for possession beyond the agreed date, and the Respondent has failed to provide any credible explanation for the delay or any reliable timeline for the completion of the project."
          ),
        ] }),

      // Para 7: Multiple correspondence
      new Paragraph({ numbering: { reference: "rera-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Complainant has, on multiple occasions, written to the Respondent demanding either the immediate delivery of possession of the said Unit or the refund of the amounts paid along with interest. The Respondent has either ignored the said communications or has given evasive responses without committing to any specific timeline. Copies of the said correspondence are annexed herewith as Annexures C-________ to C-________."
        )] }),

      // Para 8: The legal basis under Section 18
      new Paragraph({ numbering: { reference: "rera-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "ENTITLEMENT TO REFUND UNDER SECTION 18: ", bold: true, underline: {} }),
          new TextRun(
            "That under Section 18(1) of the RERA Act, where the promoter fails to complete or is unable to give possession of an apartment in accordance with the terms of the agreement for sale, the promoter is liable on demand to the allottee to return the amount received in respect of that apartment with interest at the prescribed rate, including compensation in the manner provided under the Act. The Complainant is therefore entitled, as a matter of statutory right under Section 18(1), to seek a refund of the entire amount paid along with interest and compensation."
          ),
        ] }),

      // Para 9: Other RERA violations
      new Paragraph({ numbering: { reference: "rera-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Respondent has also violated several other provisions of the RERA Act, including Section 11 (failure to make required disclosures), Section 14 (alteration of sanctioned plans without consent), and Section 4(2)(l)(D) (failure to maintain a separate escrow account for seventy percent of the funds collected from allottees). These violations further demonstrate the bad faith of the Respondent and reinforce the Complainant's entitlement to relief."
        )] }),

      // Para 10: No other proceedings
      new Paragraph({ numbering: { reference: "rera-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That no other proceedings between the Complainant and the Respondent in respect of the said Unit are pending before any court or forum. The Complainant has not earlier filed any complaint or suit against the Respondent in respect of the matters raised in the present complaint."
        )] }),

      // Para 11: Jurisdiction and limitation
      new Paragraph({ numbering: { reference: "rera-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That this Hon'ble Authority has jurisdiction to entertain and decide the present complaint under Section 31 of the RERA Act, in that the said Project is registered with this Hon'ble Authority and the alleged violations have been committed within its territorial jurisdiction. The present complaint is being filed within the limitation period prescribed under the Act, in that the cause of action is a continuing one as the Respondent continues to fail to deliver possession with each passing day."
        )] }),

      spacer,

      // ─── Prayer ───
      centeredBold("PRAYER:", 26),
      spacer,

      legalPara([new TextRun(
        "In view of the facts and circumstances stated above, it is most respectfully prayed that this Hon'ble Authority may be pleased to:"
      )]),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "Direct the Respondent to refund to the Complainant the entire amount of Rs. ________ paid by the Complainant towards the consideration for the said Unit, along with interest at the prescribed rate from the respective dates of payment till the date of actual realisation, in accordance with Section 18(1) of the RERA Act;", bold: true, underline: {} }),
        ] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Award compensation to the Complainant for the mental agony, harassment, and financial loss suffered as a result of the Respondent's breach of the Builder-Buyer Agreement and the provisions of the RERA Act;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Impose appropriate penalties on the Respondent under Sections 60, 61, and 63 of the RERA Act for the various violations committed by the Respondent;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Award the costs of the present complaint in favour of the Complainant and against the Respondent;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Pass such other or further orders as this Hon'ble Authority may deem fit and proper in the facts and circumstances of the case."
        )] }),

      spacer, spacer,

      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Place: ________"), new TextRun({ text: "\tCOMPLAINANT", bold: true })] }),
      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Date: ________"), new TextRun("\tThrough")] }),
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun("Counsel for the Complainant")] }),

      spacer, spacer,

      legalPara([
        new TextRun({ text: "[NOTE: ", bold: true, italics: true }),
        new TextRun({ text: "The exact form of the complaint and the filing fee vary from State to State because RERA is administered by State authorities under their respective State RERA Rules. The complaint must be supported by an affidavit of the complainant and accompanied by the Builder-Buyer Agreement, payment receipts, project brochures, all correspondence with the developer, and a copy of the project registration with the State RERA.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
