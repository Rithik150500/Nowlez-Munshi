/**
 * COMPLAINT TO THE DATA PROTECTION BOARD UNDER THE
 * DIGITAL PERSONAL DATA PROTECTION ACT, 2023
 * ─────────────────────────────────────────────
 * Category : Data Protection / Privacy — Modern Statutory
 *            Remedy
 * Forum    : Data Protection Board of India (under Section 18
 *            of the DPDPA, 2023)
 * Statute  : Sections 8, 13, 27, and 28 of the Digital
 *            Personal Data Protection Act, 2023
 * Source   : Standard form developed for early DPDPA practice
 *
 * The Complaint to the Data Protection Board under the DPDPA,
 * 2023 is the third template in this batch and it introduces
 * what is the most significant new statutory regime in Indian
 * commercial law in recent years. To grasp where this template
 * fits in your library, you should think of it as the first
 * template in what will eventually become a substantial body
 * of data protection jurisprudence as the DPDPA framework
 * comes into operation. The Act received presidential assent
 * in August 2023 and is being brought into force in stages
 * through implementing rules notified by the Central
 * Government.
 *
 * THE BACKGROUND TO THE DPDPA:
 *
 *   The Digital Personal Data Protection Act, 2023 is the
 *   culmination of a long process of policy development that
 *   began in earnest after the Supreme Court's landmark
 *   judgment in K.S. Puttaswamy versus Union of India in
 *   2017, in which a nine-judge bench of the Court
 *   unanimously held that the right to privacy is a
 *   fundamental right protected under Article 21 of the
 *   Constitution. The Puttaswamy judgment was the
 *   immediate catalyst for the appointment of the Justice
 *   B.N. Srikrishna Committee on data protection, which
 *   submitted its report in 2018 along with a draft
 *   Personal Data Protection Bill. The draft Bill went
 *   through several rounds of consultation and revision
 *   over the next five years, before finally being enacted
 *   in a substantially modified form as the DPDPA in 2023.
 *
 *   The DPDPA, 2023 establishes for the first time in India
 *   a comprehensive statutory framework for the protection
 *   of personal data, broadly modelled on the European
 *   Union's General Data Protection Regulation (GDPR) but
 *   with several distinctively Indian features. The Act
 *   applies to the processing of digital personal data
 *   within India and, in some circumstances, to the
 *   processing of personal data of Indian residents outside
 *   India. It imposes a range of obligations on data
 *   fiduciaries (the Indian equivalent of "data
 *   controllers" under the GDPR), creates a number of
 *   rights for data principals (the Indian equivalent of
 *   "data subjects"), and establishes the Data Protection
 *   Board of India as the principal enforcement and
 *   adjudicatory body.
 *
 * THE KEY OBLIGATIONS UNDER THE DPDPA:
 *
 *   The DPDPA imposes several key obligations on data
 *   fiduciaries that you should understand when drafting
 *   any complaint under the Act. First, under Section 4 of
 *   the Act, a data fiduciary may process personal data
 *   only on the basis of the consent of the data principal
 *   or on the basis of certain "legitimate uses" specified
 *   in the Act, and the consent must be free, specific,
 *   informed, unconditional, and unambiguous. Second, under
 *   Section 5 of the Act, the data fiduciary must give the
 *   data principal a notice setting out the personal data
 *   being processed, the purpose of the processing, and
 *   the manner in which the data principal can exercise
 *   her rights under the Act. Third, under Section 6 of the
 *   Act, the data fiduciary must obtain consent that is
 *   specific to each purpose of processing. Fourth, under
 *   Section 8 of the Act, the data fiduciary has a wide
 *   range of obligations including the obligation to
 *   ensure the accuracy of the data, the security of the
 *   data, the limitation of retention to the period
 *   necessary for the purpose, and the publication of
 *   contact details of the Data Protection Officer (where
 *   applicable).
 *
 * THE RIGHTS OF DATA PRINCIPALS:
 *
 *   The Act creates several important rights for data
 *   principals that form the basis for most complaints
 *   under the Act. These rights include: the right to
 *   access information about her personal data being
 *   processed (Section 11); the right to correction and
 *   erasure of personal data (Section 12); the right to
 *   nominate another individual to exercise the rights
 *   under the Act in case of death or incapacity (Section
 *   14); and the right of grievance redressal through the
 *   data fiduciary itself (Section 13). Section 13(3)
 *   specifically provides that the data principal must
 *   exhaust the grievance redressal mechanism of the data
 *   fiduciary before approaching the Data Protection Board,
 *   which is an important procedural requirement that
 *   should be complied with in any complaint.
 *
 * THE DATA PROTECTION BOARD:
 *
 *   The Data Protection Board of India is established under
 *   Section 18 of the Act and is the principal adjudicatory
 *   body under the Act. The Board has the power to inquire
 *   into complaints by data principals or to take suo motu
 *   cognisance of breaches, to direct urgent remedial or
 *   mitigation measures, to impose monetary penalties, and
 *   to issue directions to data fiduciaries to ensure
 *   compliance with the Act. The penalties under the Act
 *   are substantial, ranging up to Rs. 250 crore for failure
 *   to take reasonable security safeguards, and provide a
 *   significant deterrent effect against non-compliance.
 *
 *   Appeals from the Data Protection Board lie to the
 *   Telecom Disputes Settlement and Appellate Tribunal
 *   (TDSAT) under Section 29 of the Act, which is an
 *   interesting design choice that links the data
 *   protection regime to the existing telecom regulatory
 *   tribunal at Template 97 in your library.
 *
 * STRUCTURAL FEATURES OF THIS TEMPLATE:
 *
 *   The complaint to the Data Protection Board has a
 *   somewhat informal structure that reflects the
 *   technology-focused and consumer-friendly nature of the
 *   data protection regime. The body identifies the data
 *   principal making the complaint, the data fiduciary
 *   against whom the complaint is made, the personal data
 *   that has been improperly processed, the specific
 *   provisions of the Act that have been violated, and the
 *   relief sought. The complaint must demonstrate that the
 *   internal grievance redressal mechanism of the data
 *   fiduciary has been exhausted before approaching the
 *   Board.
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
      { reference: "dpdp-paras", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
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
      // ─── Header ───
      centeredBold("BEFORE THE HON'BLE DATA PROTECTION BOARD OF INDIA", 24),
      centeredBold("AT NEW DELHI", 22),
      spacer,
      centeredBold("COMPLAINT NO. ________ OF 20__", 24),
      spacer,
      legalPara([
        new TextRun({ text: "(Complaint under Section 27 of the Digital Personal Data Protection Act, 2023, read with Section 13(3) of the said Act)", italics: true, size: 22 }),
      ], { alignment: AlignmentType.CENTER }),

      spacer, hrule(),

      // ─── Parties ───
      legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      legalPara([new TextRun({ text: "Sh./Smt. ________", bold: true })]),
      legalPara([new TextRun("S/o or D/o ________")]),
      legalPara([new TextRun("Aged about ________ years")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara([new TextRun("Email: ________ | Mobile: ________")]),
      legalPara([new TextRun({ text: "(Data Principal under the DPDPA, 2023)", italics: true })]),
      legalPara([new TextRun({ text: "\u2026 COMPLAINANT", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      centeredBold("VERSUS"),
      spacer,

      legalPara([new TextRun({ text: "M/s ________ Technologies Pvt. Ltd.", bold: true })]),
      legalPara([new TextRun("A company incorporated under the Companies Act, 2013,")]),
      legalPara([new TextRun("having its registered office at ________")]),
      legalPara([new TextRun("CIN: ________")]),
      legalPara([new TextRun("Through its Data Protection Officer / authorised signatory")]),
      legalPara([new TextRun({ text: "(Data Fiduciary under the DPDPA, 2023)", italics: true })]),
      legalPara([new TextRun({ text: "\u2026 RESPONDENT", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      spacer,

      // ─── Title ───
      centeredBold("COMPLAINT UNDER SECTION 27 OF THE DIGITAL PERSONAL", 22),
      centeredBold("DATA PROTECTION ACT, 2023, AGAINST THE RESPONDENT", 22),
      centeredBold("FOR BREACH OF THE COMPLAINANT'S RIGHTS AS A DATA", 22),
      centeredBold("PRINCIPAL UNDER THE SAID ACT", 22),
      spacer,

      legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Body ───

      // Para 1: Identification of the complainant
      new Paragraph({ numbering: { reference: "dpdp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Complainant is an adult Indian citizen and is a 'Data Principal' within the meaning of Section 2(j) of the Digital Personal Data Protection Act, 2023 (hereinafter referred to as 'the DPDPA' or 'the said Act'), in that the Complainant is the natural person to whom the personal data that is the subject matter of the present complaint relates."
        )] }),

      // Para 2: Identification of the respondent
      new Paragraph({ numbering: { reference: "dpdp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Respondent is a 'Data Fiduciary' within the meaning of Section 2(i) of the said Act, in that the Respondent alone or in conjunction with other persons determines the purpose and means of processing of the personal data of the Complainant. The Respondent operates the ________ platform / application / service (the 'said Service') through which the Respondent collects, stores, and processes the personal data of millions of users including the Complainant."
        )] }),

      // Para 3: The relationship and the data collected
      new Paragraph({ numbering: { reference: "dpdp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "DETAILS OF THE PERSONAL DATA: ", bold: true, underline: {} }),
          new TextRun(
            "That the Complainant became a user of the said Service on ________ (date) by creating an account using the email address ________ and the mobile number ________. In the course of using the said Service, the Complainant has provided the Respondent with the following personal data: (a) name, age, gender, and contact details; (b) financial information including bank account details and transaction history; (c) location data and device identifiers; (d) browsing history and usage patterns within the said Service; and (e) ________ (other categories of personal data, as applicable). The Complainant provided the said personal data on the understanding that it would be processed only for the specified purposes and in accordance with the privacy policy of the Respondent."
          ),
        ] }),

      // Para 4: The breach
      new Paragraph({ numbering: { reference: "dpdp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "THE BREACH OF THE DPDPA: ", bold: true, underline: {} }),
          new TextRun(
            "That on or about ________ (date), the Complainant became aware that the Respondent had committed the following breaches of its obligations under the said Act: (a) the Respondent had been processing the personal data of the Complainant for purposes other than those for which consent had been obtained, in violation of Section 6 of the said Act; (b) the Respondent had been sharing the personal data of the Complainant with third parties without obtaining specific and informed consent for such sharing, in violation of Sections 4, 5, and 6 of the said Act; (c) the Respondent had failed to take reasonable security safeguards to prevent the personal data of the Complainant from being accessed by unauthorised persons, in violation of Section 8(5) of the said Act, as a result of which the personal data of the Complainant was exposed in a data breach reported on ________ (date); (d) the Respondent had retained the personal data of the Complainant beyond the period necessary for the specified purposes, in violation of Section 8(7) of the said Act; and (e) the Respondent had failed to publish the contact details of its Data Protection Officer (where applicable) in violation of Section 8(9) of the said Act."
          ),
        ] }),

      // Para 5: Specific incident details
      new Paragraph({ numbering: { reference: "dpdp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Complainant became aware of the said breaches when the Complainant began to receive unsolicited communications from third parties referring to specific personal information that the Complainant had provided only to the Respondent. The Complainant subsequently learned through media reports that the Respondent had suffered a major data breach in which the personal data of approximately ________ users had been exposed. Copies of the relevant media reports and the unsolicited communications received by the Complainant are annexed herewith as Annexures C-________ to C-________."
        )] }),

      // Para 6: Exhaustion of internal grievance mechanism
      new Paragraph({ numbering: { reference: "dpdp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "EXHAUSTION OF INTERNAL GRIEVANCE MECHANISM (SECTION 13(3)): ", bold: true, underline: {} }),
          new TextRun(
            "That in compliance with the procedural requirement under Section 13(3) of the said Act, the Complainant first approached the Respondent's grievance redressal mechanism by submitting a complaint through the Respondent's grievance portal on ________ (date). The said complaint was acknowledged but the Respondent failed to provide any meaningful response or to remedy the breaches complained of. The Complainant submitted a follow-up complaint on ________ (date), but the Respondent again failed to respond substantively. The Complainant has therefore exhausted the internal grievance redressal mechanism of the Respondent and is now approaching this Hon'ble Board. Copies of the said complaints and the responses received are annexed herewith as Annexures C-________ to C-________."
          ),
        ] }),

      // Para 7: Right of erasure
      new Paragraph({ numbering: { reference: "dpdp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Complainant has also exercised the right of erasure under Section 12 of the said Act by requesting the Respondent to erase all personal data of the Complainant from its systems, but the Respondent has failed to comply with the said request. The Complainant has thereby suffered a continuing violation of the right of erasure in addition to the original breaches set out above."
        )] }),

      // Para 8: Harm caused
      new Paragraph({ numbering: { reference: "dpdp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That as a result of the said breaches, the Complainant has suffered substantial harm including: (a) loss of privacy and unauthorised exposure of personal information; (b) the receipt of unsolicited and persistent commercial communications from third parties; (c) the increased risk of identity theft and financial fraud; (d) mental anguish, anxiety, and inconvenience; and (e) the loss of trust in the digital ecosystem more generally."
        )] }),

      // Para 9: Jurisdiction of the board
      new Paragraph({ numbering: { reference: "dpdp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That this Hon'ble Board has jurisdiction to entertain and decide the present complaint under Section 27 of the said Act, which empowers the Board to inquire into complaints filed by data principals against data fiduciaries for breach of the provisions of the Act. The Board has the power under Section 28 of the Act to direct urgent remedial measures, to impose monetary penalties, and to issue any other directions necessary for ensuring compliance with the Act."
        )] }),

      spacer,

      // ─── Prayer ───
      centeredBold("PRAYER:", 26),
      spacer,

      legalPara([new TextRun(
        "In view of the facts and circumstances stated above, it is most respectfully prayed that this Hon'ble Board may be pleased to:"
      )]),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "Hold and declare that the Respondent has committed breaches of Sections 4, 5, 6, 8, and 12 of the Digital Personal Data Protection Act, 2023;", bold: true, underline: {} }),
        ] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Direct the Respondent to immediately take such remedial and mitigation measures as may be necessary to prevent further harm to the Complainant and to other affected data principals;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Direct the Respondent to erase all personal data of the Complainant from its systems and from the systems of any third parties to whom the data has been transferred;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Impose appropriate monetary penalties on the Respondent under Section 33 of the said Act for the breaches committed;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Direct the Respondent to publish a public notice acknowledging the breaches and the corrective measures taken;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Pass such other or further orders as this Hon'ble Board may deem fit and proper in the facts and circumstances of the case."
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
        new TextRun({ text: "This is an early-practice template based on the DPDPA, 2023 as enacted. The exact procedural rules for filing complaints with the Data Protection Board will be set out in the Digital Personal Data Protection Rules to be notified by the Central Government, which may modify the form and the manner of filing. Appeals from the Data Protection Board lie to the Telecom Disputes Settlement and Appellate Tribunal (TDSAT) under Section 29 of the Act.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
