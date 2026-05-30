/**
 * WRIT PETITION FOR WRONGFUL TERMINATION OF SERVICE
 * UNDER ARTICLE 226 OF THE CONSTITUTION OF INDIA
 * ─────────────────────────────────────────────────────
 * Category : Labour and Employment Law / Constitutional —
 *            Service Matters
 * Court    : High Court (under Article 226)
 * Statute  : Article 226 and Article 311, Constitution of
 *            India; relevant service rules
 * Source   : Standard form used in Indian service matters practice
 *
 * The Writ Petition for Wrongful Termination is the fourth
 * template in the labour law batch and it introduces the
 * constitutional remedy that is available to public servants
 * and to employees of bodies that fall within the writ
 * jurisdiction of the High Courts. To grasp where this template
 * fits, you should compare it with the Statement of Claim before
 * the Labour Court at Template 91. The two templates address
 * similar problems (the wrongful termination of an employee)
 * but they apply to different categories of employees and
 * operate under different legal frameworks. The Statement of
 * Claim is filed by a "workman" within the meaning of Section
 * 2(s) of the Industrial Disputes Act and is filed before a
 * Labour Court that operates under the framework of the
 * Industrial Disputes Act. The Writ Petition is filed by a
 * "civil servant" or by an employee of a body that is
 * sufficiently connected with the State to be amenable to writ
 * jurisdiction, and is filed before the High Court under
 * Article 226 of the Constitution.
 *
 * THE TWO PARALLEL TRACKS FOR EMPLOYMENT DISPUTES:
 *
 *   Indian employment law has historically operated on two
 *   parallel tracks that you should understand. The first
 *   track is the industrial relations track governed by the
 *   Industrial Disputes Act, 1947 and the various other
 *   labour statutes, which applies to "workmen" in the
 *   organised private sector and in some public sector
 *   undertakings. The second track is the constitutional
 *   service jurisprudence track, which applies to civil
 *   servants and to employees of statutory corporations and
 *   other "instrumentalities of the State" within the
 *   meaning of Article 12 of the Constitution.
 *
 *   The two tracks have different procedural regimes,
 *   different forums, different remedies, and different
 *   substantive principles. The industrial relations track
 *   provides relatively informal proceedings before
 *   specialised labour forums with the principal remedy
 *   being reinstatement with back wages. The constitutional
 *   service jurisprudence track provides more formal
 *   proceedings before the High Courts under Article 226,
 *   with the remedies being the issuance of a writ
 *   quashing the impugned order and consequential relief.
 *
 *   The choice between the two tracks depends primarily on
 *   the status of the employee and on the nature of the
 *   employer. If the employee is a workman within the
 *   meaning of Section 2(s) of the Industrial Disputes Act
 *   and the employer is amenable to that Act, the
 *   industrial relations track is generally preferred. If
 *   the employee is a civil servant in the strict sense or
 *   is employed by a statutory corporation or an
 *   instrumentality of the State, the constitutional service
 *   jurisprudence track is generally preferred and may be
 *   the only available track.
 *
 * THE CONSTITUTIONAL PROTECTION UNDER ARTICLE 311:
 *
 *   Article 311 of the Constitution provides certain
 *   procedural protections to civil servants of the Union
 *   and of the States that cannot be taken away by ordinary
 *   legislation or by service rules. Article 311(1) provides
 *   that no person who is a member of a civil service of
 *   the Union or of an All India Service or of a civil
 *   service of a State shall be dismissed or removed by an
 *   authority subordinate to that by which he was appointed.
 *   Article 311(2) provides that no such person shall be
 *   dismissed, removed, or reduced in rank except after an
 *   inquiry in which he has been informed of the charges
 *   against him and given a reasonable opportunity of being
 *   heard in respect of those charges.
 *
 *   These constitutional protections are supplemented by the
 *   principles of natural justice that the Indian courts
 *   have developed and applied to all administrative actions
 *   of the State. The principles include the right to know
 *   the case against oneself, the right to a fair hearing,
 *   the right to cross-examine adverse witnesses, the right
 *   to lead defence evidence, and the right to a reasoned
 *   decision by an unbiased decision-maker. Any termination
 *   that violates these principles is liable to be quashed
 *   by the High Court in writ jurisdiction.
 *
 * THE EXTENSION TO STATUTORY BODIES:
 *
 *   The constitutional service jurisprudence track is not
 *   limited to civil servants in the strict sense. Through
 *   a long line of decisions beginning with Sukhdev Singh
 *   versus Bhagatram Sardar Singh Raghuvanshi and
 *   culminating in cases like Ajay Hasia versus Khalid Mujib
 *   Sehravardi, the Supreme Court has extended the writ
 *   jurisdiction under Article 226 to cover employees of
 *   statutory corporations, public sector undertakings, and
 *   other bodies that are sufficiently controlled or
 *   financed by the State to qualify as "instrumentalities
 *   of the State" within the meaning of Article 12 of the
 *   Constitution. The test for determining whether a body
 *   is an instrumentality of the State has been refined in
 *   subsequent cases including Pradeep Kumar Biswas versus
 *   Indian Institute of Chemical Biology, which laid down a
 *   six-factor test focusing on government control,
 *   government financing, and the public function character
 *   of the body.
 *
 *   This extension has substantially broadened the scope of
 *   the writ jurisdiction in employment matters and has made
 *   it available to a much wider range of employees than the
 *   strict category of civil servants. In modern practice,
 *   most employees of public sector banks, government-owned
 *   companies, statutory corporations, universities, and
 *   similar bodies have access to the writ jurisdiction for
 *   service-related grievances.
 *
 * STRUCTURAL FEATURES OF THIS TEMPLATE:
 *
 *   Template 94 follows the basic structure of the writ
 *   petitions that you have already seen at Template 3
 *   (Writ Petition under Article 226), Template 45 (Habeas
 *   Corpus), and Template 66 (PIL). The distinctive features
 *   of the service writ petition are the establishment of
 *   the petitioner's status as a member of the civil service
 *   or as an employee of an instrumentality of the State,
 *   the narration of the disciplinary proceedings, the
 *   identification of the violations of Article 311 and the
 *   principles of natural justice, and the prayer for
 *   quashing of the impugned order with reinstatement and
 *   consequential benefits.
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
      { reference: "wp-paras", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "wp-grounds", levels: [{ level: 0, format: LevelFormat.UPPER_LETTER, text: "%1.",
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
      centeredBold("IN THE HIGH COURT OF ________ AT ________", 26),
      centeredBold("(EXTRAORDINARY CIVIL WRIT JURISDICTION)", 22),
      spacer,
      centeredBold("WRIT PETITION (CIVIL) NO. ________ OF 20__", 24),
      spacer,
      legalPara([
        new TextRun({ text: "(Petition under Article 226 of the Constitution of India)", italics: true, size: 22 }),
      ], { alignment: AlignmentType.CENTER }),

      spacer,

      // ─── Parties ───
      legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      legalPara([new TextRun({ text: "Sh. ________", bold: true })]),
      legalPara([new TextRun("S/o ________")]),
      legalPara([new TextRun("Aged about ________ years")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara([new TextRun("Former ________ (designation)")]),
      legalPara([new TextRun("Employee Code: ________")]),
      legalPara([new TextRun({ text: "\u2026 PETITIONER", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      centeredBold("VERSUS"),
      spacer,

      legalPara([new TextRun({ text: "1. Union of India / State of ________", bold: true })]),
      legalPara([new TextRun("   Through the Secretary,")]),
      legalPara([new TextRun("   Ministry / Department of ________")]),

      spacer,

      legalPara([new TextRun({ text: "2. The ________ (Name of the employing authority / corporation)", bold: true })]),
      legalPara([new TextRun("   Through its Chairman / Managing Director / General Manager,")]),
      legalPara([new TextRun("   ________ (Address)")]),

      spacer,

      legalPara([new TextRun({ text: "3. The Disciplinary Authority", bold: true })]),
      legalPara([new TextRun("   ________ (Designation and address)")]),
      legalPara([new TextRun({ text: "\u2026 RESPONDENTS", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      spacer,

      // ─── Title ───
      centeredBold("WRIT PETITION UNDER ARTICLE 226 OF THE CONSTITUTION OF", 22),
      centeredBold("INDIA SEEKING ISSUANCE OF AN APPROPRIATE WRIT, ORDER", 22),
      centeredBold("OR DIRECTION FOR QUASHING OF THE IMPUGNED ORDER OF", 22),
      centeredBold("DISMISSAL DATED ________ AND FOR REINSTATEMENT OF THE", 22),
      centeredBold("PETITIONER WITH FULL CONSEQUENTIAL BENEFITS", 22),
      spacer,

      legalPara([new TextRun({ text: "To,", bold: true })]),
      legalPara([new TextRun("The Hon'ble Chief Justice")]),
      legalPara([new TextRun("And His Companion Justices of the Hon'ble High Court of ________ at ________.")]),

      spacer,

      legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Body ───

      // Para 1: Identification of the petitioner and his service
      new Paragraph({ numbering: { reference: "wp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Petitioner was appointed to the post of ________ (designation) in the service of Respondent No. 2 by appointment letter dated ________. The Petitioner is a member of the ________ Service / is an employee of Respondent No. 2 which is an instrumentality of the State within the meaning of Article 12 of the Constitution of India, and is therefore entitled to the constitutional protections under Article 311 / under the writ jurisdiction of this Hon'ble Court."
        )] }),

      // Para 2: Service history
      new Paragraph({ numbering: { reference: "wp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Petitioner joined the service of Respondent No. 2 on ________ (date of joining), and after the prescribed period of probation, was confirmed in service on ________. Throughout the period of his service of approximately ________ years, the Petitioner discharged his duties with utmost honesty, integrity, and dedication, and earned several appreciation letters and outstanding performance appraisals. At no time during his service was the Petitioner the subject of any adverse remark or disciplinary action, except for the impugned proceedings that culminated in his dismissal."
        )] }),

      // Para 3: Status as instrumentality of the State
      new Paragraph({ numbering: { reference: "wp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "STATUS OF RESPONDENT NO. 2 AS INSTRUMENTALITY OF THE STATE: ", bold: true, underline: {} }),
          new TextRun(
            "That Respondent No. 2 is a statutory corporation / a company in which the Government holds more than ________ % of the share capital / a body which is substantially controlled and financed by the Government. The said Respondent has been consistently held by this Hon'ble Court and by the Hon'ble Supreme Court to be an instrumentality of the State within the meaning of Article 12 of the Constitution and is therefore amenable to the writ jurisdiction of this Hon'ble Court in service matters affecting its employees."
          ),
        ] }),

      // Para 4: The chargesheet
      new Paragraph({ numbering: { reference: "wp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "THE CHARGESHEET: ", bold: true, underline: {} }),
          new TextRun(
            "That on ________, the Petitioner was issued a chargesheet by Respondent No. 3 alleging the following acts of misconduct: ________ (state the specific charges). The said charges were entirely false, fabricated, and motivated, and were issued by the Respondents with the ulterior motive of removing the Petitioner from service for ________ (state the suspected real motive, e.g. for refusing to comply with illegal instructions, for whistleblowing, for asserting his rights, etc.). A true copy of the said chargesheet is annexed herewith and marked as "
          ),
          new TextRun({ text: "Annexure P-1.", bold: true }),
        ] }),

      // Para 5: Reply to the chargesheet
      new Paragraph({ numbering: { reference: "wp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Petitioner submitted a detailed and comprehensive reply to the said chargesheet on ________, denying all the allegations and explaining the true facts. The Petitioner pointed out that the charges were vague, baseless, and unsupported by any credible evidence. A true copy of the said reply is annexed herewith as Annexure P-2."
        )] }),

      // Para 6: Departmental enquiry
      new Paragraph({ numbering: { reference: "wp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "VIOLATIONS IN THE DEPARTMENTAL ENQUIRY: ", bold: true, underline: {} }),
          new TextRun(
            "That despite the Petitioner's reply, an Enquiry Officer was appointed by Respondent No. 3 to conduct a departmental enquiry against the Petitioner. The said enquiry was conducted in flagrant violation of the principles of natural justice and the relevant service rules, and was vitiated by the following infirmities: (a) the Enquiry Officer was biased against the Petitioner and had a closed mind; (b) the Petitioner was denied copies of the documents relied upon by the Department in spite of repeated requests; (c) the Petitioner was denied the right to be represented by a defence assistant of his choice; (d) the Petitioner was not given an opportunity to cross-examine all the prosecution witnesses; (e) the Enquiry Officer relied upon evidence that had not been put to the Petitioner and on which the Petitioner had not been heard; and (f) the report of the Enquiry Officer was not supplied to the Petitioner before the punishment was imposed, in violation of the law laid down by the Hon'ble Supreme Court in Managing Director, ECIL versus B. Karunakar."
          ),
        ] }),

      // Para 7: The impugned dismissal order
      new Paragraph({ numbering: { reference: "wp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That on the basis of the report of the Enquiry Officer, Respondent No. 3 passed the impugned order of dismissal dated ________ (the 'impugned Order') terminating the services of the Petitioner with immediate effect. The said impugned Order was passed without giving the Petitioner any opportunity to make representations on the proposed punishment, and the punishment of dismissal is grossly disproportionate to the alleged misconduct. A true copy of the impugned Order is annexed herewith as Annexure P-3."
        )] }),

      // Para 8: Departmental appeal
      new Paragraph({ numbering: { reference: "wp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Petitioner preferred a departmental appeal against the impugned Order to the Appellate Authority, who dismissed the same by order dated ________ (the 'impugned Appellate Order') without giving any cogent reasons and without addressing the substantive grounds raised by the Petitioner. A true copy of the impugned Appellate Order is annexed herewith as Annexure P-4. The Petitioner has thus exhausted all departmental remedies and is now constrained to approach this Hon'ble Court."
        )] }),

      // Para 9: No alternative remedy
      new Paragraph({ numbering: { reference: "wp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Petitioner has no other equally efficacious alternative remedy available to him. The departmental remedies have been exhausted, and the impugned action involves a clear violation of fundamental rights and constitutional protections that can only be effectively redressed through the writ jurisdiction of this Hon'ble Court."
        )] }),

      spacer,

      // ─── Grounds ───
      new Paragraph({ numbering: { reference: "wp-paras", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "GROUNDS:", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Petitioner challenges the impugned Order and the impugned Appellate Order on, amongst others, the following grounds:"
      )]),

      // Ground A
      new Paragraph({ numbering: { reference: "wp-grounds", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because the impugned Order and the impugned Appellate Order are violative of Article 311(2) of the Constitution of India, in that the Petitioner was not afforded a reasonable opportunity of being heard in the departmental enquiry."
        )] }),

      // Ground B
      new Paragraph({ numbering: { reference: "wp-grounds", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because the impugned Order is violative of the principles of natural justice in that the Enquiry Officer was biased, the Petitioner was denied copies of relevant documents, and the report of the Enquiry Officer was not supplied to the Petitioner before the punishment was imposed."
        )] }),

      // Ground C
      new Paragraph({ numbering: { reference: "wp-grounds", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because the findings of the Enquiry Officer are perverse and not supported by any legal evidence, and the impugned Order is liable to be quashed on the ground of being based on no evidence."
        )] }),

      // Ground D
      new Paragraph({ numbering: { reference: "wp-grounds", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because the punishment of dismissal is grossly disproportionate to the alleged misconduct and shocks the conscience, and is liable to be set aside on the doctrine of proportionality as laid down by the Hon'ble Supreme Court in Ranjit Thakur versus Union of India and other cases."
        )] }),

      // Ground E
      new Paragraph({ numbering: { reference: "wp-grounds", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because the impugned Order has been passed by an authority which was not the appointing authority of the Petitioner, in violation of Article 311(1) of the Constitution."
        )] }),

      // Ground F
      new Paragraph({ numbering: { reference: "wp-grounds", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because the impugned Order is mala fide and is intended to victimise the Petitioner for ________ (state the suspected real motive)."
        )] }),

      // Ground G
      new Paragraph({ numbering: { reference: "wp-grounds", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "The Petitioner craves leave of this Hon'ble Court to add, alter, amend or modify any of the above grounds at the time of the hearing of the present petition."
        )] }),

      spacer,

      // ─── Prayer ───
      centeredBold("PRAYER:", 26),
      spacer,

      legalPara([new TextRun(
        "In view of the facts and circumstances stated above, it is most respectfully prayed that this Hon'ble Court may be pleased to:"
      )]),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "Issue an appropriate writ, order, or direction, particularly in the nature of certiorari, quashing the impugned Order dated ________ passed by Respondent No. 3 dismissing the Petitioner from service, and the impugned Appellate Order dated ________;", bold: true, underline: {} }),
        ] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "Issue an appropriate writ, order, or direction in the nature of mandamus, directing the Respondents to reinstate the Petitioner in service with continuity of service and full back wages from the date of the impugned dismissal till the date of actual reinstatement;", bold: true }),
        ] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Direct the Respondents to grant all consequential service benefits to the Petitioner, including increments, promotions, seniority, gratuity, provident fund contributions, and any other benefits that the Petitioner would have earned during the period of his wrongful dismissal;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Award the costs of the present petition in favour of the Petitioner;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Pass such other or further orders as this Hon'ble Court may deem fit and proper in the facts and circumstances of the case."
        )] }),

      spacer, spacer,

      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Place: ________"), new TextRun({ text: "\tPETITIONER", bold: true })] }),
      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Date: ________"), new TextRun("\tThrough")] }),
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun("Counsel for the Petitioner")] }),

      spacer, spacer,

      legalPara([
        new TextRun({ text: "[NOTE: ", bold: true, italics: true }),
        new TextRun({ text: "This petition must be supported by an affidavit of the petitioner. Documents to be annexed include the appointment letter, salary slips, the chargesheet, the reply, the enquiry report, the dismissal order, the appellate order, and the relevant service rules. The petition should be filed within a reasonable time of the impugned order, as writ courts can decline to entertain petitions filed after substantial delay even though there is no formal limitation period for writ jurisdiction.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
