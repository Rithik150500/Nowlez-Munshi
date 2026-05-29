/**
 * PETITION FOR DISSOLUTION OF CHRISTIAN MARRIAGE
 * UNDER SECTION 10 OF THE INDIAN DIVORCE ACT, 1869
 * ─────────────────────────────────────────────────────
 * Category : Personal Law — Christian Matrimonial
 * Court    : District Court / Family Court (where established)
 * Statute  : Section 10, Indian Divorce Act, 1869 (as amended
 *            by the Indian Divorce (Amendment) Act, 2001)
 * Source   : Standard form used in Indian Christian
 *            matrimonial practice
 *
 * The Petition for Dissolution of Christian Marriage under the
 * Indian Divorce Act, 1869 is the third template in the family
 * law expansion batch and it introduces Christian personal law,
 * which is one of the four main personal law systems operating
 * in India alongside Hindu law, Muslim law, and Parsi law. To
 * grasp where this template fits, you should compare it with
 * the Hindu matrimonial templates in your library at 11, 27, 39,
 * 43, 44, and 50, all of which apply only to Hindus governed by
 * the Hindu Marriage Act, 1955. The Christian divorce petition
 * follows broadly similar structural conventions to the Hindu
 * petitions but operates under a different statutory framework
 * with somewhat different grounds for divorce and a distinctive
 * historical evolution that you should understand.
 *
 * THE HISTORICAL EVOLUTION OF CHRISTIAN MATRIMONIAL LAW:
 *
 *   The Indian Divorce Act, 1869 is one of the oldest matrimonial
 *   statutes in force in India and reflects the colonial era in
 *   which it was enacted. The Act was originally drafted to
 *   apply only to Christians governed by the doctrines of the
 *   Church of England, and its provisions were heavily
 *   influenced by the English Matrimonial Causes Act, 1857
 *   that had been enacted in England a few years earlier.
 *   Under the original 1869 Act, the grounds for divorce were
 *   significantly different for husbands and wives, with
 *   husbands being able to seek divorce on the simple ground
 *   of the wife's adultery, while wives could seek divorce
 *   only on the ground of "adultery coupled with" cruelty,
 *   desertion, or some other aggravating factor. This
 *   gender-discriminatory framework was rooted in Victorian
 *   English moral attitudes and remained in force in India
 *   for more than a century after independence, even though
 *   India had constitutionally committed itself to gender
 *   equality under Articles 14 and 15 of the Constitution.
 *
 *   The original Act also required the divorce decree of the
 *   District Court to be confirmed by the High Court before
 *   it could become final, which was a procedural relic of
 *   the early matrimonial jurisdiction in England and which
 *   created substantial delay and expense for Indian
 *   Christians seeking to dissolve their marriages.
 *
 *   These anomalies were largely cured by the Indian Divorce
 *   (Amendment) Act, 2001, which made several important
 *   changes to the Act. First, the amendment equalised the
 *   grounds for divorce between husbands and wives by
 *   removing the gender-discriminatory provisions and by
 *   substituting a single set of grounds available to either
 *   party. Second, the amendment removed the requirement of
 *   High Court confirmation, making the District Court the
 *   final court for ordinary Christian divorce matters.
 *   Third, the amendment introduced the ground of mutual
 *   consent (similar to Section 13B of the HMA at Template
 *   11), giving Christian spouses for the first time a
 *   no-fault route to divorce. Fourth, the amendment
 *   reduced the period of desertion required for divorce
 *   from seven years to two years, bringing it into line
 *   with other personal law statutes.
 *
 *   The 2001 amendment was a watershed moment for Christian
 *   matrimonial law in India and brought the Indian Divorce
 *   Act largely into line with the modern matrimonial
 *   statutes governing Hindus, Parsis, and parties married
 *   under the Special Marriage Act. However, the Act
 *   retains some distinctive features that reflect its
 *   Christian character, and you should be aware of these
 *   when drafting any petition under the Act.
 *
 * THE GROUNDS FOR DIVORCE UNDER SECTION 10:
 *
 *   Section 10(1) of the Indian Divorce Act, 1869 (as
 *   amended in 2001) sets out nine grounds on which either
 *   party to a Christian marriage may petition for divorce.
 *   The grounds, in plain language, are as follows. First,
 *   that since the solemnisation of the marriage the
 *   respondent has committed adultery. Second, that the
 *   respondent has ceased to be a Christian by conversion to
 *   another religion. Third, that the respondent has been
 *   incurably of unsound mind for a continuous period of not
 *   less than two years immediately preceding the
 *   presentation of the petition. Fourth, that the
 *   respondent has, for a period of not less than two years
 *   immediately preceding the presentation of the petition,
 *   been suffering from a virulent and incurable form of
 *   leprosy. Fifth, that the respondent has, for a period of
 *   not less than two years immediately preceding the
 *   presentation of the petition, been suffering from
 *   venereal disease in a communicable form. Sixth, that the
 *   respondent has not been heard of as being alive for a
 *   period of seven years or more by those persons who would
 *   naturally have heard of the respondent if the respondent
 *   had been alive. Seventh, that the respondent has wilfully
 *   refused to consummate the marriage and the marriage has
 *   not therefore been consummated. Eighth, that the
 *   respondent has failed to comply with a decree for
 *   restitution of conjugal rights for a period of two years
 *   or upwards after the passing of the decree against the
 *   respondent. Ninth, that the respondent has deserted the
 *   petitioner for at least two years immediately preceding
 *   the presentation of the petition. Tenth, that the
 *   respondent has treated the petitioner with such cruelty
 *   as to cause a reasonable apprehension in the mind of the
 *   petitioner that it would be harmful or injurious for the
 *   petitioner to live with the respondent.
 *
 *   In addition, Section 10(2) provides for divorce by
 *   mutual consent on terms similar to Section 13B of the
 *   HMA, requiring the parties to have been living separately
 *   for a period of two years or more and to have mutually
 *   agreed that the marriage should be dissolved.
 *
 * STRUCTURAL FEATURES OF THIS TEMPLATE:
 *
 *   Look at how Template 83 follows the same general
 *   structural conventions as the Hindu matrimonial templates
 *   in your library, with a court header, a cause title
 *   identifying the parties, a body that establishes the
 *   marriage and sets out the grounds for divorce, and a
 *   prayer asking for dissolution. The differences from the
 *   Hindu templates are in the substantive provisions cited
 *   and in the specific grounds invoked, which are drawn
 *   from Section 10(1) of the Indian Divorce Act rather than
 *   Section 13 of the HMA.
 *
 *   Note also the religious affirmation in paragraph 1, which
 *   confirms that both parties are Christians at the time of
 *   marriage and at the time of filing the petition. This
 *   is essential for the court's jurisdiction under the
 *   Indian Divorce Act because the Act applies only to
 *   Christians.
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
      { reference: "chr-paras", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
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
      centeredBold("IN THE COURT OF THE PRINCIPAL DISTRICT JUDGE", 26),
      centeredBold("(FAMILY COURT, where established)", 22),
      centeredBold("AT ________", 22),
      spacer,
      centeredBold("MATRIMONIAL PETITION NO. ________ OF 20__", 24),
      spacer,
      legalPara([
        new TextRun({ text: "(Petition under Section 10 of the Indian Divorce Act, 1869, as amended by the Indian Divorce (Amendment) Act, 2001)", italics: true, size: 22 }),
      ], { alignment: AlignmentType.CENTER }),

      spacer,

      // ─── Parties ───
      legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      legalPara([new TextRun({ text: "Mrs. ________", bold: true })]),
      legalPara([new TextRun("D/o Mr. ________")]),
      legalPara([new TextRun("W/o Mr. ________")]),
      legalPara([new TextRun("Aged about ________ years")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara([new TextRun("Christian by religion")]),
      legalPara([new TextRun({ text: "\u2026 PETITIONER", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      centeredBold("VERSUS"),
      spacer,

      legalPara([new TextRun({ text: "Mr. ________", bold: true })]),
      legalPara([new TextRun("S/o Mr. ________")]),
      legalPara([new TextRun("Aged about ________ years")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara([new TextRun("Christian by religion")]),
      legalPara([new TextRun({ text: "\u2026 RESPONDENT", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      spacer,

      // ─── Title ───
      centeredBold("PETITION UNDER SECTION 10 OF THE INDIAN DIVORCE", 22),
      centeredBold("ACT, 1869, FOR DISSOLUTION OF THE MARRIAGE BETWEEN", 22),
      centeredBold("THE PETITIONER AND THE RESPONDENT BY A DECREE", 22),
      centeredBold("OF DIVORCE", 22),
      spacer,

      legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Body ───

      // Para 1: Religious status of the parties — essential for
      // jurisdiction under the Indian Divorce Act
      new Paragraph({ numbering: { reference: "chr-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Petitioner and the Respondent are both Christians by religion and were Christians at the time of their marriage and have continued to be Christians ever since. The Petitioner belongs to the ________ denomination of Christianity (e.g. Roman Catholic, Protestant, Orthodox, etc.) and the Respondent belongs to the ________ denomination. Both parties are governed by the Indian Divorce Act, 1869, in matters of matrimonial law."
        )] }),

      // Para 2: The marriage
      new Paragraph({ numbering: { reference: "chr-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That the Petitioner and the Respondent were married to each other on ________ (date of marriage) at ________ (place of marriage) according to Christian rites and ceremonies, in the presence of family members and friends. The marriage was solemnised at ________ Church / Cathedral by the officiating priest Reverend ________. A true copy of the marriage certificate issued by the Church is annexed herewith and marked as "
          ),
          new TextRun({ text: "Annexure P-1.", bold: true }),
        ] }),

      // Para 3: Cohabitation and children
      new Paragraph({ numbering: { reference: "chr-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That after the marriage, the parties cohabited together at ________ (matrimonial home address). The marriage was duly consummated. The following children were born to the parties out of their wedlock: (i) ________, born on ________; (ii) ________, born on ________ (or, if no children, state 'No children have been born to the parties out of the said wedlock')."
        )] }),

      // Para 4: Initial happiness and gradual deterioration
      new Paragraph({ numbering: { reference: "chr-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That for the first ________ years of the marriage, the parties lived together happily and discharged their marital obligations to each other. However, from on or about ________ (date), the relationship between the parties began to deteriorate due to the conduct of the Respondent set out in the following paragraphs."
        )] }),

      // Para 5: Specific conduct constituting cruelty
      new Paragraph({ numbering: { reference: "chr-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "GROUND OF CRUELTY: ", bold: true, underline: {} }),
          new TextRun(
            "That the Respondent has treated the Petitioner with such cruelty as to cause a reasonable apprehension in the mind of the Petitioner that it would be harmful and injurious for the Petitioner to live with the Respondent. The specific acts of cruelty committed by the Respondent against the Petitioner include the following: ________ (set out in detail the specific acts of physical and mental cruelty, with dates and circumstances). The said cruelty has been persistent, unprovoked, and grave in nature, and has caused severe physical and mental suffering to the Petitioner."
          ),
        ] }),

      // Para 6: Ground of desertion (alternative)
      new Paragraph({ numbering: { reference: "chr-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "GROUND OF DESERTION: ", bold: true, underline: {} }),
          new TextRun(
            "Without prejudice to the above, the Respondent has also deserted the Petitioner without any reasonable cause and without the consent of the Petitioner since ________ (date), which is a period of more than two years immediately preceding the presentation of the present petition. The Respondent left the matrimonial home on the said date and has not returned to cohabit with the Petitioner despite the Petitioner's repeated requests, and has thereby committed desertion within the meaning of Section 10(1)(ix) of the Indian Divorce Act, 1869."
          ),
        ] }),

      // Para 7: Ground of adultery (alternative)
      new Paragraph({ numbering: { reference: "chr-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "GROUND OF ADULTERY: ", bold: true, underline: {} }),
          new TextRun(
            "Further, since the solemnisation of the marriage, the Respondent has committed adultery with one ________ (name and address of the alleged adulterer or co-respondent, if known) on or about ________ (date and place). The Petitioner became aware of the said adultery on ________ (date), and the Petitioner has documentary and testimonial evidence to establish the same. The Petitioner relies on Section 10(1)(i) of the Indian Divorce Act, 1869."
          ),
        ] }),

      // Para 8: No collusion or condonation
      new Paragraph({ numbering: { reference: "chr-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That there has been no collusion between the Petitioner and the Respondent in connection with the present petition. The Petitioner has not condoned the matrimonial offences committed by the Respondent. There has been no unreasonable delay in filing the present petition, and the petition has not been filed for any improper purpose."
        )] }),

      // Para 9: No previous proceedings
      new Paragraph({ numbering: { reference: "chr-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That no previous matrimonial proceedings between the parties are pending before any court of law in India or elsewhere. The Petitioner has not earlier filed any petition for divorce, judicial separation, restitution of conjugal rights, or nullity of marriage against the Respondent."
        )] }),

      // Para 10: Jurisdiction
      new Paragraph({ numbering: { reference: "chr-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That this Hon'ble Court has jurisdiction to entertain and decide the present petition under Section 3(3) read with Section 10 of the Indian Divorce Act, 1869, in that the marriage was solemnised within the territorial jurisdiction of this Hon'ble Court and the parties last resided together as husband and wife within the said jurisdiction."
        )] }),

      // Para 11: Court fee
      new Paragraph({ numbering: { reference: "chr-paras", level: 0 },
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
          new TextRun({ text: "Pass a decree of divorce dissolving the marriage solemnised between the Petitioner and the Respondent on ________ at ________ under Section 10 of the Indian Divorce Act, 1869;", bold: true, underline: {} }),
        ] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Grant the custody of the minor children of the marriage to the Petitioner along with reasonable visitation rights to the Respondent;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Direct the Respondent to pay permanent alimony and maintenance to the Petitioner under Sections 36 and 37 of the Indian Divorce Act, 1869;"
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
        new TextRun({ text: "This petition must be supported by an affidavit of the petitioner. Documents to be annexed include the marriage certificate issued by the Church, baptism certificates establishing the Christian status of both parties, birth certificates of the children, and any documentary evidence supporting the grounds of divorce alleged in the petition. Following the 2001 amendment, the decree of the District Court no longer requires confirmation by the High Court.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
