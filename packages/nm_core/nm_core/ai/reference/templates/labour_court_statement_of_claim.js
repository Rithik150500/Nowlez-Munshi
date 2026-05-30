/**
 * STATEMENT OF CLAIM BEFORE THE LABOUR COURT UNDER
 * SECTION 10 OF THE INDUSTRIAL DISPUTES ACT, 1947
 * ─────────────────────────────────────────────────────
 * Category : Labour and Employment Law — Industrial Dispute
 * Forum    : Labour Court
 * Statute  : Sections 2A, 10, and 11A, Industrial Disputes
 *            Act, 1947
 * Source   : Standard form used in Indian labour court practice
 *
 * The Statement of Claim before the Labour Court under the
 * Industrial Disputes Act, 1947 is the first template in this
 * labour and employment batch and it introduces the principal
 * vehicle for individual industrial disputes in India. To grasp
 * where this template fits in your library, you should compare
 * it with the Employment Contract at Template 58. The Employment
 * Contract is the transactional document that establishes the
 * employer-employee relationship at the outset, while the
 * Statement of Claim is the litigation document that comes into
 * play when that relationship breaks down through dismissal,
 * non-employment, or other industrial action by the employer.
 *
 * THE STATUTORY FRAMEWORK OF INDUSTRIAL DISPUTES:
 *
 *   The Industrial Disputes Act, 1947 is the foundational
 *   labour statute in India and has been the basis of Indian
 *   labour litigation for more than seventy-five years. The
 *   Act creates a specialised dispute resolution machinery
 *   that operates outside the ordinary civil courts and that
 *   is intended to provide faster and cheaper relief to
 *   workmen than would be available through ordinary
 *   litigation. The dispute resolution machinery has several
 *   tiers, including conciliation officers, conciliation
 *   boards, courts of inquiry, labour courts, industrial
 *   tribunals, and national tribunals, with different forums
 *   handling different kinds of disputes based on the
 *   subject matter and the size of the dispute.
 *
 *   The most important conceptual distinction in the
 *   Industrial Disputes Act is the distinction between
 *   matters that fall within the jurisdiction of the Labour
 *   Court (set out in the Second Schedule to the Act) and
 *   matters that fall within the jurisdiction of the
 *   Industrial Tribunal (set out in the Third Schedule).
 *   The Second Schedule covers matters that primarily affect
 *   individual workmen, including the propriety of an order
 *   of dismissal or discharge, the reinstatement of workmen
 *   wrongfully dismissed, the payment of bonus or compensation
 *   to workmen, and the recovery of money due to workmen
 *   under an award or settlement. The Third Schedule covers
 *   matters that affect classes of workmen and that have
 *   broader industrial significance, including wages and
 *   allowances, hours of work and rest intervals, leave with
 *   wages, retrenchment of workmen, and the rationalisation
 *   of work rules.
 *
 *   This template is drafted as a Statement of Claim before
 *   the Labour Court because the most common industrial
 *   dispute in modern Indian practice is the individual
 *   workman's challenge to his dismissal or discharge, which
 *   falls within Item 1 of the Second Schedule.
 *
 * THE INDIVIDUAL WORKMAN GRIEVANCE UNDER SECTION 2A:
 *
 *   The Industrial Disputes Act was originally drafted on
 *   the assumption that an industrial dispute is a collective
 *   matter between an employer and a body of workmen
 *   (typically through their trade union), and the original
 *   provisions of the Act required the dispute to be
 *   espoused by a substantial body of workmen before it
 *   could be referred to a Labour Court. This requirement
 *   was inadequate to deal with the situation of an
 *   individual workman who had been dismissed or otherwise
 *   wronged by the employer but who did not have the
 *   support of a trade union or a substantial body of
 *   colleagues.
 *
 *   This anomaly was addressed by the insertion of Section
 *   2A into the Act in 1965, which provides that where any
 *   employer discharges, dismisses, retrenches, or otherwise
 *   terminates the services of an individual workman, any
 *   dispute or difference between that workman and his
 *   employer connected with or arising out of such discharge,
 *   dismissal, retrenchment, or termination shall be deemed
 *   to be an industrial dispute notwithstanding that no
 *   other workman or any union of workmen is a party to the
 *   dispute. Section 2A was further amended in 2010 to
 *   allow the workman to apply directly to the Labour Court
 *   after the expiry of forty-five days from the date of
 *   the application to the conciliation officer, without
 *   waiting for a formal reference by the appropriate
 *   government.
 *
 *   This 2010 amendment substantially shortened the path to
 *   the Labour Court for individual workmen and made the
 *   industrial dispute machinery much more responsive to
 *   individual grievances. It is now the most common route
 *   by which individual workmen approach the Labour Court.
 *
 * THE POWER OF SECTION 11A:
 *
 *   The most important substantive power of the Labour Court
 *   under the Industrial Disputes Act is the power conferred
 *   by Section 11A, which allows the Labour Court to
 *   reappraise the evidence in any proceeding involving the
 *   discharge or dismissal of a workman and to substitute
 *   its own judgment for that of the employer regarding the
 *   appropriate punishment. Section 11A was inserted in the
 *   Act in 1971 to overrule the earlier judicial position
 *   that the Labour Court could only interfere with a
 *   dismissal if the domestic enquiry had been procedurally
 *   defective, and not on the merits of the punishment
 *   imposed. Section 11A gives the Labour Court the broader
 *   power to consider whether the punishment of dismissal is
 *   proportionate to the proven misconduct, and to substitute
 *   a lesser punishment if it considers the dismissal
 *   excessive.
 *
 *   This power has been used extensively by Labour Courts in
 *   India to convert dismissals into lesser punishments such
 *   as withholding of increments or stoppage of promotion,
 *   particularly in cases where the misconduct is not grave
 *   or where there are mitigating circumstances. The
 *   exercise of this power is subject to judicial review by
 *   the High Courts on the limited grounds of perversity or
 *   illegality.
 *
 * STRUCTURAL FEATURES OF THIS TEMPLATE:
 *
 *   The Statement of Claim follows a structure that is
 *   somewhat distinct from the civil pleadings in your
 *   library. The cause title identifies the case as a
 *   Statement of Claim arising out of a reference under
 *   Section 10 of the Act, with the workman as the
 *   "claimant" and the employer as the "respondent."
 *   The body of the Statement of Claim establishes the
 *   workman's status, the employment, the alleged
 *   misconduct (if any), the domestic enquiry (if any),
 *   the dismissal, and the legal infirmities in the
 *   dismissal. The relief typically asks for reinstatement
 *   with back wages and continuity of service.
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
      { reference: "lc-paras", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
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
      centeredBold("INDUSTRIAL DISPUTE NO. ________ OF 20__", 24),
      spacer,
      legalPara([
        new TextRun({ text: "(Statement of Claim under Section 10 read with Section 2A of the Industrial Disputes Act, 1947)", italics: true, size: 22 }),
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
      legalPara([new TextRun({ text: "\u2026 CLAIMANT / WORKMAN", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      centeredBold("VERSUS"),
      spacer,

      legalPara([new TextRun({ text: "M/s ________ Industries Pvt. Ltd.", bold: true })]),
      legalPara([new TextRun("A company incorporated under the Companies Act, 2013,")]),
      legalPara([new TextRun("having its registered office at ________")]),
      legalPara([new TextRun("and its factory / establishment at ________")]),
      legalPara([new TextRun("Through its Managing Director / General Manager")]),
      legalPara([new TextRun({ text: "\u2026 RESPONDENT / MANAGEMENT", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      spacer,

      // ─── Title ───
      centeredBold("STATEMENT OF CLAIM UNDER SECTION 10 READ WITH", 22),
      centeredBold("SECTION 2A OF THE INDUSTRIAL DISPUTES ACT, 1947,", 22),
      centeredBold("CHALLENGING THE ILLEGAL DISMISSAL OF THE CLAIMANT", 22),
      centeredBold("AND SEEKING REINSTATEMENT WITH FULL BACK WAGES", 22),
      spacer,

      legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Body ───

      // Para 1: Identification of the workman
      new Paragraph({ numbering: { reference: "lc-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Claimant is a 'workman' within the meaning of Section 2(s) of the Industrial Disputes Act, 1947 (hereinafter referred to as 'the said Act'), in that the Claimant was engaged in manual / skilled / unskilled / clerical / supervisory work on the rolls of the Respondent at its factory / establishment situated at ________, on a monthly wage of Rs. ________ at the time of the impugned dismissal."
        )] }),

      // Para 2: The Respondent and the establishment
      new Paragraph({ numbering: { reference: "lc-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Respondent is an 'employer' within the meaning of Section 2(g) of the said Act, and runs an 'industry' within the meaning of Section 2(j) of the said Act. The factory / establishment of the Respondent is located within the territorial jurisdiction of this Hon'ble Labour Court."
        )] }),

      // Para 3: Date of joining and nature of employment
      new Paragraph({ numbering: { reference: "lc-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Claimant joined the services of the Respondent on ________ (date of joining) as a ________ (designation) on a monthly wage of Rs. ________. After completing the prescribed period of probation, the Claimant was confirmed in service on ________ (date of confirmation). At the time of the impugned dismissal, the Claimant had completed approximately ________ years of continuous service with the Respondent and was drawing a total monthly wage (including basic pay, dearness allowance, and other allowances) of Rs. ________."
        )] }),

      // Para 4: The Claimant's service record
      new Paragraph({ numbering: { reference: "lc-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That throughout the period of his service with the Respondent, the Claimant discharged his duties to the satisfaction of the Respondent and earned several appreciation letters and good service reports. The Claimant has at no time during his service been the subject of any disciplinary proceedings, except for the impugned proceedings that culminated in his dismissal. Copies of the appreciation letters and good service reports are annexed herewith as Annexures C-1 to C-________."
        )] }),

      // Para 5: The alleged misconduct and the chargesheet
      new Paragraph({ numbering: { reference: "lc-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "THE CHARGESHEET: ", bold: true, underline: {} }),
          new TextRun(
            "That on or about ________ (date), the Respondent issued a chargesheet to the Claimant alleging that the Claimant had committed the following acts of misconduct: ________ (state the specific charges as set out in the chargesheet). The said charges were entirely false, fabricated, and motivated, and were issued by the Respondent with the ulterior motive of victimising the Claimant for his trade union activities / for raising legitimate grievances about working conditions / for refusing to comply with illegal demands of the management. A true copy of the said chargesheet is annexed herewith and marked as "
          ),
          new TextRun({ text: "Annexure C-________.", bold: true }),
        ] }),

      // Para 6: The reply by the Claimant
      new Paragraph({ numbering: { reference: "lc-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That on receipt of the said chargesheet, the Claimant submitted a detailed reply dated ________ denying all the allegations and explaining the true facts. The Claimant pointed out that the charges were baseless and that the Respondent had no evidence to support them. A true copy of the said reply is annexed herewith as Annexure C-________."
        )] }),

      // Para 7: The domestic enquiry
      new Paragraph({ numbering: { reference: "lc-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "THE DOMESTIC ENQUIRY: ", bold: true, underline: {} }),
          new TextRun(
            "That despite the Claimant's reply, the Respondent appointed an Enquiry Officer and proceeded with a domestic enquiry against the Claimant. The said domestic enquiry was conducted in violation of the principles of natural justice and was vitiated by several procedural infirmities, including: (a) the Enquiry Officer was biased against the Claimant and did not provide a fair and impartial hearing; (b) the Claimant was denied the right to be represented by a co-worker or a representative of his choice; (c) the Claimant was not provided with copies of the documents relied upon by the management witnesses; (d) the Claimant was not given an adequate opportunity to cross-examine the management witnesses; and (e) the Enquiry Officer reached his findings without any legal evidence to support them."
          ),
        ] }),

      // Para 8: The dismissal order
      new Paragraph({ numbering: { reference: "lc-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That on the basis of the report of the Enquiry Officer, the Respondent issued an order of dismissal dated ________ (the 'impugned Order') terminating the services of the Claimant with immediate effect. The said impugned Order was passed without affording the Claimant any opportunity to make representations on the proposed punishment, and the punishment of dismissal is grossly disproportionate to the alleged misconduct. A true copy of the impugned Order is annexed herewith as Annexure C-________."
        )] }),

      // Para 9: The conciliation proceedings
      new Paragraph({ numbering: { reference: "lc-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That being aggrieved by the impugned Order, the Claimant raised an industrial dispute by submitting an application to the Conciliation Officer / Assistant Labour Commissioner under Section 2A(2) of the said Act. The Conciliation Officer initiated conciliation proceedings on ________ but the said proceedings failed because the Respondent refused to take the Claimant back into service. After the lapse of forty-five days from the application to the Conciliation Officer, and in accordance with Section 2A(2) of the said Act as amended in 2010, the Claimant has approached this Hon'ble Labour Court directly by filing the present Statement of Claim."
        )] }),

      // Para 10: Grounds challenging the dismissal
      new Paragraph({ numbering: { reference: "lc-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "GROUNDS CHALLENGING THE IMPUGNED ORDER: ", bold: true, underline: {} }),
          new TextRun(
            "The Claimant respectfully submits the following grounds in support of the present Statement of Claim: (a) the impugned Order is contrary to the principles of natural justice in that the domestic enquiry was conducted in a biased and unfair manner; (b) the findings of the Enquiry Officer are perverse and not supported by any legal evidence; (c) the punishment of dismissal is grossly disproportionate to the alleged misconduct, even assuming the same is proved; (d) the Respondent has failed to follow the procedure prescribed under the standing orders / certified standing orders of the establishment; (e) the impugned Order is vitiated by mala fides and is intended to victimise the Claimant for his trade union activities; and (f) the Respondent has failed to obtain the prior permission / approval required under Section 33 of the said Act, where applicable."
          ),
        ] }),

      // Para 11: Section 11A power
      new Paragraph({ numbering: { reference: "lc-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That this Hon'ble Labour Court has the power under Section 11A of the said Act to reappraise the evidence on record, to set aside the findings of the Enquiry Officer if they are perverse, and to substitute its own judgment for that of the management regarding the appropriate punishment. The Claimant prays that this Hon'ble Court may exercise its power under Section 11A and set aside the impugned Order."
        )] }),

      // Para 12: Continuing unemployment and gainful employment
      new Paragraph({ numbering: { reference: "lc-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That since the date of the impugned dismissal, the Claimant has remained unemployed and has been unable to secure any gainful employment elsewhere despite his best efforts. The Claimant and his family have been put to severe financial hardship as a consequence, and the Claimant has been compelled to borrow money to meet the basic needs of his family."
        )] }),

      // Para 13: Jurisdiction
      new Paragraph({ numbering: { reference: "lc-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That this Hon'ble Labour Court has jurisdiction to entertain and decide the present Statement of Claim because the establishment of the Respondent is located within its territorial jurisdiction and the subject matter of the dispute (the propriety of the dismissal of an individual workman) falls within Item 1 of the Second Schedule to the Industrial Disputes Act, 1947."
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
          new TextRun({ text: "Hold and declare that the impugned Order dated ________ dismissing the Claimant from the services of the Respondent is illegal, void, and unsustainable in law;", bold: true, underline: {} }),
        ] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "Direct the Respondent to reinstate the Claimant in service with continuity of service and full back wages from the date of the impugned dismissal till the date of actual reinstatement;", bold: true }),
        ] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Direct the Respondent to pay all consequential benefits to the Claimant, including increments, promotions, and other service benefits that the Claimant would have earned during the period of his wrongful unemployment;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Award the costs of the present proceedings in favour of the Claimant;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Pass such other or further orders as this Hon'ble Labour Court may deem fit and proper in the facts and circumstances of the case."
        )] }),

      spacer, spacer,

      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Place: ________"), new TextRun({ text: "\tCLAIMANT", bold: true })] }),
      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Date: ________"), new TextRun("\tThrough")] }),
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun("Counsel for the Claimant")] }),

      spacer, spacer,

      legalPara([
        new TextRun({ text: "[NOTE: ", bold: true, italics: true }),
        new TextRun({ text: "This Statement of Claim must be supported by an affidavit of the workman. Documents to be annexed include the appointment letter, salary slips, the chargesheet, the reply, the enquiry report, the dismissal order, and any documents relating to the conciliation proceedings. The workman should also seek a stay on the recovery of any dues from the gratuity or provident fund pending the disposal of the dispute.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
