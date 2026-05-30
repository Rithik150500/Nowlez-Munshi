/**
 * SPECIAL LEAVE PETITION (CRIMINAL) UNDER ARTICLE 136
 * ──────────────────────────────────────────────────────
 * Category : Constitutional Law — Supreme Court Criminal Appellate Practice
 * Court    : Supreme Court of India
 * Statute  : Article 136 of the Constitution of India read with
 *            Order XXII Rule 2(1), Supreme Court Rules, 2013
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * This template is the criminal counterpart of Template 23, which is
 * the Special Leave Petition in civil matters. Reading the two
 * together is the best way to understand how the same constitutional
 * power under Article 136 produces meaningfully different drafting
 * depending on whether the matter being appealed is civil or criminal.
 *
 * THE COMMON FOUNDATION:
 *
 *   Article 136 of the Constitution vests the Supreme Court with
 *   discretionary power to grant special leave to appeal from any
 *   judgment, decree, determination or order of any court or
 *   tribunal in India (other than military tribunals). The power
 *   is exactly the same whether the underlying matter is civil or
 *   criminal. What changes is the procedural rules under the
 *   Supreme Court Rules, 2013, and the substantive content of the
 *   petition itself.
 *
 * KEY DIFFERENCES FROM THE CIVIL SLP (TEMPLATE 23):
 *
 *   1. JURISDICTION — Template 23 invokes "Civil Appellate
 *      Jurisdiction" of the Supreme Court. This template invokes
 *      "Criminal Appellate Jurisdiction." That single phrase
 *      determines which set of rules and which judicial registry
 *      will handle the petition.
 *
 *   2. SUPREME COURT RULES REFERENCE — Template 23 cites Order XXI
 *      Rule 3(1)(a) of the Supreme Court Rules, 2013. This template
 *      cites Order XXII Rule 2(1). Order XXII governs criminal
 *      appellate practice. This is not just a stylistic distinction;
 *      filing under the wrong order will get the petition returned
 *      by the registry.
 *
 *   3. PARTY LABELS — In a civil SLP, the parties are simply
 *      "Petitioner" and "Respondent." In a criminal SLP, the labels
 *      include the original criminal status of the parties:
 *      "Petitioner / Original Accused" and "Respondent" (which is
 *      typically the State). There may also be a "Proforma
 *      Respondent / Original Accused" — this is a co-accused who
 *      is named not because the petitioner has a complaint against
 *      him, but because he was a party to the proceedings below
 *      and the Supreme Court Rules require all original parties
 *      to be impleaded.
 *
 *   4. THE BRIEF FACTS SECTION — The criminal SLP has a distinctive
 *      "BRIEF FACTS" paragraph that summarises the entire criminal
 *      case in narrative form: when the offence occurred, who the
 *      victim was, who reported it, how the investigation
 *      unfolded, what charges were framed, and what the trial court
 *      ultimately held. This narrative is essential because the
 *      Supreme Court at the leave stage needs to understand the
 *      whole story quickly. A civil SLP has nothing equivalent
 *      because civil disputes do not turn on a sequence of events
 *      in the same way.
 *
 *   5. THE TRIAL COURT JUDGMENT IS ALWAYS ANNEXED — In a criminal
 *      SLP, the Trial Court judgment is annexed as Annexure P-1 by
 *      convention. The Supreme Court wants to see how the case was
 *      decided at every stage, not just the High Court order being
 *      challenged.
 *
 *   6. THE GROUNDS FOCUS ON EVIDENTIARY AND CRIMINAL LAW POINTS —
 *      Civil SLP grounds tend to focus on questions of contractual
 *      interpretation, statutory construction, or jurisdiction.
 *      Criminal SLP grounds focus on issues like the credibility
 *      of witnesses, suppression of evidence, the burden of proof,
 *      and circumstantial evidence. This template illustrates
 *      typical criminal grounds.
 *
 *   7. NO POSITION-OF-PARTIES TABLE — Template 23 (Civil) uses a
 *      formal position-of-parties table because civil parties may
 *      have switched roles between courts. In criminal cases, the
 *      State is always the prosecutor and the accused is always
 *      the accused, so the table is unnecessary.
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
      { reference: "slp-paras", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      // Upper-case letters for grounds — characteristic of criminal SLP drafting
      { reference: "slp-grounds", levels: [{ level: 0, format: LevelFormat.UPPER_LETTER, text: "%1.",
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
      // Notice the difference from Template 23: this petition invokes
      // CRIMINAL Appellate Jurisdiction and cites Order XXII (not XXI).
      centeredBold("IN THE SUPREME COURT OF INDIA", 28),
      centeredBold("(CRIMINAL APPELLATE JURISDICTION)", 22),
      centeredBold("ORDER XXII, RULE 2(1), SUPREME COURT RULES, 2013", 20),
      centeredBold("(Under Article 136 of the Constitution of India)", 22),
      spacer,
      centeredBold("SPECIAL LEAVE PETITION (CRL.) NO. ________ OF 20__", 24),
      spacer,

      // ─── Arising-from clause ───
      // The SLP must always identify the lower court order being
      // challenged. In criminal cases, this is typically a High
      // Court order in a Criminal Appeal.
      legalPara([
        new TextRun({ text: "(From the Final Judgement and Order dated ________ passed by the High Court of ________ at ________ in Criminal Appeal No. ________ of 20__)", italics: true, size: 22 }),
      ], { alignment: AlignmentType.CENTER }),

      spacer,

      // ─── Parties ───
      // Notice the dual labelling: the petitioner is identified as
      // both Petitioner AND original accused. This is conventional
      // in criminal SLPs because it locates the petitioner in the
      // sequence of criminal proceedings.
      legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      legalPara([new TextRun({ text: "N. ________", bold: true })]),
      legalPara([new TextRun("S/o ________")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara([new TextRun("(Currently lodged in Model Jail, ________)", { italics: true })]),
      legalPara([new TextRun({ text: "\u2026 PETITIONER / ORIGINAL ACCUSED", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      centeredBold("VERSUS"),
      spacer,

      // The State as the principal respondent — this is always the
      // case in a criminal SLP because criminal prosecutions are
      // conducted in the name of the State.
      legalPara([
        new TextRun({ text: "1. ", bold: true }),
        new TextRun({ text: "Union Territory of ________", bold: true }),
      ]),
      legalPara([new TextRun("   through Home Secretary,")]),
      legalPara([new TextRun("   Secretariat, ________")]),
      legalPara([new TextRun({ text: "\u2026 RESPONDENT", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      spacer,

      // The PROFORMA RESPONDENT — a unique feature of criminal SLPs.
      // The proforma respondent is a co-accused from the original
      // criminal trial. The petitioner does not actually want any
      // relief against him, but the Supreme Court Rules require all
      // original parties to be impleaded so the record is complete.
      legalPara([
        new TextRun({ text: "2. ", bold: true }),
        new TextRun({ text: "S. Singh ________", bold: true }),
      ]),
      legalPara([new TextRun("   S/o ________")]),
      legalPara([new TextRun("   R/o ________")]),
      legalPara([new TextRun({ text: "\u2026 PROFORMA RESPONDENT / ORIGINAL ACCUSED", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      spacer,

      // ─── Title ───
      centeredBold("PETITION FOR SPECIAL LEAVE TO APPEAL UNDER", 22),
      centeredBold("ARTICLE 136 OF THE CONSTITUTION OF INDIA", 22),
      spacer,

      // ─── Formal Addressing ───
      // Same as Template 23 — addressed to the Chief Justice
      legalPara([new TextRun({ text: "To,", bold: true })]),
      legalPara([new TextRun("The Hon'ble Chief Justice of India")]),
      legalPara([new TextRun("And His Companion Justices of the Supreme Court of India")]),

      spacer,

      legalPara([
        new TextRun({ text: "The humble petition of the above-named Petitioner most respectfully showeth:", italics: true }),
      ]),

      spacer,

      // ─── Body ───

      // Para 1: Identifying the impugned order
      new Paragraph({ numbering: { reference: "slp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the present Special Leave Petition (Criminal) is filed against order dated ________ of the High Court of ________ at ________ in Criminal Appeal No. ________ of 20__, titled \"________ versus The State of ________\", whereby the Hon'ble Court dismissed the appeal of the Petitioner."
        )] }),

      // Para 2: Question of law for consideration
      new Paragraph({ numbering: { reference: "slp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the present petition raises an important question of law for consideration before this Hon'ble Court, namely: ________."
        )] }),

      // Para 3: Declaration under Rule 2(2) — note that the rule
      // citation is different from Template 23 (which uses Rule 3(2)).
      // This is because the criminal rules have different numbering.
      new Paragraph({ numbering: { reference: "slp-paras", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "Declaration under Rule 2(2):", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "That the Petitioner states that no other petition for special leave to appeal has been filed by him against the judgment and order impugned herein."
      )]),

      // Para 4: Declaration under Rule 4
      new Paragraph({ numbering: { reference: "slp-paras", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "Declaration under Rule 4:", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Petitioner states that the Annexures filed along with the Special Leave Petition are true copies of the pleadings and documents which formed part of the records of the case in the Court below against whose order the leave to appeal is sought for in this petition."
      )]),

      // ─── BRIEF FACTS — A DISTINCTIVE FEATURE OF CRIMINAL SLPs ───
      // This narrative section is unique to criminal petitions. It
      // tells the story of the criminal case from the date of the
      // alleged offence through the trial court conviction. The
      // Supreme Court needs this complete picture to decide whether
      // to even grant leave at the threshold stage.
      new Paragraph({ numbering: { reference: "slp-paras", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "BRIEF FACTS:", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "On the night intervening ________, the murder of Sh. ________, who was a ________ employed at the residence of Sh. ________, was committed in the kitchen of his house when Sh. ________ and his sister Smt. ________ were away at ________."
      )]),

      legalPara([new TextRun(
        "The F.I.R. was registered on the statement of Capt. ________, P.W. 11, who resides in the neighbourhood of the said house. The offence came to light when Smt. ________, the sweeper of the said house, informed Capt. ________. On the information given by him, S.I. ________ recorded D.D.R. No. ________ dated ________ in the Rojnamcha of Police Station ________ and formed a police party that proceeded to the said house."
      )]),

      legalPara([new TextRun(
        "The investigation of the case remained pending with S.I. ________ until ________. The police remained unsuccessful in tracing the crime till ________. On that day, ________ S.I. (P.W. 24) of the C.I.A. staff took over the investigation. He, along with members of the police party, visited the said house where Sh. ________ (P.W. 12) was present. In his presence, the appellant (Petitioner herein) was interrogated and made certain disclosures, after which the further story unfolded."
      )]),

      legalPara([new TextRun(
        "After completion of the investigation, the accused persons were challaned on the charges under Sections 120-B, 392/120-B, 302/34 and 302/114 of the Indian Penal Code. The accused pleaded not guilty to the charges framed against them and claimed trial. The Court of Sh. ________, Sessions Judge, ________, convicted the accused under Sections 120-B, 302/34 and in the alternative 302/114 IPC."
      )]),

      // Para 6: Annexure for the Trial Court judgment.
      // Notice that this is paragraph 6 because the Brief Facts are
      // numbered as paragraph 5 — and the trial court judgment is
      // always Annexure P-1 by convention in criminal SLPs.
      new Paragraph({ numbering: { reference: "slp-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That the copy of the Trial Court judgment passed by the Sessions Judge, ________, convicting and sentencing the Petitioner in Sessions Case No. ________ of 20__ under Sections 120-B, 302/34 and in the alternative 302/114 IPC is "
          ),
          new TextRun({ text: "Annexure P-1.", bold: true }),
        ] }),

      // Para 7: Grounds — using upper-case letters as is conventional
      // in criminal SLPs (the civil version uses Roman numerals)
      new Paragraph({ numbering: { reference: "slp-paras", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "GROUNDS:", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "Being aggrieved and dissatisfied with the impugned order, the Petitioner approaches this Hon'ble Court by way of Special Leave Petition on the following grounds, amongst others:"
      )]),

      // Criminal SLP grounds focus on evidentiary and criminal law
      // issues — credibility of witnesses, suppression of evidence,
      // and so on. This is fundamentally different from civil SLP
      // grounds which focus on contractual or statutory interpretation.

      new Paragraph({ numbering: { reference: "slp-grounds", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because the judgment and order dated ________ passed by the Hon'ble High Court dismissing the appeal of the Appellant is contrary to law and facts, and hence is liable to be set aside both on the point of law and equity."
        )] }),

      new Paragraph({ numbering: { reference: "slp-grounds", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because the prosecution only produced partisan or interested persons as witnesses in order to prove the commission of the crime by the Petitioner. This fact casts grave doubt on the truthfulness of the prosecution case."
        )] }),

      new Paragraph({ numbering: { reference: "slp-grounds", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because the prosecution has suppressed the origin and genesis of the occurrence and has thus not presented the true version of events before the Trial Court."
        )] }),

      new Paragraph({ numbering: { reference: "slp-grounds", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because the Hon'ble High Court failed to appreciate that the prosecution case rests entirely on circumstantial evidence and the chain of circumstances is not complete so as to exclude every reasonable hypothesis of the innocence of the Petitioner."
        )] }),

      new Paragraph({ numbering: { reference: "slp-grounds", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because the alleged disclosure statement attributed to the Petitioner is inadmissible in evidence and could not have formed the basis of conviction."
        )] }),

      new Paragraph({ numbering: { reference: "slp-grounds", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Because the Hon'ble High Court has not appreciated that the burden of proof in a criminal case rests on the prosecution and the prosecution has failed to discharge that burden beyond reasonable doubt."
        )] }),

      new Paragraph({ numbering: { reference: "slp-grounds", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "The Petitioner craves leave of this Hon'ble Court to add, amend and alter the grounds raised in this petition."
        )] }),

      spacer,

      // ─── Prayer ───
      // Note how the criminal SLP prayer asks for setting aside the
      // conviction and acquittal — fundamentally different from the
      // civil SLP prayer which asks for setting aside an order on
      // a question of law.
      centeredBold("PRAYER:", 26),
      spacer,

      legalPara([new TextRun("In view of the foregoing, it is most respectfully prayed that this Hon'ble Court may kindly be pleased to:")]),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Grant Special Leave to Appeal against the impugned final judgment and order dated ________ passed by the Hon'ble High Court of ________ in Criminal Appeal No. ________ of 20__;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "Set aside the impugned judgment and acquit the Petitioner of all the charges levelled against him; ", bold: true }),
          new TextRun("and"),
        ] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun("Pass such other order or orders as may be deemed fit and proper in the facts, reasons and circumstances of the case.")] }),

      spacer,

      // ─── The Ceremonial Closing ───
      // Same closing as the civil SLP — these formal phrases are
      // used in all Supreme Court petitions
      centeredBold("AND FOR THIS ACT OF KINDNESS, THE PETITIONER", 22),
      centeredBold("SHALL EVER REMAIN GRATEFUL AS IN DUTY BOUND.", 22),

      spacer, spacer,

      legalPara([new TextRun({ text: "Drawn and Filed by:", bold: true })]),
      spacer,

      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("New Delhi"), new TextRun({ text: "\tAdvocate for the Petitioner", bold: true })] }),
      legalPara([new TextRun("Date of drawn: ________")]),
      legalPara([new TextRun("Date of filing: ________")]),

      spacer,

      legalPara([
        new TextRun({ text: "[NOTE: ", bold: true, italics: true }),
        new TextRun({ text: "To be supported by an affidavit. The Vakalatnama must be duly attested by the Jail Superintendent if the Petitioner is in custody.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
