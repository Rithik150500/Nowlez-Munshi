/**
 * PETITION FOR DECLARATION OF VALID ADOPTION UNDER THE
 * HINDU ADOPTIONS AND MAINTENANCE ACT, 1956
 * ────────────────────────────────────────────────────────
 * Category : Personal Law — Family / Adoption
 * Court    : District Court / Family Court (where established)
 * Statute  : Hindu Adoptions and Maintenance Act, 1956 (HAMA)
 * Source   : Standard form used in Indian family court practice
 *
 * The Adoption Petition under the Hindu Adoptions and Maintenance
 * Act, 1956 is the third template in this batch and it expands
 * your library into an area of personal law that the existing
 * matrimonial templates do not cover. Your library currently has
 * six matrimonial templates at 11, 27, 39, 43, 44 and 50, and
 * all of them deal with the husband-wife relationship in some
 * form, whether for restoration (restitution of conjugal rights),
 * preservation (judicial separation, maintenance), or dissolution
 * (mutual consent, contested, Special Marriage Act). The
 * adoption petition is fundamentally different because it deals
 * with the creation of a parent-child relationship, which is the
 * other principal kind of family relationship recognised by law.
 *
 * THE LEGAL FRAMEWORK FOR ADOPTION IN INDIA:
 *
 *   To grasp where this template fits, you have to understand
 *   the somewhat fragmented framework that governs adoption in
 *   India. Unlike many countries where adoption is governed by
 *   a single secular statute that applies to everyone, India
 *   has two parallel adoption regimes that apply to different
 *   communities.
 *
 *   The first regime is the Hindu Adoptions and Maintenance
 *   Act, 1956 (HAMA), which governs adoptions among Hindus,
 *   Buddhists, Jains, and Sikhs. HAMA is a comprehensive code
 *   that sets out who can adopt, who can be adopted, the
 *   conditions for a valid adoption, and the legal effects of
 *   adoption. Under HAMA, an adoption is a private act between
 *   the giving family and the receiving family, and no court
 *   order is strictly necessary for the adoption to be valid.
 *   However, in modern practice, parties almost always seek a
 *   court declaration that the adoption is valid, both for
 *   evidentiary purposes (to prove the adoption to schools,
 *   passport authorities, banks, and so on) and for inheritance
 *   purposes (to establish the adopted child's right to
 *   inherit from the adoptive parents).
 *
 *   The second regime is the Juvenile Justice (Care and
 *   Protection of Children) Act, 2015 read with the
 *   Adoption Regulations issued by the Central Adoption
 *   Resource Authority (CARA). This regime applies to
 *   adoptions by non-Hindus and is also available to Hindus
 *   who choose to use it. Unlike HAMA, the JJ Act regime
 *   requires the adoption to be processed through CARA-
 *   accredited specialised adoption agencies and culminates
 *   in a court order under Section 61 of the JJ Act. Until
 *   2015, non-Hindus had no statutory right to adopt and
 *   could only become "guardians" of children under the
 *   Guardians and Wards Act, 1890, with the child not
 *   acquiring full filial status. The 2015 amendment cured
 *   this anomaly and made adoption available to all Indians
 *   regardless of religion.
 *
 *   This template is drafted under HAMA because it is the
 *   regime that governs the largest number of adoptions in
 *   India and because the HAMA petition has its own
 *   distinctive structure that you should learn.
 *
 * THE CONDITIONS FOR A VALID HAMA ADOPTION:
 *
 *   Before drafting any adoption petition, you must verify
 *   that the proposed adoption satisfies all the conditions
 *   laid down in Sections 6 to 11 of HAMA. The essential
 *   conditions are as follows.
 *
 *   First, the person taking in adoption must have the
 *   capacity to do so. Under Section 7, a Hindu male can
 *   adopt if he is of sound mind and not a minor, and if his
 *   wife (if any) consents to the adoption. Under Section 8,
 *   a Hindu female can adopt if she is of sound mind, not a
 *   minor, and either unmarried or whose marriage has been
 *   dissolved or whose husband is dead, has renounced the
 *   world, has been declared insane, or has ceased to be a
 *   Hindu.
 *
 *   Second, the person giving in adoption must have the
 *   capacity to do so. Under Section 9, only the father, the
 *   mother, or the guardian of the child can give the child
 *   in adoption, and even they require certain consents and
 *   conditions to be satisfied.
 *
 *   Third, the conditions for a valid adoption under Section
 *   11 must be met. These include: that if the child being
 *   adopted is a son, the adoptive parent must not have a
 *   Hindu son, son's son, or son's son's son living at the
 *   time of adoption; that if the child being adopted is a
 *   daughter, the adoptive parent must not have a Hindu
 *   daughter or son's daughter living; that if the adoption
 *   is by a male, there must be at least a 21-year age
 *   difference between him and a female being adopted; and
 *   that if the adoption is by a female, there must be at
 *   least a 21-year age difference between her and a male
 *   being adopted.
 *
 *   Fourth, there must be an actual giving and taking of the
 *   child between the natural and adoptive families, with
 *   the intent to transfer the child from the giver's family
 *   to the receiver's family. Under Section 11(vi), this is
 *   the so-called "datta homam" requirement. The giving and
 *   taking is the essential ceremonial act that constitutes
 *   the adoption.
 *
 * STRUCTURAL FEATURES OF THIS TEMPLATE:
 *
 *   First, look at the parties. The petition is filed jointly
 *   by the adoptive parents (or by one of them in case of a
 *   single parent), with the natural parents named as
 *   respondents (if they are alive and if their consent is
 *   relevant). The child is described in the body of the
 *   petition but is not made a formal party because of the
 *   minor status.
 *
 *   Second, look at the body. Paragraphs 1 and 2 establish the
 *   identities of the adoptive and natural parents. Paragraph
 *   3 describes the child being adopted. Paragraphs 4 to 7
 *   set out the eligibility of the parties under Sections 7,
 *   8, 9, and 11 of HAMA. Paragraph 8 describes the actual
 *   ceremony of giving and taking. Paragraphs 9 and 10 set
 *   out the bona fides and the absence of any consideration.
 *
 *   Third, look at the prayer. It asks for a declaration that
 *   the adoption is valid and that the child is the lawful
 *   adopted son or daughter of the adoptive parents, with all
 *   the legal consequences that flow from such a declaration.
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
      { reference: "ado-paras", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
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
      // The petition is filed before the District Court or the
      // Family Court (where one has been established) within
      // whose jurisdiction the petitioners reside or the
      // adoption took place.
      centeredBold("IN THE COURT OF THE PRINCIPAL DISTRICT JUDGE", 26),
      centeredBold("(FAMILY COURT, where established)", 22),
      centeredBold("AT ________", 22),
      spacer,
      centeredBold("PETITION NO. ________ OF 20__", 24),
      spacer,
      legalPara([
        new TextRun({ text: "(Petition under the Hindu Adoptions and Maintenance Act, 1956)", italics: true, size: 22 }),
      ], { alignment: AlignmentType.CENTER }),

      spacer,

      // ─── Parties ───
      // The petition is filed jointly by the adoptive parents.
      // The natural parents are named as respondents.
      legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      legalPara([new TextRun({ text: "1. Sh. ________", bold: true })]),
      legalPara([new TextRun("   S/o ________")]),
      legalPara([new TextRun("   Aged about ________ years")]),
      legalPara([new TextRun("   R/o ________")]),
      legalPara([new TextRun({ text: "   (Adoptive Father)", italics: true })]),

      spacer,

      legalPara([new TextRun({ text: "2. Smt. ________", bold: true })]),
      legalPara([new TextRun("   W/o Sh. ________")]),
      legalPara([new TextRun("   Aged about ________ years")]),
      legalPara([new TextRun("   R/o ________")]),
      legalPara([new TextRun({ text: "   (Adoptive Mother)", italics: true })]),
      legalPara([new TextRun({ text: "\u2026 PETITIONERS", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      centeredBold("VERSUS"),
      spacer,

      legalPara([new TextRun({ text: "1. Sh. ________", bold: true })]),
      legalPara([new TextRun("   S/o ________")]),
      legalPara([new TextRun("   Aged about ________ years")]),
      legalPara([new TextRun("   R/o ________")]),
      legalPara([new TextRun({ text: "   (Natural Father of the child)", italics: true })]),

      spacer,

      legalPara([new TextRun({ text: "2. Smt. ________", bold: true })]),
      legalPara([new TextRun("   W/o Sh. ________")]),
      legalPara([new TextRun("   Aged about ________ years")]),
      legalPara([new TextRun("   R/o ________")]),
      legalPara([new TextRun({ text: "   (Natural Mother of the child)", italics: true })]),
      legalPara([new TextRun({ text: "\u2026 RESPONDENTS", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      spacer,

      // ─── Title ───
      centeredBold("PETITION UNDER THE HINDU ADOPTIONS AND MAINTENANCE", 22),
      centeredBold("ACT, 1956, FOR DECLARATION OF VALID ADOPTION OF", 22),
      centeredBold("MASTER / KUMARI ________ BY THE PETITIONERS", 22),
      spacer,

      legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Body ───

      // Para 1: Identification of adoptive parents
      new Paragraph({ numbering: { reference: "ado-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Petitioners are Hindus by religion governed by the provisions of the Hindu Adoptions and Maintenance Act, 1956 (hereinafter referred to as 'the said Act'). The Petitioners are husband and wife, having been married to each other on ________ at ________ in accordance with Hindu rites and ceremonies. The Petitioners have been residing together at the address mentioned above and lead a peaceful and harmonious married life."
        )] }),

      // Para 2: Identification of the natural parents
      new Paragraph({ numbering: { reference: "ado-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Respondents are also Hindus by religion governed by the provisions of the said Act. The Respondents are husband and wife and the natural parents of Master / Kumari ________ (hereinafter referred to as 'the said child'), the child whose adoption is the subject matter of the present petition."
        )] }),

      // Para 3: Description of the child
      new Paragraph({ numbering: { reference: "ado-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That the said child Master / Kumari ________ was born to the Respondents on ________ (date of birth) at ________. The said child is at present aged about ________ years. The said child is a Hindu by religion and has not been previously adopted by any other person. A true copy of the birth certificate of the said child is annexed herewith and marked as "
          ),
          new TextRun({ text: "Annexure P-1.", bold: true }),
        ] }),

      // Para 4: Capacity of the adoptive father under Section 7
      new Paragraph({ numbering: { reference: "ado-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "That Petitioner No. 1 (Adoptive Father) has the capacity to take the said child in adoption under Section 7 of the said Act, ", bold: true }),
          new TextRun(
            "in that he is a Hindu male of sound mind, has attained the age of majority, and is not disqualified by any of the conditions specified in the said Section. Petitioner No. 2 (Adoptive Mother) has given her consent to the adoption as required by the proviso to Section 7."
          ),
        ] }),

      // Para 5: Capacity of the adoptive mother under Section 8
      // (in case the adoption is being done jointly)
      new Paragraph({ numbering: { reference: "ado-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That Petitioner No. 2 (Adoptive Mother) is a Hindu female of sound mind, has attained the age of majority, and is fully capable of taking the said child in adoption jointly with Petitioner No. 1 in accordance with the provisions of Section 8 of the said Act."
        )] }),

      // Para 6: Capacity of natural parents to give the child in
      // adoption under Section 9
      new Paragraph({ numbering: { reference: "ado-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "That the Respondents (Natural Parents) have the capacity to give the said child in adoption under Section 9 of the said Act. ", bold: true }),
          new TextRun(
            "Both the natural parents have voluntarily and with full understanding agreed to give the said child in adoption to the Petitioners. The reasons for the natural parents' decision to give the child in adoption are as follows: ________ (state the genuine reasons, e.g. inability to bring up the child due to financial hardship, large family size, the petitioners being relatives of the natural parents, etc.)."
          ),
        ] }),

      // Para 7: Compliance with Section 11 conditions
      new Paragraph({ numbering: { reference: "ado-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "That the conditions for a valid adoption under Section 11 of the said Act are duly satisfied in the present case, namely: ", bold: true }),
          new TextRun(
            "(a) the said child is a Hindu and has not completed the age of fifteen years and has not been previously adopted; (b) if the child is a son, the Petitioners do not have any Hindu son, son's son, or son's son's son (whether by legitimate blood relationship or by adoption) living at the time of adoption; (c) if the child is a daughter, the Petitioners do not have any Hindu daughter or son's daughter (whether by legitimate blood relationship or by adoption) living at the time of adoption; (d) ________ (any other Section 11 conditions that need to be addressed, including the 21-year age difference if the adopted child is of the opposite gender from a single adoptive parent)."
          ),
        ] }),

      // Para 8: The actual ceremony of adoption (datta homam)
      new Paragraph({ numbering: { reference: "ado-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "That the actual giving and taking of the said child in adoption was performed on ________ (date of adoption) at ________ in the presence of family members and friends and in accordance with Hindu customs and traditions. ", bold: true }),
          new TextRun(
            "The Respondents physically handed over the said child to the Petitioners with the intent to transfer the child from their family to that of the Petitioners. The Petitioners received the said child in adoption with the intent to take the child as their own child. A registered Adoption Deed dated ________ recording the said adoption is annexed herewith and marked as "
          ),
          new TextRun({ text: "Annexure P-2.", bold: true }),
        ] }),

      // Para 9: Bona fides and absence of consideration
      new Paragraph({ numbering: { reference: "ado-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the said adoption has been made bona fide and in the best interests of the said child. No payment, consideration, reward or recompense in any form has been received by or paid to any person in connection with the said adoption. The adoption has not been induced by any fraud, undue influence, coercion, or misrepresentation."
        )] }),

      // Para 10: Welfare of the child
      new Paragraph({ numbering: { reference: "ado-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Petitioners have the financial means and the emotional and physical capacity to provide for the welfare, education, upbringing, and proper development of the said child. The Petitioners undertake to treat the said child as their own child in all respects and to provide the said child with the same care and affection as they would provide to a biological child."
        )] }),

      // Para 11: Need for declaration
      new Paragraph({ numbering: { reference: "ado-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That although the adoption is valid in law without the need for any court order, the Petitioners are filing the present petition for a formal declaration of the validity of the adoption from this Hon'ble Court. The said declaration is necessary for the purposes of school admission, passport, inheritance, insurance, and other administrative matters where formal proof of the adoption may be required."
        )] }),

      // Para 12: Jurisdiction
      new Paragraph({ numbering: { reference: "ado-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That this Hon'ble Court has jurisdiction to entertain and decide the present petition because the Petitioners reside within the territorial jurisdiction of this Hon'ble Court and the adoption took place within the said jurisdiction."
        )] }),

      // Para 13: Court fee
      new Paragraph({ numbering: { reference: "ado-paras", level: 0 },
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
          new TextRun({ text: "Declare that the adoption of Master / Kumari ________ by the Petitioners on ________ is a valid adoption under the Hindu Adoptions and Maintenance Act, 1956;", bold: true, underline: {} }),
        ] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "Declare that the said child Master / Kumari ________ is the lawful adopted son / daughter of the Petitioners with effect from ________ for all purposes whatsoever, including the right to inherit from the Petitioners;", bold: true }),
        ] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Declare that all ties of the said child with the natural family of the Respondents have been severed by virtue of the adoption, as provided under Section 12 of the said Act;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Pass such other or further orders as this Hon'ble Court may deem fit and proper in the facts and circumstances of the case."
        )] }),

      spacer, spacer,

      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Place: ________"), new TextRun({ text: "\tPETITIONERS", bold: true })] }),
      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Date: ________"), new TextRun("\tThrough")] }),
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun("Counsel for the Petitioners")] }),

      spacer, spacer,

      legalPara([
        new TextRun({ text: "[NOTE: ", bold: true, italics: true }),
        new TextRun({ text: "This petition must be supported by affidavits of both the Petitioners and both the Respondents (Natural Parents). Documents to be annexed include: birth certificate of the child, registered Adoption Deed, marriage certificate of the Petitioners, identity and residence proofs of all parties, photographs of the adoption ceremony, and consent affidavits from the natural parents.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
