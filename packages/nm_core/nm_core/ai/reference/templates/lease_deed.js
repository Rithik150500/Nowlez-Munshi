/**
 * LEASE DEED
 * ───────────
 * Category : Conveyancing — Bilateral Indenture Deed
 * Statute  : Transfer of Property Act, 1882 (Sections 105–111)
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * A Lease Deed is the CLASSIC example of an "indenture" — a bilateral
 * deed executed by BOTH parties (Lessor and Lessee). This contrasts with
 * "Deed Poll" documents (Will, Power of Attorney) which are unilateral.
 *
 * Structural hallmarks of a Lease Deed:
 *   - Opens with "THIS LEASE DEED is made and executed..." (third person)
 *   - DUAL party descriptions with "FIRST PART" / "SECOND PART"
 *   - WHEREAS recitals establishing ownership and intent to lease
 *   - Testatum: "NOW THIS AGREEMENT WITNESSETH AS UNDER"
 *   - SEPARATE covenant sections:
 *     (a) Lessee's covenants (obligations of the tenant)
 *     (b) Lessor's covenants (obligations of the landlord)
 *     (c) Mutual declarations (agreed by both)
 *   - Dual signatures (both parties sign)
 *
 * This is the most complex conveyancing template because it has THREE
 * separate enumerated lists (Lessee covenants, Lessor covenants, Mutual
 * declarations), each requiring independent numbering.
 *
 * Section 105 TPA defines a lease as a transfer of the right to enjoy
 * immovable property for a certain time in consideration of rent.
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

function hrule() {
  return new Paragraph({
    spacing: { after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "333333", space: 1 } },
    children: [],
  });
}

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
        // Main operative clauses
        reference: "lease-clauses",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        // Lessee's sub-covenants (roman numerals under clause 6)
        reference: "lessee-covenants",
        levels: [{
          level: 0, format: LevelFormat.LOWER_ROMAN, text: "(%1)",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1080, hanging: 400 } } },
        }],
      },
      {
        // Lessor's sub-covenants (roman numerals under clause 7)
        reference: "lessor-covenants",
        levels: [{
          level: 0, format: LevelFormat.LOWER_ROMAN, text: "(%1)",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1080, hanging: 400 } } },
        }],
      },
      {
        // Mutual declarations (roman numerals under clause 8)
        reference: "mutual-declarations",
        levels: [{
          level: 0, format: LevelFormat.LOWER_ROMAN, text: "(%1)",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1080, hanging: 400 } } },
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
      // ─── Title ───
      centeredBold("LEASE DEED", 32),
      spacer,
      hrule(),

      // ─── Opening / Date & Place ───
      // Indenture deeds use third person: "THIS LEASE DEED is made..."
      // (contrast with Deed Poll which uses first person: "I do hereby...")
      legalPara([
        new TextRun({ text: "THIS LEASE DEED ", bold: true }),
        new TextRun("is made and executed at "),
        new TextRun({ text: "Delhi ", bold: true }),
        new TextRun("on "),
        new TextRun({ text: "________ (Date)", bold: true }),
      ]),

      spacer,

      // ─── Parties ───
      // Both parties are fully described with the standard
      // "hereinafter referred to as" label convention.

      legalPara([new TextRun({ text: "BETWEEN", bold: true, size: 26 })], { alignment: AlignmentType.CENTER }),
      spacer,

      // LESSOR (Landlord) — Party of the First Part
      legalPara([
        new TextRun({ text: "Smt. ________", bold: true }),
        new TextRun(", W/o Sh. ________, R/o ________"),
        new TextRun({ text: " (hereinafter referred to as the ", italics: true }),
        new TextRun({ text: "'LESSOR'", bold: true, italics: true }),
        new TextRun({ text: ", which expression shall, unless excluded or repugnant to the context, be deemed to include legal heirs, successors, executors, administrators, representatives and assigns)", italics: true }),
        new TextRun(" of the "),
        new TextRun({ text: "FIRST PART.", bold: true }),
      ]),

      spacer,
      legalPara([new TextRun({ text: "AND", bold: true, size: 26 })], { alignment: AlignmentType.CENTER }),
      spacer,

      // LESSEE (Tenant) — Party of the Second Part
      legalPara([
        new TextRun({ text: "M/s. ________", bold: true }),
        new TextRun(", a company having its registered office at ________, through its Director "),
        new TextRun({ text: "Mr. ________", bold: true }),
        new TextRun({ text: " (hereinafter referred to as the ", italics: true }),
        new TextRun({ text: "'LESSEE'", bold: true, italics: true }),
        new TextRun({ text: ", which expression shall, unless excluded or repugnant to the context, include successors, successors-in-interest and assigns)", italics: true }),
        new TextRun(" of the "),
        new TextRun({ text: "SECOND PART.", bold: true }),
      ]),

      spacer,
      hrule(),

      // ─── Recitals (WHEREAS) ───
      legalPara([
        new TextRun({ text: "WHEREAS ", bold: true }),
        new TextRun("the Lessor has represented to the Lessee that she is the owner/landlady of the ________ portion of the construction at ________, admeasuring ________ sq. ft. approximate covered area in the said premises and is desirous of letting out the same (hereinafter referred to as "),
        new TextRun({ text: "'the demised premises'", bold: true }),
        new TextRun(")."),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS ", bold: true }),
        new TextRun("the Lessee has offered to take the demised premises on lease and the Lessor has agreed to let out the same on the terms and conditions hereinafter specified."),
      ]),

      spacer,

      // ─── Testatum ───
      centeredBold("NOW THIS AGREEMENT WITNESSETH AS UNDER:", 22),
      spacer,

      // ─── Main Operative Clauses ───

      // Clause 1-5: Core commercial terms (rent, tenure, termination, renewal, deposit)
      new Paragraph({
        numbering: { reference: "lease-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Lessor hereby conveys to the Lessee the ________ portion of the said premises admeasuring ________ sq. ft. approx. for a period of ________ months with effect from ________ at a monthly rent of Rs. ________ exclusive of electricity, water charges, and actual bills of telephone / fax whenever installed in the demised premises."
        )],
      }),

      new Paragraph({
        numbering: { reference: "lease-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Lease will be for an initial period of ________ months with effect from ________. The rent will be increased by ________% of the rent payable per annum immediately after expiry of every 12 months."
        )],
      }),

      new Paragraph({
        numbering: { reference: "lease-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That both the Lessor and the Lessee have the right to terminate the Lease even before the expiry of the Lease period, by giving ________ months written notice."
        )],
      }),

      new Paragraph({
        numbering: { reference: "lease-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Lessor shall have the option to renew the Lease for a further period of ________ years at such terms and conditions as laid out by the Lessor."
        )],
      }),

      new Paragraph({
        numbering: { reference: "lease-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That on the date of execution of this Lease Deed, the Lessee has paid a sum of Rs. ________ vide pay order No. ________ dated ________ drawn on ________ as security deposit, which will be kept by the Lessor for the due performance of the terms and conditions of this Lease, free of interest. On termination of the Lease, the Lessor shall refund the security deposit / unadjusted advance rent, if any."
        )],
      }),

      spacer,

      // ─── Clause 6: LESSEE'S COVENANTS ───
      // These are the tenant's obligations — the "Lessee covenants with Lessor"
      new Paragraph({
        numbering: { reference: "lease-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "The Lessee covenants with the Lessor as under:", bold: true })],
      }),

      new Paragraph({
        numbering: { reference: "lessee-covenants", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That the Lessee agrees to pay the monthly rent mentioned above on or before the 7th day of every month.")],
      }),
      new Paragraph({
        numbering: { reference: "lessee-covenants", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That the Lessee agrees to carry out minor repairs in electrical and sanitary installations, but major structural repairs will be done by the Lessor.")],
      }),
      new Paragraph({
        numbering: { reference: "lessee-covenants", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That the Lessee shall give vacant possession of the premises to the Lessor after the expiry of the Lease period.")],
      }),
      new Paragraph({
        numbering: { reference: "lessee-covenants", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That the Lessee shall duly comply with all rules and regulations of local authorities with regard to the use of the premises.")],
      }),
      new Paragraph({
        numbering: { reference: "lessee-covenants", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That the Lessee shall pay the electricity charges in accordance with the bills at rates determined by the local distribution company.")],
      }),
      new Paragraph({
        numbering: { reference: "lessee-covenants", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That the demised premises have been let out to the Lessee for authorised use only.")],
      }),
      new Paragraph({
        numbering: { reference: "lessee-covenants", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That the Lessee shall not make any alteration of permanent nature within the premises without the written consent of the Lessor.")],
      }),

      spacer,

      // ─── Clause 7: LESSOR'S COVENANTS ───
      // The landlord's counter-obligations — a separate numbering reference
      new Paragraph({
        numbering: { reference: "lease-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "The Lessor hereby covenants with the Lessee as follows:", bold: true })],
      }),

      new Paragraph({
        numbering: { reference: "lessor-covenants", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That the Lessor has good right, full power and absolute authority to lease the demised premises to the Lessee in the manner herein contained.")],
      }),
      new Paragraph({
        numbering: { reference: "lessor-covenants", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That the Lessor shall not interfere with the peaceful enjoyment of the property by the Lessee whether directly or indirectly.")],
      }),
      new Paragraph({
        numbering: { reference: "lessor-covenants", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That the Lessor shall pay the taxes, whether Municipal or otherwise, and failing to pay any such amount, the Lessee shall be entitled to pay the same on behalf of the Lessor and to deduct the amount so paid from the rent payable.")],
      }),
      new Paragraph({
        numbering: { reference: "lessor-covenants", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That the Lessor shall comply, at his own cost, with all requirements and regulations of the Municipal or other lawful authority concerning the demised premises.")],
      }),

      spacer,

      // ─── Clause 8: MUTUAL DECLARATIONS ───
      // Agreed by both parties — uses yet another independent numbering ref
      new Paragraph({
        numbering: { reference: "lease-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "It is hereby mutually agreed and declared by the parties hereto as follows:", bold: true })],
      }),

      new Paragraph({
        numbering: { reference: "mutual-declarations", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("In the event of the demised premises being destroyed or damaged by fire, earthquake, flood, war, or any act of God, this Lease shall, at the option of the Lessee, be terminated.")],
      }),
      new Paragraph({
        numbering: { reference: "mutual-declarations", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That in the event of any dispute arising out of this deed, the matter will be referred to an Arbitrator to be appointed by consent of both the parties and his decision will be binding on both the parties.")],
      }),
      new Paragraph({
        numbering: { reference: "mutual-declarations", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That the parties have specifically agreed that, considering the location, accommodation, and condition of the said property, the lease rent is fair rent and in consonance with the prevailing market rates.")],
      }),
      new Paragraph({
        numbering: { reference: "mutual-declarations", level: 0 },
        spacing: { after: 100, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("That the Lease shall automatically come to an end on the expiry of the Lease period.")],
      }),
      new Paragraph({
        numbering: { reference: "mutual-declarations", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("The cost of preparation of the original Lease and duplicate thereof and stamps and registration fee shall be borne and paid by the Lessee.")],
      }),

      spacer,
      hrule(),

      // ─── Testimonium ───
      legalPara([
        new TextRun({ text: "IN WITNESS WHEREOF, ", bold: true }),
        new TextRun("these presents have been executed by the parties hereto on the day, month and year first mentioned herein above in the presence of witnesses."),
      ]),

      spacer,
      spacer,

      // ─── Dual Signatures ───
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 60 },
        children: [
          new TextRun({ text: "LESSOR", bold: true }),
          new TextRun({ text: "\tLESSEE", bold: true }),
        ],
      }),

      spacer,
      spacer,

      legalPara([new TextRun({ text: "WITNESSES:", bold: true, underline: {} })]),
      spacer,
      legalPara([new TextRun("(1) Name: ________")]),
      legalPara([new TextRun("    Signature: ________")]),
      spacer,
      legalPara([new TextRun("(2) Name: ________")]),
      legalPara([new TextRun("    Signature: ________")]),

      spacer,

      legalPara([
        new TextRun({ text: "Note: ", bold: true, italics: true }),
        new TextRun({ text: "Read Sections 105 to 111 of the Transfer of Property Act, 1882.", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
