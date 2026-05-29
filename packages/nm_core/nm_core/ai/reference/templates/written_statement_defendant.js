/**
 * MODEL DRAFT WRITTEN STATEMENT (DEFENDANT'S REPLY)
 * ────────────────────────────────────────────────────
 * Category : Civil Pleading — Defensive
 * Court    : Civil Judge, Delhi
 * Statute  : Order VIII of the Code of Civil Procedure, 1908
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * This is the ONLY DEFENSIVE PLEADING in the entire template library.
 * Every other template initiates a proceeding. This one RESPONDS to one.
 *
 * The Written Statement has a UNIQUE TWO-PART STRUCTURE:
 *
 *   PART 1 — PRELIMINARY OBJECTIONS (Legal/Technical Defenses)
 *     These are threshold defenses that can KILL the suit without the
 *     court ever reaching the merits. They include:
 *     - Limitation (the suit was filed too late)
 *     - Jurisdiction (wrong court)
 *     - Res judicata (same matter already decided)
 *     - Non-joinder / Mis-joinder of parties
 *     - Maintainability (legal bar to the suit)
 *     Each uses a SEPARATE numbering sequence from the Reply on Merits.
 *
 *   PART 2 — REPLY ON MERITS
 *     This is a PARAGRAPH-BY-PARAGRAPH response to the plaint, using
 *     a FORMULAIC VOCABULARY of five response types:
 *       "is correct and is admitted" — full admission
 *       "is denied for want of knowledge" — qualified denial
 *       "are absolutely incorrect and are denied" — full denial
 *       "is correct... however the remaining... are denied" — partial
 *       "is not admitted" — neither admitted nor denied
 *
 *   The Written Statement opens with "WITHOUT PREJUDICE" — a legal
 *   term meaning "replying to the merits should not be treated as
 *   waiving any of the preliminary objections raised above."
 *
 *   Under Order VIII Rule 1 CPC, the defendant MUST file the Written
 *   Statement within 30 days (extendable to 120 days maximum).
 *
 *   NOTE: Counter-claims and set-off can also be included in a Written
 *   Statement (Order VIII Rules 6A-6G CPC).
 */

const {
  Document, Paragraph, TextRun,
  AlignmentType, TabStopType, TabStopPosition,
  Footer, PageNumber, LevelFormat, BorderStyle
} = require("docx");

// ───── Helpers ─────

function legalPara(children, opts = {}) {
  return new Paragraph({
    spacing: { after: 120, line: 360 },
    alignment: AlignmentType.JUSTIFIED,
    ...opts,
    children,
  });
}

function centeredBold(text, size = 24) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [new TextRun({ text, bold: true, size, font: "Times New Roman" })],
  });
}

const spacer = new Paragraph({ spacing: { after: 120 }, children: [] });

// ───── Document ─────

module.exports = new Document({
  styles: {
    default: {
      document: { run: { font: "Times New Roman", size: 24 } },
    },
  },

  numbering: {
    config: [
      {
        // Preliminary Objections — independent counter
        reference: "prelim-objections",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        // Reply on Merits — separate counter that restarts from 1
        reference: "merits-reply",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        // Prayer items
        reference: "prayer-items",
        levels: [{
          level: 0, format: LevelFormat.LOWER_LETTER, text: "%1)",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },

  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1440, bottom: 1440, left: 1800, right: 1440 },
      },
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ children: ["Page ", PageNumber.CURRENT], size: 18, font: "Times New Roman" })],
        })],
      }),
    },
    children: [
      // ─── Court Header ───
      centeredBold("IN THE COURT OF SH. ________, CIVIL JUDGE", 24),
      centeredBold("(DISTRICT ________), ________ COURT, DELHI", 22),
      spacer,
      centeredBold("SUIT NO. ________ OF 20__", 24),
      spacer,

      // ─── Parties ───
      // Note the party labels: in the Written Statement, the PLAINTIFF
      // appears first (because the case was initiated by them), and
      // the DEFENDANT appears second.
      legalPara([new TextRun({ text: "X ________", bold: true })]),
      legalPara(
        [new TextRun({ text: "\u2026 PLAINTIFF", bold: true })],
        { alignment: AlignmentType.RIGHT }
      ),

      centeredBold("VERSUS"),
      spacer,

      legalPara([new TextRun({ text: "Y ________", bold: true })]),
      legalPara(
        [new TextRun({ text: "\u2026 DEFENDANT", bold: true })],
        { alignment: AlignmentType.RIGHT }
      ),

      spacer,

      // ─── Title ───
      // Note: "ON BEHALF OF THE DEFENDANT" — this clarifies which
      // party is filing this document (since both parties' names appear above).
      centeredBold("WRITTEN STATEMENT ON BEHALF OF THE DEFENDANT", 26),
      spacer,
      legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      spacer,

      // ═══════════════════════════════════════════════════════════
      // PART 1: PRELIMINARY OBJECTIONS
      // ═══════════════════════════════════════════════════════════
      // These are THRESHOLD defenses. If any one succeeds, the
      // court dismisses the suit without ever considering the merits.

      centeredBold("PRELIMINARY OBJECTIONS:", 24),
      spacer,

      // Limitation — most common preliminary objection
      new Paragraph({
        numbering: { reference: "prelim-objections", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the suit is barred by limitation under Article ________ of the Limitation Act and is liable to be dismissed on this ground alone."
        )],
      }),

      // Jurisdiction
      new Paragraph({
        numbering: { reference: "prelim-objections", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That this Hon'ble Court has no jurisdiction to entertain and try this suit because ________."
        )],
      }),

      // Valuation
      new Paragraph({
        numbering: { reference: "prelim-objections", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the suit has not been properly valued for the purpose of court fees and jurisdiction and is therefore liable to be rejected outrightly."
        )],
      }),

      // No cause of action
      new Paragraph({
        numbering: { reference: "prelim-objections", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That there is absolutely no cause of action in favour of the Plaintiff and against the Defendant. The suit is therefore liable to be rejected on this ground also."
        )],
      }),

      // Non-joinder of parties
      new Paragraph({
        numbering: { reference: "prelim-objections", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the suit is bad for non-joinder of necessary parties, namely ________."
        )],
      }),

      // Res judicata
      new Paragraph({
        numbering: { reference: "prelim-objections", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the suit is barred by the decree dated ________ passed in Suit No. ________ titled Y Versus X by Sh. ________, Sub-Judge, Delhi. The present suit is therefore barred by the principle of res judicata and is liable to be dismissed on this short ground alone."
        )],
      }),

      // Pending prior suit
      new Paragraph({
        numbering: { reference: "prelim-objections", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the suit is liable to be stayed as a previously instituted suit between the parties bearing No. ________ is pending in the Court of Sh. ________, Sub-Judge, Delhi."
        )],
      }),

      // Statutory bar — injunction
      new Paragraph({
        numbering: { reference: "prelim-objections", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Plaintiff's suit for permanent injunction is barred by Section 41(h) of the Specific Relief Act since a more efficacious remedy is available to the Plaintiff."
        )],
      }),

      // Clean hands doctrine
      new Paragraph({
        numbering: { reference: "prelim-objections", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Plaintiff's suit is also barred by Section 41(i) of the Specific Relief Act because he has not approached this Hon'ble Court with clean hands and his conduct has been most unfair, dishonest and tainted with illegality."
        )],
      }),

      // Mandatory notice not given
      new Paragraph({
        numbering: { reference: "prelim-objections", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the suit is liable to be dismissed outrightly as the Plaintiff has not given the mandatory notice under Section 80 of the Code of Civil Procedure."
        )],
      }),

      spacer,

      // ═══════════════════════════════════════════════════════════
      // PART 2: REPLY ON MERITS
      // ═══════════════════════════════════════════════════════════
      // The critical "WITHOUT PREJUDICE" qualifier protects the
      // defendant — answering on merits doesn't waive the preliminary
      // objections raised above.

      centeredBold("ON MERITS:", 24),
      spacer,

      legalPara([
        new TextRun({ text: "Without prejudice to the preliminary objections stated above, ", bold: true, italics: true }),
        new TextRun("the reply on merits, which is without prejudice to one another, is as under:"),
      ]),

      spacer,

      // The five standard response formulae demonstrated below:

      // Type 1: FULL ADMISSION — "is correct and is admitted"
      new Paragraph({
        numbering: { reference: "merits-reply", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun("That the contents of para 1 of the plaint "),
          new TextRun({ text: "is correct and is admitted.", bold: true }),
        ],
      }),

      // Type 2: QUALIFIED DENIAL — "denied for want of knowledge"
      new Paragraph({
        numbering: { reference: "merits-reply", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun("That the contents of para 2 of the plaint are "),
          new TextRun({ text: "denied for want of knowledge.", bold: true }),
          new TextRun(" The Plaintiff be put to the strict proof of each and every allegation made in the para under reply."),
        ],
      }),

      // Type 3: FULL DENIAL — "absolutely incorrect and are denied"
      new Paragraph({
        numbering: { reference: "merits-reply", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun("That the contents of para 3 of the plaint are "),
          new TextRun({ text: "absolutely incorrect and are denied.", bold: true }),
          new TextRun(" It is specifically denied that the Plaintiff is the owner of the suit property. As a matter of fact, Mr. N is the owner of the suit property."),
        ],
      }),

      // Type 4: PARTIAL ADMISSION + PARTIAL DENIAL
      new Paragraph({
        numbering: { reference: "merits-reply", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun("That with respect to para 4 of the plaint, "),
          new TextRun({ text: "it is correct ", bold: true }),
          new TextRun("that the Defendant is in possession of the suit property. "),
          new TextRun({ text: "However, the remaining contents of the para under reply are absolutely incorrect and are denied.", bold: true }),
          new TextRun(" It is specifically denied that ________."),
        ],
      }),

      // Guidance note for remaining paragraphs
      new Paragraph({
        numbering: { reference: "merits-reply", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "(Each and every allegation of the plaint must be replied to specifically depending upon the facts of each case. The above reply on merits is illustrative in nature.)", italics: true }),
        ],
      }),

      // Type 5: NEITHER ADMITTED NOR DENIED — "not admitted"
      new Paragraph({
        numbering: { reference: "merits-reply", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun("That the contents of the relevant para "),
          new TextRun({ text: "is not admitted.", bold: true }),
          new TextRun(" This Hon'ble Court has no jurisdiction to entertain this suit because the subject matter exceeds the pecuniary jurisdiction of this Hon'ble Court."),
        ],
      }),

      spacer,

      // ─── Prayer ───
      // The defendant's prayer is to DISMISS — the mirror opposite
      // of the plaintiff's prayer to DECREE.
      centeredBold("PRAYER:", 26),
      spacer,

      legalPara([
        new TextRun("It is, therefore, most respectfully prayed that this Hon'ble Court may be pleased to:"),
      ]),

      new Paragraph({
        numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "Dismiss the suit of the Plaintiff.", bold: true })],
      }),
      new Paragraph({
        numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("Award costs to the Defendant.")],
      }),
      new Paragraph({
        numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("Pass any other just and equitable order as deemed fit in the interest of justice.")],
      }),

      spacer,
      spacer,

      // ─── Signature Block ───
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [
          new TextRun("Delhi"),
          new TextRun({ text: "\tDefendant", bold: true }),
        ],
      }),
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [
          new TextRun("Dated: ________"),
          new TextRun("\tThrough"),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun("Advocate")],
      }),

      spacer,

      // ─── Verification ───
      // The Written Statement verification has a unique structure:
      // it separately identifies which paragraphs are from personal
      // knowledge, which are from legal advice, and which relate
      // to preliminary objections vs merits.
      centeredBold("VERIFICATION:", 24),
      spacer,

      legalPara([
        new TextRun(
          "Verified at Delhi on ________ day of ________, 20__ that the contents of paras 1 to __ of the Preliminary Objections and paras __ to __ of Reply on Merits are true to my personal knowledge, and those of paras __ to __ of Preliminary Objections and paras __ to __ of Reply on Merits are true and correct on the basis of legal advice received and believed to be true. Last para is prayer to the Hon'ble Court."
        ),
      ]),

      spacer,

      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "DEFENDANT", bold: true })],
      }),

      spacer,
      spacer,

      legalPara(
        [
          new TextRun({ text: "[NOTE: ", bold: true, italics: true }),
          new TextRun({ text: "Counter-claim and set-off can be joined in the Written Statement and the same may be verified and supported by affidavit]", italics: true }),
        ],
        { alignment: AlignmentType.CENTER }
      ),
    ],
  }],
});
