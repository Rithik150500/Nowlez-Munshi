/**
 * PETITION FOR GRANT OF PROBATE
 * ───────────────────────────────
 * Category : Succession Law — Pleading under Indian Succession Act, 1925
 * Court    : High Court of Delhi (Testamentary & Intestate Jurisdiction)
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * PROBATE is the court's certification that a Will is valid. It empowers
 * the named "Executor" in the Will to administer the deceased's estate.
 * (Compare with "Letters of Administration" — which is sought when
 * the deceased left a will but did NOT name an executor, or died intestate.)
 *
 * This petition is structurally unique because:
 *   - The case title uses "IN THE MATTER OF: THE ESTATE OF..." (not
 *     a standard plaintiff-vs-defendant format)
 *   - It requires THREE separate verifications:
 *     1. By the Petitioner (executor)
 *     2. By Witness No. 1 to the Will
 *     3. By Witness No. 2 to the Will
 *   - It must include a Schedule of Assets (Schedule-A)
 *   - ALL legal heirs must be made respondents (even those who benefit
 *     under the will), along with the State
 *
 * Under the Indian Succession Act, 1925:
 *   Section 2(h) — defines "Will"
 *   Section 213  — makes probate necessary for executors (in some cases)
 *   Section 222  — probate has effect over entire estate
 */

const {
  Document, Paragraph, TextRun,
  AlignmentType, TabStopType, TabStopPosition,
  Footer, PageNumber, PageBreak, LevelFormat, BorderStyle
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
        reference: "probate-paras",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        // For listing legal heirs
        reference: "heirs-list",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "(%1)",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1080, hanging: 360 } } },
        }],
      },
      {
        // For prayer items
        reference: "prayer-items",
        levels: [{
          level: 0, format: LevelFormat.LOWER_LETTER, text: "%1.",
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
        // ─── Court Header ───
        // Probate petitions go to the HIGH COURT under its special
        // "Testamentary and Intestate Jurisdiction"
        centeredBold("IN THE HIGH COURT OF DELHI AT NEW DELHI", 26),
        centeredBold("(TESTAMENTARY & INTESTATE JURISDICTION)", 22),
        spacer,
        centeredBold("PROBATE CASE NO. ________ OF 20__", 24),
        spacer,

        // ─── Case Title ───
        // The unique "IN THE MATTER OF: THE ESTATE OF..." format
        // reflects that probate is about the deceased's estate, not
        // an adversarial dispute between living parties.
        legalPara([
          new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} }),
        ], { alignment: AlignmentType.CENTER }),

        centeredBold("THE ESTATE OF LATE SH. ________ (DECEASED)", 24),
        spacer,

        legalPara([
          new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} }),
        ], { alignment: AlignmentType.CENTER }),

        // Petitioner (the named Executor in the Will)
        legalPara([new TextRun({ text: "X ________", bold: true })]),
        legalPara([new TextRun("S/o ________")]),
        legalPara([new TextRun("R/o ________")]),
        legalPara(
          [new TextRun({ text: "\u2026 APPLICANT / PETITIONER", bold: true })],
          { alignment: AlignmentType.RIGHT }
        ),

        centeredBold("VERSUS"),
        spacer,

        // Respondents: State + all legal heirs
        legalPara([
          new TextRun({ text: "1. ", bold: true }),
          new TextRun("State of ________"),
        ]),
        spacer,
        legalPara([
          new TextRun({ text: "2. ", bold: true }),
          new TextRun("Y ________"),
        ]),
        legalPara([new TextRun("   S/o ________")]),
        legalPara([new TextRun("   R/o ________")]),
        legalPara(
          [new TextRun({ text: "\u2026 RESPONDENTS", bold: true })],
          { alignment: AlignmentType.RIGHT }
        ),

        spacer,

        // ─── Title ───
        centeredBold("PETITION FOR GRANT OF PROBATE", 28),
        spacer,

        // ─── Addressee ───
        legalPara([new TextRun({ text: "To,", bold: true })]),
        legalPara([new TextRun("The Hon'ble Mr. Justice ________, Chief Justice")]),
        legalPara([new TextRun("And his Companion Justices of this Hon'ble Court")]),
        spacer,

        legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
          { alignment: AlignmentType.CENTER }),
        spacer,

        // ─── Body ───
        // The petition must establish: (1) death and domicile, (2) existence
        // and validity of will, (3) attestation, (4) bequests, (5) legal
        // heirs, (6) assets, (7) executor's standing, and (8) jurisdiction.

        new Paragraph({
          numbering: { reference: "probate-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the present petition is filed by the Petitioner for the grant of probate in respect of the estate of the deceased Late Sh. ________, S/o ________. At the time of his death on ________, the deceased was residing at ________."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "probate-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That during his lifetime, before his death, the deceased had bequeathed his estate in the manner specified in his last and final testament / will dated ________, which was made by him in a sound state of mind. The Original Will is annexed as "
            ),
            new TextRun({ text: "Annexure A.", bold: true }),
          ],
        }),

        new Paragraph({
          numbering: { reference: "probate-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the said Will was duly made by the deceased in the presence of the witnesses whose names, addresses and signatures appear at the end of the Will."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "probate-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That by virtue of the said Will, the deceased has bequeathed his estate as follows: ________ (mention how the deceased has bequeathed his estate, the name, relation and the individual share of each beneficiary, and also mention whether he has excluded any of his legal heirs from the Will)."
            ),
          ],
        }),

        // Para 5: List of all relatives — a mandatory requirement
        new Paragraph({
          numbering: { reference: "probate-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That a description of the relatives of the deceased and their respective residences are given below:"
            ),
          ],
        }),

        // Heirs listing
        new Paragraph({
          numbering: { reference: "heirs-list", level: 0 },
          spacing: { after: 80, line: 360 },
          children: [new TextRun("Son (Petitioner)")],
        }),
        new Paragraph({
          numbering: { reference: "heirs-list", level: 0 },
          spacing: { after: 80, line: 360 },
          children: [new TextRun("Brother, Sri ________, resident of ________")],
        }),
        new Paragraph({
          numbering: { reference: "heirs-list", level: 0 },
          spacing: { after: 80, line: 360 },
          children: [new TextRun("Widow, Smt. ________, resident of ________")],
        }),
        new Paragraph({
          numbering: { reference: "heirs-list", level: 0 },
          spacing: { after: 80, line: 360 },
          children: [new TextRun("Mother, Smt. ________, resident of ________")],
        }),
        new Paragraph({
          numbering: { reference: "heirs-list", level: 0 },
          spacing: { after: 120, line: 360 },
          children: [new TextRun("Daughter, Smt. ________, resident of ________")],
        }),

        legalPara([
          new TextRun({ text: "(All the relatives shall be made as Respondents)", italics: true, bold: true }),
        ], { indent: { left: 720 } }),

        spacer,

        // Remaining paragraphs
        new Paragraph({
          numbering: { reference: "probate-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the amount of the assets of the deceased which are likely to come to the hands of the Petitioner are detailed in "
            ),
            new TextRun({ text: "Schedule-A", bold: true }),
            new TextRun(
              ", which is annexed with the present petition. The Petitioner has set forth all the assets and liabilities with complete particulars of the estate of the deceased as the Petitioner could ascertain as of now with the best of his efforts."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "probate-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That so far as your Petitioner has been able to ascertain and is aware, there are no properties and effects other than those specified in the affidavit of assets."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "probate-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the Petitioner undertakes, in case any other properties and effects come to his hands, to pay the Court-fees payable in respect thereof."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "probate-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That there is no legal impediment to the grant of probate in favour of the Petitioner."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "probate-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the Petitioner undertakes to execute the Will of the Testator as per his wishes and to take all steps as per his wishes, desires and directions as contained in the Will annexed."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "probate-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the Petitioner is claiming the probate of the Will and has filed this petition being the named Executor in the Will."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "probate-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That to the best of the belief of the Petitioner, no petition has been made to any other court for the purpose of the said Will."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "probate-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the deceased died and had a fixed abode within the territorial jurisdiction of this Hon'ble Court. The immovable property is also situated within the jurisdiction of this Hon'ble Court and therefore this Hon'ble Court has the jurisdiction to entertain, try and decide this petition."
            ),
          ],
        }),

        new Paragraph({
          numbering: { reference: "probate-paras", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "That the requisite court fee of Rs. ________ has been affixed on this petition."
            ),
          ],
        }),

        spacer,

        // ─── Prayer ───
        centeredBold("PRAYER:", 26),
        spacer,

        legalPara([
          new TextRun("It is, therefore, most humbly prayed that:"),
        ]),

        new Paragraph({
          numbering: { reference: "prayer-items", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun("The probate of the Will be granted to the Petitioner."),
          ],
        }),

        new Paragraph({
          numbering: { reference: "prayer-items", level: 0 },
          spacing: { after: 120, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun(
              "Any other or further relief which this Hon'ble Court may deem fit, just, proper and necessary may also be granted in favour of the Petitioner."
            ),
          ],
        }),

        spacer,
        spacer,

        // ─── Signature Block ───
        new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun("Place: ________"),
            new TextRun("\tPetitioner"),
          ],
        }),
        new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun("Date: ________"),
            new TextRun("\tThrough"),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun("Advocate")],
        }),

        // ─── PAGE BREAK before verifications ───
        new Paragraph({ children: [new PageBreak()] }),

        // ─── TRIPLE VERIFICATION ───
        // This is what makes probate petitions structurally unique:
        // the executor AND both witnesses to the Will must each provide
        // a separate verification affirming the Will's authenticity.

        // Verification 1: By the Petitioner (Executor)
        centeredBold("VERIFICATION BY THE PETITIONER", 24),
        spacer,
        legalPara([
          new TextRun(
            "I, ________, S/o ________, R/o ________, the Petitioner in the above petition, declare that what is stated herein is true to the best of my information and belief. The last para is the prayer to this Hon'ble Court."
          ),
        ]),
        legalPara([
          new TextRun("Verified at New Delhi on this ________ day of ________ 20__."),
        ]),
        spacer,
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "PETITIONER", bold: true })],
        }),

        spacer,
        hrule(),

        // Verification 2: By Witness No. 1 to the Will
        centeredBold("VERIFICATION BY WITNESS NO. 1", 24),
        spacer,
        legalPara([
          new TextRun(
            "I, ________, S/o ________, R/o ________, one of the witnesses to the last Will and Testament of the Testator mentioned in the above petition, declare that I was present and saw the said Testator affix his signature on the Will annexed to the above petition and acknowledge the writing annexed to the above petition to be his Last Will and Testament in my presence."
          ),
        ]),
        spacer,
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "WITNESS NO. 1", bold: true })],
        }),

        spacer,
        hrule(),

        // Verification 3: By Witness No. 2 to the Will
        centeredBold("VERIFICATION BY WITNESS NO. 2", 24),
        spacer,
        legalPara([
          new TextRun(
            "I, ________, W/o ________, R/o ________, one of the witnesses to the last Will and Testament of the Testator mentioned in the above petition, declare that I was present and saw the said Testator affix his signature on the Will annexed to the above petition and acknowledge the writing annexed to the above petition to be his Last Will and Testament in my presence."
          ),
        ]),
        spacer,
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "WITNESS NO. 2", bold: true })],
        }),

        spacer,
        spacer,

        legalPara(
          [
            new TextRun({ text: "[NOTE: ", bold: true, italics: true }),
            new TextRun({ text: "To be supported by an affidavit]", italics: true }),
          ],
          { alignment: AlignmentType.CENTER }
        ),
      ],
    },
  ],
});
