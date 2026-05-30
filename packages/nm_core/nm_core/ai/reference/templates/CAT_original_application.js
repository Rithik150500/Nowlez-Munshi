/**
 * ORIGINAL APPLICATION BEFORE THE CENTRAL
 * ADMINISTRATIVE TRIBUNAL UNDER SECTION 19 OF
 * THE ADMINISTRATIVE TRIBUNALS ACT, 1985
 * ─────────────────────────────────────────────
 * Category : Service Law / Specialised Tribunal
 * Forum    : Central Administrative Tribunal (CAT)
 * Statute  : Sections 14, 19, 20, and 21 of the
 *            Administrative Tribunals Act, 1985;
 *            Article 323A, Constitution of India
 * Source   : Standard form used in CAT practice
 *
 * The Original Application before the Central Administrative
 * Tribunal is the first template in this batch and it
 * introduces the principal forum for service disputes of
 * central government employees in India. To grasp where this
 * template fits in your library, you should compare it with
 * the Writ Petition for Wrongful Termination at Template 94,
 * which deals with similar service grievances but is filed
 * before the High Court under Article 226. The relationship
 * between the two templates illustrates one of the most
 * important institutional reforms in modern Indian
 * administrative law — the creation of specialised
 * administrative tribunals to substitute for the writ
 * jurisdiction of the High Courts in service matters.
 *
 * THE CONSTITUTIONAL FOUNDATION OF CAT:
 *
 *   The Central Administrative Tribunal was established
 *   under the Administrative Tribunals Act, 1985, which
 *   was enacted pursuant to Article 323A of the
 *   Constitution. Article 323A was inserted into the
 *   Constitution by the Forty-Second Amendment in 1976,
 *   and it empowers Parliament to provide by law for the
 *   adjudication of disputes relating to recruitment and
 *   conditions of service of persons in connection with
 *   the affairs of the Union by administrative tribunals.
 *   The constitutional purpose was to relieve the High
 *   Courts of the heavy burden of service matters that had
 *   been clogging their dockets and to create a more
 *   specialised and efficient forum for the resolution of
 *   service disputes by judges and administrators with
 *   particular expertise in service jurisprudence.
 *
 *   The original 1985 Act ousted the writ jurisdiction of
 *   the High Courts in service matters falling within the
 *   jurisdiction of CAT, with appeals lying directly to
 *   the Supreme Court. This exclusive jurisdiction was
 *   challenged in S.P. Sampath Kumar versus Union of India
 *   and was initially upheld by the Supreme Court, but the
 *   Court reconsidered the question in L. Chandra Kumar
 *   versus Union of India in 1997 and held that the
 *   exclusion of the writ jurisdiction of the High Courts
 *   was unconstitutional because it violated the basic
 *   structure of the Constitution. After L. Chandra Kumar,
 *   decisions of CAT can be challenged by way of writ
 *   petition before the Division Bench of the relevant
 *   High Court before reaching the Supreme Court, which
 *   has restored the constitutional supervisory role of
 *   the High Courts while preserving CAT as the forum of
 *   first instance for service matters.
 *
 * THE JURISDICTION OF CAT:
 *
 *   Section 14 of the Administrative Tribunals Act sets
 *   out the jurisdiction of CAT, which extends to all
 *   service matters concerning persons appointed to all-
 *   India services, central civil services, civil posts
 *   under the Union, civilian employees of the Defence
 *   Services, and various other categories of central
 *   government employees. Service matters include all
 *   matters relating to recruitment, appointment,
 *   confirmation, seniority, promotion, transfer, leave,
 *   pay and allowances, pension, gratuity, retirement,
 *   tenure, disciplinary proceedings, and termination of
 *   service. The jurisdiction is wide and covers virtually
 *   every kind of service grievance that a central
 *   government employee might have.
 *
 *   The most important practical advantage of CAT over
 *   the High Courts is that the proceedings are less
 *   formal, the filing fees are lower, the parties are not
 *   required to engage senior counsel, and the disposal is
 *   typically faster than in the High Courts. CAT also has
 *   the advantage of being staffed by judges and
 *   administrators with specialised knowledge of service
 *   jurisprudence and government rules.
 *
 * THE STRUCTURE OF AN ORIGINAL APPLICATION:
 *
 *   The Original Application before CAT follows a structure
 *   that is somewhat distinct from both the writ petitions
 *   in your library (Templates 3, 45, 66, 94) and the
 *   labour court Statement of Claim at Template 91. The
 *   document is filed in a prescribed form that includes
 *   a statement of facts, the grounds for the application,
 *   the relief sought, and a list of documents relied upon.
 *   The document must be supported by an affidavit and
 *   accompanied by the prescribed filing fee.
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
      { reference: "cat-paras", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
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
      centeredBold("BEFORE THE HON'BLE CENTRAL ADMINISTRATIVE TRIBUNAL", 24),
      centeredBold("________ BENCH AT ________", 22),
      spacer,
      centeredBold("ORIGINAL APPLICATION NO. ________ OF 20__", 24),
      spacer,
      legalPara([
        new TextRun({ text: "(Application under Section 19 of the Administrative Tribunals Act, 1985)", italics: true, size: 22 }),
      ], { alignment: AlignmentType.CENTER }),

      spacer,

      // ─── Parties ───
      legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      legalPara([new TextRun({ text: "Sh. ________", bold: true })]),
      legalPara([new TextRun("S/o ________")]),
      legalPara([new TextRun("Aged about ________ years")]),
      legalPara([new TextRun("Designation: ________")]),
      legalPara([new TextRun("Posted at: ________")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara([new TextRun({ text: "\u2026 APPLICANT", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      centeredBold("VERSUS"),
      spacer,

      legalPara([new TextRun({ text: "1. Union of India", bold: true })]),
      legalPara([new TextRun("   Through the Secretary,")]),
      legalPara([new TextRun("   Ministry of ________,")]),
      legalPara([new TextRun("   Government of India, New Delhi")]),

      spacer,

      legalPara([new TextRun({ text: "2. The ________ (Appointing / Disciplinary Authority)", bold: true })]),
      legalPara([new TextRun("   ________ (full designation and address)")]),

      spacer,

      legalPara([new TextRun({ text: "3. The ________ (Cadre Controlling Authority)", bold: true })]),
      legalPara([new TextRun("   ________ (full designation and address)")]),
      legalPara([new TextRun({ text: "\u2026 RESPONDENTS", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      spacer,

      // ─── Title ───
      centeredBold("ORIGINAL APPLICATION UNDER SECTION 19 OF THE", 22),
      centeredBold("ADMINISTRATIVE TRIBUNALS ACT, 1985, CHALLENGING THE", 22),
      centeredBold("IMPUGNED ORDER DATED ________ AND SEEKING", 22),
      centeredBold("APPROPRIATE SERVICE BENEFITS", 22),
      spacer,

      legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Body ───

      // Para 1: Maintainability
      new Paragraph({ numbering: { reference: "cat-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Applicant is a person appointed to a civil service of the Union / a civil post under the Union / an All India Service, and the present Original Application falls squarely within the jurisdiction of this Hon'ble Tribunal under Section 14 of the Administrative Tribunals Act, 1985 (hereinafter referred to as 'the said Act'). The cause of action of the present Application is a 'service matter' within the meaning of Section 3(q) of the said Act."
        )] }),

      // Para 2: Particulars of the Applicant
      new Paragraph({ numbering: { reference: "cat-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Applicant was appointed to the post of ________ in the ________ Service / Department on ________ (date of appointment) by appointment order No. ________ dated ________. After completing the prescribed period of probation, the Applicant was confirmed in service on ________. At present, the Applicant is working / was working at the time of the impugned action as a ________ at ________, and the present basic pay of the Applicant in the relevant pay matrix is Rs. ________."
        )] }),

      // Para 3: Service record
      new Paragraph({ numbering: { reference: "cat-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That throughout his service of approximately ________ years, the Applicant has discharged his duties with utmost honesty, dedication, and efficiency, and has earned several outstanding performance appraisals, appreciation letters, and promotions. The annual confidential reports / annual performance assessment reports of the Applicant have consistently been graded as 'Very Good' or 'Outstanding'. Copies of the relevant ACRs / APARs are annexed herewith as Annexures A-1 to A-________."
        )] }),

      // Para 4: The cause of action
      new Paragraph({ numbering: { reference: "cat-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "THE CAUSE OF ACTION: ", bold: true, underline: {} }),
          new TextRun(
            "That on ________ (date), Respondent No. ________ issued the impugned Order No. ________ dated ________ (the 'impugned Order') by which the Applicant was ________ (state the action taken, e.g. denied promotion, transferred to a remote location, awarded a major penalty, denied seniority, denied pay fixation, denied pension, etc.). The said impugned Order is illegal, arbitrary, and contrary to the relevant service rules, and is liable to be set aside by this Hon'ble Tribunal. A true copy of the impugned Order is annexed herewith as Annexure A-________."
          ),
        ] }),

      // Para 5: The relevant service rules
      new Paragraph({ numbering: { reference: "cat-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the service of the Applicant is governed by the ________ Service Rules / Recruitment Rules notified vide Notification No. ________ dated ________. The relevant provisions of the said Rules that are applicable to the present case are ________, which provide that ________. The impugned Order is in clear violation of the said Rules and has been passed in disregard of the procedural safeguards prescribed therein."
        )] }),

      // Para 6: Departmental remedies exhausted
      new Paragraph({ numbering: { reference: "cat-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That being aggrieved by the impugned Order, the Applicant submitted a representation to Respondent No. ________ on ________, but the said representation was rejected vide order dated ________ without giving any reasons. The Applicant has thus exhausted the departmental remedies available to him as required under Section 20 of the said Act, and is now constrained to approach this Hon'ble Tribunal."
        )] }),

      // Para 7: Limitation
      new Paragraph({ numbering: { reference: "cat-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "LIMITATION: ", bold: true, underline: {} }),
          new TextRun(
            "That the present Original Application is being filed within the period of one year from the date of the final order on the representation of the Applicant, as prescribed under Section 21 of the said Act. The final order on the representation was passed on ________, and the present Application is being filed on ________, well within the prescribed period of limitation."
          ),
        ] }),

      // Para 8: No alternative remedy
      new Paragraph({ numbering: { reference: "cat-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Applicant has no other equally efficacious alternative remedy available to him. The departmental remedies have been exhausted and the only remedy available to the Applicant is to approach this Hon'ble Tribunal."
        )] }),

      // Para 9: Grounds challenging the impugned order
      new Paragraph({ numbering: { reference: "cat-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "GROUNDS: ", bold: true, underline: {} }),
          new TextRun(
            "The Applicant challenges the impugned Order on, amongst others, the following grounds: (a) the impugned Order is in violation of the relevant service rules; (b) the impugned Order is violative of the principles of natural justice in that the Applicant was not given a fair hearing; (c) the impugned Order is mala fide and is intended to victimise the Applicant for ________; (d) the impugned Order is arbitrary, discriminatory, and violative of Articles 14 and 16 of the Constitution of India; (e) the impugned Order has been passed without application of mind and on extraneous considerations; and (f) the impugned Order is in violation of the law laid down by the Hon'ble Supreme Court in ________."
          ),
        ] }),

      // Para 10: Jurisdiction of the bench
      new Paragraph({ numbering: { reference: "cat-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That this Hon'ble Bench of the Central Administrative Tribunal has jurisdiction to entertain and decide the present Original Application because the Applicant is presently posted / was last posted within the territorial jurisdiction of this Hon'ble Bench, and the cause of action arose within the said jurisdiction."
        )] }),

      // Para 11: Court fee
      new Paragraph({ numbering: { reference: "cat-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the requisite court fee of Rs. ________ has been paid in the manner prescribed under the Central Administrative Tribunal Rules of Practice."
        )] }),

      spacer,

      // ─── Prayer ───
      centeredBold("PRAYER:", 26),
      spacer,

      legalPara([new TextRun(
        "In view of the facts and circumstances stated above, it is most respectfully prayed that this Hon'ble Tribunal may be pleased to:"
      )]),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "Quash and set aside the impugned Order dated ________ passed by Respondent No. ________;", bold: true, underline: {} }),
        ] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Direct the Respondents to grant to the Applicant ________ (the relief sought, e.g. promotion to the post of ________ with retrospective effect from ________ along with consequential service benefits / pay fixation in accordance with the relevant rules / continuity of service from ________, etc.);"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Direct the Respondents to grant all consequential service benefits including arrears of pay and allowances, seniority, increments, and any other benefits that the Applicant would have been entitled to but for the impugned Order;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Award the costs of the present Application in favour of the Applicant;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Pass such other or further orders as this Hon'ble Tribunal may deem fit and proper in the facts and circumstances of the case."
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
        new TextRun({ text: "This Original Application must be supported by an affidavit of the applicant and accompanied by the appointment letter, the latest pay slip, the relevant ACRs/APARs, the impugned order, the representation made to the departmental authority, the order rejecting the representation, and the relevant service rules. The application must be filed in the prescribed form under the Central Administrative Tribunal Rules of Practice.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
