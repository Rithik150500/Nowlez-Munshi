/**
 * PETITION BEFORE THE TELECOM DISPUTES SETTLEMENT
 * AND APPELLATE TRIBUNAL UNDER SECTION 14A OF THE
 * TELECOM REGULATORY AUTHORITY OF INDIA ACT, 1997
 * ─────────────────────────────────────────────
 * Category : Regulatory Tribunal — Telecom & Broadcasting
 * Forum    : Telecom Disputes Settlement and Appellate
 *            Tribunal (TDSAT), New Delhi
 * Statute  : Sections 14, 14A, 14B, and 18 of the
 *            Telecom Regulatory Authority of India Act, 1997
 * Source   : Standard form used in TDSAT practice
 *
 * The Petition before the Telecom Disputes Settlement and
 * Appellate Tribunal is the second template in this batch and
 * it introduces the specialised regulatory tribunal that
 * handles disputes in the telecom and broadcasting sectors in
 * India. To grasp where this template fits in your library,
 * you should compare it with the other tribunal templates at
 * Templates 76 (ITAT for direct taxes), 77 (NCLAT for company
 * law), 78 (SAT for securities), 79 (CCI for competition), and
 * 80 (NGT for environment). Each of these tribunals has been
 * established to handle a specific area of regulatory
 * jurisprudence that requires technical expertise and a
 * dedicated forum, and TDSAT is the equivalent forum for the
 * telecom and broadcasting sectors which have been among the
 * most heavily regulated parts of the Indian economy since
 * liberalisation.
 *
 * THE HISTORY AND EVOLUTION OF TDSAT:
 *
 *   The Telecom Disputes Settlement and Appellate Tribunal
 *   was established under the Telecom Regulatory Authority
 *   of India Act, 1997 (the 'TRAI Act'), which was the
 *   foundational statute for the modern Indian
 *   telecommunications sector. The TRAI Act was enacted in
 *   the wake of the liberalisation of the telecommunications
 *   sector in the early 1990s, when the government decided
 *   to allow private operators to enter what had previously
 *   been a state monopoly. The liberalisation created a
 *   need for an independent regulatory body to set policies,
 *   resolve disputes between operators and between operators
 *   and customers, and ensure fair competition in the
 *   sector. The TRAI Act addressed this need by creating
 *   two complementary bodies: the Telecom Regulatory
 *   Authority of India (TRAI) as the policy-making and
 *   regulation-setting body, and the TDSAT as the dispute
 *   resolution body.
 *
 *   The TDSAT was established to take over the dispute
 *   resolution functions that had previously been performed
 *   by TRAI itself, after the Supreme Court raised concerns
 *   in Cellular Operators Association of India versus Union
 *   of India about the propriety of a regulatory body acting
 *   as both the rule-maker and the dispute-resolver. The
 *   TDSAT was designed as an independent quasi-judicial
 *   body chaired by a person who is or has been a judge of
 *   the Supreme Court or the Chief Justice of a High Court,
 *   and supported by members with expertise in telecom,
 *   law, finance, or management.
 *
 *   The jurisdiction of TDSAT was originally limited to
 *   telecom disputes, but it has been expanded over the
 *   years to cover broadcasting and cable services (under
 *   the Cable Television Networks Regulation Act, 1995,
 *   read with various government notifications), airport
 *   tariff disputes (under the Airports Economic
 *   Regulatory Authority of India Act, 2008), and certain
 *   other regulated sectors. TDSAT is now one of the most
 *   important specialised regulatory tribunals in India and
 *   has developed a substantial body of jurisprudence on
 *   licensing, interconnection, tariff regulation,
 *   broadcasting content, and similar regulatory issues.
 *
 * THE THREE LIMBS OF TDSAT JURISDICTION:
 *
 *   The jurisdiction of TDSAT under the TRAI Act has three
 *   distinct limbs that you should understand. The first
 *   limb, set out in Section 14(a)(i) of the TRAI Act, is
 *   the original jurisdiction to adjudicate any dispute
 *   between a licensor and a licensee, between two or more
 *   service providers, or between a service provider and a
 *   group of consumers. This is the core dispute resolution
 *   function of TDSAT and covers most commercial disputes
 *   in the regulated sectors.
 *
 *   The second limb, set out in Section 14(a)(ii) and the
 *   appellate provisions, is the appellate jurisdiction to
 *   hear appeals against any direction, decision, or order
 *   of TRAI under the Act. This makes TDSAT the appellate
 *   forum for regulatory orders passed by TRAI and gives
 *   TDSAT substantial influence over the development of
 *   telecom policy and regulation.
 *
 *   The third limb, set out in Section 18 of the TRAI Act,
 *   is the appellate jurisdiction to hear appeals against
 *   the orders of TDSAT itself, which lie directly to the
 *   Supreme Court on questions of law. This direct appeal
 *   to the Supreme Court (bypassing the High Courts) is a
 *   distinctive feature of TDSAT that reflects the
 *   specialised nature of its jurisdiction and the need for
 *   uniform interpretation of telecom regulation across
 *   India.
 *
 * STRUCTURAL FEATURES OF THIS TEMPLATE:
 *
 *   Template 97 follows the basic structure of the other
 *   tribunal petitions in your library, with a court header
 *   identifying TDSAT as the forum, a cause title with the
 *   parties identified as petitioner and respondent, a body
 *   establishing the petitioner's standing and the
 *   substantive grievance, and a prayer asking for
 *   appropriate relief. The distinctive features are the
 *   establishment of TDSAT's jurisdiction under Section 14
 *   of the TRAI Act, the identification of the licensing
 *   relationship between the parties, and the specific
 *   reliefs available under the telecom regulatory regime.
 *
 *   This template is drafted as an original petition
 *   between two service providers (interconnection dispute)
 *   because that is the most common type of TDSAT
 *   proceeding and because it illustrates the substantive
 *   regulatory issues that TDSAT typically handles.
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
      { reference: "tdsat-paras", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
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
      centeredBold("BEFORE THE HON'BLE TELECOM DISPUTES SETTLEMENT", 24),
      centeredBold("AND APPELLATE TRIBUNAL", 24),
      centeredBold("AT NEW DELHI", 22),
      spacer,
      centeredBold("PETITION NO. ________ OF 20__", 24),
      spacer,
      legalPara([
        new TextRun({ text: "(Petition under Section 14(a)(i) of the Telecom Regulatory Authority of India Act, 1997)", italics: true, size: 22 }),
      ], { alignment: AlignmentType.CENTER }),

      spacer,

      // ─── Parties ───
      legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      legalPara([new TextRun({ text: "M/s ________ Telecommunications Pvt. Ltd.", bold: true })]),
      legalPara([new TextRun("A company incorporated under the Companies Act, 2013,")]),
      legalPara([new TextRun("having its registered office at ________")]),
      legalPara([new TextRun("CIN: ________")]),
      legalPara([new TextRun("Holder of Unified Licence dated ________")]),
      legalPara([new TextRun("Through its authorised signatory")]),
      legalPara([new TextRun({ text: "\u2026 PETITIONER", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      centeredBold("VERSUS"),
      spacer,

      legalPara([new TextRun({ text: "M/s ________ Communications Ltd.", bold: true })]),
      legalPara([new TextRun("A company incorporated under the Companies Act, 2013,")]),
      legalPara([new TextRun("having its registered office at ________")]),
      legalPara([new TextRun("CIN: ________")]),
      legalPara([new TextRun("Holder of Unified Licence dated ________")]),
      legalPara([new TextRun("Through its authorised signatory")]),
      legalPara([new TextRun({ text: "\u2026 RESPONDENT", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      spacer,

      // ─── Title ───
      centeredBold("PETITION UNDER SECTION 14(a)(i) OF THE TELECOM", 22),
      centeredBold("REGULATORY AUTHORITY OF INDIA ACT, 1997, FOR", 22),
      centeredBold("RESOLUTION OF INTERCONNECTION DISPUTE BETWEEN", 22),
      centeredBold("THE PETITIONER AND THE RESPONDENT", 22),
      spacer,

      legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Body ───

      // Para 1: Identification of the petitioner
      new Paragraph({ numbering: { reference: "tdsat-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Petitioner is a 'service provider' within the meaning of Section 2(j) of the Telecom Regulatory Authority of India Act, 1997 (hereinafter referred to as 'the said Act'), being a holder of a Unified Licence issued by the Department of Telecommunications, Government of India, vide Licence No. ________ dated ________. The Petitioner provides ________ telecommunications services in the ________ Service Area / Areas, and is duly authorised to enter into interconnection arrangements with other licensed service providers."
        )] }),

      // Para 2: Identification of the respondent
      new Paragraph({ numbering: { reference: "tdsat-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Respondent is also a 'service provider' within the meaning of Section 2(j) of the said Act, being a holder of a Unified Licence issued by the Department of Telecommunications. The Respondent operates one of the largest telecommunications networks in India and has substantial market power in the ________ Service Area which is relevant to the present dispute."
        )] }),

      // Para 3: The interconnection regime
      new Paragraph({ numbering: { reference: "tdsat-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "THE INTERCONNECTION REGIME: ", bold: true, underline: {} }),
          new TextRun(
            "That the interconnection between licensed telecommunications service providers in India is governed by the Telecommunication Interconnection Regulations, 2018 (and any amendments thereto) issued by the Telecom Regulatory Authority of India (TRAI) under Section 11 of the said Act, read with the conditions of the Unified Licence. Under the said regulatory framework, every service provider is under an obligation to provide interconnection to other licensed service providers on fair, transparent, and non-discriminatory terms, and to enter into interconnection agreements that comply with the regulations issued by TRAI from time to time."
          ),
        ] }),

      // Para 4: The interconnection agreement
      new Paragraph({ numbering: { reference: "tdsat-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That on ________, the Petitioner and the Respondent entered into an Interconnection Agreement (the 'said Agreement') for the mutual exchange of telecommunications traffic between their respective networks. The said Agreement set out the technical, commercial, and operational terms governing the interconnection between the parties, including the points of interconnection, the capacity to be made available, the interconnection usage charges, and the procedures for billing and settlement. A true copy of the said Agreement is annexed herewith and marked as "
          ),
          new TextRun({ text: "Annexure P-1.", bold: true }),
        ] }),

      // Para 5: The dispute
      new Paragraph({ numbering: { reference: "tdsat-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "PARTICULARS OF THE DISPUTE: ", bold: true, underline: {} }),
          new TextRun(
            "That from on or about ________ (date), the Respondent began to engage in the following unfair and discriminatory practices in connection with the said Agreement: (a) the Respondent has unilaterally refused to provide additional interconnection capacity to the Petitioner despite repeated requests, citing capacity constraints that do not actually exist; (b) the Respondent has been raising disputed invoices on the Petitioner for amounts far in excess of the actual interconnection usage charges payable under the said Agreement; (c) the Respondent has been deliberately delaying the settlement of amounts admittedly due to the Petitioner; and (d) the Respondent has threatened to disconnect the existing interconnection points unless the Petitioner accepts the Respondent's unilateral demands. The said practices are in flagrant violation of the said Agreement, the Telecommunication Interconnection Regulations, 2018, and the conditions of the Unified Licence."
          ),
        ] }),

      // Para 6: Correspondence
      new Paragraph({ numbering: { reference: "tdsat-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Petitioner has, on multiple occasions, written to the Respondent calling upon the Respondent to comply with its obligations under the said Agreement and the regulatory framework. Despite the said correspondence, the Respondent has continued its unfair practices and has refused to engage meaningfully with the Petitioner to resolve the dispute. Copies of the relevant correspondence are annexed herewith as Annexures P-________ to P-________."
        )] }),

      // Para 7: Reference to TRAI
      new Paragraph({ numbering: { reference: "tdsat-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Petitioner has also approached the Telecom Regulatory Authority of India seeking its intervention in the dispute, but TRAI has indicated that the matter is essentially a commercial dispute between two service providers and that the appropriate forum for its resolution is this Hon'ble Tribunal under Section 14(a)(i) of the said Act."
        )] }),

      // Para 8: Jurisdiction
      new Paragraph({ numbering: { reference: "tdsat-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "JURISDICTION: ", bold: true, underline: {} }),
          new TextRun(
            "That this Hon'ble Tribunal has jurisdiction to entertain and decide the present petition under Section 14(a)(i) of the said Act, in that the present dispute is a dispute between two service providers within the meaning of the said Section. The dispute is in the nature of an interconnection dispute and falls squarely within the regulatory jurisdiction of this Hon'ble Tribunal as expanded by various decisions of the Hon'ble Supreme Court and this Hon'ble Tribunal itself."
          ),
        ] }),

      // Para 9: Urgency and balance of convenience
      new Paragraph({ numbering: { reference: "tdsat-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the present dispute is of an urgent nature because the threat of disconnection by the Respondent could result in serious disruption of services to the customers of the Petitioner and could cause irreparable harm to the business of the Petitioner. The balance of convenience is overwhelmingly in favour of the Petitioner, and the Petitioner is therefore also seeking interim directions to maintain the status quo pending the disposal of the present petition."
        )] }),

      // Para 10: Filing fee
      new Paragraph({ numbering: { reference: "tdsat-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the requisite filing fee has been paid in accordance with the TDSAT (Procedure) Rules and the relevant fee schedule."
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
          new TextRun({ text: "Direct the Respondent to provide additional interconnection capacity to the Petitioner in accordance with the requests made by the Petitioner and in compliance with the Telecommunication Interconnection Regulations, 2018;", bold: true, underline: {} }),
        ] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Quash the disputed invoices raised by the Respondent on the Petitioner and direct the Respondent to raise fresh invoices in accordance with the actual interconnection usage charges payable under the said Agreement;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Direct the Respondent to settle the amounts admittedly due to the Petitioner along with interest at the rate prescribed under the said Agreement;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Pass interim directions restraining the Respondent from disconnecting the existing interconnection points or from taking any other coercive action against the Petitioner during the pendency of the present petition;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Award the costs of the present petition in favour of the Petitioner and against the Respondent;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Pass such other or further orders as this Hon'ble Tribunal may deem fit and proper in the facts and circumstances of the case."
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
        new TextRun({ text: "This petition must be supported by an affidavit of an authorised officer of the petitioner. Documents to be annexed include the Unified Licences of both parties, the Interconnection Agreement, the disputed invoices, the correspondence between the parties, the relevant TRAI regulations, and any technical reports relevant to the dispute. Appeals from TDSAT lie directly to the Supreme Court under Section 18 of the TRAI Act on questions of law.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
