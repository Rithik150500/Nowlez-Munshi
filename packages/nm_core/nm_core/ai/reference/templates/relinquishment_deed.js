/**
 * DEED OF RELINQUISHMENT
 * ────────────────────────
 * Category : Conveyancing — Inheritance Settlement
 * Statute  : Transfer of Property Act, 1882; Indian Stamp Act, 1899
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * The Relinquishment Deed is a uniquely Indian conveyancing instrument
 * used to consolidate inherited property in the hands of one or more
 * co-heirs. To understand its distinct character, it helps to compare
 * it with the other gratuitous transfer in your library, the Gift
 * Deed (Template 15):
 *
 *   GIFT DEED (Template 15) — transfers property the donor ALREADY
 *   OWNS to the donee. The donor must have title before the gift.
 *
 *   RELINQUISHMENT DEED — gives up an UNDIVIDED, INHERITED SHARE
 *   in property held jointly with other co-heirs. The releasor
 *   never had sole ownership; they only had a fractional interest
 *   that arose by operation of law upon the death of the original
 *   owner.
 *
 * THE TYPICAL FACT PATTERN:
 *
 *   The original owner dies intestate (without a will), leaving a
 *   widow and several children. By operation of inheritance law,
 *   each legal heir gets an equal share — for example, if the
 *   deceased left a widow, three daughters, and one son, each gets
 *   one-fifth of the property. The siblings then decide that the
 *   property should remain with the widow (their mother), so they
 *   "relinquish" their respective shares in her favour. After
 *   registration of the deed, the widow becomes the absolute and
 *   sole owner of the entire property.
 *
 * KEY DRAFTING DISTINCTIONS:
 *
 *   1. THE PARTIES ARE CALLED RELEASORS AND RELEASEE — these labels
 *      exist nowhere else in Indian conveyancing. The "releasors"
 *      give up their shares; the "releasee" receives them.
 *
 *   2. THE DEED USES "BY... IN FAVOUR OF" — like the Mortgage Deed
 *      (Template 20), and unlike the bilateral Sale Deed which uses
 *      "BETWEEN... AND". This reflects the essentially unilateral
 *      character of the relinquishment — the releasors act, the
 *      releasee receives.
 *
 *   3. "WITHOUT CONSIDERATION" IS ESSENTIAL — for the deed to be
 *      a true Relinquishment Deed (and to attract the lower stamp
 *      duty applicable to relinquishments), it must be made without
 *      monetary consideration. If money changes hands, the document
 *      will be treated as a sale, not a relinquishment, and stamp
 *      duty will be assessed accordingly.
 *
 *   4. THE FRACTIONAL SHARES MUST BE SET OUT — the deed must state
 *      exactly what share each releasor is giving up and what total
 *      share the releasee acquires after the relinquishment. This
 *      mathematical precision is what makes the deed enforceable
 *      against third parties.
 *
 *   5. NATURAL LOVE AND AFFECTION (or family settlement) — like a
 *      gift deed, the motive must be expressed. Either "natural love
 *      and affection" (for transfers among close relatives) or
 *      "family settlement" (for amicable resolution of inheritance
 *      disputes) is used.
 *
 *   6. STAMP DUTY ADVANTAGE — Relinquishment among co-heirs of
 *      inherited property attracts a much lower stamp duty than
 *      either sale or gift deeds in most Indian states. This makes
 *      relinquishment the preferred mode for consolidating
 *      inherited property.
 *
 * REGISTRATION:
 *
 *   Compulsory under Section 17 of the Registration Act, 1908,
 *   for relinquishment of immovable property worth more than Rs. 100.
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
    config: [{
      reference: "release-clauses",
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
      // ─── Title ───
      centeredBold("DEED OF RELINQUISHMENT", 32),
      spacer, hrule(),

      // ─── Date and Place ───
      legalPara([
        new TextRun({ text: "THIS DEED OF RELINQUISHMENT ", bold: true }),
        new TextRun("is executed at "),
        new TextRun({ text: "Delhi ", bold: true }),
        new TextRun("on this "),
        new TextRun({ text: "________ ", bold: true }),
        new TextRun("day of "),
        new TextRun({ text: "________.", bold: true }),
      ]),

      spacer,

      // ─── Parties ───
      // The "BY... IN FAVOUR OF" pattern signals a unilateral conveyance.
      legalPara([new TextRun({ text: "BY", bold: true, size: 26 })], { alignment: AlignmentType.CENTER }),
      spacer,

      // The Releasors — typically multiple co-heirs giving up their shares.
      // This template shows four releasors, which is realistic for an
      // Indian intestate succession scenario.
      legalPara([
        new TextRun({ text: "1. Smt. ________", bold: true }),
        new TextRun(", wife of Sh. ________, daughter of late Sh. X, Resident of ________"),
      ]),
      spacer,
      legalPara([
        new TextRun({ text: "2. Smt. ________", bold: true }),
        new TextRun(", wife of Sh. ________, daughter of late Sh. X, Resident of ________"),
      ]),
      spacer,
      legalPara([
        new TextRun({ text: "3. Smt. ________", bold: true }),
        new TextRun(", wife of Sh. ________, daughter of late Sh. X, Resident of ________"),
      ]),
      spacer,
      legalPara([
        new TextRun({ text: "4. Sh. ________", bold: true }),
        new TextRun(", son of late Sh. X, Resident of ________, Delhi"),
      ]),

      spacer,
      legalPara([
        new TextRun({ text: "Hereinafter called the ", italics: true }),
        new TextRun({ text: "'RELEASORS'", bold: true, italics: true }),
        new TextRun({ text: ", which expression shall, unless repugnant to the context or meaning hereof, mean and include their heirs, successors, legal representatives and executors", italics: true }),
        new TextRun(" of the "),
        new TextRun({ text: "FIRST PART.", bold: true }),
      ]),

      spacer,
      legalPara([new TextRun({ text: "IN FAVOUR OF", bold: true, size: 26 })], { alignment: AlignmentType.CENTER }),
      spacer,

      // The Releasee — the person who receives all the relinquished
      // shares. In this template it is the widow of the deceased.
      legalPara([
        new TextRun({ text: "Smt. Ragini ________", bold: true }),
        new TextRun(", wife of late Sh. X, Resident of ________, Delhi"),
        new TextRun({ text: ", hereinafter called the ", italics: true }),
        new TextRun({ text: "'RELEASEE'", bold: true, italics: true }),
        new TextRun({ text: ", which expression shall, unless repugnant to the context or meaning hereof, mean and include her heirs, successors, legal representatives and executors", italics: true }),
        new TextRun(" of the "),
        new TextRun({ text: "SECOND PART.", bold: true }),
      ]),

      spacer, hrule(),

      // ─── Recitals ───
      // The recitals must establish: (1) the original owner and his
      // death, (2) how the property is held jointly by the heirs, and
      // (3) the parties' shares by inheritance. This is the foundation
      // for the relinquishment.

      legalPara([
        new TextRun({ text: "WHEREAS ", bold: true }),
        new TextRun("late Sh. X was the sole and absolute owner of property bearing No. ________, Delhi, consisting of a double-storey house built over an area of ________ sq. yds.;"),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS ", bold: true }),
        new TextRun("the said Sh. X expired on ________;"),
      ]),

      // This recital establishes the FRACTIONAL SHARES — the
      // mathematical foundation of the relinquishment. Each releasor
      // and the releasee currently hold one-fifth of the property by
      // operation of inheritance law.
      legalPara([
        new TextRun({ text: "AND WHEREAS ", bold: true }),
        new TextRun("Releasors Nos. 1 to 3 are the daughters of late Sh. X, Releasor No. 4 is the son, and the Releasee is the wife of late Sh. X. Each of them has got "),
        new TextRun({ text: "1/5th share ", bold: true }),
        new TextRun("in the above-mentioned house according to the law of inheritance;"),
      ]),

      // This recital confirms that there are no other claimants —
      // important for ensuring that the relinquishment fully consolidates
      // ownership.
      legalPara([
        new TextRun({ text: "AND WHEREAS ", bold: true }),
        new TextRun("besides the Releasors and the Releasee, there is no other legal heir of the deceased and nobody else is entitled to or claims any right, title or interest in the above-mentioned property;"),
      ]),

      // The MOTIVE clause — establishing that this is gratuitous,
      // not a disguised sale.
      legalPara([
        new TextRun({ text: "AND WHEREAS ", bold: true }),
        new TextRun("the Releasors are desirous of giving up their "),
        new TextRun({ text: "4/5th share ", bold: true }),
        new TextRun("in the above-mentioned property in favour of the Releasee on account of "),
        new TextRun({ text: "natural love and affection and without receipt of any consideration ", bold: true, underline: {} }),
        new TextRun("from her."),
      ]),

      spacer,

      // ─── Testatum & Operative Clauses ───
      centeredBold("NOW THIS DEED OF RELINQUISHMENT WITNESSES AS UNDER:", 22),
      spacer,

      // Clause 1: The actual relinquishment — note that it expressly
      // states "without taking or receiving any consideration." This
      // is what makes it a relinquishment rather than a sale.
      new Paragraph({ numbering: { reference: "release-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That the Releasors, voluntarily, without any outside pressure from any side and in their full senses, "
          ),
          new TextRun({ text: "give up and release ", bold: true }),
          new TextRun(
            "all their right, title and interest in property No. ________, Delhi, along with the land beneath the same measuring ________ sq. yds., in favour of the Releasee, "
          ),
          new TextRun({ text: "without taking or receiving any consideration ", bold: true }),
          new TextRun("from her, to the extent of their "),
          new TextRun({ text: "4/5th share. ", bold: true }),
          new TextRun("Now, the Releasee is the "),
          new TextRun({ text: "absolute and sole owner ", bold: true, underline: {} }),
          new TextRun("of the above-mentioned property (4/5th share of the Releasors PLUS 1/5th share of the Releasee herself, totalling the entire 5/5)."),
        ] }),

      // Clause 2: Releasors' divestiture — they retain nothing
      new Paragraph({ numbering: { reference: "release-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Releasors, their heirs, successors and assigns have been left with no claim, title or interest in the property hereby relinquished, and the Releasee is the sole and absolute owner thereof."
        )] }),

      // Clause 3: Possession — confirming the releasee's existing
      // physical possession (since she was already living in the property)
      new Paragraph({ numbering: { reference: "release-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the possession of the above-mentioned property is exclusively with the Releasee, and the Releasee is entitled to continue the same."
        )] }),

      // Clause 4: Mutation rights — the releasee can now get the
      // revenue records changed to reflect her sole ownership
      new Paragraph({ numbering: { reference: "release-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Releasee is fully entitled to get the above-mentioned property mutated and transferred in her name on the basis of this Deed of Relinquishment."
        )] }),

      // Clause 5: Title deeds
      new Paragraph({ numbering: { reference: "release-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the original sale deed and other relevant papers regarding the above-mentioned property are with the Releasee."
        )] }),

      spacer, hrule(),

      // ─── Testimonium ───
      legalPara([
        new TextRun({ text: "IN WITNESS WHEREOF ", bold: true }),
        new TextRun("the Releasors and the Releasee have set their respective hands to this Deed of Relinquishment at Delhi on the date mentioned above."),
      ]),

      spacer, spacer,

      // ─── Signatures ───
      // Multiple releasors all sign — this is unique to relinquishment
      // and family settlement deeds where many parties are involved.
      legalPara([new TextRun({ text: "RELEASORS:", bold: true, underline: {} })]),
      legalPara([new TextRun("1. Smt. ________ ____________________________ (Signature)")]),
      legalPara([new TextRun("2. Smt. ________ ____________________________ (Signature)")]),
      legalPara([new TextRun("3. Smt. ________ ____________________________ (Signature)")]),
      legalPara([new TextRun("4. Sh.  ________ ____________________________ (Signature)")]),

      spacer,

      legalPara([new TextRun({ text: "RELEASEE:", bold: true, underline: {} })]),
      legalPara([new TextRun("Smt. Ragini ________ ____________________________ (Signature)")]),

      spacer, spacer,

      legalPara([new TextRun({ text: "WITNESSES:", bold: true, underline: {} })]),
      legalPara([new TextRun("1. Mr. P ________, son of ________")]),
      legalPara([new TextRun("   Resident of ________")]),
      spacer,
      legalPara([new TextRun("2. Mr. Q ________, son of ________")]),
      legalPara([new TextRun("   Resident of ________")]),
    ],
  }],
});
