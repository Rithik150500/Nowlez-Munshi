/**
 * FIRST APPEAL UNDER SECTION 19(1) OF THE
 * RIGHT TO INFORMATION ACT, 2005
 * ──────────────────────────────────────────
 * Category : Information Law — Statutory Appeal
 * Forum    : First Appellate Authority of the public authority
 * Statute  : Section 19(1), Right to Information Act, 2005
 * Source   : Standard form used in Indian RTI practice
 *
 * The First Appeal under the Right to Information Act, 2005 is
 * the second template in this batch and it introduces an entirely
 * separate statutory regime that has become one of the most
 * widely used legal instruments in modern India. To grasp where
 * the RTI First Appeal fits, you have to understand the
 * three-tier structure of the RTI process and where the First
 * Appeal sits within that structure.
 *
 * THE THREE-TIER STRUCTURE OF RTI:
 *
 *   The Right to Information Act creates a three-tier
 *   procedural mechanism for the disclosure of information held
 *   by public authorities. The first tier is the original RTI
 *   APPLICATION, which is filed by any citizen with the Public
 *   Information Officer (PIO) of the public authority that
 *   holds the desired information. The PIO is required to
 *   respond to the application within thirty days (or
 *   forty-eight hours in cases involving the life or liberty
 *   of a person). The PIO can either provide the requested
 *   information, refuse to provide it on one of the grounds
 *   specified in Section 8 or Section 9 of the Act, or claim
 *   that the information is not held by the authority.
 *
 *   The second tier, which is what this template covers, is
 *   the FIRST APPEAL under Section 19(1) of the Act. This
 *   appeal lies before a senior officer of the same public
 *   authority who is designated as the First Appellate
 *   Authority. The First Appeal must be filed within thirty
 *   days from the date on which the appellant receives the
 *   PIO's response, or from the expiry of the thirty-day
 *   period within which the PIO was supposed to respond. The
 *   First Appellate Authority is required to dispose of the
 *   appeal within thirty days, extendable to forty-five days
 *   in special circumstances.
 *
 *   The third tier is the SECOND APPEAL under Section 19(3)
 *   of the Act, which lies before the Central Information
 *   Commission for matters relating to central public
 *   authorities or before the State Information Commission for
 *   matters relating to state public authorities. The Second
 *   Appeal must be filed within ninety days from the date of
 *   the First Appellate Authority's order. The Information
 *   Commission has wide powers under Section 19(8) to direct
 *   the disclosure of information, to impose penalties on
 *   defaulting PIOs, and to award compensation to the
 *   appellant.
 *
 * THE GROUNDS FOR A FIRST APPEAL:
 *
 *   Section 19(1) of the Act allows a person to file a First
 *   Appeal in any of the following situations. First, if the
 *   PIO has refused to provide the information that was
 *   requested. Second, if the PIO has provided incomplete,
 *   misleading, or false information. Third, if the PIO has
 *   demanded an excessive fee that is not commensurate with
 *   the actual cost of providing the information. Fourth, if
 *   the PIO has not provided the information within the
 *   prescribed time limit (which is treated as a deemed
 *   refusal under Section 7(2) of the Act). Fifth, if the
 *   PIO has imposed unreasonable conditions on the disclosure
 *   of the information.
 *
 *   When you draft a First Appeal, you should identify the
 *   specific ground or grounds on which you are challenging
 *   the PIO's response and explain how the response falls
 *   short of what the Act requires. The First Appellate
 *   Authority is bound to consider these grounds and to
 *   decide whether the PIO's response was justified under the
 *   Act.
 *
 * THE STATUTORY EXEMPTIONS:
 *
 *   The most heavily contested issue in RTI practice is
 *   whether the requested information falls within one of the
 *   exemptions to disclosure set out in Section 8 of the Act.
 *   Section 8(1) lists ten categories of information that are
 *   exempt from disclosure, including information that would
 *   prejudicially affect the sovereignty and integrity of
 *   India, information that has been forbidden to be published
 *   by a court, information that would cause a breach of
 *   privilege of Parliament or a state legislature, commercial
 *   confidence and trade secrets, information available to a
 *   person in his fiduciary relationship, information received
 *   in confidence from a foreign government, information that
 *   would endanger the life or physical safety of any person,
 *   information that would impede an investigation or
 *   apprehension of offenders, cabinet papers including
 *   records of deliberations, and personal information that
 *   has no relationship with any public activity or interest.
 *
 *   The Supreme Court has held in cases like Central Public
 *   Information Officer v. Subhash Chandra Agarwal that the
 *   exemptions under Section 8 must be construed narrowly and
 *   that even where an exemption applies, the public
 *   authority must consider whether the public interest in
 *   disclosure outweighs the harm protected by the exemption.
 *   This is the so-called "public interest override" under
 *   the proviso to Section 8(1) of the Act.
 *
 * STRUCTURAL FEATURES OF THE TEMPLATE:
 *
 *   First, look at the form of the appeal. The RTI First
 *   Appeal does not have a court header in the same way that
 *   a court pleading does. Instead, it is addressed to the
 *   First Appellate Authority of the public authority and
 *   uses a letter-style format with a clear subject line.
 *
 *   Second, look at the chronology paragraphs at the
 *   beginning. They establish the date of the original RTI
 *   application, the date of the PIO's response (or the
 *   expiry of the thirty-day window), and the date of filing
 *   the First Appeal. This chronology is essential because the
 *   First Appellate Authority must verify that the appeal has
 *   been filed within the prescribed period of thirty days.
 *
 *   Third, look at the grounds paragraphs. They identify the
 *   specific ways in which the PIO's response is alleged to
 *   be inadequate and explain why the appellant is entitled
 *   to the relief sought. The grounds should be specific to
 *   the response received, not generic.
 *
 *   Fourth, look at the prayer. It asks for specific directions
 *   to the PIO to provide the requested information, rather
 *   than for any general relief.
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
      { reference: "rti-paras", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "rti-grounds", levels: [{ level: 0, format: LevelFormat.UPPER_LETTER, text: "%1.",
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
      // ─── Title ───
      centeredBold("FIRST APPEAL UNDER SECTION 19(1) OF THE", 24),
      centeredBold("RIGHT TO INFORMATION ACT, 2005", 24),
      spacer, hrule(),

      // ─── Date and Reference ───
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 120 },
        children: [
          new TextRun("Reference No.: ________"),
          new TextRun("\tDated: ________"),
        ],
      }),

      spacer,

      // ─── Addressee — the First Appellate Authority ───
      legalPara([new TextRun({ text: "To,", bold: true })]),
      legalPara([new TextRun({ text: "The First Appellate Authority", bold: true })]),
      legalPara([new TextRun({ text: "________ (Name of the Public Authority)", bold: true })]),
      legalPara([new TextRun("Office of the ________,")]),
      legalPara([new TextRun("________ (full address of the public authority)")]),

      spacer,

      // ─── Subject ───
      legalPara([
        new TextRun({ text: "Subject: ", bold: true }),
        new TextRun({ text: "FIRST APPEAL UNDER SECTION 19(1) OF THE RIGHT TO INFORMATION ACT, 2005, AGAINST THE RESPONSE / NON-RESPONSE OF THE PUBLIC INFORMATION OFFICER DATED ________ TO THE RTI APPLICATION DATED ________ FILED BY THE APPELLANT.", bold: true }),
      ]),

      spacer,

      legalPara([new TextRun({ text: "Sir/Madam,", bold: true })]),

      spacer,

      // ─── Body ───

      // Para 1: Identification of the appellant
      new Paragraph({ numbering: { reference: "rti-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the appellant, ________ S/o or D/o ________, residing at ________, is a citizen of India and is entitled to invoke the provisions of the Right to Information Act, 2005 (hereinafter referred to as 'the RTI Act')."
        )] }),

      // Para 2: Original RTI application
      new Paragraph({ numbering: { reference: "rti-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That the appellant filed an application under Section 6(1) of the RTI Act dated ________ before the Public Information Officer (PIO) of ________ (name of the public authority), seeking the following information: ________ (set out in detail the information that was originally sought, preferably reproducing the exact wording of the original RTI application). The said RTI application was duly accompanied by the prescribed application fee of Rs. ________. A true copy of the said RTI application is annexed herewith as "
          ),
          new TextRun({ text: "Annexure A-1.", bold: true }),
        ] }),

      // Para 3: PIO's response (or lack thereof)
      new Paragraph({ numbering: { reference: "rti-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That the PIO of the said public authority responded to the appellant's RTI application by letter dated ________ (or has failed to respond within the period of thirty days prescribed under Section 7(1) of the RTI Act). The said response is grossly inadequate and unsatisfactory in the following respects: ________ (state specifically what was wrong with the response, e.g. the PIO has refused to provide the information citing exemption under Section 8(1)(d), or the PIO has provided only partial information, or the PIO has demanded an excessive fee of Rs. ________, or the PIO has remained silent and has not responded at all). A true copy of the said response of the PIO is annexed herewith as "
          ),
          new TextRun({ text: "Annexure A-2.", bold: true }),
        ] }),

      // Para 4: The appellant is aggrieved
      new Paragraph({ numbering: { reference: "rti-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the appellant is aggrieved by the said response / non-response of the PIO and is therefore filing the present appeal under Section 19(1) of the RTI Act for appropriate relief. The appellant submits that the requested information should be provided forthwith and free of cost in view of the lapse of the prescribed time limit by the PIO."
        )] }),

      // Para 5: Limitation
      new Paragraph({ numbering: { reference: "rti-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the present appeal is being filed within the period of thirty days prescribed under Section 19(1) of the RTI Act, computed from the date of receipt of the PIO's response by the appellant on ________ (or from the expiry of the thirty-day period within which the PIO was required to respond)."
        )] }),

      spacer,

      // ─── Grounds of Appeal ───
      new Paragraph({ numbering: { reference: "rti-paras", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "GROUNDS OF APPEAL:", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The appellant respectfully submits the following grounds in support of the present appeal:"
      )]),

      // Ground A
      new Paragraph({ numbering: { reference: "rti-grounds", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because the response of the PIO is contrary to the letter and spirit of the RTI Act, which was enacted to promote transparency and accountability in the working of every public authority and to make the right to information a meaningful right rather than a paper one."
        )] }),

      // Ground B
      new Paragraph({ numbering: { reference: "rti-grounds", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because the information sought by the appellant does not fall within any of the exemptions specified in Section 8 or Section 9 of the RTI Act, and the PIO has wrongly invoked the said exemptions to deny the information."
        )] }),

      // Ground C
      new Paragraph({ numbering: { reference: "rti-grounds", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because even if any of the exemptions under Section 8(1) of the RTI Act were applicable, the public interest in disclosure clearly outweighs the harm protected by the exemption, and the proviso to Section 8(1) of the RTI Act mandates disclosure in such cases (the so-called 'public interest override')."
        )] }),

      // Ground D
      new Paragraph({ numbering: { reference: "rti-grounds", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because the PIO has failed to provide the information within the time limit of thirty days prescribed by Section 7(1) of the RTI Act, and the failure to do so is treated as a deemed refusal under Section 7(2) of the Act, entitling the appellant to receive the information free of cost as provided under Section 7(6)."
        )] }),

      // Ground E
      new Paragraph({ numbering: { reference: "rti-grounds", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because the Supreme Court has consistently held in cases such as Central Public Information Officer v. Subhash Chandra Agarwal that the exemptions under Section 8 of the RTI Act must be construed narrowly and in favour of disclosure rather than secrecy."
        )] }),

      // Ground F
      new Paragraph({ numbering: { reference: "rti-grounds", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "The appellant craves leave of the First Appellate Authority to add, amend or modify any of the above grounds at the time of the hearing of the present appeal."
        )] }),

      spacer,

      // ─── Prayer ───
      centeredBold("PRAYER:", 24),
      spacer,

      legalPara([new TextRun(
        "In view of the facts and circumstances stated above, it is most respectfully prayed that the First Appellate Authority may be pleased to:"
      )]),

      legalPara([
        new TextRun({ text: "(a) ", bold: true }),
        new TextRun({ text: "Allow the present appeal and direct the Public Information Officer to provide the complete information as requested in the original RTI application dated ________ to the appellant within such time as the First Appellate Authority may deem fit;", bold: true }),
      ], { indent: { left: 720 } }),

      legalPara([
        new TextRun({ text: "(b) ", bold: true }),
        new TextRun(
          "Direct that the said information be provided to the appellant free of cost in view of the failure of the PIO to respond within the prescribed time limit, as mandated by Section 7(6) of the RTI Act;"
        ),
      ], { indent: { left: 720 } }),

      legalPara([
        new TextRun({ text: "(c) ", bold: true }),
        new TextRun(
          "Pass such other or further orders as the First Appellate Authority may deem fit and proper in the facts and circumstances of the case."
        ),
      ], { indent: { left: 720 } }),

      spacer, spacer,

      legalPara([new TextRun({ text: "Yours faithfully,", bold: true })]),

      spacer, spacer,

      legalPara([new TextRun("________________________")]),
      legalPara([new TextRun({ text: "(Signature of the Appellant)", bold: true })]),
      legalPara([new TextRun("Name: ________")]),
      legalPara([new TextRun("Address: ________")]),
      legalPara([new TextRun("Phone: ________")]),
      legalPara([new TextRun("Email: ________")]),

      spacer,

      legalPara([new TextRun({ text: "Enclosures:", bold: true, underline: {} })]),
      legalPara([new TextRun("Annexure A-1: Copy of the original RTI application dated ________")]),
      legalPara([new TextRun("Annexure A-2: Copy of the PIO's response (or proof of non-response)")]),
      legalPara([new TextRun("Annexure A-3: Copy of the receipt for the application fee paid")]),

      spacer, spacer,

      legalPara([
        new TextRun({ text: "[NOTE: ", bold: true, italics: true }),
        new TextRun({ text: "The First Appeal must be filed within thirty days from the date of receipt of the PIO's response or from the expiry of the thirty-day period for response. No fee is payable for filing the First Appeal under the RTI Act. The First Appellate Authority is required to dispose of the appeal within thirty days, extendable to forty-five days in special circumstances.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
