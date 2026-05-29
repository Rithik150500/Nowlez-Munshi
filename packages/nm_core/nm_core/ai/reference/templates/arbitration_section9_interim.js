/**
 * APPLICATION FOR INTERIM MEASURES UNDER SECTION 9
 * OF THE ARBITRATION AND CONCILIATION ACT, 1996
 * ───────────────────────────────────────────────────
 * Category : Alternative Dispute Resolution — Court Support to Arbitration
 * Court    : Principal Civil Court of original jurisdiction in a district,
 *            or High Court (for international commercial arbitration)
 * Statute  : Section 9, Arbitration and Conciliation Act, 1996
 * Source   : Standard form used in Indian arbitration practice
 *
 * The Application for Interim Measures under Section 9 of the
 * Arbitration and Conciliation Act is the companion to the
 * Section 11 application at Template 49 in your library, and
 * understanding the relationship between the two applications
 * will give you a much clearer picture of how arbitration
 * actually functions in practice. Template 49 deals with the
 * problem of what happens when parties cannot agree on the
 * appointment of an arbitrator, and it allows the court to step
 * in and make the appointment so that arbitration can proceed.
 * Template 51, this template, deals with a different but equally
 * important problem, namely what happens when a party needs
 * urgent protective relief before the arbitral tribunal is in a
 * position to grant it.
 *
 * THE GAP THAT SECTION 9 FILLS:
 *
 *   To grasp why Section 9 is necessary, you have to understand
 *   the practical limitations of arbitration as a dispute
 *   resolution mechanism. Arbitration depends entirely on the
 *   private authority of the arbitrator, and that authority does
 *   not exist until the arbitrator has actually been appointed
 *   and has accepted the appointment. Between the moment when a
 *   dispute first arises and the moment when the tribunal is
 *   constituted, there is often a substantial gap of weeks or
 *   even months during which no decision-maker has any power to
 *   act in the matter at all. During this gap, the petitioner
 *   may face urgent practical problems that demand immediate
 *   relief. The other party may be threatening to dissipate
 *   assets, to remove crucial documents, to demolish disputed
 *   property, or to take other steps that would render the
 *   eventual arbitral award meaningless. Without some way to
 *   freeze the situation pending the arbitration, the petitioner
 *   would be in an impossible position: forced to wait for
 *   arbitration that might come too late to provide any real
 *   relief.
 *
 *   Section 9 solves this problem by allowing a party to
 *   approach the court directly for interim measures even when
 *   the underlying dispute is governed by an arbitration clause.
 *   The court can grant the same kinds of interim relief that
 *   it would grant in ordinary civil litigation: securing the
 *   amount in dispute, ordering the preservation or interim
 *   custody of property, granting interim injunctions,
 *   appointing receivers, and so on. The key feature of
 *   Section 9 is that this court intervention does NOT
 *   contradict or undermine the arbitration agreement. The
 *   court is not deciding the dispute on its merits but
 *   merely preserving the position pending the arbitration.
 *   Once the tribunal is constituted, the court's interim
 *   measures continue to bind the parties until the tribunal
 *   itself takes over.
 *
 * THE THREE STAGES AT WHICH SECTION 9 CAN BE INVOKED:
 *
 *   Section 9 is unusually flexible in that it can be invoked at
 *   three different stages of the arbitration:
 *
 *   First, it can be invoked BEFORE the commencement of
 *   arbitration. The petitioner does not have to wait for the
 *   tribunal to be constituted or even for the arbitration to
 *   be formally invoked. As long as the petitioner can show that
 *   there is a valid arbitration agreement and that arbitration
 *   is intended to be commenced soon, the court can grant
 *   interim relief. The 2015 amendment to the Act added a
 *   condition to this pre-arbitration relief: the petitioner
 *   must commence arbitration proceedings within ninety days
 *   of the court's order, failing which the interim measures
 *   may be vacated. This condition was added to prevent parties
 *   from using Section 9 as a substitute for arbitration rather
 *   than as a complement to it.
 *
 *   Second, Section 9 can be invoked DURING the pendency of
 *   arbitration proceedings. While the tribunal itself can
 *   grant interim measures under Section 17, the court's
 *   jurisdiction under Section 9 has not been completely
 *   ousted. However, the 2015 amendment introduced an
 *   important restriction: once the tribunal is constituted,
 *   the court should not grant interim measures unless it
 *   finds that the remedy provided under Section 17 by the
 *   tribunal would not be efficacious. This reflects a policy
 *   preference for letting the tribunal handle interim matters
 *   wherever possible, with court intervention as a fallback.
 *
 *   Third, Section 9 can be invoked AFTER the making of an
 *   arbitral award but BEFORE its enforcement. This addresses
 *   the situation where the petitioner has won the arbitration
 *   but needs interim relief to prevent the losing party from
 *   frustrating the eventual enforcement. Without this third
 *   stage of relief, a party could win an arbitration on paper
 *   only to find that there is nothing left to recover by the
 *   time enforcement begins.
 *
 * THE TYPES OF INTERIM RELIEF AVAILABLE:
 *
 *   Section 9 lists several specific kinds of interim relief
 *   that the court can grant, and these closely parallel the
 *   reliefs available under the CPC for ordinary civil
 *   litigation. The list includes the appointment of a guardian
 *   for a minor or a person of unsound mind for the purposes of
 *   the arbitration, the preservation, interim custody, or sale
 *   of any goods which are the subject matter of the
 *   arbitration agreement, securing the amount in dispute in
 *   the arbitration, the detention, preservation, or
 *   inspection of any property or thing which is the subject
 *   matter of the dispute, the interim injunction or appointment
 *   of a receiver, and any other interim measure of protection
 *   as may appear to the court to be just and convenient.
 *
 * STRUCTURAL FEATURES OF THE TEMPLATE:
 *
 *   First, look at the case caption. It uses "Arbitration
 *   Petition" or "Arb. P." just like Template 49, signalling
 *   that the matter falls within the special arbitration roster
 *   of the court.
 *
 *   Second, look at how the body establishes the court's
 *   jurisdiction. Paragraph 2 sets out the existence of the
 *   arbitration agreement, paragraph 3 explains the underlying
 *   dispute, and paragraph 4 describes the apprehended harm
 *   that requires immediate intervention. The chronology
 *   matters: the court needs to be satisfied that there is an
 *   arbitration agreement, that there is a real dispute, and
 *   that there is a genuine need for interim protection.
 *
 *   Third, look at the assertion in paragraph 7 about the
 *   intention to commence arbitration within ninety days. This
 *   is the post-2015 requirement that prevents abuse of Section
 *   9 by parties who do not actually intend to pursue
 *   arbitration.
 *
 *   Fourth, look at how the prayer is drafted. It asks for
 *   specific interim measures rather than general relief
 *   because the court will only grant the precise relief that
 *   is sought and justified by the facts.
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
      { reference: "s9-paras", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
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
      // For domestic arbitration in commercial matters above the
      // pecuniary threshold, the application typically goes to
      // the Commercial Court / Commercial Division of the High
      // Court. For international commercial arbitration, it goes
      // to the High Court. This template uses the High Court
      // form which is the most common.
      centeredBold("IN THE HIGH COURT OF DELHI AT NEW DELHI", 26),
      centeredBold("(ORDINARY ORIGINAL CIVIL JURISDICTION)", 22),
      spacer,

      centeredBold("OMP (I) (COMM) NO. ________ OF 20__", 24),
      spacer,
      legalPara([
        new TextRun({ text: "(Original Miscellaneous Petition for Interim Relief in a Commercial Matter)", italics: true, size: 22 }),
      ], { alignment: AlignmentType.CENTER }),

      spacer,

      // ─── Parties ───
      legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      legalPara([new TextRun({ text: "M/s ABC Pvt. Ltd.", bold: true })]),
      legalPara([new TextRun("A company incorporated under the Companies Act,")]),
      legalPara([new TextRun("having its registered office at ________,")]),
      legalPara([new TextRun("New Delhi.")]),
      legalPara([new TextRun("Through its Authorised Representative")]),
      legalPara([new TextRun("Sh. ________, Director")]),
      legalPara([new TextRun({ text: "\u2026 PETITIONER", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      centeredBold("VERSUS"),
      spacer,

      legalPara([new TextRun({ text: "M/s XYZ Ltd.", bold: true })]),
      legalPara([new TextRun("A company incorporated under the Companies Act,")]),
      legalPara([new TextRun("having its registered office at ________,")]),
      legalPara([new TextRun("New Delhi.")]),
      legalPara([new TextRun("Through its Managing Director")]),
      legalPara([new TextRun({ text: "\u2026 RESPONDENT", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      spacer,

      // ─── Title ───
      centeredBold("PETITION UNDER SECTION 9 OF THE ARBITRATION AND", 22),
      centeredBold("CONCILIATION ACT, 1996, FOR GRANT OF INTERIM", 22),
      centeredBold("MEASURES OF PROTECTION", 22),
      spacer,

      legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Body ───

      // Para 1: The parties and their commercial relationship
      new Paragraph({ numbering: { reference: "s9-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Petitioner is a company duly incorporated under the Companies Act, 2013, and is engaged in the business of ________. The Respondent is also a company duly incorporated under the Companies Act and is engaged in the business of ________."
        )] }),

      // Para 2: The arbitration agreement — establishes that the
      // dispute is subject to arbitration, which is the
      // jurisdictional foundation for Section 9 relief
      new Paragraph({ numbering: { reference: "s9-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That the Petitioner and the Respondent entered into an Agreement dated ________ (hereinafter referred to as 'the said Agreement') for ________ (state the subject matter of the contract). Clause ________ of the said Agreement contains an arbitration clause providing that any dispute arising out of or in connection with the said Agreement shall be referred to and finally resolved by arbitration under the Arbitration and Conciliation Act, 1996, with the seat of arbitration at New Delhi. A true copy of the said Agreement is annexed herewith and marked as "
          ),
          new TextRun({ text: "Annexure P-1.", bold: true }),
        ] }),

      // Para 3: The disputes that have arisen
      new Paragraph({ numbering: { reference: "s9-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That disputes and differences have arisen between the Petitioner and the Respondent in connection with the said Agreement. The Petitioner has performed its obligations under the said Agreement, and is entitled to receive a sum of Rs. ________ from the Respondent. However, the Respondent has wrongfully withheld payment and has refused to honour its obligations under the said Agreement despite repeated demands by the Petitioner."
        )] }),

      // Para 4: The apprehended harm — the heart of the
      // application. The petitioner must show what specific harm
      // would occur without interim protection.
      new Paragraph({ numbering: { reference: "s9-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "That the Petitioner has come to learn from reliable sources that the Respondent is in the process of ", bold: true }),
          new TextRun(
            "________ (state the apprehended harm with specificity, e.g.: dissipating its assets by transferring funds to overseas accounts; alienating its immovable properties to third parties; removing critical documents and records relevant to the disputes; closing down its business operations and rendering itself impecunious). The said actions of the Respondent, if not immediately restrained by this Hon'ble Court, would cause irreparable injury to the Petitioner and would render the eventual arbitral award nugatory and incapable of execution."
          ),
        ] }),

      // Para 5: Specific facts supporting the apprehension
      new Paragraph({ numbering: { reference: "s9-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the apprehension of the Petitioner is based on the following specific facts and circumstances: ________ (set out the specific facts that justify the apprehension, such as advertisements for sale of property, public announcements, statements made by the Respondent's officers, news reports, or any other tangible evidence)."
        )] }),

      // Para 6: Three-element test for interim relief
      // Same test as Order XXXIX Rule 1-2 CPC: prima facie case,
      // balance of convenience, irreparable injury
      new Paragraph({ numbering: { reference: "s9-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Petitioner has a strong prima facie case against the Respondent in the contemplated arbitration proceedings, the balance of convenience lies in favour of the Petitioner, and the Petitioner would suffer irreparable loss and injury if the interim measures of protection prayed for are not granted forthwith."
        )] }),

      // Para 7: The 90-day commencement undertaking — required
      // by the post-2015 amendment to prevent abuse of Section 9
      new Paragraph({ numbering: { reference: "s9-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "That the Petitioner undertakes to commence the arbitral proceedings against the Respondent within a period of ninety days from the date of the order passed by this Hon'ble Court on the present petition, ", bold: true }),
          new TextRun("as required by Section 9(2) of the Arbitration and Conciliation Act, 1996. The Petitioner is in the process of issuing the formal notice of invocation of arbitration to the Respondent and shall file an application under Section 11 of the said Act, if necessary, in due course."),
        ] }),

      // Para 8: Jurisdiction
      new Paragraph({ numbering: { reference: "s9-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That this Hon'ble Court has jurisdiction to entertain and decide the present petition because the seat of arbitration as agreed by the parties is New Delhi, and the cause of action has arisen within the territorial jurisdiction of this Hon'ble Court. The dispute also constitutes a 'commercial dispute' within the meaning of the Commercial Courts Act, 2015."
        )] }),

      // Para 9: Court fee
      new Paragraph({ numbering: { reference: "s9-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the requisite court fee has been affixed on the present petition."
        )] }),

      spacer,

      // ─── Prayer ───
      // Specific interim reliefs are sought, not general relief.
      // The court grants only what is specifically asked for and
      // justified by the facts.
      centeredBold("PRAYER:", 26),
      spacer,

      legalPara([new TextRun(
        "In view of the facts and circumstances stated above, it is most respectfully prayed that this Hon'ble Court may be pleased to:"
      )]),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "Pass an order of injunction restraining the Respondent, its directors, officers, employees, agents, representatives, and any person claiming through or under it, from in any manner alienating, transferring, encumbering, parting with possession of, or otherwise dealing with the immovable property bearing No. ________, situated at ________, pending the arbitral proceedings between the parties;", bold: true }),
        ] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Direct the Respondent to deposit the amount of Rs. ________ with the Registrar General of this Hon'ble Court, or to furnish a bank guarantee for the said amount, as security for the satisfaction of any award that may be passed against it;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Pass an order directing the Respondent to disclose on affidavit, within such time as this Hon'ble Court may direct, full and complete particulars of all its movable and immovable assets, including details of its bank accounts, investments, immovable properties, and other valuable items;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Pass any other or further interim order or orders as this Hon'ble Court may deem fit and proper in the facts and circumstances of the case to protect the interests of the Petitioner pending the arbitral proceedings."
        )] }),

      spacer, spacer,

      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Place: New Delhi"), new TextRun({ text: "\tPETITIONER", bold: true })] }),
      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Date: ________"), new TextRun("\tThrough")] }),
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun("Counsel for the Petitioner")] }),

      spacer, spacer,

      legalPara([
        new TextRun({ text: "[NOTE: ", bold: true, italics: true }),
        new TextRun({ text: "This petition must be supported by an affidavit and accompanied by certified copies of the underlying agreement containing the arbitration clause and any documents establishing the apprehended dissipation of assets. The Petitioner is required to commence arbitral proceedings within ninety days of the order or such further period as the Court may determine, failing which the interim measures may be vacated.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
