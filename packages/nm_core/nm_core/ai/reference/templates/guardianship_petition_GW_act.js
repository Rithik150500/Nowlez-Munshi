/**
 * PETITION FOR APPOINTMENT AS GUARDIAN OF A MINOR
 * UNDER SECTION 7 OF THE GUARDIANS AND WARDS ACT, 1890
 * ─────────────────────────────────────────────────────
 * Category : Family / Personal Law — Secular Guardianship
 * Court    : District Court / Family Court (where established)
 * Statute  : Sections 7, 8, 17, and 25 of the Guardians and
 *            Wards Act, 1890
 * Source   : Standard form used in Indian family court practice
 *
 * The Petition for Guardianship under the Guardians and Wards
 * Act, 1890 is the first template in this family law expansion
 * batch and it introduces the secular guardianship statute that
 * sits alongside the various personal laws governing parent and
 * child relationships in India. To grasp where this template
 * fits, you have to understand the somewhat fragmented framework
 * that governs guardianship in Indian law and the particular
 * role that the Guardians and Wards Act plays within that
 * framework.
 *
 * THE FRAMEWORK OF GUARDIANSHIP LAW IN INDIA:
 *
 *   Guardianship in India is governed by an overlapping set
 *   of statutes that operate at different levels and that
 *   apply to different communities. At the personal law
 *   level, guardianship for Hindus is governed by the Hindu
 *   Minority and Guardianship Act, 1956 (HMG Act), which
 *   designates the father as the natural guardian of a
 *   Hindu minor and after him the mother. For Muslims,
 *   guardianship is governed by personal law, under which
 *   the father is the natural guardian of his minor children
 *   subject to the right of "hizanat" (the right of physical
 *   custody) which usually vests in the mother during the
 *   tender years of the child. For Christians and Parsis,
 *   there is no separate personal law of guardianship, and
 *   the matter is governed entirely by the Guardians and
 *   Wards Act, 1890.
 *
 *   At the secular level, the Guardians and Wards Act, 1890
 *   is a colonial-era statute that provides a uniform
 *   procedural framework for the appointment of guardians
 *   by the courts. The Act applies to all Indians regardless
 *   of religion, but its substantive provisions are
 *   supplemented by the personal law of the parties for
 *   communities like Hindus and Muslims that have their own
 *   personal laws of guardianship.
 *
 *   The relationship between the Guardians and Wards Act and
 *   the personal laws is that the personal laws determine
 *   who is the natural guardian (and therefore who has a
 *   prima facie claim to be appointed by the court), while
 *   the Guardians and Wards Act provides the procedural
 *   mechanism by which the court actually makes the
 *   appointment. In the case of Hindus, the HMG Act and the
 *   Guardians and Wards Act work together: the HMG Act
 *   governs the substantive question of who is the natural
 *   guardian, while the Guardians and Wards Act governs the
 *   procedural question of how a court order of guardianship
 *   is to be obtained.
 *
 * THE WELFARE PRINCIPLE:
 *
 *   The most important substantive principle in any
 *   guardianship petition is the welfare of the minor, which
 *   is set out in Section 17(1) of the Guardians and Wards
 *   Act, 1890. Section 17(1) provides that in appointing or
 *   declaring the guardian of a minor, the court shall be
 *   guided by what, consistently with the law to which the
 *   minor is subject, appears in the circumstances to be for
 *   the welfare of the minor. The welfare principle has been
 *   repeatedly emphasised by the Supreme Court as the
 *   paramount consideration that overrides all other
 *   considerations including the prima facie rights of the
 *   natural guardian. In leading cases such as Gaurav Nagpal
 *   versus Sumedha Nagpal and Vivek Singh versus Romani
 *   Singh, the Supreme Court has held that the welfare of
 *   the child is the polestar that must guide the court in
 *   any custody or guardianship matter, and that the court
 *   must consider the age, sex, religion, character, and
 *   capacity of the proposed guardian, the wishes of any
 *   deceased parent, the existing or previous relations of
 *   the proposed guardian with the minor, and any other
 *   factor relevant to the welfare of the minor.
 *
 * STRUCTURAL FEATURES OF THIS TEMPLATE:
 *
 *   First, look at the parties. The petitioner is the
 *   person seeking to be appointed as the guardian, who is
 *   typically a parent, a grandparent, an uncle, or some
 *   other near relative of the minor. The minor is named
 *   in the cause title but is not a formal party because of
 *   the minor status, and any other person claiming an
 *   interest in the guardianship of the minor is named as
 *   a respondent.
 *
 *   Second, look at the body. Paragraphs 1 and 2 establish
 *   the petitioner and the minor. Paragraph 3 sets out the
 *   circumstances that have given rise to the need for the
 *   appointment of a guardian (typically the death of the
 *   parents, the incapacity of the parents, or the
 *   abandonment of the minor by the parents). Paragraphs 4
 *   and 5 establish the petitioner's qualifications to be
 *   the guardian and the welfare of the minor under the
 *   proposed guardianship. Paragraph 6 deals with the
 *   property of the minor (if any). Paragraphs 7 and 8 deal
 *   with jurisdiction and limitation.
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
      { reference: "gw-paras", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
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
      // Filed before the District Court / Family Court within
      // whose jurisdiction the minor ordinarily resides
      centeredBold("IN THE COURT OF THE PRINCIPAL DISTRICT JUDGE", 26),
      centeredBold("(FAMILY COURT, where established)", 22),
      centeredBold("AT ________", 22),
      spacer,
      centeredBold("GUARDIANSHIP PETITION NO. ________ OF 20__", 24),
      spacer,
      legalPara([
        new TextRun({ text: "(Petition under Sections 7, 8 and 17 of the Guardians and Wards Act, 1890)", italics: true, size: 22 }),
      ], { alignment: AlignmentType.CENTER }),

      spacer,

      // ─── Parties ───
      legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      spacer,

      legalPara([new TextRun({ text: "Master / Kumari ________", bold: true })]),
      legalPara([new TextRun("Aged about ________ years")]),
      legalPara([new TextRun("S/o or D/o (late) ________")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara([new TextRun({ text: "(The Minor)", italics: true })]),

      spacer,

      legalPara([new TextRun({ text: "AND IN THE MATTER OF:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      spacer,

      legalPara([new TextRun({ text: "Sh./Smt. ________", bold: true })]),
      legalPara([new TextRun("S/o or D/o ________")]),
      legalPara([new TextRun("Aged about ________ years")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara([new TextRun("(Relationship with the Minor: ________)")]),
      legalPara([new TextRun({ text: "\u2026 PETITIONER", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      centeredBold("VERSUS"),
      spacer,

      // Other persons claiming guardianship of the minor are
      // named as respondents
      legalPara([new TextRun({ text: "1. Sh. ________", bold: true })]),
      legalPara([new TextRun("   S/o ________")]),
      legalPara([new TextRun("   R/o ________")]),
      legalPara([new TextRun({ text: "   (Father / Brother / Uncle of the Minor)", italics: true })]),

      spacer,

      legalPara([new TextRun({ text: "2. Smt. ________", bold: true })]),
      legalPara([new TextRun("   W/o ________")]),
      legalPara([new TextRun("   R/o ________")]),
      legalPara([new TextRun({ text: "   (Mother / Sister / Aunt of the Minor)", italics: true })]),
      legalPara([new TextRun({ text: "\u2026 RESPONDENTS", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      spacer,

      // ─── Title ───
      centeredBold("PETITION UNDER SECTION 7 OF THE GUARDIANS AND WARDS", 22),
      centeredBold("ACT, 1890, FOR APPOINTMENT OF THE PETITIONER AS THE", 22),
      centeredBold("GUARDIAN OF THE PERSON AND PROPERTY OF THE", 22),
      centeredBold("ABOVE-NAMED MINOR", 22),
      spacer,

      legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Body ───

      // Para 1: Identification of the petitioner
      new Paragraph({ numbering: { reference: "gw-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Petitioner is the ________ (state the relationship, e.g. paternal grandfather / maternal aunt / elder brother) of the minor Master / Kumari ________ (hereinafter referred to as 'the Minor'). The Petitioner is a person of sound mind, of good character, and of adequate financial means to provide for the welfare of the Minor. The Petitioner has been residing at the address mentioned above for the last ________ years and is gainfully employed / engaged in the business of ________."
        )] }),

      // Para 2: Identification of the minor
      new Paragraph({ numbering: { reference: "gw-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That the Minor was born on ________ (date of birth) at ________, and is at present aged about ________ years and ________ months. The Minor is a citizen of India and is governed by ________ (state the personal law, e.g. Hindu law / Muslim law / Christian law / Parsi law) so far as matters of personal status are concerned. A true copy of the birth certificate of the Minor is annexed herewith and marked as "
          ),
          new TextRun({ text: "Annexure P-1.", bold: true }),
        ] }),

      // Para 3: Circumstances giving rise to the need for
      // appointment
      new Paragraph({ numbering: { reference: "gw-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "CIRCUMSTANCES NECESSITATING THE APPOINTMENT: ", bold: true, underline: {} }),
          new TextRun(
            "That the natural parents of the Minor, namely Sh. ________ (the father) and Smt. ________ (the mother), have ________ (state the circumstances, e.g. both passed away in an accident on ________ leaving the Minor an orphan / are no longer alive having died on ________ and ________ respectively / have abandoned the Minor since ________ / are incapable of caring for the Minor due to mental illness / are estranged and unable to agree on the upbringing of the Minor). In view of these circumstances, there is no person currently exercising effective guardianship over the Minor, and the appointment of a court-recognised guardian has become necessary for the welfare and proper upbringing of the Minor. Death certificates / medical certificates / other documentary evidence of the said circumstances are annexed herewith as Annexures P-2 to P-________."
          ),
        ] }),

      // Para 4: Petitioner's qualifications to be guardian
      new Paragraph({ numbering: { reference: "gw-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Petitioner is fully qualified and competent to act as the guardian of the person and property of the Minor. The Petitioner has been closely associated with the Minor since birth and has developed a strong emotional bond with the Minor. The Minor has been residing with the Petitioner since ________ (date), and the Petitioner has been providing for all the needs of the Minor including food, clothing, shelter, medical care, and education. The Minor is comfortable in the company of the Petitioner and regards the Petitioner as a parental figure."
        )] }),

      // Para 5: Welfare of the minor — the paramount
      // consideration under Section 17
      new Paragraph({ numbering: { reference: "gw-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "WELFARE OF THE MINOR: ", bold: true, underline: {} }),
          new TextRun(
            "That the appointment of the Petitioner as the guardian of the Minor will be in the best interests and for the welfare of the Minor within the meaning of Section 17(1) of the Guardians and Wards Act, 1890. The Petitioner has the means, the willingness, and the family environment necessary to ensure the proper upbringing of the Minor. The Petitioner undertakes to provide the Minor with quality education, adequate medical care, emotional support, and a stable home environment, and to bring the Minor up in accordance with the religion, customs, and traditions to which the Minor is subject. The Petitioner further undertakes to maintain the Minor's relationships with the extended family of the deceased parents and to consult with appropriate family members on important decisions affecting the Minor."
          ),
        ] }),

      // Para 6: Property of the minor (if any)
      new Paragraph({ numbering: { reference: "gw-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Minor has inherited the following movable and immovable properties from his/her late parents: (a) ________ (immovable property situated at ________); (b) ________ (bank deposits, fixed deposits, and other financial assets); and (c) ________ (other movable property). The total value of the said properties is approximately Rs. ________. The Petitioner undertakes to manage the said properties prudently for the benefit of the Minor, to keep proper accounts, and not to alienate any immovable property without the leave of this Hon'ble Court."
        )] }),

      // Para 7: No previous application
      new Paragraph({ numbering: { reference: "gw-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That no previous application for the appointment of a guardian of the Minor has been made by the Petitioner or by any other person to this Hon'ble Court or to any other court. There is no other proceeding relating to the guardianship of the Minor pending before any court of law."
        )] }),

      // Para 8: Jurisdiction
      new Paragraph({ numbering: { reference: "gw-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That this Hon'ble Court has jurisdiction to entertain and decide the present petition under Section 9 of the Guardians and Wards Act, 1890, in that the Minor ordinarily resides within the territorial jurisdiction of this Hon'ble Court. The properties of the Minor are also situated within the said jurisdiction."
        )] }),

      // Para 9: Court fee
      new Paragraph({ numbering: { reference: "gw-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the requisite court fee has been affixed on the present petition."
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
          new TextRun({ text: "Appoint the Petitioner as the guardian of the person and the property of the Minor Master / Kumari ________ under Section 7 of the Guardians and Wards Act, 1890;", bold: true, underline: {} }),
        ] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Issue a guardianship certificate in favour of the Petitioner under Section 7 of the said Act, authorising the Petitioner to take charge of the person and property of the Minor;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Authorise the Petitioner to manage the properties of the Minor for the benefit of the Minor, subject to such conditions and safeguards as this Hon'ble Court may deem fit to impose;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Pass such other or further orders as this Hon'ble Court may deem fit and proper in the facts and circumstances of the case for the welfare of the Minor."
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
        new TextRun({ text: "This petition must be supported by an affidavit of the petitioner and accompanied by the birth certificate of the minor, death certificates of the parents (if applicable), proof of residence and financial means of the petitioner, school records of the minor, and any other documents establishing the welfare of the minor under the proposed guardianship. The court will typically appoint a guardian ad litem to represent the interests of the minor and may also conduct an inquiry through the Child Welfare Committee.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
