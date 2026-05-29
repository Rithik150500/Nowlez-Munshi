/**
 * APPLICATION UNDER SECTION 33C(2) OF THE INDUSTRIAL
 * DISPUTES ACT, 1947 FOR RECOVERY OF MONEY DUE
 * ─────────────────────────────────────────────────────
 * Category : Labour and Employment Law — Recovery Remedy
 * Forum    : Labour Court
 * Statute  : Section 33C(2), Industrial Disputes Act, 1947
 * Source   : Standard form used in Indian labour court practice
 *
 * The Application under Section 33C(2) of the Industrial Disputes
 * Act is the second template in the labour law batch and it
 * introduces a quite different kind of labour law proceeding
 * than the Statement of Claim at Template 91. To grasp the
 * relationship between the two templates, you should think of
 * the Statement of Claim as an "adjudicatory" proceeding that
 * decides the substantive question of whether the workman's
 * dismissal was lawful, while the Section 33C(2) Application is
 * a "computational" or "executing court" proceeding that
 * computes the money already due to the workman and orders the
 * employer to pay it.
 *
 * THE NATURE OF THE SECTION 33C(2) JURISDICTION:
 *
 *   Section 33C of the Industrial Disputes Act provides a
 *   streamlined recovery procedure for workmen who are
 *   entitled to receive money from their employer but who
 *   are unable to actually receive the money because the
 *   employer has refused or failed to pay. The section has
 *   two parts. Section 33C(1) deals with money due under a
 *   settlement, an award, or any provision of Chapter VA or
 *   Chapter VB of the Act, and provides for recovery of
 *   such money as if it were an arrear of land revenue
 *   through the District Collector. Section 33C(2), which is
 *   the more commonly used provision and which is the
 *   subject of this template, deals with any money that is
 *   due to a workman from his employer or any benefit which
 *   is capable of being computed in terms of money, and
 *   provides that the Labour Court may, on application by
 *   the workman, decide the question of the amount due and
 *   issue an appropriate certificate of recovery.
 *
 *   The most important conceptual feature of the Section
 *   33C(2) jurisdiction is that it is computational rather
 *   than adjudicatory. The Labour Court does not decide the
 *   substantive question of whether the workman is entitled
 *   to the money in the first place. That question is
 *   assumed to have been decided by some prior adjudication
 *   (such as a settlement, an award, an order, a scheme
 *   under the standing orders, or an entitlement that is
 *   admitted by the employer or that flows from an
 *   undisputed provision of law). The Labour Court only
 *   computes the amount that is due based on this prior
 *   adjudication and issues a recovery certificate.
 *
 *   This computational character of the Section 33C(2)
 *   jurisdiction has been the source of substantial
 *   litigation over the years, with the Supreme Court
 *   repeatedly emphasising that the Labour Court cannot
 *   convert itself into a court of original adjudication
 *   under the guise of a Section 33C(2) application. In
 *   leading cases like Punjab Beverages versus Suresh Chand
 *   and Central Bank of India versus P.S. Rajagopalan, the
 *   Supreme Court has held that the workman must establish
 *   the existence of a pre-existing right to the money
 *   before the Labour Court can entertain a Section 33C(2)
 *   application, and that disputed claims to entitlement
 *   must be referred to a Labour Court under Section 10 of
 *   the Act rather than being pursued under Section 33C(2).
 *
 * THE PRACTICAL ADVANTAGES OF SECTION 33C(2):
 *
 *   Despite this conceptual limitation, Section 33C(2) is
 *   very widely used in Indian labour practice because it
 *   has several practical advantages over the ordinary
 *   adjudicatory route. First, it is faster than a
 *   reference under Section 10 because it bypasses the
 *   conciliation and reference stage. Second, it is
 *   procedurally simpler because it involves only the
 *   computation of an admitted entitlement rather than the
 *   adjudication of contested rights. Third, it produces a
 *   recovery certificate that can be enforced as a decree
 *   of a civil court, which gives the workman effective
 *   enforcement powers against the employer.
 *
 *   The most common claims under Section 33C(2) are for
 *   unpaid wages, unpaid overtime, unpaid leave encashment,
 *   unpaid bonus where the entitlement is established under
 *   the Payment of Bonus Act or under a settlement, and
 *   unpaid amounts under settlements or awards.
 *
 * STRUCTURAL FEATURES OF THIS TEMPLATE:
 *
 *   The Section 33C(2) Application has a simpler structure
 *   than the Statement of Claim at Template 91 because it
 *   does not need to plead the full case for substantive
 *   relief. The body needs to establish three things: first,
 *   that the workman is a workman within the meaning of the
 *   Act; second, that the money claimed is due to the
 *   workman from the employer based on some pre-existing
 *   right or entitlement; and third, the precise computation
 *   of the amount due. The relief asks the Labour Court to
 *   determine the amount due and to issue a recovery
 *   certificate.
 */

const {
  Document, Paragraph, TextRun,
  AlignmentType, TabStopType, TabStopPosition,
  Footer, PageNumber, LevelFormat
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

module.exports = new Document({
  styles: { default: { document: { run: { font: "Times New Roman", size: 24 } } } },
  numbering: {
    config: [
      { reference: "s33c-paras", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
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
      // ─── Court Header ───
      centeredBold("BEFORE THE HON'BLE PRESIDING OFFICER", 24),
      centeredBold("LABOUR COURT NO. ________", 24),
      centeredBold("AT ________", 22),
      spacer,
      centeredBold("APPLICATION NO. ________ OF 20__", 24),
      centeredBold("UNDER SECTION 33C(2)", 22),
      spacer,
      legalPara([
        new TextRun({ text: "(Application under Section 33C(2) of the Industrial Disputes Act, 1947, for recovery of money due to the Applicant)", italics: true, size: 22 }),
      ], { alignment: AlignmentType.CENTER }),

      spacer,

      // ─── Parties ───
      legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      legalPara([new TextRun({ text: "Sh. ________", bold: true })]),
      legalPara([new TextRun("S/o ________")]),
      legalPara([new TextRun("Aged about ________ years")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara([new TextRun({ text: "(Workman)", italics: true })]),
      legalPara([new TextRun({ text: "\u2026 APPLICANT", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      centeredBold("VERSUS"),
      spacer,

      legalPara([new TextRun({ text: "M/s ________ Industries Pvt. Ltd.", bold: true })]),
      legalPara([new TextRun("A company incorporated under the Companies Act, 2013,")]),
      legalPara([new TextRun("having its registered office at ________")]),
      legalPara([new TextRun("Through its Managing Director")]),
      legalPara([new TextRun({ text: "\u2026 RESPONDENT", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      spacer,

      // ─── Title ───
      centeredBold("APPLICATION UNDER SECTION 33C(2) OF THE INDUSTRIAL", 22),
      centeredBold("DISPUTES ACT, 1947, FOR RECOVERY OF MONEY DUE", 22),
      centeredBold("FROM THE RESPONDENT TO THE APPLICANT", 22),
      spacer,

      legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Body ───

      // Para 1: Identification of the workman
      new Paragraph({ numbering: { reference: "s33c-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Applicant is a 'workman' within the meaning of Section 2(s) of the Industrial Disputes Act, 1947 (hereinafter referred to as 'the said Act'), and was employed with the Respondent as a ________ (designation) at the Respondent's establishment situated at ________ from ________ (date of joining) till ________ (date of leaving / continuing). The Applicant was drawing a monthly wage of Rs. ________ at the relevant time."
        )] }),

      // Para 2: The Respondent
      new Paragraph({ numbering: { reference: "s33c-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Respondent is an 'employer' within the meaning of Section 2(g) of the said Act and runs an 'industry' within the meaning of Section 2(j) of the said Act, having its establishment located within the territorial jurisdiction of this Hon'ble Labour Court."
        )] }),

      // Para 3: The pre-existing right — the foundation of the
      // Section 33C(2) claim
      new Paragraph({ numbering: { reference: "s33c-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "EXISTENCE OF THE PRE-EXISTING RIGHT: ", bold: true, underline: {} }),
          new TextRun(
            "That the Applicant is entitled to receive the money claimed in the present Application from the Respondent on the basis of the following pre-existing right: ________ (state the source of the entitlement, e.g. an Award dated ________ passed by the Hon'ble Industrial Tribunal in IT No. ________ of 20__ which has become final and binding on the parties / a Settlement dated ________ between the Respondent and the Union of which the Applicant is a member / the certified Standing Orders of the Respondent which prescribe the entitlement / a written agreement between the Applicant and the Respondent / the provisions of the Payment of Bonus Act, 1965, the Payment of Wages Act, 1936, or other applicable labour statute). A true copy of the document evidencing the pre-existing right is annexed herewith and marked as "
          ),
          new TextRun({ text: "Annexure A-1.", bold: true }),
        ] }),

      // Para 4: The amount due and how it has been computed
      new Paragraph({ numbering: { reference: "s33c-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "COMPUTATION OF THE AMOUNT DUE: ", bold: true, underline: {} }),
          new TextRun(
            "That on the basis of the said pre-existing right, the Respondent is liable to pay to the Applicant a total sum of Rs. ________ on account of ________ (state what the money is due for, e.g. arrears of wages from ________ to ________ at the rate of Rs. ________ per month, totalling Rs. ________; unpaid overtime allowance for the period ________ to ________ totalling Rs. ________; unpaid leave encashment for ________ days of accumulated leave at the rate of Rs. ________ per day, totalling Rs. ________; unpaid bonus for the financial year ________ at the rate of ________ % of the basic wages, totalling Rs. ________). A detailed computation of the amount claimed is annexed herewith as Annexure A-2."
          ),
        ] }),

      // Para 5: The demand and refusal
      new Paragraph({ numbering: { reference: "s33c-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Applicant has, on multiple occasions, made oral and written demands to the Respondent for the payment of the said sum, but the Respondent has either refused to pay or has remained silent on the matter. Copies of the written demands made by the Applicant and any responses received from the Respondent are annexed herewith as Annexures A-________ to A-________."
        )] }),

      // Para 6: The amount is computable in terms of money
      new Paragraph({ numbering: { reference: "s33c-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the amount claimed by the Applicant in the present Application is a money claim that is capable of being computed in terms of money on the basis of the documents and the evidence already on record. The Applicant is not seeking any declaration of his entitlement to the money in the first place, but only the computation and recovery of the money that is admittedly or established to be due to him."
        )] }),

      // Para 7: No collateral disputes
      new Paragraph({ numbering: { reference: "s33c-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That there is no genuine dispute about the existence of the Applicant's right to receive the money. The Respondent's refusal to pay is based purely on dilatory tactics and not on any bona fide objection to the substantive entitlement. The present Application therefore squarely falls within the scope of Section 33C(2) of the said Act and not within the more elaborate adjudicatory procedure under Section 10 of the said Act."
        )] }),

      // Para 8: Limitation
      new Paragraph({ numbering: { reference: "s33c-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the present Application is being filed within the period of limitation. The cause of action arose on ________ (date when the entitlement crystallised or when payment was last refused), and the Applicant has approached this Hon'ble Labour Court without any unreasonable delay."
        )] }),

      // Para 9: Jurisdiction
      new Paragraph({ numbering: { reference: "s33c-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That this Hon'ble Labour Court has jurisdiction to entertain and decide the present Application under Section 33C(2) of the said Act, in that the establishment of the Respondent is located within the territorial jurisdiction of this Hon'ble Court."
        )] }),

      spacer,

      // ─── Prayer ───
      centeredBold("PRAYER:", 26),
      spacer,

      legalPara([new TextRun(
        "In view of the facts and circumstances stated above, it is most respectfully prayed that this Hon'ble Labour Court may be pleased to:"
      )]),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "Determine that a sum of Rs. ________ is due and payable from the Respondent to the Applicant on account of ________;", bold: true, underline: {} }),
        ] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "Issue a recovery certificate in favour of the Applicant for the said sum of Rs. ________, along with interest at such rate as this Hon'ble Court may deem just and proper from the date the said sum became due till the date of actual payment;", bold: true }),
        ] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Direct the Respondent to pay the said sum to the Applicant within such time as this Hon'ble Court may specify, failing which the Applicant may proceed to recover the same as if it were a decree of a civil court;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Award costs of the present Application in favour of the Applicant and against the Respondent;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Pass such other or further orders as this Hon'ble Labour Court may deem fit and proper in the facts and circumstances of the case."
        )] }),

      spacer, spacer,

      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Place: ________"), new TextRun({ text: "\tAPPLICANT", bold: true })] }),
      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Date: ________"), new TextRun("\tThrough")] }),
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun("Counsel for the Applicant")] }),

      spacer, spacer,

      legalPara([
        new TextRun({ text: "[NOTE: ", bold: true, italics: true }),
        new TextRun({ text: "This application must be supported by an affidavit of the workman and accompanied by the document establishing the pre-existing right (the award, settlement, agreement, or relevant statutory provision), the detailed computation of the amount claimed, salary slips for the relevant period, and any correspondence with the employer regarding the payment.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
