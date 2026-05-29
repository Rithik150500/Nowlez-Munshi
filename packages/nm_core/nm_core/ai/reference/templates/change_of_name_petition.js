/**
 * PETITION FOR CHANGE OF NAME / DECLARATION
 * OF NEW NAME
 * ─────────────────────────────────────────────
 * Category : Civil — Personal Status / Identity
 * Court    : Civil Court / District Court
 * Statute  : No specific statute; combined administrative and
 *            common-law procedure recognised through judicial
 *            practice; Section 22 of the Births, Deaths and
 *            Marriages Registration Act, 1886 for related
 *            corrections; Article 21 of the Constitution of India
 *            for the constitutional dimension
 * Source   : Standard form used in Indian civil court practice
 *
 * The Petition for Change of Name is the fifth and final template
 * in the family law expansion batch and it introduces a
 * procedural device that does not have a precise analogue in
 * your existing library. Unlike the other templates in this
 * batch which apply specific personal-law statutes to
 * matrimonial disputes, the change of name petition operates
 * under a hybrid procedure that has developed through
 * administrative practice and judicial recognition rather than
 * through any single comprehensive statute. To grasp where this
 * template fits, you have to understand the curious legal
 * status of name change in India and the practical reasons that
 * lead Indians to seek formal name changes.
 *
 * THE LEGAL FRAMEWORK FOR NAME CHANGE IN INDIA:
 *
 *   Unlike many Western jurisdictions which have specific
 *   name change statutes, India does not have a single
 *   comprehensive statute that governs the change of personal
 *   names. The right to change one's name is recognised as
 *   part of the right to life and personal liberty under
 *   Article 21 of the Constitution, as held by the Supreme
 *   Court in cases like Jigya Yadav versus Central Board of
 *   Secondary Education and earlier in K.S. Puttaswamy
 *   versus Union of India (the right to privacy case).
 *   The courts have consistently held that the right to
 *   choose one's name is a facet of the right to identity
 *   and personal autonomy, and that it cannot be denied
 *   without compelling justification.
 *
 *   The actual mechanism for changing one's name in India
 *   has developed through administrative practice rather than
 *   through formal legislation. The standard procedure
 *   involves three steps that you should understand. First,
 *   the person seeking to change the name executes an
 *   affidavit declaring the change of name and the reason
 *   for the change. Second, the change of name is published
 *   in two newspapers (one English language and one local
 *   language) and in the Official Gazette of the appropriate
 *   State Government, which gives notice to the world of the
 *   change. Third, the various official records of the
 *   person (such as the birth certificate, the Aadhaar card,
 *   the PAN card, the passport, the school records, and the
 *   bank accounts) are updated based on the affidavit and
 *   the gazette notification.
 *
 *   In most cases, this administrative procedure is
 *   sufficient and no court order is required. However,
 *   there are situations in which a formal court declaration
 *   becomes necessary, and these situations are the subject
 *   of this template. The principal situations in which a
 *   court declaration is sought are: first, where the
 *   administrative authorities (such as a school board, a
 *   passport authority, or a bank) refuse to update their
 *   records based on the affidavit and the gazette
 *   notification alone; second, where the change of name
 *   involves a change of religion, gender, or other sensitive
 *   personal status that may need formal judicial
 *   recognition; third, where the change is being made in
 *   the context of an ongoing matrimonial dispute or
 *   property dispute and the parties want the court's
 *   imprimatur on the change; and fourth, where the change
 *   is being made by a minor and the consent of the
 *   guardian needs to be formalised.
 *
 * THE COMMON REASONS FOR NAME CHANGE:
 *
 *   Indians seek to change their names for a wide variety of
 *   reasons that you should learn to identify. The most
 *   common reason is marriage, where a woman traditionally
 *   adopts her husband's surname after marriage and may also
 *   change her first name in some communities. The second
 *   common reason is religious conversion, where a person
 *   who has converted from one religion to another adopts a
 *   name that is more consistent with the new religion.
 *   The third common reason is the correction of errors in
 *   birth records, where the name as recorded at birth was
 *   misspelled, transliterated incorrectly, or otherwise
 *   inaccurate. The fourth reason is personal preference,
 *   where the person simply wishes to adopt a different name
 *   that they consider more attractive, more meaningful, or
 *   more reflective of their identity. The fifth reason,
 *   which has become increasingly important in recent years,
 *   is gender identity, where a transgender person seeks to
 *   adopt a name consistent with their affirmed gender. The
 *   sixth reason is numerological or astrological, where the
 *   person changes the spelling of their name on the advice
 *   of an astrologer or numerologist. The seventh reason is
 *   to escape past associations, where the person wishes to
 *   distance themselves from a previous identity associated
 *   with a difficult personal history.
 *
 * STRUCTURAL FEATURES OF THIS TEMPLATE:
 *
 *   First, look at the parties. The petition is filed by
 *   the person seeking the change of name, who is the sole
 *   petitioner. There are typically no respondents because
 *   the petition is not adversarial in nature. However, in
 *   some cases the petition may be drafted as a "petition
 *   in the matter of" without naming any respondent.
 *
 *   Second, look at the body. Paragraph 1 establishes the
 *   identity of the petitioner under the existing name.
 *   Paragraph 2 sets out the reason for the change of
 *   name. Paragraph 3 describes the new name being adopted.
 *   Paragraph 4 narrates the administrative steps that have
 *   already been taken (the affidavit, the newspaper
 *   publications, the gazette notification). Paragraph 5
 *   explains why a court declaration is necessary.
 *   Paragraph 6 confirms the bona fides of the petitioner
 *   and the absence of any improper purpose.
 *
 *   Third, look at the prayer. The prayer asks for a formal
 *   declaration that the petitioner is now to be known by
 *   the new name and that all official records should be
 *   updated accordingly.
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
      { reference: "name-paras", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
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
      centeredBold("IN THE COURT OF THE PRINCIPAL DISTRICT JUDGE", 26),
      centeredBold("AT ________", 22),
      spacer,
      centeredBold("CIVIL MISCELLANEOUS PETITION NO. ________ OF 20__", 24),
      spacer,
      legalPara([
        new TextRun({ text: "(Petition for declaration of change of name)", italics: true, size: 22 }),
      ], { alignment: AlignmentType.CENTER }),

      spacer,

      // ─── Parties ───
      legalPara([new TextRun({ text: "IN THE MATTER OF:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      legalPara([new TextRun({ text: "Sh./Smt./Kumari ________ (existing name)", bold: true })]),
      legalPara([new TextRun("S/o or D/o ________")]),
      legalPara([new TextRun("Aged about ________ years")]),
      legalPara([new TextRun("R/o ________")]),
      legalPara([new TextRun("Now to be known as Sh./Smt./Kumari ________ (new name)")]),
      legalPara([new TextRun({ text: "\u2026 PETITIONER", bold: true })],
        { alignment: AlignmentType.RIGHT }),

      spacer,

      // ─── Title ───
      centeredBold("PETITION SEEKING DECLARATION OF CHANGE OF NAME", 22),
      centeredBold("OF THE PETITIONER FROM ________ TO ________", 22),
      centeredBold("AND CONSEQUENTIAL DIRECTIONS", 22),
      spacer,

      legalPara([new TextRun({ text: "MOST RESPECTFULLY SHOWETH:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),
      spacer,

      // ─── Body ───

      // Para 1: Identification of the petitioner
      new Paragraph({ numbering: { reference: "name-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That the Petitioner is an adult Indian citizen, currently known by the name ________ (the 'Existing Name'), as recorded in the birth certificate of the Petitioner issued by the Office of the Registrar of Births and Deaths, ________, on ________ (date of issue). A true copy of the birth certificate is annexed herewith and marked as "
          ),
          new TextRun({ text: "Annexure P-1.", bold: true }),
        ] }),

      // Para 2: Existing identity documents
      new Paragraph({ numbering: { reference: "name-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Existing Name of the Petitioner is recorded in the following identity documents and official records: (a) Aadhaar Card No. ________; (b) PAN Card No. ________; (c) Passport No. ________; (d) Voter ID Card No. ________; (e) Driving Licence No. ________; (f) school and college records; and (g) bank accounts and other financial records. Copies of the said identity documents are annexed herewith as Annexures P-2 to P-________."
        )] }),

      // Para 3: The reason for the change of name
      new Paragraph({ numbering: { reference: "name-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "REASON FOR THE CHANGE OF NAME: ", bold: true, underline: {} }),
          new TextRun(
            "That the Petitioner desires to change the Existing Name to ________ (the 'New Name') for the following reasons: ________ (state the specific reason for the change of name, e.g. marriage, religious conversion, correction of a transliteration error in the birth records, personal preference, gender affirmation following transition, the advice of a numerologist, the desire to adopt a name more reflective of the Petitioner's cultural or religious identity, etc.). The reason for the change of name is bona fide and is not motivated by any intention to defraud creditors, evade legal liability, or escape from any pending legal proceedings."
          ),
        ] }),

      // Para 4: Affidavit of change of name
      new Paragraph({ numbering: { reference: "name-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That the Petitioner has executed an affidavit dated ________ before a Notary Public / Magistrate, declaring the change of name from the Existing Name to the New Name and stating the reason for the said change. A true copy of the said affidavit is annexed herewith and marked as "
          ),
          new TextRun({ text: "Annexure P-________.", bold: true }),
        ] }),

      // Para 5: Newspaper publication
      new Paragraph({ numbering: { reference: "name-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the change of name has been duly published in two newspapers having wide circulation in the area where the Petitioner ordinarily resides, namely (a) ________ (English newspaper) dated ________, and (b) ________ (vernacular / regional language newspaper) dated ________. The newspaper publications give notice to the world of the change of name and provide an opportunity for any person having any objection to the change to come forward. No objection has been received by the Petitioner pursuant to the said publications. True copies of the newspaper publications are annexed herewith as Annexures P-________ and P-________."
        )] }),

      // Para 6: Gazette notification
      new Paragraph({ numbering: { reference: "name-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun(
            "That the change of name has also been duly notified in the Official Gazette of the State Government of ________, vide Notification dated ________ published in Gazette No. ________. The gazette notification represents the formal recognition of the change of name by the State Government and is sufficient evidence of the said change for most administrative purposes. A true copy of the gazette notification is annexed herewith and marked as "
          ),
          new TextRun({ text: "Annexure P-________.", bold: true }),
        ] }),

      // Para 7: Need for court declaration
      new Paragraph({ numbering: { reference: "name-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "NEED FOR A COURT DECLARATION: ", bold: true, underline: {} }),
          new TextRun(
            "That despite the affidavit, the newspaper publications, and the gazette notification, certain administrative authorities have refused to update their records to reflect the New Name and have insisted on a formal court order declaring the change of name. Specifically, ________ (state the specific authority that has refused to update its records, e.g. the school board for the issuance of corrected mark sheets, the passport authority for the issuance of a new passport, the property registrar for the mutation of property records, etc.) has insisted on a court order. The Petitioner therefore approaches this Hon'ble Court for a formal declaration of the change of name."
          ),
        ] }),

      // Para 8: Constitutional right to identity
      new Paragraph({ numbering: { reference: "name-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Petitioner submits that the right to change one's name is a facet of the right to identity and personal autonomy guaranteed under Article 21 of the Constitution of India, as held by the Hon'ble Supreme Court in cases such as K.S. Puttaswamy versus Union of India and Jigya Yadav versus Central Board of Secondary Education. The Petitioner has a constitutional right to be recognised by the name of the Petitioner's choice, and the various administrative authorities are bound to respect this right and to update their records accordingly."
        )] }),

      // Para 9: Bona fides
      new Paragraph({ numbering: { reference: "name-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the Petitioner solemnly affirms that the change of name is bona fide and is not being made for any improper purpose. The Petitioner has no pending criminal or civil proceedings in the Existing Name in which the change of name might be relevant. The Petitioner has no outstanding debts or liabilities that the Petitioner is seeking to evade through the change of name. The Petitioner undertakes to inform all the authorities and institutions concerned of the change of name and to update all the relevant records accordingly."
        )] }),

      // Para 10: Jurisdiction
      new Paragraph({ numbering: { reference: "name-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That this Hon'ble Court has jurisdiction to entertain and decide the present petition because the Petitioner ordinarily resides within the territorial jurisdiction of this Hon'ble Court."
        )] }),

      // Para 11: Court fee
      new Paragraph({ numbering: { reference: "name-paras", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "That the requisite court fee has been affixed on the present petition."
        )] }),

      spacer,

      // ─── Prayer ───
      centeredBold("PRAYER:", 26),
      spacer,

      legalPara([new TextRun(
        "In view of the facts and circumstances stated above, it is most respectfully prayed that this Hon'ble Court may be pleased to:"
      )]),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({ text: "Declare that the Petitioner, hitherto known as ________ (the Existing Name), shall henceforth be known as ________ (the New Name) for all purposes whatsoever;", bold: true, underline: {} }),
        ] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Direct all the concerned authorities and institutions, including the Registrar of Births and Deaths, the Aadhaar authority, the Income Tax Department, the passport authority, the school and college boards, the banks, and any other authority that maintains records of the Petitioner, to update their records to reflect the New Name of the Petitioner;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Declare that all the rights, properties, liabilities, and obligations of the Petitioner under the Existing Name shall continue to be the rights, properties, liabilities, and obligations of the Petitioner under the New Name, and that the change of name shall not affect any subsisting legal relationship of the Petitioner;"
        )] }),

      new Paragraph({ numbering: { reference: "prayer-items", level: 0 },
        spacing: { after: 120, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun(
          "Pass such other or further orders as this Hon'ble Court may deem fit and proper in the facts and circumstances of the case."
        )] }),

      spacer, spacer,

      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Place: ________"), new TextRun({ text: "\tPETITIONER", bold: true })] }),
      new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [new TextRun("Date: ________"), new TextRun("\tThrough")] }),
      new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun("Counsel for the Petitioner")] }),

      spacer, spacer,

      legalPara([
        new TextRun({ text: "[NOTE: ", bold: true, italics: true }),
        new TextRun({ text: "This petition must be supported by an affidavit of the petitioner. Documents to be annexed include the birth certificate, copies of identity documents bearing the existing name, the change of name affidavit, the newspaper publications, the gazette notification, and any communication from the administrative authority that has refused to update its records. For minors, the petition must be filed by the natural guardian or by a court-appointed guardian.]", italics: true }),
      ], { alignment: AlignmentType.CENTER }),
    ],
  }],
});
