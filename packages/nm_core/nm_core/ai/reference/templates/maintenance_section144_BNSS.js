/**
 * APPLICATION FOR MAINTENANCE UNDER SECTION 144 BNSS
 * ─────────────────────────────────────────────────────
 * Category : Family Law / Quasi-Criminal Pleading
 * Court    : Principal Judge, Family Court, Delhi
 * Statute  : Section 144 of the Bharatiya Nagarik Suraksha Sanhita, 2023
 *            (formerly Section 125 of CrPC, 1973)
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * Section 144 BNSS is one of the most IMPORTANT social welfare
 * provisions in Indian law. It enables vulnerable family members —
 * abandoned wives, minor children, and indigent parents — to claim
 * maintenance from those legally bound to support them.
 *
 * WHO CAN CLAIM MAINTENANCE UNDER SECTION 144:
 *
 *   - A wife who is unable to maintain herself
 *   - A legitimate or illegitimate minor child unable to maintain itself
 *   - A legitimate or illegitimate adult child suffering from physical
 *     or mental abnormality and unable to maintain itself
 *   - The father or mother who is unable to maintain themselves
 *
 * UNIQUE CHARACTERISTICS:
 *
 *   1. QUASI-CRIMINAL PROCEEDING — although filed in the Family Court,
 *      Section 144 sits in the Bharatiya Nagarik Suraksha Sanhita
 *      (the criminal procedure code). The proceedings are summary
 *      in nature and faster than civil maintenance suits.
 *
 *   2. RELIGION-NEUTRAL — unlike personal-law remedies (Hindu Marriage
 *      Act, Muslim personal law), Section 144 applies to ALL persons
 *      regardless of religion. This makes it especially valuable for
 *      women whose personal law remedies are limited.
 *
 *   3. MULTIPLE APPLICANTS — the same application can be filed by a
 *      wife AND her minor children together. Notice the parties block:
 *      Applicant No. 1 is the wife, Applicant No. 2 is the minor child
 *      (filing through the mother as natural guardian).
 *
 *   4. THE RESPONDENT'S MEANS MUST BE PLEADED — the applicant must
 *      specifically plead that the respondent has "sufficient means"
 *      and yet refuses or neglects to maintain her/them. This is the
 *      jurisdictional fact for Section 144.
 *
 *   5. THE APPLICANT'S INABILITY MUST ALSO BE PLEADED — the wife
 *      must show she has "no independent source of livelihood" and
 *      is unable to maintain herself.
 *
 *   6. NO FIXED CEILING ON MAINTENANCE — unlike the old CrPC which
 *      capped maintenance at Rs. 500 per month, Section 144 BNSS
 *      (and the post-2001 amended Section 125 CrPC) has NO ceiling.
 *      Courts award what is "reasonable" based on the husband's
 *      income and the wife's needs.
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
    config: [{
      reference: "maint-paras",
      levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
    }],
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
      // Note: Maintenance under S.144 is filed in the Family Court
      // (NOT a Magistrate's Court, despite being in the criminal code)
      centeredBold("IN THE COURT OF PRINCIPAL JUDGE, FAMILY COURT", 24),
      centeredBold("(DISTRICT ________), ________ COURT, DELHI", 22),
      spacer,
      centeredBold("MAINTENANCE APPLICATION NO. ________ OF 20__", 24),
      spacer,

      // ─── Parties ───
      legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      // Applicant No. 1 — the wife
      legalPara([new TextRun({ text: "1. Smt. X ________", bold: true })]),
      legalPara([new TextRun("   W/o Sh. Z ________")]),
      legalPara([new TextRun("   R/o ________")]),

      spacer,

      // Applicant No. 2 — the minor child filing through the mother
      // The phrase "through his mother and natural guardian" is the
      // standard way minors are represented in Indian courts.
      legalPara([new TextRun({ text: "2. Master R ________", bold: true })]),
      legalPara([new TextRun("   S/o Sh. Z ________")]),
      legalPara([new TextRun("   R/o ________")]),
      legalPara([new TextRun({ text: "through his mother and natural guardian Smt. X", italics: true })]),
      legalPara([new TextRun({ text: "\u2026 APPLICANTS", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      centeredBold("VERSUS"),
      spacer,

      legalPara([new TextRun({ text: "Sh. Z ________", bold: true })]),
      legalPara([new TextRun("S/o ________")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara([new TextRun({ text: "\u2026 RESPONDENT", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      spacer,

      // ─── Title ───
      centeredBold("APPLICATION UNDER SECTION 144 OF THE BHARATIYA", 22),
      centeredBold("NAGARIK SURAKSHA SANHITA, 2023", 22),
      spacer,

      legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Body ───
      // The narrative must establish: (1) marital relationship, (2)
      // child's parentage, (3) the breakdown of cohabitation, (4)
      // the respondent's "sufficient means," (5) the applicants'
      // inability to maintain themselves.

      new Paragraph({ numbering: { reference: "maint-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Applicant No. 1 is the legally wedded wife of the Respondent, while Applicant No. 2 is the legitimate son of the Respondent."
        )] }),

      new Paragraph({ numbering: { reference: "maint-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Applicant No. 1 was married to the Respondent according to Hindu rites and ceremonies on ________ (date) at New Delhi, and the Applicant No. 2 was born out of their wedlock on ________. The Applicant No. 2 is presently staying with Applicant No. 1."
        )] }),

      new Paragraph({ numbering: { reference: "maint-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That Applicant No. 1 and the Respondent stayed together after their marriage and for the last ________ years preceding ________, they were staying at Delhi."
        )] }),

      // Para 4: The breakdown of cohabitation — typically because of
      // the husband's misconduct (cruelty, adultery, abandonment)
      new Paragraph({ numbering: { reference: "maint-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That sometime during the period ________, the matrimonial life of Applicant No. 1 and the Respondent got disturbed on account of ________. The Applicant No. 1 made best possible efforts to persuade the Respondent to mend his ways. However, the same had no effect on the Respondent. Rather, the behavior of the Respondent towards Applicant No. 1 became rude, cruel and oppressive, and finally on ________, the Respondent compelled Applicant No. 1 to leave the matrimonial home along with Applicant No. 2. Since then, the Applicants have been staying with Applicant No. 1's father."
        )] }),

      new Paragraph({ numbering: { reference: "maint-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That Applicant No. 1 has made repeated attempts to rejoin the Respondent in the matrimonial home. However, the Respondent has refused to take back the Applicants and has clearly informed Applicant No. 1 that he is not willing to maintain them. As such, the Respondent has deserted the Applicants without any reasonable cause."
        )] }),

      // Para 6: Refusal/neglect to maintain — the JURISDICTIONAL FACT
      new Paragraph({ numbering: { reference: "maint-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun("That the Respondent is "),
          new TextRun({ text: "liable to maintain the Applicants", bold: true }),
          new TextRun(", who have repeatedly requested the Respondent to provide them appropriate maintenance. However, the Respondent has not only "),
          new TextRun({ text: "refused / neglected to maintain ", bold: true }),
          new TextRun("the Applicants but has also refused to ever return the articles belonging to Applicant No. 1 towards her dowry and Stridhan."),
        ] }),

      // Para 7: Respondent's "sufficient means" — must be specifically pleaded
      new Paragraph({ numbering: { reference: "maint-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun("That the Respondent is a man of "),
          new TextRun({ text: "sufficient status and means.", bold: true, underline: {} }),
          new TextRun(" He is working as ________ and is getting monthly emoluments of approximately Rs. ________ per month, and as such has sufficient means to maintain himself and the Applicants. He has no encumbrances or liabilities except that of maintenance of the Applicants."),
        ] }),

      // Para 8: Applicant's inability — also must be specifically pleaded
      new Paragraph({ numbering: { reference: "maint-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun("That the Applicant No. 1 has "),
          new TextRun({ text: "no independent source of livelihood ", bold: true, underline: {} }),
          new TextRun("and as such is unable to maintain herself. She is staying with her father at Delhi, and as such both the Applicants are dependent upon him."),
        ] }),

      // Para 9: Detailed expenses for the minor child
      new Paragraph({ numbering: { reference: "maint-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Applicant No. 2 is a minor and is studying at ________. His monthly expenditure including school fees, dresses, books, food, medical care and other necessities is more than Rs. ________ per month."
        )] }),

      // Para 10: Jurisdiction
      new Paragraph({ numbering: { reference: "maint-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Applicants are residing at Delhi. This Hon'ble Court is therefore competent to entertain and try this petition."
        )] }),

      spacer,

      // ─── Prayer ───
      // Maintenance prayers ask for SEPARATE amounts for each applicant
      // because each has their own needs. Awards are typically monthly
      // and may include separate provisions for school fees, medical
      // expenses, and the cost of legal proceedings.
      centeredBold("PRAYER:", 26),
      spacer,

      legalPara([
        new TextRun(
          "It is, therefore, most respectfully prayed that orders for maintenance be passed in favour of the Applicants and against the Respondent directing the Respondent to pay:"
        ),
      ]),

      legalPara([
        new TextRun({ text: "(a) ", bold: true }),
        new TextRun("a monthly allowance of Rs. ________ towards the maintenance of Applicant No. 1;"),
      ]),

      legalPara([
        new TextRun({ text: "(b) ", bold: true }),
        new TextRun("a monthly allowance of Rs. ________ towards the maintenance of Applicant No. 2 (minor child);"),
      ]),

      legalPara([
        new TextRun({ text: "(c) ", bold: true }),
        new TextRun("the costs of these proceedings to be also awarded to the Applicants;"),
      ]),

      legalPara([
        new TextRun({ text: "(d) ", bold: true }),
        new TextRun("any other order(s) which this Hon'ble Court may deem fit and proper in the facts and circumstances of the case."),
      ]),

      spacer, spacer,

      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Place: ________"), new TextRun({ text: "\tApplicants", bold: true })] }),
      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Date: ________"), new TextRun("\tThrough")] }),
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun("Advocate")] }),

      spacer, spacer,

      legalPara([
        new TextRun({ text: "[Note: ", bold: true, italics: true }),
        new TextRun({ text: "An affidavit is to be attached to this petition. List of witnesses to be mentioned at the end of the application.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
