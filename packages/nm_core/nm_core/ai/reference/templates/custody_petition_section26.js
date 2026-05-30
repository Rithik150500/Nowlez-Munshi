/**
 * PETITION FOR CUSTODY OF MINOR CHILD UNDER SECTION 26
 * OF THE HINDU MARRIAGE ACT, 1955 READ WITH THE
 * GUARDIANS AND WARDS ACT, 1890
 * ─────────────────────────────────────────────────────
 * Category : Family / Personal Law — Custody Dispute
 * Court    : Family Court / District Court
 * Statute  : Section 26, Hindu Marriage Act, 1955;
 *            Section 25, Guardians and Wards Act, 1890;
 *            Hindu Minority and Guardianship Act, 1956
 * Source   : Standard form used in Indian family court practice
 *
 * The Petition for Custody of Minor Child is the second template
 * in the family law expansion batch and it addresses the most
 * emotionally charged aspect of any matrimonial proceeding,
 * namely the question of which parent will have physical
 * custody of the children and what visitation rights the other
 * parent will have. To grasp where this template fits in your
 * library, you should compare it with the matrimonial templates
 * at 11 (mutual consent divorce), 39 (judicial separation), 43
 * (maintenance pendente lite), 44 (contested divorce), and 50
 * (Special Marriage Act divorce). The custody petition is
 * different from those templates because it focuses on the
 * children of the marriage rather than on the spouses
 * themselves, and it can be filed either as part of the main
 * divorce petition or as a separate proceeding under Section 26
 * of the Hindu Marriage Act read with the Guardians and Wards
 * Act, 1890.
 *
 * THE TWO STATUTORY ROUTES TO A CUSTODY ORDER:
 *
 *   Custody petitions in India can be filed under one of two
 *   parallel statutory routes that you should understand. The
 *   first route is Section 26 of the Hindu Marriage Act,
 *   1955, which empowers the matrimonial court (whether the
 *   District Court or the Family Court) to make orders
 *   relating to the custody, maintenance, and education of
 *   the minor children of the marriage at any stage of any
 *   proceeding under the Act. Section 26 is a relatively
 *   short provision that gives the court a wide discretion
 *   to do whatever it considers just and proper for the
 *   welfare of the children. The second route is the
 *   Guardians and Wards Act, 1890, which provides a more
 *   formal procedure for the appointment of a guardian of
 *   the minor and which can be invoked independently of any
 *   matrimonial proceeding. For Hindus, the Hindu Minority
 *   and Guardianship Act, 1956 also applies and overlays the
 *   Guardians and Wards Act with substantive provisions
 *   designating the natural guardians of Hindu minors.
 *
 *   The choice of route depends on the practical
 *   circumstances of the case. If the parents are already
 *   engaged in divorce proceedings, the custody question is
 *   typically decided as part of those proceedings under
 *   Section 26. If there is no pending divorce proceeding,
 *   the custody question is typically decided in a separate
 *   proceeding under the Guardians and Wards Act. This
 *   template is drafted as a custody petition under Section
 *   26 of the HMA filed in connection with a pending divorce
 *   proceeding, because that is the more common scenario in
 *   modern Indian practice.
 *
 * THE WELFARE PRINCIPLE IN CUSTODY DISPUTES:
 *
 *   The single most important principle in any custody
 *   dispute is the welfare of the child, which has been
 *   repeatedly emphasised by the Supreme Court as the
 *   paramount consideration that overrides all other
 *   considerations including the rights of the parents. In
 *   Gaurav Nagpal versus Sumedha Nagpal, the Supreme Court
 *   held that the welfare of the child must include both
 *   the material welfare and the moral and ethical welfare
 *   of the child, and that the court must consider not
 *   just which parent has the better material resources but
 *   also which parent will provide the better emotional
 *   environment, the better education, the better moral
 *   guidance, and the better connection with the extended
 *   family. The Court emphasised that the welfare principle
 *   is not a mere formula but a substantive standard that
 *   requires the court to engage seriously with the actual
 *   circumstances of the child and the parents.
 *
 *   In Vivek Singh versus Romani Singh, the Supreme Court
 *   further elaborated on the welfare principle and held
 *   that the wishes of the child, where the child is of
 *   sufficient age and maturity to express an intelligent
 *   preference, should be given due weight by the court.
 *   The Court also held that the principle of "tender years"
 *   (which traditionally favoured the mother for very young
 *   children) is not an absolute rule but a presumption
 *   that can be displaced by contrary evidence about the
 *   welfare of the child.
 *
 * THE TYPES OF CUSTODY ARRANGEMENTS:
 *
 *   Custody orders in India typically take one of three
 *   forms. The first is sole custody, in which one parent
 *   has the exclusive right to physical custody of the
 *   child and the other parent has visitation rights. This
 *   is the most common arrangement and is generally favoured
 *   when the parents live in different cities or when there
 *   is significant conflict between the parents. The second
 *   is joint legal custody, in which both parents share the
 *   decision-making authority for important matters
 *   affecting the child (such as education, religion, and
 *   health care) but the child resides primarily with one
 *   parent. This arrangement is becoming more popular in
 *   Indian practice as courts recognise the benefit of
 *   keeping both parents involved in the child's upbringing.
 *   The third is shared physical custody, in which the
 *   child spends substantial time residing with each parent
 *   on a rotating basis. This arrangement is rare in Indian
 *   practice because it requires the parents to live in
 *   reasonable proximity and to maintain a cooperative
 *   relationship, which is often difficult after a
 *   contested divorce.
 *
 * STRUCTURAL FEATURES OF THIS TEMPLATE:
 *
 *   First, look at the parties. The petitioner is one of
 *   the parents (typically the parent seeking custody) and
 *   the respondent is the other parent. The minor child is
 *   named in the cause title but is not a formal party.
 *
 *   Second, look at the body. Paragraphs 1 and 2 establish
 *   the parties and the marriage. Paragraph 3 identifies
 *   the minor child or children whose custody is sought.
 *   Paragraph 4 narrates the matrimonial proceedings (if
 *   any) and the current custody arrangement. Paragraphs 5
 *   to 8 establish the petitioner's qualifications to be
 *   the custodial parent and the welfare of the child under
 *   the proposed arrangement.
 *
 *   Third, look at the prayer. The prayer typically asks
 *   for sole custody to the petitioner with visitation
 *   rights to the respondent, but it can be tailored to ask
 *   for any of the three custody arrangements depending on
 *   the circumstances.
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
      { reference: "cust-paras", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
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
      centeredBold("IN THE COURT OF THE PRINCIPAL JUDGE", 26),
      centeredBold("FAMILY COURT, AT ________", 22),
      spacer,
      centeredBold("CUSTODY PETITION NO. ________ OF 20__", 24),
      centeredBold("(Arising out of HMA Petition No. ________ of 20__)", 22),
      spacer,
      legalPara([
        new TextRun({ text: "(Petition under Section 26 of the Hindu Marriage Act, 1955, read with Section 25 of the Guardians and Wards Act, 1890)", italics: true, size: 22 }),
      ], { alignment: AlignmentType.CENTER }),

      spacer,

      // ─── Parties ───
      legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      legalPara([new TextRun({ text: "Smt. ________", bold: true })]),
      legalPara([new TextRun("W/o Sh. ________")]),
      legalPara([new TextRun("Aged about ________ years")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara([new TextRun({ text: "(Mother of the Minor Children)", italics: true })]),
      legalPara([new TextRun({ text: "\u2026 PETITIONER", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      centeredBold("VERSUS"),
      spacer,

      legalPara([new TextRun({ text: "Sh. ________", bold: true })]),
      legalPara([new TextRun("S/o ________")]),
      legalPara([new TextRun("Aged about ________ years")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara([new TextRun({ text: "(Father of the Minor Children)", italics: true })]),
      legalPara([new TextRun({ text: "\u2026 RESPONDENT", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      spacer,

      // ─── Title ───
      centeredBold("PETITION UNDER SECTION 26 OF THE HINDU MARRIAGE", 22),
      centeredBold("ACT, 1955, READ WITH SECTION 25 OF THE GUARDIANS", 22),
      centeredBold("AND WARDS ACT, 1890, FOR GRANT OF CUSTODY OF THE", 22),
      centeredBold("MINOR CHILDREN OF THE PARTIES", 22),
      spacer,

      legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Body ───

      // Para 1: The marriage
      new Paragraph({ numbering: { reference: "cust-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Petitioner and the Respondent are husband and wife, having been married to each other on ________ at ________ in accordance with Hindu rites and ceremonies. The marriage of the parties was duly registered under the Hindu Marriage Act, 1955."
        )] }),

      // Para 2: The matrimonial proceedings
      new Paragraph({ numbering: { reference: "cust-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That HMA Petition No. ________ of 20__ for divorce / judicial separation is presently pending between the parties before this Hon'ble Court. The said matrimonial proceedings have given rise to the question of the custody of the minor children of the marriage, which is the subject matter of the present petition under Section 26 of the Hindu Marriage Act, 1955."
        )] }),

      // Para 3: The minor children
      new Paragraph({ numbering: { reference: "cust-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "PARTICULARS OF THE MINOR CHILDREN: ", bold: true, underline: {} }),
          new TextRun(
            "That the following minor children were born to the parties out of their wedlock: (i) Master / Kumari ________, born on ________ at ________, presently aged about ________ years; (ii) Master / Kumari ________, born on ________ at ________, presently aged about ________ years. True copies of the birth certificates of the minor children are annexed herewith and marked as "
          ),
          new TextRun({ text: "Annexures P-1 and P-2.", bold: true }),
        ] }),

      // Para 4: Current custody arrangement
      new Paragraph({ numbering: { reference: "cust-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That since the breakdown of the marriage between the parties on or about ________ (date), the minor children have been residing with the Petitioner at the address mentioned above. The Petitioner has been the primary caregiver for the minor children throughout their lives and has been responsible for their day-to-day care, education, medical needs, and emotional wellbeing. The minor children are emotionally attached to the Petitioner and look to her for all their needs."
        )] }),

      // Para 5: Petitioner's qualifications and circumstances
      new Paragraph({ numbering: { reference: "cust-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Petitioner is fully qualified, willing, and able to take care of the minor children and to provide for their proper upbringing. The Petitioner is gainfully employed as ________ with a monthly income of approximately Rs. ________, which is sufficient to maintain the minor children at the standard of living to which they are accustomed. The Petitioner resides in a suitable family environment along with her parents, who provide additional emotional support and assistance in caring for the minor children."
        )] }),

      // Para 6: Welfare of the children — the paramount
      // consideration
      new Paragraph({ numbering: { reference: "cust-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "WELFARE OF THE MINOR CHILDREN: ", bold: true, underline: {} }),
          new TextRun(
            "That the grant of custody of the minor children to the Petitioner will be in the best interests and for the welfare of the minor children. The Petitioner has been the primary caregiver for the children throughout their lives and has developed a strong emotional bond with them. The minor children are well settled in their school at ________, are attached to their friends in the area, and are familiar with their surroundings. Removing the children from this stable environment would be detrimental to their welfare and would cause them significant emotional distress. Furthermore, the Petitioner is committed to ensuring that the children continue to have a meaningful relationship with the Respondent and the Respondent's family through reasonable visitation arrangements."
          ),
        ] }),

      // Para 7: Concerns about the Respondent
      new Paragraph({ numbering: { reference: "cust-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Respondent is not in a position to take care of the minor children for the following reasons: ________ (state the specific concerns about the Respondent's ability to provide custody, e.g. the Respondent works long hours and travels frequently for business / the Respondent has a history of ________ which makes him unsuitable as a primary caregiver / the Respondent has not shown any interest in the day-to-day care of the children during the marriage / the Respondent's residential arrangements are unsuitable for raising young children, etc.)."
        )] }),

      // Para 8: The wishes of the children
      new Paragraph({ numbering: { reference: "cust-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the elder minor child Master / Kumari ________, who is now aged about ________ years and is of sufficient age and maturity to express an intelligent preference, has clearly expressed the wish to continue residing with the Petitioner. The Petitioner submits that the wishes of the elder minor child should be given due weight by this Hon'ble Court in accordance with the principles laid down by the Hon'ble Supreme Court in cases such as Vivek Singh versus Romani Singh."
        )] }),

      // Para 9: Hindu Minority and Guardianship Act
      new Paragraph({ numbering: { reference: "cust-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That under Section 6(a) of the Hindu Minority and Guardianship Act, 1956, the mother of a Hindu minor is entitled to the custody of a child below the age of five years, and the Petitioner relies on this statutory presumption in respect of the younger minor child who is below the age of five years."
        )] }),

      // Para 10: Visitation arrangements
      new Paragraph({ numbering: { reference: "cust-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Petitioner is willing to permit the Respondent reasonable visitation with the minor children, including weekly visits, video calls, and longer visits during school holidays, on terms to be settled by this Hon'ble Court. The Petitioner believes that the children should maintain a meaningful relationship with the Respondent and the Respondent's family, subject only to the welfare of the children remaining the paramount consideration."
        )] }),

      // Para 11: Maintenance for the children
      new Paragraph({ numbering: { reference: "cust-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That as the Respondent has substantial financial resources from his business / employment, the Petitioner also seeks an order for maintenance of the minor children to be paid by the Respondent at the rate of Rs. ________ per month per child, along with the cost of education and medical expenses, until each of the minor children attains majority."
        )] }),

      // Para 12: Jurisdiction
      new Paragraph({ numbering: { reference: "cust-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That this Hon'ble Court has jurisdiction to entertain and decide the present petition because the matrimonial proceedings between the parties are pending before this Hon'ble Court and because the minor children ordinarily reside within the territorial jurisdiction of this Hon'ble Court."
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
          new TextRun({ text: "Grant the sole physical and legal custody of the minor children Master / Kumari ________ and Master / Kumari ________ to the Petitioner;", bold: true, underline: {} }),
        ] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Grant the Respondent reasonable visitation rights with the minor children on terms to be specified by this Hon'ble Court;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Direct the Respondent to pay maintenance for the minor children at the rate of Rs. ________ per month per child, along with the cost of education and medical expenses, until each minor child attains majority;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Pass interim orders during the pendency of the present petition continuing the existing custody arrangement and directing the Respondent to pay interim maintenance for the minor children;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Pass such other or further orders as this Hon'ble Court may deem fit and proper in the facts and circumstances of the case for the welfare of the minor children."
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
        new TextRun({ text: "This petition must be supported by an affidavit of the petitioner. Documents to be annexed include: marriage certificate, birth certificates of the minor children, school records, photographs of the residential arrangements, financial documents establishing the income of both parties, and any other documents establishing the welfare of the children. The court may interview the children in chambers if they are of sufficient age to express an intelligent preference.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
