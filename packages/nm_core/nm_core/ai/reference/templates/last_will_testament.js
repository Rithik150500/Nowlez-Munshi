/**
 * LAST WILL AND TESTAMENT
 * ────────────────────────
 * Category : Conveyancing — Testamentary Document (Deed Poll)
 * Statute  : Indian Succession Act, 1925 (Section 2(h))
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * A Will is a unique legal document:
 *   - It is a "Deed Poll" (unilateral — executed by one party only)
 *   - Written in the FIRST PERSON (unlike bilateral deeds which use third person)
 *   - No stamp duty required
 *   - Registration is optional (but advisable)
 *   - Requires attestation by at least 2 witnesses
 *   - Takes effect only after the testator's death
 *
 * Structure: Declaration → Family Details (WHEREAS) → Property Schedule
 *            → Bequests → Attestation
 */

const {
  Document, Paragraph, TextRun,
  AlignmentType, TabStopType, TabStopPosition,
  Footer, PageNumber, PageBreak,
  BorderStyle, LevelFormat
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
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: "333333", space: 1 },
    },
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
        // For listing immovable and movable property items
        reference: "property-list",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },

  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 1440, bottom: 1440, left: 1800, right: 1440 },
        },
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ children: ["Page ", PageNumber.CURRENT], size: 18, font: "Times New Roman" }),
              ],
            }),
          ],
        }),
      },
      children: [
        // ─── Title ───
        // Wills traditionally open with "THIS IS THE LAST WILL AND TESTAMENT"
        // because a later will revokes all previous ones
        centeredBold("LAST WILL AND TESTAMENT", 32),
        spacer,
        hrule(),

        // ─── Opening Declaration (First Person — characteristic of Deed Poll) ───
        legalPara([
          new TextRun({ text: "THIS IS THE LAST WILL AND TESTAMENT ", bold: true }),
          new TextRun("of me, "),
          new TextRun({ text: "Sh. XYZ", bold: true }),
          new TextRun(", S/o Sh. ABC, R/o 13, PQS Apartments, Rohini, Delhi-110085, made at "),
          new TextRun({ text: "________ (Place) ", bold: true }),
          new TextRun("on "),
          new TextRun({ text: "________ (Date).", bold: true }),
        ]),

        spacer,

        // Testamentary intention and mental capacity declaration
        legalPara([
          new TextRun(
            "That life is uncertain and this is my last Will by way of which I bequeath voluntarily and out of my own free will in a sound state of mind, my self-acquired properties to the beneficiaries as described hereunder."
          ),
        ]),

        spacer,

        // ─── Family Background (Recitals / WHEREAS) ───
        // Unlike bilateral deeds, the WHEREAS clauses in a will describe
        // the testator's family to establish the context for bequests

        legalPara([
          new TextRun({ text: "WHEREAS ", bold: true }),
          new TextRun(
            "I was married to ________ (name) on ________ (date) and we have been living happily for ________ years and out of the wedlock we have two children: a son ________ (name), aged ________, and a daughter ________ (name), aged ________."
          ),
        ]),

        legalPara([
          new TextRun({ text: "AND WHEREAS ", bold: true }),
          new TextRun(
            "my son ________ is happily married to ________ (name) and out of the wedlock, they are blessed with one child ________ (name), aged ________, and are residing at ________ (address)."
          ),
        ]),

        legalPara([
          new TextRun({ text: "AND WHEREAS ", bold: true }),
          new TextRun(
            "my daughter ________ is married to ________ (name) and out of the wedlock, they are blessed with one child ________ (name), aged ________, and are residing at ________ (address)."
          ),
        ]),

        spacer,

        legalPara([
          new TextRun(
            "In my lifetime I have built my movable and immovable properties out of my own sources and, therefore, I am the absolute owner of the properties described hereunder."
          ),
        ]),

        spacer,

        // ─── Property Schedule ───
        // The schedule precisely identifies what the testator owns

        centeredBold("IMMOVABLE PROPERTY", 26),
        spacer,

        new Paragraph({
          numbering: { reference: "property-list", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun("Residential property bearing No. ________, admeasuring ________, situated at ________."),
          ],
        }),

        new Paragraph({
          numbering: { reference: "property-list", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun("Residential property bearing No. ________, admeasuring ________, situated at ________."),
          ],
        }),

        legalPara([
          new TextRun({ text: "(hereinafter collectively called the ", italics: true }),
          new TextRun({ text: "'Immovable Property'", bold: true, italics: true }),
          new TextRun({ text: ")", italics: true }),
        ]),

        spacer,

        centeredBold("MOVABLE PROPERTY", 26),
        spacer,

        legalPara([new TextRun("All household and personal belongings at ________.")]),
        legalPara([new TextRun("Fixed Deposits: ________")]),
        legalPara([new TextRun("Gold and Jewellery: ________")]),
        legalPara([new TextRun("Bank Accounts: ________")]),

        legalPara([
          new TextRun({ text: "(hereinafter collectively called the ", italics: true }),
          new TextRun({ text: "'Movable Property'", bold: true, italics: true }),
          new TextRun({ text: ")", italics: true }),
        ]),

        spacer,
        hrule(),

        // ─── Bequests (the operative testamentary dispositions) ───
        // This is the heart of the will — who gets what

        centeredBold("BEQUESTS", 26),
        spacer,

        legalPara([
          new TextRun({ text: "I HEREBY WISH ", bold: true }),
          new TextRun(
            "that my above-mentioned property should devolve in the following manner:"
          ),
        ]),

        spacer,

        legalPara([
          new TextRun(
            "That my property bearing No. ________ would devolve on to my wife ________ absolutely and unconditionally and she shall deal with the said property in any manner as she likes, and my children will have no claim on this property whatsoever."
          ),
        ]),

        legalPara([
          new TextRun(
            "That my property bearing No. ________ and all my movable property would devolve on to my son ________ absolutely and unconditionally, and none of my legal heirs shall have any claims on this property whatsoever."
          ),
        ]),

        legalPara([
          new TextRun(
            "That my daughter is happily married and is well settled in her matrimonial home and she does not need any financial support for survival after my death."
          ),
        ]),

        spacer,

        // ─── Final declarations ───
        legalPara([
          new TextRun(
            "That my present Will is drafted in my presence and upon my instructions and the contents of my Will have been read out to me in my own vernacular."
          ),
        ]),

        legalPara([
          new TextRun({ text: "I declare the contents of this Will to be my last Will arrived at by me in a sound state of mind.", bold: true }),
        ]),

        spacer,
        hrule(),

        // ─── Testimonium ───
        // In a will, the testator must sign in presence of witnesses,
        // and the witnesses must attest in presence of the testator

        legalPara([
          new TextRun({ text: "IN WITNESS WHEREOF ", bold: true }),
          new TextRun(
            "I, ________, have signed this Will hereunder on this ________ day of ________, 20__ at ________ in the presence of the following witnesses who are also attesting this Will in my presence and at my request."
          ),
        ]),

        spacer,
        spacer,

        // ─── Testator Signature ───
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { before: 400 },
          children: [new TextRun("____________________")],
        }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "TESTATOR", bold: true })],
        }),

        spacer,
        spacer,

        // ─── Attestation by Witnesses ───
        legalPara([
          new TextRun(
            "Signed by the above-named Testator in our presence at the same time and each of us has in the presence of the Testator signed our name hereunder as an attesting witness:"
          ),
        ]),

        spacer,
        spacer,

        // Witness 1
        legalPara([new TextRun({ text: "WITNESS 1:", bold: true, underline: {} })]),
        legalPara([new TextRun("Name: ________")]),
        legalPara([new TextRun("Father's Name: ________")]),
        legalPara([new TextRun("Address: ________")]),
        legalPara([new TextRun("Signature: ________")]),

        spacer,

        // Witness 2
        legalPara([new TextRun({ text: "WITNESS 2:", bold: true, underline: {} })]),
        legalPara([new TextRun("Name: ________")]),
        legalPara([new TextRun("Father's Name: ________")]),
        legalPara([new TextRun("Address: ________")]),
        legalPara([new TextRun("Signature: ________")]),
      ],
    },
  ],
});
