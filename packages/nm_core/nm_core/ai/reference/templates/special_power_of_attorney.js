/**
 * SPECIAL POWER OF ATTORNEY
 * ───────────────────────────
 * Category : Conveyancing — Authorisation Instrument (Single Purpose)
 * Statute  : Indian Stamp Act, 1899; Registration Act, 1908
 * Source   : LB-502 Drafting, Pleadings & Conveyance (DU, 2025)
 *
 * The Special Power of Attorney is the focused, single-purpose
 * counterpart of the General Power of Attorney at Template 09. The
 * easiest way to grasp the distinction between them is to think
 * about the scope of authorisation each one creates.
 *
 * THE GENERAL POWER OF ATTORNEY (Template 09):
 *
 *   The GPA confers broad and unspecified authority on the attorney
 *   to do many things on behalf of the principal — manage property,
 *   collect rents, file suits, defend actions, deposit and withdraw
 *   from bank accounts, deal with government offices, and so on.
 *   The GPA is typically used when the principal will be unavailable
 *   for an extended period and needs someone to handle their affairs
 *   generally. The opening salutation "KNOW ALL MEN BY THESE
 *   PRESENTS" reflects the GPA's broad announcement to the world.
 *
 * THE SPECIAL POWER OF ATTORNEY (this template):
 *
 *   The SPA confers narrowly-tailored authority for ONE specific
 *   transaction or purpose — typically a single sale, a single
 *   court appearance, a single property transfer, or a single bank
 *   account operation. Once that specific purpose is accomplished,
 *   the SPA is exhausted and has no further legal effect.
 *
 * WHY THE DISTINCTION MATTERS IN PRACTICE:
 *
 *   The choice between a GPA and an SPA is not merely formal — it
 *   has substantial legal and tax consequences:
 *
 *     1. STAMP DUTY — Special Powers of Attorney typically attract
 *        a much lower stamp duty than General Powers of Attorney.
 *        In Delhi, for instance, an SPA can be executed on a stamp
 *        paper of just one hundred rupees, whereas a GPA may
 *        require stamp duty calculated as a percentage of the
 *        value of the property involved.
 *
 *     2. SCOPE OF LIABILITY — A principal who executes a GPA is
 *        exposed to much wider liability because the attorney can
 *        bind them to a multitude of transactions. With an SPA,
 *        the principal's exposure is confined to the single
 *        authorised purpose.
 *
 *     3. JUDICIAL SCRUTINY — Indian courts have grown increasingly
 *        cautious about transactions executed under General Powers
 *        of Attorney, particularly after the Supreme Court's
 *        decision in Suraj Lamp & Industries Pvt. Ltd. v. State of
 *        Haryana (2011), which held that GPA-based transfers of
 *        immovable property cannot substitute for proper sale
 *        deeds. Special Powers of Attorney, being narrower and
 *        more clearly tied to specific transactions, do not raise
 *        the same concerns.
 *
 *     4. REGISTRATION — Under Section 17 of the Registration Act,
 *        an SPA authorising the execution of a sale deed for
 *        immovable property worth more than Rs. 100 must itself
 *        be registered. A GPA need not always be registered, but
 *        in practice many states now require it for property
 *        transactions.
 *
 * STRUCTURAL PARALLELS WITH THE GPA:
 *
 *   Notice that this template shares many features with Template 09
 *   — the "KNOW ALL MEN BY THESE PRESENTS" opening, the
 *   identification of the principal in the first person, the
 *   designation of the attorney, and the ratification clause at the
 *   end. These parallels reflect the common conceptual foundation
 *   of all powers of attorney as agency-creating instruments. What
 *   changes is the operative clause in the middle, which spells out
 *   the precise scope of the authorisation.
 *
 * THE TYPICAL USE CASE — SALE OF SPECIFIC PROPERTY:
 *
 *   This template uses the most common SPA scenario: the principal
 *   owns a specific property and wants to authorise a relative or
 *   trusted person to execute a sale deed for that one property.
 *   The principal might be NRI (non-resident Indian) and unable to
 *   travel to India for the registration ceremony, or might be
 *   elderly and unable to attend the sub-registrar's office in
 *   person, or might simply be busy with other commitments. In
 *   each case, an SPA tied to a specific property and a specific
 *   purpose is the cleanest legal solution.
 *
 * THE RATIFICATION CLAUSE:
 *
 *   Notice the ratification clause near the end of the template.
 *   This clause is essential because it forecloses any future
 *   dispute about whether the attorney exceeded their authority
 *   in some minor respect. By ratifying in advance "all and
 *   whatsoever the said attorney shall lawfully do or cause to
 *   be done," the principal binds themselves to the attorney's
 *   acts done within the scope of the SPA.
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
      reference: "spa-clauses",
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
      centeredBold("SPECIAL POWER OF ATTORNEY", 32),
      spacer, hrule(),

      // ─── The "KNOW ALL MEN" Opening ───
      // This is the same ceremonial opening used in the General Power
      // of Attorney (Template 09). It is conventional in deed-poll
      // instruments — documents that announce something to the world
      // at large rather than passing between specific parties.
      legalPara([
        new TextRun({ text: "KNOW ALL MEN BY THESE PRESENTS ", bold: true }),
        new TextRun("that I, "),
        new TextRun({ text: "Mr. ________", bold: true }),
        new TextRun(", aged about ________ years, son of Sh. ________, by occupation ________, presently residing at ________, "),
        new TextRun({ text: "do hereby nominate, constitute and appoint ", bold: true }),
        new TextRun({ text: "Mr. ________", bold: true }),
        new TextRun(", aged about ________ years, son of Sh. ________, presently residing at ________, "),
        new TextRun({ text: "to be my true and lawful attorney ", bold: true }),
        new TextRun("(hereinafter called the 'Attorney'), to act for me, in my name, on my behalf and at my own risk, cost and consequences, with respect to the matter specifically set out hereinafter."),
      ]),

      spacer,

      // ─── The Recital — Establishing the Property and the Purpose ───
      // The recital is where the SPA differs most dramatically from the
      // GPA. Here, the SPA must specify the exact property and the
      // exact transaction. This narrowness is what gives the SPA its
      // legal character.
      legalPara([
        new TextRun({ text: "WHEREAS ", bold: true }),
        new TextRun("I am the absolute and lawful owner of the property bearing No. ________, situated at ________, New Delhi, admeasuring ________ sq. yds., having purchased the same vide registered Sale Deed dated ________ executed in my favour by Sh. ________ and registered in the office of the Sub-Registrar, ________, as Document No. ________, Book No. ________, Volume No. ________, on pages ________ to ________ on ________;"),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS ", bold: true }),
        new TextRun("I have agreed to sell the aforesaid property to Sh. ________, S/o ________, R/o ________, for a total sale consideration of Rs. ________;"),
      ]),

      // The personal reason for needing the SPA — this is rhetorically
      // important because it shows the court (in the event of any
      // future dispute) that the SPA was created for a legitimate
      // and limited purpose, not as a device to circumvent ordinary
      // sale procedures.
      legalPara([
        new TextRun({ text: "AND WHEREAS ", bold: true }),
        new TextRun("on account of my pre-existing professional commitments / health condition / residence abroad, I am unable to attend the office of the Sub-Registrar, ________, in person for execution and registration of the sale deed in favour of the said purchaser;"),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS ", bold: true }),
        new TextRun("I therefore desire to authorise the said Attorney to execute and register the sale deed in respect of the aforesaid property and to do all related acts on my behalf;"),
      ]),

      spacer,

      // ─── The Operative Clauses ───
      // Notice how each clause is narrowly tailored to the specific
      // transaction. There is no general grant of authority anywhere
      // in this document — every clause is tied to the sale of the
      // specific property identified in the recital.
      centeredBold("NOW THIS DEED OF SPECIAL POWER OF ATTORNEY WITNESSES THAT", 22),
      centeredBold("I HEREBY AUTHORISE AND EMPOWER THE SAID ATTORNEY:", 22),
      spacer,

      // Clause 1: To execute the sale deed
      new Paragraph({ numbering: { reference: "spa-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "To execute, sign and deliver the sale deed in respect of the aforesaid property bearing No. ________, situated at ________, New Delhi, in favour of Sh. ________, S/o ________, R/o ________, for a total sale consideration of Rs. ________, in such form, manner and at such time as the said Attorney may consider appropriate, on my behalf and as my act and deed."
        )] }),

      // Clause 2: To present the deed for registration
      new Paragraph({ numbering: { reference: "spa-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "To present the said sale deed for registration before the Sub-Registrar, ________, New Delhi, having jurisdiction over the area where the said property is situated, and to admit execution of the said sale deed before the said Sub-Registrar."
        )] }),

      // Clause 3: To receive the sale consideration
      new Paragraph({ numbering: { reference: "spa-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "To receive the entire sale consideration of Rs. ________ from the purchaser by way of cheque, demand draft, bank transfer or such other mode as the Attorney may consider appropriate, and to issue valid and effective receipts and discharges in respect of the same."
        )] }),

      // Clause 4: To deliver possession
      new Paragraph({ numbering: { reference: "spa-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "To deliver actual, vacant and physical possession of the aforesaid property to the purchaser on receipt of the full sale consideration, and to hand over to the purchaser the original title deeds, sanctioned plans, tax receipts, electricity and water bills, and all other relevant documents pertaining to the said property."
        )] }),

      // Clause 5: Mutation and other formalities
      new Paragraph({ numbering: { reference: "spa-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "To apply to the appropriate authorities including the Municipal Corporation, the Electricity Department and the Water Department for mutation, transfer and substitution of the name of the purchaser in their respective records in respect of the aforesaid property, and to sign all such applications, declarations, indemnities, undertakings and other documents as may be required for the said purpose."
        )] }),

      // Clause 6: Incidental and ancillary acts
      // This clause is important because it covers any small
      // procedural step that might come up during the transaction,
      // without expanding the SPA's scope beyond the original
      // single purpose.
      new Paragraph({ numbering: { reference: "spa-clauses", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "To do all such acts, deeds, matters and things as may be necessary, incidental or ancillary to the completion of the aforesaid sale transaction, including but not limited to the payment of stamp duty, registration charges, mutation fees and other statutory levies in connection with the said transaction."
        )] }),

      spacer, hrule(),

      // ─── The Ratification Clause ───
      // This is the standard ratification clause that appears in all
      // powers of attorney. It binds the principal to whatever the
      // attorney does within the scope of the authorisation.
      legalPara([
        new TextRun({ text: "AND I HEREBY FURTHER DECLARE AND CONFIRM ", bold: true }),
        new TextRun("that all the acts, deeds, matters and things lawfully done by my said Attorney by virtue of the powers herein contained shall be construed as acts, deeds, matters and things done by me personally, and "),
        new TextRun({ text: "I hereby ratify and confirm and undertake to ratify and confirm ", bold: true, italics: true }),
        new TextRun("all and whatsoever that my said Attorney shall lawfully do or cause to be done in or about the aforesaid sale transaction by virtue of these presents."),
      ]),

      spacer,

      // The exhaustion clause — this is what distinguishes the SPA
      // from a GPA. Once the specific purpose is fulfilled, the SPA
      // automatically ceases to have effect.
      legalPara([
        new TextRun({ text: "IT IS FURTHER DECLARED ", bold: true }),
        new TextRun("that this Special Power of Attorney is granted solely for the specific purpose set out hereinabove and shall "),
        new TextRun({ text: "automatically stand revoked and exhausted ", bold: true, underline: {} }),
        new TextRun("upon the completion of the said sale transaction and the registration of the sale deed in favour of the purchaser."),
      ]),

      spacer, hrule(),

      // ─── Testimonium ───
      legalPara([
        new TextRun({ text: "IN WITNESS WHEREOF ", bold: true }),
        new TextRun("I have signed this Special Power of Attorney at ________ on this ________ day of ________."),
      ]),

      spacer, spacer,

      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 60 },
        children: [new TextRun({ text: "EXECUTANT / PRINCIPAL", bold: true })],
      }),

      spacer,

      // ─── Acceptance by Attorney ───
      // The attorney's signature acknowledging acceptance of the
      // authority. Without this, the SPA may be challenged as a
      // unilateral declaration that was never accepted.
      legalPara([
        new TextRun({ text: "I, ________, the Attorney named above, hereby accept the appointment.", bold: true }),
      ]),

      spacer, spacer,

      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "ATTORNEY", bold: true })],
      }),

      spacer, spacer,

      legalPara([new TextRun({ text: "WITNESSES:", bold: true, underline: {} })]),
      legalPara([new TextRun("(1) ________, S/o ________, R/o ________")]),
      legalPara([new TextRun("(2) ________, S/o ________, R/o ________")]),
    ],
  }],
});
