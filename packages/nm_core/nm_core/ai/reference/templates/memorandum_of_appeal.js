/**
 * MEMORANDUM OF APPEAL (FIRST APPEAL)
 * ──────────────────────────────────────
 * Category : Civil Appellate Pleading
 * Court    : District Judge / High Court (intermediate appellate)
 * Statute  : Section 96 read with Order XLI, Code of Civil Procedure, 1908
 * Source   : Standard form used in Indian appellate practice
 *
 * The Memorandum of Appeal is the document by which a party
 * dissatisfied with a trial court decree challenges that decree in
 * the next higher court. To understand its place in your library,
 * consider the appellate hierarchy in Indian civil practice.
 * Suits begin in trial courts: Civil Judge, Senior Civil Judge,
 * District Judge, or in some cases the High Court itself in its
 * original jurisdiction. From there, an appeal lies to the next
 * higher court, and from THAT court a further appeal lies to the
 * High Court if the case originated below the High Court level.
 * Finally, from the High Court, the dissatisfied party can file a
 * Special Leave Petition in the Supreme Court if the issue involves
 * a substantial question of law of general importance.
 *
 * THE APPELLATE STRUCTURE IN YOUR LIBRARY:
 *
 *   You can now see the full appellate ladder reflected in your
 *   templates:
 *
 *     The trial court level is where Templates 1, 17, 21, 26 and
 *     others begin their litigation. They are filed before a
 *     Civil Judge or District Judge who hears evidence and
 *     delivers a judgment.
 *
 *     The intermediate appellate level is what Template 42
 *     addresses. Once a trial court decree is passed, the losing
 *     party has thirty days to file a First Appeal, and that is
 *     what this Memorandum of Appeal is.
 *
 *     The apex appellate level is what Templates 23 (Civil SLP)
 *     and 32 (Criminal SLP) cover. These are filed in the Supreme
 *     Court after the High Court has rendered its decision.
 *
 *   So your library now contains the full chain of appellate
 *   documents from trial court to Supreme Court, and the
 *   Memorandum of Appeal is the missing middle piece that
 *   connects the trial-court pleadings to the apex-court petitions.
 *
 * SECTION 96 OF THE CODE OF CIVIL PROCEDURE:
 *
 *   Section 96(1) provides that an appeal shall lie from every
 *   decree passed by any court exercising original jurisdiction
 *   to the court authorised to hear appeals from the decisions
 *   of such court. This is the statutory foundation of the right
 *   of appeal in Indian civil litigation. Two important
 *   limitations apply. First, no appeal lies from a decree passed
 *   with the consent of the parties, because consent extinguishes
 *   the grievance. Second, no appeal lies in suits cognizable by
 *   courts of small causes when the value of the suit is below a
 *   prescribed threshold. Subject to these limitations, the right
 *   of appeal is essentially absolute for parties who are not
 *   satisfied with the trial court's decision.
 *
 * THE STRUCTURE OF AN APPELLATE DOCUMENT:
 *
 *   The Memorandum of Appeal looks quite different from a trial
 *   court plaint, and it is worth understanding why. A plaint
 *   tells the court a STORY: who the plaintiff is, what happened,
 *   how the defendant wronged them, and what relief should be
 *   granted. The court hears this story for the first time and
 *   has to decide whether it is true. An appeal, by contrast,
 *   does not tell a story. The story has already been told, the
 *   court below has heard it, and the appellate court starts with
 *   a record of that story already in front of it. So an appeal
 *   does not need to repeat the facts in narrative form. Instead,
 *   it identifies the IMPUGNED JUDGMENT, sets out the GROUNDS on
 *   which that judgment is being challenged, and prays for the
 *   judgment to be set aside or modified.
 *
 *   Notice how this structural insight is reflected in the body
 *   of Template 42. Paragraph 1 identifies the parties. Paragraph
 *   2 identifies the impugned judgment with full particulars
 *   (court, suit number, date, names of parties). Paragraph 3
 *   gives a brief description of the trial court's findings so
 *   that the appellate court can understand what is being
 *   challenged. Paragraphs 4 onward then set out the GROUNDS of
 *   appeal, each one identifying a specific error in the trial
 *   court's reasoning. This is where the appellate lawyer
 *   actually argues the case, and the quality of the grounds is
 *   what determines whether the appeal will succeed.
 *
 * THE THIRTY-DAY LIMITATION:
 *
 *   Under Article 116 of the Limitation Act, a First Appeal must
 *   be filed within thirty days from the date of the decree if
 *   the appeal is to a District Judge, or within ninety days if
 *   the appeal is to the High Court. These periods are strict,
 *   and an appeal filed even one day late is liable to be
 *   dismissed unless the appellant can show "sufficient cause"
 *   for the delay under Section 5 of the Limitation Act. So one
 *   of the very first things an appellate lawyer must do on
 *   receiving a brief is to compute the limitation period and
 *   ensure the memorandum is filed on time.
 *
 * THE COURT FEE QUESTION:
 *
 *   The court fee on a Memorandum of Appeal is calculated on the
 *   same basis as the original suit, namely as a percentage of
 *   the value of the relief sought. If the appellant is
 *   challenging only part of the trial court's decree, the court
 *   fee is calculated on the value of that part alone, not on
 *   the entire decree. This rule allows partial appeals at
 *   correspondingly lower cost.
 *
 * STRUCTURAL FEATURES YOU SHOULD NOTICE:
 *
 *   Look at the case header. It says "FIRST APPEAL FROM ORDER" or
 *   "REGULAR FIRST APPEAL" depending on whether the trial court
 *   passed an order or a decree. The distinction matters because
 *   different procedural rules apply.
 *
 *   Look at how the parties are labelled. The party who has
 *   brought the appeal is now called the APPELLANT (whether they
 *   were plaintiff or defendant in the trial court), and the
 *   other party is called the RESPONDENT. This relabelling is
 *   conventional in all Indian appellate documents and helps
 *   prevent confusion about which party is now seeking what.
 *
 *   Look at how the grounds are numbered. They use Roman numerals
 *   in lowercase or uppercase, depending on local convention.
 *   The grounds are the substance of the appeal, and each one
 *   is meant to identify a discrete legal or factual error in
 *   the trial court's reasoning.
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
      { reference: "appeal-paras", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      // Roman uppercase for grounds
      { reference: "appeal-grounds", levels: [{ level: 0, format: LevelFormat.UPPER_ROMAN, text: "%1.",
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
      // The appeal goes to the next higher court — typically the
      // Court of the District Judge if the original court was a
      // Civil Judge, or the High Court if the original court was
      // a District Judge.
      centeredBold("IN THE COURT OF DISTRICT JUDGE", 26),
      centeredBold("(DISTRICT ________), ________ COURT, DELHI", 22),
      spacer,
      centeredBold("REGULAR FIRST APPEAL NO. ________ OF 20__", 24),
      spacer,

      // ─── Arising-From Clause ───
      // Every appellate document must identify the lower court
      // judgment being challenged. This includes the court name,
      // the case number, the date, and the parties.
      legalPara([
        new TextRun({ text: "(Arising out of the Judgment and Decree dated ________ passed by the Court of Sh. ________, Civil Judge, ________ District, Delhi, in Civil Suit No. ________ of 20__, titled '________ versus ________')", italics: true, size: 22 }),
      ], { alignment: AlignmentType.CENTER }),

      spacer,

      // ─── Parties ───
      // The dual labelling — original party role plus current
      // appellate role — is conventional and reflects the dual
      // identity of each party in the appellate proceeding.
      legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      legalPara([new TextRun({ text: "________", bold: true })]),
      legalPara([new TextRun("S/o ________")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara([new TextRun({ text: "(Original Defendant in Civil Suit No. ________ of 20__)", italics: true })]),
      legalPara([new TextRun({ text: "\u2026 APPELLANT", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      centeredBold("VERSUS"),
      spacer,

      legalPara([new TextRun({ text: "________", bold: true })]),
      legalPara([new TextRun("S/o ________")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara([new TextRun({ text: "(Original Plaintiff in Civil Suit No. ________ of 20__)", italics: true })]),
      legalPara([new TextRun({ text: "\u2026 RESPONDENT", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      spacer,

      // ─── Title ───
      centeredBold("MEMORANDUM OF APPEAL UNDER SECTION 96", 22),
      centeredBold("READ WITH ORDER XLI OF THE CODE OF", 22),
      centeredBold("CIVIL PROCEDURE, 1908", 22),
      spacer,

      legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Body ───

      // Para 1: Introduction and identification of the impugned judgment
      new Paragraph({ numbering: { reference: "appeal-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Appellant herein is filing the present appeal against the Judgment and Decree dated ________ passed by the Court of Sh. ________, Civil Judge, ________ District, Delhi, in Civil Suit No. ________ of 20__, titled '________ versus ________' (hereinafter referred to as 'the impugned judgment')."
        )] }),

      // Para 2: Brief description of the underlying suit
      // Just enough background for the appellate court to
      // understand the context, not a full repetition of the facts.
      new Paragraph({ numbering: { reference: "appeal-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Respondent herein had filed Civil Suit No. ________ of 20__ before the said Court of Civil Judge, seeking ________ (briefly state the nature of the relief sought in the original suit). The Appellant herein, who was the Defendant in the said suit, filed a Written Statement contesting the suit on the grounds set out therein."
        )] }),

      // Para 3: The trial court's findings
      new Paragraph({ numbering: { reference: "appeal-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That after recording the evidence of the parties and hearing arguments, the learned Trial Court passed the impugned judgment dated ________, "
          ),
          new TextRun({ text: "decreeing the suit of the Respondent ", bold: true }),
          new TextRun(
            "and granting the relief of ________ in favour of the Respondent and against the Appellant. The certified copy of the impugned judgment is annexed herewith and marked as "
          ),
          new TextRun({ text: "Annexure A-1.", bold: true }),
        ] }),

      // Para 4: The appellant's grievance
      new Paragraph({ numbering: { reference: "appeal-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Appellant is aggrieved by the impugned judgment and decree, which is contrary to law, against the weight of evidence on record, and is liable to be set aside on the grounds set out hereinafter."
        )] }),

      spacer,

      // ─── GROUNDS OF APPEAL ───
      // This is the heart of the document. Each ground identifies
      // a discrete legal or factual error in the trial court's
      // reasoning. The grounds are what the appellate court will
      // actually consider, so the quality of the drafting here
      // determines whether the appeal will succeed.
      centeredBold("GROUNDS OF APPEAL", 26),
      spacer,

      legalPara([new TextRun(
        "The Appellant, being aggrieved by the impugned judgment, prefers the present appeal on the following grounds, amongst others:"
      )]),

      spacer,

      // Each ground addresses a specific category of error.
      // Notice how each begins with "Because" — this is the
      // conventional opening for grounds in Indian appellate
      // drafting.

      new Paragraph({ numbering: { reference: "appeal-grounds", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because the learned Trial Court has erred in law and in fact in passing the impugned judgment, which is contrary to the evidence on record."
        )] }),

      new Paragraph({ numbering: { reference: "appeal-grounds", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because the learned Trial Court has failed to appreciate that ________ (specific factual error in the trial court's findings)."
        )] }),

      new Paragraph({ numbering: { reference: "appeal-grounds", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because the learned Trial Court has failed to appreciate the legal position laid down by the Hon'ble Supreme Court in ________ (cite specific case authority that supports the appellant's case)."
        )] }),

      new Paragraph({ numbering: { reference: "appeal-grounds", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because the learned Trial Court has wrongly placed the burden of proof on the Appellant when, in law, the burden lay on the Respondent."
        )] }),

      new Paragraph({ numbering: { reference: "appeal-grounds", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because the learned Trial Court has wrongly admitted or relied upon documents which were inadmissible in evidence."
        )] }),

      new Paragraph({ numbering: { reference: "appeal-grounds", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because the learned Trial Court has wrongly disbelieved the testimony of the Appellant's witnesses without giving any cogent reasons for doing so."
        )] }),

      new Paragraph({ numbering: { reference: "appeal-grounds", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because the learned Trial Court has misconstrued the documents and has drawn inferences that are not supported by the contents of those documents."
        )] }),

      new Paragraph({ numbering: { reference: "appeal-grounds", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because the impugned judgment is perverse and is based on conjectures and surmises rather than on the evidence on record."
        )] }),

      new Paragraph({ numbering: { reference: "appeal-grounds", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because the Appellant craves leave of this Hon'ble Court to add, amend, modify or delete any of the above grounds at the time of hearing of the appeal."
        )] }),

      spacer,

      // ─── Limitation and Court Fee ───
      new Paragraph({ numbering: { reference: "appeal-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the present appeal is being filed within the period of limitation prescribed under Article 116 of the Limitation Act, 1963."
        )] }),

      new Paragraph({ numbering: { reference: "appeal-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the requisite court fee of Rs. ________ has been affixed on this Memorandum of Appeal as per the value of the relief challenged."
        )] }),

      spacer,

      // ─── Prayer ───
      centeredBold("PRAYER:", 26),
      spacer,

      legalPara([new TextRun(
        "In the facts and circumstances stated above, it is, therefore, most respectfully prayed that this Hon'ble Court may be pleased to:"
      )]),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "Allow the present appeal and set aside the impugned judgment and decree dated ________ passed by the Court of Sh. ________, Civil Judge, in Civil Suit No. ________ of 20__;", bold: true }),
        ] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Dismiss the suit of the Respondent with costs throughout;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Pass any other or further order or orders as this Hon'ble Court may deem fit and proper in the facts and circumstances of the case."
        )] }),

      spacer, spacer,

      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Place: Delhi"), new TextRun({ text: "\tAPPELLANT", bold: true })] }),
      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Date: ________"), new TextRun("\tThrough")] }),
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun("Counsel for the Appellant")] }),

      spacer,

      // ─── Verification ───
      centeredBold("VERIFICATION:", 24), spacer,

      legalPara([new TextRun(
        "Verified at Delhi on ________ day of ________, 20__ that the contents of paragraphs 1 to ________ of this Memorandum of Appeal are true to my personal knowledge, and the grounds of appeal are based on legal advice received and believed to be true. The last paragraph is the prayer to this Hon'ble Court."
      )]),

      spacer,
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "APPELLANT", bold: true })] }),

      spacer, spacer,

      legalPara([
        new TextRun({ text: "[NOTE: ", bold: true, italics: true }),
        new TextRun({ text: "This Memorandum of Appeal must be supported by an affidavit and accompanied by a certified copy of the impugned judgment and decree. The appeal must be filed within thirty days from the date of the decree if the appeal lies to the District Judge, or within ninety days if the appeal lies to the High Court.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
