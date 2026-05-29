/**
 * PETITION FOR GRANT OF SUCCESSION CERTIFICATE
 * ────────────────────────────────────────────────
 * Category : Succession Law — Pleading under Indian Succession Act, 1925
 * Court    : District Judge / Administrative Civil Judge, Delhi
 * Statute  : Section 372, Indian Succession Act, 1925
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * The Succession Certificate is the third and most specialised
 * member of the succession trio in Indian law. To understand its
 * place, you have to see how it differs from the other two
 * succession instruments you already have in your library.
 *
 * THE THREE SUCCESSION INSTRUMENTS COMPARED:
 *
 *   PROBATE (Template 10) — Deals with the entire estate of a
 *   deceased person who left a valid will and named an executor.
 *   The probate is the court's certification that the will is
 *   valid and that the executor has authority to administer the
 *   whole estate.
 *
 *   LETTERS OF ADMINISTRATION (Template 31) — Also deals with the
 *   entire estate, but used when there is no will, or when there is
 *   a will but no named executor. The court appoints an administrator
 *   to handle the whole estate.
 *
 *   SUCCESSION CERTIFICATE (this template) — Deals only with DEBTS
 *   AND SECURITIES owed to the deceased. It is a much narrower
 *   instrument used in a very specific situation: someone owes
 *   money to the deceased (or holds securities belonging to the
 *   deceased), and the legal heir wants to collect those debts and
 *   securities. The certificate authorises the holder to collect
 *   these specific items, but does NOT authorise them to deal with
 *   the rest of the estate.
 *
 * THE SCOPE OF THE CERTIFICATE:
 *
 *   Under Section 372 of the Indian Succession Act, 1925, a
 *   succession certificate can be granted in respect of:
 *
 *     - Debts owed to the deceased (loans, salary arrears,
 *       insurance proceeds, bank deposits, provident fund balances,
 *       and other amounts owed to the deceased at the time of death)
 *
 *     - Securities held in the deceased's name (shares, debentures,
 *       government securities, mutual fund units, fixed deposits)
 *
 *   The certificate does NOT cover immovable property, household
 *   goods, or any other assets. For those, you need probate or
 *   letters of administration.
 *
 * WHY USE A SUCCESSION CERTIFICATE INSTEAD OF PROBATE?
 *
 *   The reason is practical: succession certificates are MUCH
 *   easier and cheaper to obtain than probate. The procedure is
 *   summary, the court fee is much lower, and the inquiry is
 *   limited to whether the petitioner is genuinely entitled to
 *   collect the debts. For a family whose deceased member left
 *   only a few bank accounts and some shares (no immovable
 *   property, no will), a succession certificate is far more
 *   efficient than full probate proceedings.
 *
 * THE TYPICAL USE CASE:
 *
 *   The classic scenario is the death of a salaried employee who
 *   leaves behind a bank fixed deposit, a provident fund balance,
 *   and a small portfolio of shares. The widow approaches the bank
 *   and the PF authorities asking for the money, but they refuse
 *   to release it without legal authority. The widow then files a
 *   succession certificate petition, identifying each debt and
 *   security in Schedule I, and asks the court to grant her a
 *   certificate authorising her to collect them.
 *
 * KEY STRUCTURAL FEATURES OF THE TEMPLATE:
 *
 *   1. CASE NAME — "SUCCESSION PETITION" rather than "Probate
 *      Petition" or "Letters Petition." This caption immediately
 *      tells the registry that the petition is under Section 372.
 *
 *   2. PARAGRAPH 2 — Crucially says "the said deceased died
 *      intestate." If the deceased had left a will, the petitioner
 *      would have to apply for probate or letters of administration
 *      instead. The succession certificate procedure assumes
 *      intestacy.
 *
 *   3. SCHEDULE I — The schedule of debts and securities is the
 *      heart of the petition. Without a precise listing of what is
 *      being claimed, the court has nothing to authorise. The
 *      schedule must specify each item with its identifying
 *      details (account number, deposit number, share certificate
 *      number, etc.).
 *
 *   4. PARAGRAPH 8 — Confirms that no probate or letters of
 *      administration application is pending. This is necessary
 *      because the court needs to know that no broader succession
 *      proceeding will overlap with the certificate.
 *
 *   5. AD VALOREM DUTY — Court fee on a succession certificate is
 *      calculated as a percentage of the value of the debts and
 *      securities being claimed (typically 2-3% under most state
 *      court fee schedules). This is mentioned in paragraph 10.
 *
 *   6. PRAYER WITH POWER TO COLLECT — The prayer specifically asks
 *      not just for the certificate but for "power to collect and
 *      receive and realise" the listed items. Without these
 *      operative words, the holder might find that the certificate
 *      is treated as merely declaratory rather than empowering.
 *
 *   7. EXEMPTION FROM SECURITY — Paragraph (ii) of the prayer asks
 *      that the petitioner be exempted from presenting security.
 *      Under Section 375 of the Act, the court may require the
 *      petitioner to give security to protect the interests of
 *      others who may be entitled to the same debts and securities.
 *      For routine cases, this requirement is usually waived.
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
      { reference: "succ-paras", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "(%1)",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "prayer-roman", levels: [{ level: 0, format: LevelFormat.LOWER_ROMAN, text: "(%1)",
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
      // The administrative civil judge has the jurisdiction to grant
      // succession certificates under Section 388 of the Act.
      centeredBold("IN THE COURT OF THE ADMINISTRATIVE CIVIL JUDGE", 24),
      centeredBold("(DISTRICT ________), ________ COURT, DELHI", 22),
      spacer,

      // The case is captioned as a "Succession Petition" not a
      // "Probate Petition" or "Civil Suit." This caption immediately
      // tells the registry that the petition is under Section 372.
      centeredBold("SUCCESSION PETITION NO. ________ OF 20__", 24),
      spacer,

      // ─── Parties ───
      legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      legalPara([new TextRun({ text: "X ________", bold: true })]),
      legalPara([new TextRun("S/o ________")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara([new TextRun({ text: "\u2026 APPLICANT / PETITIONER", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      centeredBold("VERSUS"),
      spacer,

      // The State and any other potential heirs are named as
      // respondents to ensure that everyone with a competing claim
      // has notice of the proceedings.
      legalPara([new TextRun({ text: "1. STATE OF ________", bold: true })]),
      spacer,
      legalPara([new TextRun({ text: "2. Y ________", bold: true })]),
      legalPara([new TextRun("   S/o ________")]),
      legalPara([new TextRun("   R/o ________")]),
      legalPara([new TextRun({ text: "\u2026 RESPONDENTS", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      spacer,

      // ─── Title ───
      // The full title makes the legal basis explicit. Notice the
      // phrase "in respect of the goods, debts and securities" —
      // this is the operative phrase from Section 372 that limits
      // the scope of the certificate.
      centeredBold("PETITION FOR THE GRANT OF SUCCESSION CERTIFICATE", 22),
      centeredBold("IN RESPECT OF THE GOODS, DEBTS AND SECURITIES", 22),
      centeredBold("ETC. OF THE LATE Sh. ________ (DECEASED)", 22),
      centeredBold("UNDER SECTION 372 OF THE INDIAN SUCCESSION ACT, 1925", 22),
      spacer,

      legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Body ───

      // Para 1: Identification of the deceased and date of death
      new Paragraph({ numbering: { reference: "succ-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the above-named deceased Sh. ________ died at ________ (residential address) on or about the ________ day of ________, 20__."
        )] }),

      // Para 2: The intestacy declaration — without this, the
      // succession certificate procedure does not apply
      new Paragraph({ numbering: { reference: "succ-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "That the said deceased died intestate ", bold: true, underline: {} }),
          new TextRun(
            "and that due and diligent search has been made for a Will but none has been found."
          ),
        ] }),

      // Para 3: Establishing residence at the time of death — this
      // determines which court has territorial jurisdiction
      new Paragraph({ numbering: { reference: "succ-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the deceased named above (hereinafter referred to as 'the said deceased') had been, during his lifetime till his death, permanently residing and living at the abovesaid premises, which falls within the jurisdiction of this Hon'ble Court. The deceased was, by nationality and faith, a Hindu citizen of India governed by the Mitakshara School of Hindu Law."
        )] }),

      // Para 4: Surviving heirs
      new Paragraph({ numbering: { reference: "succ-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the said deceased, at the time of his death, left him surviving the following next-of-kin according to Hindu law: ________ (state the names, relationships, ages and addresses of all surviving heirs)."
        )] }),

      // Para 5: The petitioner's claim — establishes locus standi
      new Paragraph({ numbering: { reference: "succ-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Petitioner, as ________ (state relationship to the deceased) of the said deceased, claims to be entitled to a share of the estate of the deceased and is therefore entitled to apply for the present certificate."
        )] }),

      // Para 6: No legal impediment
      new Paragraph({ numbering: { reference: "succ-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That there is no impediment under Section 370 of the Indian Succession Act, 1925, or under any other provision of the said Act or any other enactment, to the grant of the certificate or to the validity thereof if it were granted."
        )] }),

      // Para 7: SCHEDULE I — the heart of the petition.
      // The schedule must specify each debt and security with
      // identifying details so that the certificate can effectively
      // authorise their collection.
      new Paragraph({ numbering: { reference: "succ-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That the Petitioner has truly set forth in "
          ),
          new TextRun({ text: "Schedule I ", bold: true }),
          new TextRun(
            "annexed hereto the debts and securities in respect of which the certificate is applied for. The Succession Certificate is required for the purpose of collecting and realising the debts and securities listed in the said Schedule I, including the bank fixed deposits, savings bank balances, provident fund balances, gratuity, leave encashment, insurance proceeds and shares standing in the name of the deceased. The said assets in respect of which the Succession Certificate is required are valued at approximately Rs. ________."
          ),
        ] }),

      // Para 8: No competing succession proceedings
      new Paragraph({ numbering: { reference: "succ-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That no application has been made to any District Court or Delegate or to any High Court for Probate of any Will of the said deceased or for Letters of Administration with or without the Will annexed in respect of his property and credits."
        )] }),

      // Para 9: No competing certificate applications
      new Paragraph({ numbering: { reference: "succ-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That no application for a Succession Certificate in respect of any debt or security belonging to the estate of the said deceased has been made to any District Court or Delegate or to any High Court."
        )] }),

      // Para 10: Court fee — ad valorem on the value of the assets
      new Paragraph({ numbering: { reference: "succ-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That ad valorem court fee of Rs. ________ payable in respect of the grant of the Succession Certificate hereunder prayed for has been duly paid."
        )] }),

      // Para 11: Bona fide application
      new Paragraph({ numbering: { reference: "succ-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That this application is made bona fide.")] }),

      spacer,

      // ─── Prayer ───
      // Note that the prayer specifically asks for the POWER to
      // collect, receive and realise. Without these operative words,
      // the certificate might be treated as merely declaratory.
      centeredBold("PRAYER:", 26),
      spacer,

      legalPara([new TextRun("The Petitioner, therefore, most respectfully prays:")]),

      new Paragraph({ numbering: { reference: "prayer-roman", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "That a Succession Certificate may be granted to the Petitioner ", bold: true }),
          new TextRun(
            "in respect of the debts and securities set forth in Schedule I hereto, with power to collect and / or receive and / or realise the same, inclusive of all interests accrued thereon, and to sell and / or negotiate and / or deal with the same without any impediment;"
          ),
        ] }),

      // The exemption from security — typically requested in routine
      // cases where the petitioner is the closest legal heir
      new Paragraph({ numbering: { reference: "prayer-roman", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That the Petitioner be exempted from presenting any security on that account;"
          ),
        ] }),

      new Paragraph({ numbering: { reference: "prayer-roman", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That such other and further orders as this Hon'ble Court may deem fit and proper in the facts and circumstances of the case may also be passed."
        )] }),

      spacer, spacer,

      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Place: ________"), new TextRun({ text: "\tPETITIONER", bold: true })] }),
      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Date: ________"), new TextRun("\tThrough")] }),
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun("Counsel for the Petitioner")] }),

      spacer,

      // ─── Verification ───
      centeredBold("VERIFICATION:", 24), spacer,

      legalPara([new TextRun(
        "I, ________, the Petitioner above-named, do solemnly declare that what is stated in paragraphs ________ to ________ above is true to my knowledge and that what is stated in the remaining paragraphs is true to information received from ________ and believed by me to be true."
      )]),

      legalPara([new TextRun("Verified at ________ on this ________ day of ________ 20__.")]),

      spacer,
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "PETITIONER", bold: true })] }),

      spacer, spacer,

      legalPara([
        new TextRun({ text: "[NOTE: ", bold: true, italics: true }),
        new TextRun({ text: "To be supported by an affidavit and accompanied by Schedule I listing the debts and securities. The Petitioner must also annex a death certificate of the deceased.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
