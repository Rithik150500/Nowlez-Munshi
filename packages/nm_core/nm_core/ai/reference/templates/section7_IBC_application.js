/**
 * APPLICATION BY FINANCIAL CREDITOR UNDER SECTION 7 OF THE
 * INSOLVENCY AND BANKRUPTCY CODE, 2016 (FORM 1)
 * ────────────────────────────────────────────────────────────
 * Category : Insolvency Law — Initiation of CIRP
 * Tribunal : National Company Law Tribunal (NCLT)
 * Statute  : Section 7, Insolvency and Bankruptcy Code, 2016
 * Form     : Form 1 of the Insolvency and Bankruptcy
 *            (Application to Adjudicating Authority) Rules, 2016
 * Source   : Standard form prescribed under the IBC Rules
 *
 * The Application under Section 7 of the IBC by a financial
 * creditor is the third insolvency template in your library and
 * it is the most powerful debt recovery instrument in Indian
 * commercial law today. To grasp how the Section 7 application
 * differs from the Section 9 application that you saw at
 * Template 62, you have to understand the asymmetric treatment
 * that the IBC accords to financial creditors and operational
 * creditors.
 *
 * THE ASYMMETRIC TREATMENT:
 *
 *   The IBC treats financial creditors much more favourably
 *   than operational creditors in three important respects, and
 *   each of these respects is reflected in the structural
 *   differences between Templates 62 and 63.
 *
 *   First, financial creditors do NOT need to send any demand
 *   notice before filing an insolvency application. Where an
 *   operational creditor must first serve a Section 8 demand
 *   notice and wait for ten days before filing a Section 9
 *   application, a financial creditor can file a Section 7
 *   application directly without any precondition. This
 *   reflects the policy judgment that financial creditors
 *   typically have well-documented evidence of the debt and
 *   the default and do not need any intermediary step to
 *   establish the existence of an undisputed debt.
 *
 *   Second, the existence of a dispute is irrelevant to a
 *   Section 7 application. Where a Section 9 application by an
 *   operational creditor must be rejected if the corporate
 *   debtor has raised a pre-existing dispute regarding the
 *   debt, a Section 7 application can be admitted even if the
 *   corporate debtor disputes the debt. The leading case on
 *   this point is Innoventive Industries Ltd. v. ICICI Bank
 *   (2018), in which the Supreme Court held that the NCLT's
 *   role at the admission stage of a Section 7 application is
 *   limited to determining (a) whether a financial debt
 *   exists, and (b) whether a default has occurred. The Court
 *   does not need to inquire into the merits of any underlying
 *   dispute, and the corporate debtor cannot defeat the
 *   admission by raising defences that go to the merits of the
 *   debt.
 *
 *   Third, the burden of proof is much lighter for a financial
 *   creditor. The financial creditor needs to produce only the
 *   record of the financial debt and evidence of default, both
 *   of which can usually be drawn from the books of the
 *   financial creditor itself or from a credit information
 *   company report. The Information Utilities established
 *   under Section 210 of the Code provide an even easier
 *   route, because a record of default registered with an
 *   Information Utility is conclusive proof of the default for
 *   the purposes of a Section 7 application.
 *
 * THE DEFINITION OF FINANCIAL DEBT:
 *
 *   The crucial threshold question in any Section 7
 *   application is whether the debt in question qualifies as a
 *   FINANCIAL DEBT within the meaning of Section 5(8) of the
 *   Code. The definition is broad and includes any debt along
 *   with interest that is disbursed against the consideration
 *   for the time value of money. The classic examples are
 *   loans, debentures, bonds, deposits, leases that are
 *   functionally equivalent to financing, and financial
 *   guarantees. The definition specifically excludes
 *   operational debts, which are governed by the Section 9
 *   regime.
 *
 *   The line between financial and operational debt is not
 *   always crisp, and the courts have had to deal with several
 *   borderline cases. Home buyers who pay advance amounts to
 *   real estate developers were initially treated as
 *   operational creditors, but a 2018 amendment to the Code
 *   classified them as financial creditors. Trade finance
 *   transactions, working capital loans, and structured
 *   financings have all given rise to interpretive disputes
 *   about whether they qualify as financial debt. As a
 *   drafter, you should be alert to these classification
 *   issues because the choice between Section 7 and Section 9
 *   determines the entire procedure that will follow.
 *
 * THE INNOVENTIVE STANDARD IN PRACTICE:
 *
 *   The Innoventive Industries judgment has had a profound
 *   practical effect on Indian commercial litigation. Because
 *   the Section 7 standard is so easy to satisfy, banks and
 *   other financial creditors have increasingly preferred the
 *   IBC route over traditional debt recovery mechanisms like
 *   suits in civil courts and applications before the Debt
 *   Recovery Tribunal. The threat of CIRP, with its drastic
 *   consequences including the loss of management control and
 *   the suspension of all other proceedings, is so powerful
 *   that many corporate debtors hurry to settle their debts
 *   the moment a Section 7 application is filed against them.
 *   In some cases, the application is settled even before the
 *   first hearing, with the financial creditor agreeing to
 *   withdraw the application in exchange for payment of the
 *   debt.
 *
 *   This dynamic has made the IBC the primary debt recovery
 *   mechanism for banks and large financial institutions in
 *   India, and the Section 7 application has become one of
 *   the most important commercial documents in the entire
 *   Indian legal system. Knowing how to draft a Section 7
 *   application is therefore essential for any commercial
 *   lawyer in India today.
 *
 * THE STRUCTURAL DIFFERENCES FROM TEMPLATE 62:
 *
 *   Notice how this template differs from the Section 9
 *   template at 62 in several important respects. First, the
 *   case caption is different: this is "Form 1" rather than
 *   "Form 5." Second, the Petitioner is described as a
 *   "Financial Creditor" rather than an "Operational
 *   Creditor." Third, the body refers to a "financial debt"
 *   rather than an "operational debt." Fourth, there is no
 *   reference anywhere to a Section 8 demand notice or to the
 *   absence of any pre-existing dispute, because neither is
 *   required for a Section 7 application. Fifth, the proof of
 *   default relies on records from an Information Utility or
 *   on the books of the financial creditor, rather than on
 *   invoices and contracts.
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
      { reference: "form1-paras", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
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
      // ─── Form Header ───
      // Note "FORM 1" — distinguishes this from Template 62 which
      // uses Form 5 for operational creditors
      centeredBold("FORM 1", 24),
      centeredBold("[See clause (a) of sub-rule (1) of rule 4]", 20),
      spacer,

      // ─── Tribunal Header ───
      centeredBold("BEFORE THE HON'BLE NATIONAL COMPANY LAW TRIBUNAL", 24),
      centeredBold("NEW DELHI BENCH, AT NEW DELHI", 22),
      spacer,
      centeredBold("CP (IB) NO. ________ OF 20__", 24),
      spacer,
      legalPara([
        new TextRun({ text: "(Application under Section 7 of the Insolvency and Bankruptcy Code, 2016 read with Rule 4 of the Insolvency and Bankruptcy (Application to Adjudicating Authority) Rules, 2016)", italics: true, size: 22 }),
      ], { alignment: AlignmentType.CENTER }),

      spacer,

      // ─── Parties ───
      // Notice that the petitioner is now a "Financial Creditor"
      // rather than an "Operational Creditor"
      legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      legalPara([new TextRun({ text: "________ Bank Limited", bold: true })]),
      legalPara([new TextRun("A banking company incorporated under the Companies Act,")]),
      legalPara([new TextRun("having its registered office at ________")]),
      legalPara([new TextRun("Through its authorised representative")]),
      legalPara([new TextRun("Sh. ________, Senior Manager")]),
      legalPara([new TextRun({ text: "\u2026 FINANCIAL CREDITOR / APPLICANT", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      centeredBold("VERSUS"),
      spacer,

      legalPara([new TextRun({ text: "M/s ________ Ltd.", bold: true })]),
      legalPara([new TextRun("A company incorporated under the Companies Act, 2013,")]),
      legalPara([new TextRun("having its registered office at ________")]),
      legalPara([new TextRun("CIN: ________")]),
      legalPara([new TextRun("Through its Board of Directors")]),
      legalPara([new TextRun({ text: "\u2026 CORPORATE DEBTOR / RESPONDENT", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      spacer,

      // ─── Title ───
      centeredBold("APPLICATION BY FINANCIAL CREDITOR FOR INITIATION", 22),
      centeredBold("OF CORPORATE INSOLVENCY RESOLUTION PROCESS UNDER", 22),
      centeredBold("SECTION 7 OF THE INSOLVENCY AND BANKRUPTCY CODE, 2016", 22),
      spacer,

      legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Body ───

      // Para 1: Identification of the Financial Creditor
      new Paragraph({ numbering: { reference: "form1-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Financial Creditor, ________ Bank Limited, is a banking company duly incorporated under the Companies Act and is a 'banking company' within the meaning of the Banking Regulation Act, 1949. The Financial Creditor is engaged in the business of banking and has its registered office at the address mentioned above. The Financial Creditor is filing the present application as a 'financial creditor' within the meaning of Section 5(7) of the Insolvency and Bankruptcy Code, 2016."
        )] }),

      // Para 2: Identification of the Corporate Debtor
      new Paragraph({ numbering: { reference: "form1-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Corporate Debtor, M/s ________ Ltd., is a company duly incorporated under the Companies Act, 2013, having its registered office at the address mentioned above. The Corporate Debtor is a 'corporate person' within the meaning of Section 3(7) of the Code and is therefore amenable to insolvency proceedings under the Code."
        )] }),

      // Para 3: The financial debt — establishes the existence
      // of the debt with reference to the loan documentation
      new Paragraph({ numbering: { reference: "form1-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That the Financial Creditor sanctioned a term loan facility of Rs. ________ (Rupees ________ only) in favour of the Corporate Debtor by Sanction Letter dated ________. The said loan facility was disbursed to the Corporate Debtor on the terms and conditions set out in the Loan Agreement dated ________ executed between the Financial Creditor and the Corporate Debtor. A true copy of the said Loan Agreement is annexed herewith and marked as "
          ),
          new TextRun({ text: "Annexure A-1.", bold: true }),
        ] }),

      // Para 4: Disbursement
      new Paragraph({ numbering: { reference: "form1-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That pursuant to the said Loan Agreement, the Financial Creditor disbursed the entire amount of Rs. ________ to the Corporate Debtor on ________ (date). The disbursement was made by way of credit to the current account of the Corporate Debtor maintained with the Financial Creditor. A copy of the bank statement evidencing the disbursement is annexed herewith and marked as Annexure A-2."
        )] }),

      // Para 5: This is a financial debt — explicit assertion
      // because the classification determines the applicable
      // procedure
      new Paragraph({ numbering: { reference: "form1-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "That the said term loan facility constitutes a 'financial debt' within the meaning of Section 5(8) of the Insolvency and Bankruptcy Code, 2016, ", bold: true, underline: {} }),
          new TextRun(
            "in that it is a debt along with interest that has been disbursed against the consideration for the time value of money."
          ),
        ] }),

      // Para 6: The default — the second key element
      new Paragraph({ numbering: { reference: "form1-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "That the Corporate Debtor has committed default in repayment of the said financial debt. ", bold: true, underline: {} }),
          new TextRun(
            "The Corporate Debtor has failed to pay the instalments of principal and interest due under the Loan Agreement on the due dates specified therein. The first default occurred on ________ (date), when the instalment of Rs. ________ became due but was not paid. Since then, the Corporate Debtor has continued to be in default and has failed to make payment of any further instalments. The total amount in default as on ________ (date) is Rs. ________ (comprising principal of Rs. ________ and interest of Rs. ________)."
          ),
        ] }),

      // Para 7: The threshold requirement
      new Paragraph({ numbering: { reference: "form1-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the amount of financial debt in default exceeds the minimum threshold of Rs. 1,00,00,000/- (Rupees One Crore only) prescribed under Section 4 of the Insolvency and Bankruptcy Code, 2016, as amended."
        )] }),

      // Para 8: Record of default — Information Utility or other
      // evidence
      new Paragraph({ numbering: { reference: "form1-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the record of default of the Corporate Debtor has been registered with the Information Utility, namely National e-Governance Services Limited (NeSL), and a copy of the said record of default is annexed herewith and marked as Annexure A-3. In the alternative, the books of accounts of the Financial Creditor maintained in the ordinary course of banking business clearly show the said default, and copies of the relevant entries from the said books are also annexed herewith."
        )] }),

      // Para 9: Notice of recall (if any) — not strictly required
      // but commonly included
      new Paragraph({ numbering: { reference: "form1-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That on account of the persistent default by the Corporate Debtor, the Financial Creditor classified the loan account of the Corporate Debtor as a Non-Performing Asset (NPA) on ________ (date) in accordance with the prudential norms of the Reserve Bank of India. The Financial Creditor also issued a notice of recall to the Corporate Debtor on ________ (date), recalling the entire outstanding amount of the loan along with interest. Despite the said notice of recall, the Corporate Debtor has failed to make payment of the outstanding amount."
        )] }),

      // Para 10: Proposal for IRP
      new Paragraph({ numbering: { reference: "form1-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Financial Creditor proposes the name of Sh. ________, an Insolvency Professional registered with the Insolvency and Bankruptcy Board of India under Registration No. ________, as the Interim Resolution Professional to be appointed by this Hon'ble Tribunal. The written communication of the said Insolvency Professional in Form 2, confirming his consent to act as Interim Resolution Professional, is annexed herewith and marked as Annexure A-4."
        )] }),

      // Para 11: Documents annexed
      new Paragraph({ numbering: { reference: "form1-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the following documents are annexed to the present application: (a) copy of the Loan Agreement dated ________; (b) copy of the bank statement evidencing the disbursement of the loan; (c) copy of the record of default registered with the Information Utility; (d) copies of the relevant entries from the books of accounts of the Financial Creditor; (e) copy of the notice of recall issued to the Corporate Debtor; (f) written communication from the proposed Interim Resolution Professional in Form 2; (g) copy of the certificate of incorporation of the Corporate Debtor; and (h) Master Data of the Corporate Debtor obtained from the website of the Ministry of Corporate Affairs."
        )] }),

      // Para 12: Jurisdiction
      new Paragraph({ numbering: { reference: "form1-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That this Hon'ble Tribunal has jurisdiction to entertain and decide the present application because the registered office of the Corporate Debtor is situated within the territorial jurisdiction of this Hon'ble Tribunal."
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
          new TextRun({ text: "Admit the present application under Section 7 of the Insolvency and Bankruptcy Code, 2016, and initiate the Corporate Insolvency Resolution Process against the Corporate Debtor;", bold: true, underline: {} }),
        ] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Declare a moratorium under Section 14 of the Code prohibiting all proceedings, actions, and recovery measures against the Corporate Debtor;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Appoint Sh. ________ (or such other Insolvency Professional as this Hon'ble Tribunal may deem fit) as the Interim Resolution Professional in respect of the Corporate Debtor;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Cause a public announcement of the initiation of the Corporate Insolvency Resolution Process to be made in accordance with Section 15 of the Code;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Pass such other or further orders as this Hon'ble Tribunal may deem fit and proper in the facts and circumstances of the case."
        )] }),

      spacer, spacer,

      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Place: New Delhi"), new TextRun({ text: "\tFINANCIAL CREDITOR", bold: true })] }),
      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Date: ________"), new TextRun("\tThrough")] }),
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun("Counsel for the Financial Creditor")] }),

      spacer, spacer,

      legalPara([
        new TextRun({ text: "[NOTE: ", bold: true, italics: true }),
        new TextRun({ text: "This application must be supported by an affidavit of the authorised representative of the Financial Creditor. The application must be accompanied by the prescribed filing fee and by all the documents listed in paragraph 11 above. Unlike a Section 9 application, no demand notice or affidavit confirming absence of dispute is required for a Section 7 application.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
