/**
 * COMPLAINT UNDER THE RESERVE BANK - INTEGRATED
 * OMBUDSMAN SCHEME, 2021
 * ─────────────────────────────────────────────
 * Category : Banking and Financial Services — Consumer
 *            Grievance Redressal
 * Forum    : Office of the Reserve Bank of India Ombudsman
 * Statute  : The Reserve Bank - Integrated Ombudsman Scheme,
 *            2021, notified under Section 35A of the Banking
 *            Regulation Act, 1949 and corresponding provisions
 *            of the RBI Act, 1934 and the Payment and
 *            Settlement Systems Act, 2007
 * Source   : Standard form developed for RBI ombudsman
 *            practice
 *
 * The Complaint under the RBI Integrated Ombudsman Scheme,
 * 2021 is the fourth template in this batch and it introduces
 * the consolidated banking grievance mechanism that has
 * become the principal forum for the resolution of consumer
 * disputes in the Indian banking and financial services
 * sector. To grasp where this template fits in your library,
 * you should compare it with the other consumer remedies
 * already in your library, particularly the Consumer Complaint
 * under the CPA 2019 at Template 8 and the SARFAESI Notice at
 * Template 64. The RBI Ombudsman scheme is different from
 * both of these because it is a specialised grievance
 * redressal mechanism for banking and financial services
 * disputes, and because it operates under the authority of
 * the RBI as the financial sector regulator rather than under
 * general consumer protection law.
 *
 * THE EVOLUTION TO THE INTEGRATED SCHEME:
 *
 *   The RBI ombudsman framework has evolved over more than
 *   thirty years and represents one of the most successful
 *   examples of regulator-led consumer protection in India.
 *   The first Banking Ombudsman Scheme was notified by the
 *   RBI in 1995 under Section 35A of the Banking Regulation
 *   Act, 1949, and provided a mechanism for the resolution
 *   of complaints against scheduled commercial banks. The
 *   1995 scheme was modest in scope and was largely
 *   confined to deficiencies in banking services.
 *
 *   Over the years, the RBI expanded its ombudsman framework
 *   in two important ways. First, the Banking Ombudsman
 *   Scheme itself was revised several times to expand the
 *   grounds of complaint and to improve the procedure.
 *   Second, the RBI created additional ombudsman schemes
 *   for different categories of regulated entities,
 *   including the Ombudsman Scheme for Non-Banking Financial
 *   Companies (NBFCs) in 2018 and the Ombudsman Scheme for
 *   Digital Transactions in 2019. By 2021, this had
 *   resulted in a fragmented framework with three separate
 *   ombudsman schemes covering different categories of
 *   financial service providers, with different grounds of
 *   complaint, different procedural rules, and different
 *   monetary limits.
 *
 *   This fragmentation was addressed by the RBI in 2021
 *   when it consolidated the three ombudsman schemes into
 *   a single Reserve Bank - Integrated Ombudsman Scheme.
 *   The Integrated Scheme has the advantage of providing a
 *   single window for the resolution of complaints against
 *   all RBI-regulated entities, with uniform procedural
 *   rules and a consistent approach to dispute resolution.
 *   The Integrated Scheme also introduced the principle of
 *   "one nation, one ombudsman," meaning that complaints
 *   are no longer divided into territorial jurisdictions
 *   but can be filed from anywhere in India through a
 *   centralised complaint management system.
 *
 * THE GROUNDS OF COMPLAINT UNDER THE INTEGRATED SCHEME:
 *
 *   The Integrated Scheme allows complaints on the broad
 *   ground of "deficiency in service," which is defined
 *   widely to include any short-coming or inadequacy in any
 *   financial service that the regulated entity is
 *   obligated to provide statutorily or otherwise. The
 *   specific grounds that have been identified in the
 *   Scheme include: delay in or failure to credit the
 *   proceeds of an instrument; non-payment or inordinate
 *   delay in payment of inward remittances; failure to
 *   issue or delay in issuing drafts, pay orders, or
 *   bankers' cheques; non-adherence to the prescribed
 *   working hours; failure to honour a guarantee or letter
 *   of credit; complaints from non-resident Indians having
 *   accounts in India in respect of remittances or deposits;
 *   refusal to open deposit accounts; levying of charges
 *   without adequate prior notice; non-adherence to the
 *   directions of the RBI on lending rates and other
 *   matters; refusal to accept or delay in accepting payment
 *   towards taxes; refusal to issue or delay in issuing
 *   pension to senior citizens; and any other matter
 *   relating to the violation of the directives of the RBI.
 *
 *   The Scheme also provides for complaints in respect of
 *   digital transactions, including the failure to credit
 *   funds promptly to the beneficiary's account, the
 *   wrongful debit of the customer's account, and any other
 *   issue relating to the operation of digital payment
 *   systems.
 *
 * THE PROCEDURAL REQUIREMENTS:
 *
 *   The Integrated Scheme requires the complainant to first
 *   approach the regulated entity with a written complaint
 *   and to give the regulated entity a reasonable
 *   opportunity to resolve the grievance. The complaint to
 *   the Ombudsman can be filed only after the regulated
 *   entity has either rejected the complaint, has failed to
 *   reply within thirty days of receipt of the complaint,
 *   or has given a reply with which the complainant is not
 *   satisfied. The complaint to the Ombudsman must be filed
 *   within one year from the date on which the complainant
 *   received the reply from the regulated entity, or in the
 *   absence of a reply, within one year and thirty days
 *   from the date of the original complaint to the regulated
 *   entity.
 *
 *   The complaint can be filed online through the RBI's
 *   Complaint Management System (CMS) at cms.rbi.org.in or
 *   in physical form at the Centralised Receipt and
 *   Processing Centre (CRPC) at the RBI's Chandigarh office.
 *   The procedure is informal and there are no court fees
 *   payable. The Ombudsman is empowered to pass an Award
 *   directing the regulated entity to take specific actions
 *   and to compensate the complainant for the loss suffered,
 *   subject to a maximum compensation limit prescribed
 *   under the Scheme.
 *
 * STRUCTURAL FEATURES OF THIS TEMPLATE:
 *
 *   The complaint to the RBI Ombudsman is more in the
 *   nature of a representation than a formal pleading,
 *   reflecting the consumer-friendly and informal character
 *   of the Scheme. The body identifies the complainant, the
 *   regulated entity, the nature of the deficiency in
 *   service, the prior complaint to the regulated entity,
 *   the response received (or the lack of response), and
 *   the relief sought. The complaint must be supported by
 *   documents establishing the banking relationship, the
 *   transaction in question, and the prior correspondence.
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
      { reference: "rbi-paras", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
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
      centeredBold("BEFORE THE HON'BLE OMBUDSMAN", 24),
      centeredBold("RESERVE BANK OF INDIA", 24),
      centeredBold("(Centralised Receipt and Processing Centre, Chandigarh)", 22),
      spacer,
      centeredBold("COMPLAINT NO. ________ OF 20__", 24),
      spacer,
      legalPara([
        new TextRun({ text: "(Complaint under the Reserve Bank - Integrated Ombudsman Scheme, 2021)", italics: true, size: 22 }),
      ], { alignment: AlignmentType.CENTER }),

      spacer, hrule(),

      // ─── Parties ───
      legalPara([new TextRun({ text: "PARTICULARS OF THE COMPLAINANT:", bold: true, underline: {} })]),
      spacer,

      legalPara([new TextRun("Name: Sh./Smt. ________")]),
      legalPara([new TextRun("Father's / Husband's Name: ________")]),
      legalPara([new TextRun("Age: ________ years")]),
      legalPara([new TextRun("Address: ________")]),
      legalPara([new TextRun("Email: ________")]),
      legalPara([new TextRun("Mobile: ________")]),
      legalPara([new TextRun("PAN: ________ (optional)")]),

      spacer,

      legalPara([new TextRun({ text: "PARTICULARS OF THE REGULATED ENTITY (RESPONDENT):", bold: true, underline: {} })]),
      spacer,

      legalPara([new TextRun("Name of the Bank / NBFC / Payment System Operator: ________")]),
      legalPara([new TextRun("Branch Name and Address: ________")]),
      legalPara([new TextRun("IFSC Code: ________")]),
      legalPara([new TextRun("Account Number: ________")]),
      legalPara([new TextRun("Customer ID: ________")]),

      spacer,

      // ─── Title ───
      centeredBold("COMPLAINT UNDER THE RESERVE BANK - INTEGRATED", 22),
      centeredBold("OMBUDSMAN SCHEME, 2021, AGAINST THE REGULATED", 22),
      centeredBold("ENTITY FOR DEFICIENCY IN SERVICE", 22),
      spacer,

      legalPara([new TextRun({ text: "Respected Sir / Madam,", bold: true })]),

      spacer,

      // ─── Body ───

      // Para 1: Banking relationship
      new Paragraph({ numbering: { reference: "rbi-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Complainant is a customer of the Respondent and has been maintaining a Savings Bank Account / Current Account / Credit Card Account / Loan Account No. ________ with the Respondent's ________ branch since ________ (date). The Complainant has been a satisfied customer of the Respondent for several years and has used the various banking services offered by the Respondent including online banking, mobile banking, and ATM services."
        )] }),

      // Para 2: The specific grievance
      new Paragraph({ numbering: { reference: "rbi-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "PARTICULARS OF THE GRIEVANCE: ", bold: true, underline: {} }),
          new TextRun(
            "That on ________ (date of the incident), the Complainant ________ (describe the specific incident, e.g. attempted to make an online transfer of Rs. ________ from the Complainant's account to the account of ________; the amount was debited from the Complainant's account but was never credited to the beneficiary's account; the Complainant immediately reported the matter to the Respondent's customer care, who acknowledged the issue and assured the Complainant that the amount would be reversed within seven working days). However, despite the said assurance and the lapse of more than ________ days, the amount has neither been credited to the beneficiary's account nor reversed to the Complainant's account."
          ),
        ] }),

      // Para 3: Deficiency in service
      new Paragraph({ numbering: { reference: "rbi-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "DEFICIENCY IN SERVICE: ", bold: true, underline: {} }),
          new TextRun(
            "That the failure of the Respondent to either complete the transaction or to reverse the amount within a reasonable time constitutes a clear deficiency in service within the meaning of the Reserve Bank - Integrated Ombudsman Scheme, 2021. The Respondent has also failed to comply with the RBI's directives on the time limits for the resolution of failed transactions in digital payment systems, which require failed transactions to be reversed within a specified period."
          ),
        ] }),

      // Para 4: Prior complaint to the regulated entity
      new Paragraph({ numbering: { reference: "rbi-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "PRIOR COMPLAINT TO THE RESPONDENT: ", bold: true, underline: {} }),
          new TextRun(
            "That in compliance with the procedural requirement under Clause 11 of the Integrated Ombudsman Scheme, 2021, the Complainant first approached the Respondent's grievance redressal mechanism by submitting a written complaint dated ________ (Reference No. ________). The said complaint was acknowledged by the Respondent vide acknowledgement No. ________ dated ________, but the Respondent failed to provide any meaningful response or to resolve the grievance. The Complainant submitted reminder complaints on ________ and ________, but the Respondent again failed to respond substantively. More than thirty days have elapsed since the original complaint to the Respondent, and the Complainant is therefore approaching this Hon'ble Office under the Integrated Ombudsman Scheme."
          ),
        ] }),

      // Para 5: Documents
      new Paragraph({ numbering: { reference: "rbi-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Complainant is annexing herewith copies of the following documents in support of the present complaint: (a) the bank statement / passbook entries showing the disputed transaction; (b) the screenshots of the failed transaction from the mobile banking application; (c) the written complaint to the Respondent dated ________; (d) the acknowledgement issued by the Respondent; (e) the reminder complaints; (f) the call records of the conversations with the Respondent's customer care; and (g) any other relevant documents."
        )] }),

      // Para 6: Loss suffered
      new Paragraph({ numbering: { reference: "rbi-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That as a result of the deficiency in service of the Respondent, the Complainant has suffered the following loss and inconvenience: (a) the loss of the use of the disputed amount of Rs. ________ for the period from ________ till the present date; (b) interest loss on the said amount; (c) the costs of multiple visits to the bank branch and of telephone calls to the customer care; (d) mental anguish, harassment, and inconvenience caused by the prolonged failure of the Respondent to resolve the matter; and (e) the loss of trust in digital banking services."
        )] }),

      // Para 7: Limitation
      new Paragraph({ numbering: { reference: "rbi-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "LIMITATION: ", bold: true, underline: {} }),
          new TextRun(
            "That the present complaint is being filed within the period of one year from the date of the response of the Respondent (or, in the absence of a response, within one year and thirty days from the date of the original complaint to the Respondent), as required by the Integrated Ombudsman Scheme, 2021. The complaint is therefore well within the prescribed period of limitation."
          ),
        ] }),

      // Para 8: No proceedings pending
      new Paragraph({ numbering: { reference: "rbi-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That no proceedings are pending in respect of the subject matter of the present complaint before any court, tribunal, arbitrator, or other competent forum, and that the present complaint is not barred by any earlier order of any such forum."
        )] }),

      spacer,

      // ─── Prayer ───
      centeredBold("PRAYER:", 26),
      spacer,

      legalPara([new TextRun(
        "In view of the facts and circumstances stated above, the Complainant most respectfully prays that this Hon'ble Office may be pleased to:"
      )]),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "Direct the Respondent to immediately credit the disputed amount of Rs. ________ to the Complainant's account along with applicable interest from the date of the disputed transaction till the date of actual credit;", bold: true, underline: {} }),
        ] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Award compensation to the Complainant for the mental agony, harassment, inconvenience, and loss caused by the deficiency in service of the Respondent;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Direct the Respondent to issue a written apology to the Complainant and to take steps to prevent similar incidents from occurring in the future;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Pass such other or further orders or awards as this Hon'ble Office may deem fit and proper in the facts and circumstances of the case."
        )] }),

      spacer, spacer,

      legalPara([new TextRun({ text: "DECLARATION:", bold: true, underline: {} })]),
      spacer,

      legalPara([new TextRun(
        "I, the Complainant above-named, hereby declare that the information furnished above is true and correct to the best of my knowledge and belief and that I have not concealed any material fact. I further declare that no proceedings in respect of the subject matter of the present complaint are pending before any court, tribunal, arbitrator, or other forum."
      )]),

      spacer, spacer,

      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Place: ________"), new TextRun({ text: "\tComplainant", bold: true })] }),
      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Date: ________"), new TextRun("\t________________________")] }),

      spacer, spacer,

      legalPara([
        new TextRun({ text: "[NOTE: ", bold: true, italics: true }),
        new TextRun({ text: "This complaint can be filed online through the RBI's Complaint Management System at cms.rbi.org.in or in physical form at the Centralised Receipt and Processing Centre at the RBI's Chandigarh office. There are no court fees payable. The complaint must be accompanied by copies of the bank statement, the disputed transaction details, the prior complaint to the regulated entity, and any other relevant documents.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
