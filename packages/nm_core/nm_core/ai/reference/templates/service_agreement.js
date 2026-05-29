/**
 * SERVICE AGREEMENT (CONSULTANCY AGREEMENT)
 * ────────────────────────────────────────────
 * Category : Commercial Drafting — Independent Contractor Relationship
 * Type     : Bilateral principal-to-principal services agreement
 * Statute  : Indian Contract Act, 1872; Income Tax Act, 1961;
 *            Goods and Services Tax Act, 2017
 * Source   : Standard form used in Indian commercial practice
 *
 * The Service Agreement is the fifth and final commercial drafting
 * template in your library, and it has been deliberately drafted
 * to serve as a contrast to the Employment Contract at Template
 * 58. To grasp the importance of this template, you have to
 * understand a distinction that is fundamental to Indian
 * commercial and labour law: the distinction between a
 * "contract of service" and a "contract FOR services."
 *
 * THE TWO KINDS OF SERVICE RELATIONSHIPS:
 *
 *   When one person engages another to perform work, the
 *   relationship that arises can fall into one of two legally
 *   distinct categories. The first category is the CONTRACT OF
 *   SERVICE, which is an employment relationship between an
 *   employer and an employee. This is the relationship that
 *   Template 58 covers. The second category is the CONTRACT
 *   FOR SERVICES, which is an independent contractor
 *   relationship between a principal and a service provider.
 *   This is the relationship that Template 60 covers.
 *
 *   Despite their superficial similarity, these two
 *   relationships are governed by entirely different legal
 *   regimes and have entirely different practical
 *   consequences. Understanding the distinction is essential
 *   because mischaracterising a relationship can lead to
 *   serious legal and tax problems for both parties.
 *
 * THE CONTROL TEST:
 *
 *   The Indian courts have developed a multi-factor test for
 *   distinguishing the two categories, but the most important
 *   single factor is the degree of CONTROL that the engaging
 *   party exercises over the manner in which the work is done.
 *   In an employment relationship, the employer typically
 *   directs not just what work is to be done but also how, when,
 *   where and by whom. The employee is integrated into the
 *   employer's organisation and follows the employer's
 *   instructions on a continuous basis. In a service
 *   relationship, by contrast, the principal specifies the
 *   results to be delivered but leaves the service provider
 *   free to determine the manner of performance. The service
 *   provider is independent of the principal's organisation
 *   and uses its own methods, tools and procedures.
 *
 *   Other factors that the courts consider include the
 *   following: who provides the tools and equipment used in
 *   the work; whether the worker bears any financial risk in
 *   the performance of the work; whether the worker can profit
 *   from sound management of the work; whether the worker
 *   provides services to multiple principals or only to one;
 *   whether the worker has employees or subcontractors of
 *   their own; and how the relationship is described in the
 *   underlying contract. No single factor is decisive, and the
 *   courts examine the totality of the circumstances to
 *   determine the true nature of the relationship.
 *
 * THE LEGAL CONSEQUENCES OF THE DISTINCTION:
 *
 *   The distinction between employment and service has
 *   far-reaching consequences across several areas of law.
 *
 *   In LABOUR LAW, employees enjoy a wide range of statutory
 *   protections that do not apply to independent contractors.
 *   Employees are entitled to provident fund contributions,
 *   gratuity, maternity benefits, statutory bonus, paid leave,
 *   and protection against arbitrary termination. Independent
 *   contractors are simply parties to a commercial contract
 *   and have only the rights that the contract gives them.
 *
 *   In TAX LAW, employees are subject to tax deduction at
 *   source under Section 192 of the Income Tax Act, with the
 *   employer responsible for computing and depositing the tax.
 *   Independent contractors are subject to tax deduction at
 *   source under Section 194J or 194C, at much lower rates,
 *   and are themselves responsible for filing returns and
 *   paying any balance tax. Independent contractors are also
 *   typically required to register under the Goods and
 *   Services Tax Act and to charge GST on their invoices,
 *   while employees do not face this requirement.
 *
 *   In TORT LAW, an employer is generally liable for the
 *   wrongful acts of an employee committed in the course of
 *   employment under the doctrine of vicarious liability. A
 *   principal is generally not liable for the wrongful acts
 *   of an independent contractor, with limited exceptions for
 *   non-delegable duties.
 *
 *   In INTELLECTUAL PROPERTY LAW, the default rule is that
 *   intellectual property created by an employee in the
 *   course of employment belongs to the employer. The default
 *   rule for independent contractors is more complex and
 *   depends on the type of intellectual property and the
 *   specific terms of the contract. This is why service
 *   agreements typically contain explicit IP assignment
 *   clauses to avoid any uncertainty.
 *
 * COMPARING TEMPLATES 58 AND 60:
 *
 *   You should place Templates 58 and 60 side by side and
 *   notice the differences. Both documents are structured
 *   similarly and both involve one party paying another for
 *   services rendered. But the substance differs in several
 *   important ways.
 *
 *   First, the parties are described differently. Template 58
 *   uses "Employer" and "Employee" while Template 60 uses
 *   "Client" and "Service Provider." This difference in
 *   nomenclature reflects the fundamentally different nature
 *   of the relationships and is itself important evidence of
 *   the parties' intention.
 *
 *   Second, Template 60 explicitly states that no
 *   employer-employee relationship exists. This kind of
 *   express disclaimer is important because the courts will
 *   look at the substance of the relationship rather than
 *   the labels used by the parties, and an express disclaimer
 *   helps to establish that the parties intended to create a
 *   service relationship rather than an employment
 *   relationship.
 *
 *   Third, the compensation provisions are different.
 *   Template 58 provides for a monthly salary with statutory
 *   deductions while Template 60 provides for service fees
 *   to be invoiced periodically with applicable GST.
 *
 *   Fourth, Template 58 contains provisions for statutory
 *   benefits like provident fund and gratuity, while Template
 *   60 explicitly states that no such benefits are payable
 *   because the service provider is not an employee.
 *
 *   Fifth, the termination provisions are different. Template
 *   58 contains elaborate notice requirements and grounds for
 *   summary termination, reflecting the labour law constraints
 *   on terminating employment. Template 60 typically allows
 *   either party to terminate with relatively short notice,
 *   reflecting the principle that commercial parties are
 *   free to agree their own termination terms.
 *
 *   Sixth, Template 60 explicitly retains the service
 *   provider's right to provide services to other clients,
 *   subject only to a non-conflict obligation. Template 58
 *   requires the employee to devote all of their time to the
 *   employer.
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
      reference: "svc-clauses",
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
      centeredBold("SERVICE AGREEMENT", 30),
      centeredBold("(CONSULTANCY AGREEMENT)", 22),
      spacer, hrule(),

      // ─── Date ───
      legalPara([
        new TextRun({ text: "THIS SERVICE AGREEMENT ", bold: true }),
        new TextRun("(hereinafter referred to as 'this Agreement') is made and executed at "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" on this "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" day of "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(", 20__,"),
      ]),

      spacer,

      // ─── Parties — note the use of "Client" and "Service
      // Provider" rather than "Employer" and "Employee" ───
      legalPara([new TextRun({ text: "BY AND BETWEEN:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      spacer,

      legalPara([
        new TextRun({ text: "M/s ABC Pvt. Ltd.", bold: true }),
        new TextRun(", a company duly incorporated under the Companies Act, 2013, having its registered office at "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(", through its authorised representative "),
        new TextRun({ text: "Sh. ________", bold: true }),
        new TextRun(" (hereinafter referred to as 'the "),
        new TextRun({ text: "Client", bold: true }),
        new TextRun("') of the "),
        new TextRun({ text: "FIRST PART;", bold: true }),
      ]),

      spacer,

      legalPara([new TextRun({ text: "AND", bold: true })],
        { alignment: AlignmentType.CENTER }),

      spacer,

      legalPara([
        new TextRun({ text: "M/s ________ Consulting LLP", bold: true }),
        new TextRun(", a limited liability partnership registered under the Limited Liability Partnership Act, 2008, having its registered office at "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(", through its designated partner "),
        new TextRun({ text: "Sh. ________", bold: true }),
        new TextRun(" (hereinafter referred to as 'the "),
        new TextRun({ text: "Service Provider", bold: true }),
        new TextRun("') of the "),
        new TextRun({ text: "SECOND PART.", bold: true }),
      ]),

      spacer,

      legalPara([new TextRun(
        "The Client and the Service Provider are hereinafter individually referred to as 'a Party' and collectively as 'the Parties'."
      )]),

      spacer,

      // ─── Recitals ───
      legalPara([new TextRun({ text: "RECITALS:", bold: true, underline: {} })],
        { alignment: AlignmentType.CENTER }),

      spacer,

      legalPara([
        new TextRun({ text: "WHEREAS, ", bold: true }),
        new TextRun("the Client is engaged in the business of "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(" and requires professional services in the field of "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(";"),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS, ", bold: true }),
        new TextRun("the Service Provider is an independent professional/firm engaged in the business of providing services in the field of "),
        new TextRun({ text: "________", bold: true }),
        new TextRun(", and has the necessary skills, expertise, experience and resources to provide the services required by the Client;"),
      ]),

      legalPara([
        new TextRun({ text: "AND WHEREAS, ", bold: true }),
        new TextRun("the Client has agreed to engage the Service Provider as an independent contractor, and the Service Provider has agreed to be so engaged, on the terms and conditions set out herein;"),
      ]),

      legalPara([
        new TextRun({ text: "NOW, THEREFORE, ", bold: true }),
        new TextRun("in consideration of the mutual covenants and undertakings contained herein, the Parties hereby agree as follows:"),
      ]),

      spacer,

      // ─── Operative Clauses ───

      // Clause 1: Scope of services
      new Paragraph({ numbering: { reference: "svc-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "SCOPE OF SERVICES", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Service Provider shall provide to the Client the following services (the 'Services'): ________ (state in detail the nature and scope of the services to be provided, including specific deliverables, timelines, and acceptance criteria). The detailed scope of work, including the specific deliverables, milestones and acceptance criteria, is set out in the Statement of Work annexed hereto as Annexure A."
      )]),

      spacer,

      // Clause 2: INDEPENDENT CONTRACTOR STATUS — the most
      // important clause in the entire agreement because it
      // expressly negates an employment relationship
      new Paragraph({ numbering: { reference: "svc-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "INDEPENDENT CONTRACTOR STATUS", bold: true, underline: {} })] }),

      legalPara([
        new TextRun({ text: "It is expressly understood and agreed by the Parties that the relationship between them is that of a Client and an independent contractor, and nothing contained in this Agreement shall be construed as creating any relationship of employer and employee, master and servant, principal and agent, partnership, or joint venture between the Parties. ", bold: true, underline: {} }),
        new TextRun(
          "The Service Provider shall perform the Services as an independent contractor and shall be responsible for determining the manner, methods, and means of performing the Services. The Service Provider shall not be entitled to any of the rights or benefits available to employees of the Client under any applicable law, including but not limited to provident fund, gratuity, leave, medical insurance, or any other statutory or contractual benefits. The Service Provider shall be responsible for filing its own tax returns, paying its own taxes (including income tax and goods and services tax), and obtaining any registrations or licences required for the conduct of its business."
        ),
      ]),

      spacer,

      // Clause 3: Term
      new Paragraph({ numbering: { reference: "svc-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "TERM", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "This Agreement shall commence on ________ (the 'Commencement Date') and shall continue in force for a period of ________ months/years, unless earlier terminated in accordance with the terms hereof. The Parties may extend the term of this Agreement by mutual written agreement before the expiry of the original term."
      )]),

      spacer,

      // Clause 4: Service fees and payment
      new Paragraph({ numbering: { reference: "svc-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "SERVICE FEES AND PAYMENT", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "In consideration of the Services to be provided by the Service Provider under this Agreement, the Client shall pay to the Service Provider a total fee of Rs. ________ (Rupees ________ only), exclusive of applicable Goods and Services Tax (GST). The said fee shall be payable in accordance with the payment schedule set out in the Statement of Work. The Service Provider shall raise invoices for the said fee in accordance with the payment schedule, and the Client shall make payment within thirty days of receipt of each valid invoice. The Client shall be entitled to deduct tax at source from the payments under this Agreement at the rates specified in Section 194J of the Income Tax Act, 1961, or any other applicable provision of law."
      )]),

      spacer,

      // Clause 5: Reimbursement of expenses
      new Paragraph({ numbering: { reference: "svc-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "REIMBURSEMENT OF EXPENSES", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Service Provider shall be entitled to reimbursement of reasonable out-of-pocket expenses actually incurred in the performance of the Services, including travel, accommodation, and communication expenses, subject to the prior written approval of the Client and the production of supporting receipts and documentation. The Client shall not be liable to reimburse any expenses that have not been pre-approved or that are not properly documented."
      )]),

      spacer,

      // Clause 6: Standard of performance
      new Paragraph({ numbering: { reference: "svc-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "STANDARD OF PERFORMANCE", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Service Provider shall perform the Services with the level of skill, care and diligence normally expected of a qualified professional providing services of a similar nature. The Service Provider warrants that the personnel deployed for the performance of the Services possess the necessary qualifications, experience and expertise. The Service Provider shall comply with all applicable laws and regulations in the performance of the Services."
      )]),

      spacer,

      // Clause 7: Non-conflict and non-exclusivity
      // The service provider can provide services to other
      // clients — this is fundamentally different from
      // employment which requires exclusivity
      new Paragraph({ numbering: { reference: "svc-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "NON-EXCLUSIVITY AND NON-CONFLICT", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Parties acknowledge that this Agreement is non-exclusive in nature, and the Service Provider shall be free to provide similar services to other clients during the term of this Agreement, provided that such services do not conflict with or adversely affect the Service Provider's obligations to the Client under this Agreement. The Service Provider undertakes not to provide services to any direct competitor of the Client during the term of this Agreement without the prior written consent of the Client."
      )]),

      spacer,

      // Clause 8: Confidentiality
      new Paragraph({ numbering: { reference: "svc-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "CONFIDENTIALITY", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Service Provider acknowledges that during the performance of the Services it may have access to confidential information of the Client, including business plans, financial information, customer information, technical know-how and trade secrets. The Service Provider undertakes to hold all such confidential information in strict confidence, not to disclose it to any third party, and not to use it for any purpose other than the performance of the Services. This obligation of confidentiality shall survive the termination or expiry of this Agreement for an indefinite period."
      )]),

      spacer,

      // Clause 9: Intellectual property
      new Paragraph({ numbering: { reference: "svc-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "INTELLECTUAL PROPERTY", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "All deliverables, work products, reports, designs, drawings, software code, and other intellectual property created by the Service Provider in the performance of the Services under this Agreement (the 'Work Product') shall, upon payment of the agreed fees, become the sole and exclusive property of the Client. The Service Provider hereby assigns to the Client all rights, title and interest in and to the Work Product, including all intellectual property rights therein. The Service Provider shall execute all such documents and take all such actions as may be necessary to give effect to such assignment. The Service Provider shall retain ownership of any background intellectual property and pre-existing know-how that the Service Provider brings to bear on the performance of the Services, and shall grant the Client a perpetual, royalty-free, non-exclusive licence to use such background intellectual property to the extent necessary for the use of the Work Product."
      )]),

      spacer,

      // Clause 10: Indemnification
      new Paragraph({ numbering: { reference: "svc-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "INDEMNIFICATION", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "The Service Provider shall indemnify and hold harmless the Client from and against any losses, damages, costs and expenses (including reasonable attorney fees) arising out of or in connection with (a) any breach by the Service Provider of any provision of this Agreement; (b) any negligence or wilful misconduct of the Service Provider in the performance of the Services; (c) any claim that the Work Product or any part thereof infringes the intellectual property rights of any third party; or (d) any claim that the relationship between the Client and the Service Provider constitutes an employment relationship under any applicable law."
      )]),

      spacer,

      // Clause 11: Termination
      new Paragraph({ numbering: { reference: "svc-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "TERMINATION", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "Either Party may terminate this Agreement by giving the other Party thirty days' written notice. Notwithstanding the foregoing, either Party may terminate this Agreement immediately by written notice to the other Party in the event of (a) any material breach of this Agreement by the other Party that is not remedied within fifteen days of written notice; (b) the insolvency, bankruptcy, or winding up of the other Party; or (c) any act or omission of the other Party that brings the terminating Party into disrepute or that adversely affects the business or reputation of the terminating Party. Upon termination of this Agreement, the Service Provider shall return to the Client all property, documents and confidential information of the Client in its possession, and shall cooperate with the Client in the orderly transition of the Services to a successor service provider."
      )]),

      spacer,

      // Clause 12: Governing law and dispute resolution
      new Paragraph({ numbering: { reference: "svc-clauses", level: 0 },
        spacing: { after: 60, line: 360 }, alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: "GOVERNING LAW AND DISPUTE RESOLUTION", bold: true, underline: {} })] }),

      legalPara([new TextRun(
        "This Agreement shall be governed by and construed in accordance with the laws of India. Any dispute arising out of or in connection with this Agreement shall first be attempted to be resolved through good faith negotiations between the Parties. If the dispute cannot be resolved through negotiations within thirty days, the dispute shall be referred to and finally resolved by arbitration in accordance with the provisions of the Arbitration and Conciliation Act, 1996, by a sole arbitrator to be appointed by mutual consent of the Parties, with the seat of arbitration at New Delhi and the language of arbitration in English."
      )]),

      spacer, hrule(),

      // ─── Testimonium and Signature Block ───
      legalPara([
        new TextRun({ text: "IN WITNESS WHEREOF, ", bold: true }),
        new TextRun("the Parties hereto have caused this Service Agreement to be executed by their respective duly authorised representatives on the day, month and year first written above."),
      ]),

      spacer, spacer,

      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 60 },
        children: [
          new TextRun({ text: "For and on behalf of", bold: true }),
          new TextRun({ text: "\tFor and on behalf of", bold: true }),
        ],
      }),
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 60 },
        children: [
          new TextRun({ text: "M/s ABC Pvt. Ltd.", bold: true }),
          new TextRun({ text: "\tM/s ________ Consulting LLP", bold: true }),
        ],
      }),
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 60 },
        children: [
          new TextRun({ text: "(The Client)", italics: true }),
          new TextRun({ text: "\t(The Service Provider)", italics: true }),
        ],
      }),

      spacer, spacer, spacer,

      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 60 },
        children: [
          new TextRun("________________________"),
          new TextRun("\t________________________"),
        ],
      }),
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 60 },
        children: [
          new TextRun({ text: "Authorised Signatory", bold: true }),
          new TextRun({ text: "\tAuthorised Signatory", bold: true }),
        ],
      }),
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 60 },
        children: [
          new TextRun("Name: ________"),
          new TextRun("\tName: ________"),
        ],
      }),
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 60 },
        children: [
          new TextRun("Designation: ________"),
          new TextRun("\tDesignation: ________"),
        ],
      }),

      spacer, spacer,

      legalPara([new TextRun({ text: "WITNESSES:", bold: true, underline: {} })]),
      spacer,
      legalPara([new TextRun({ text: "1. Name: ________", bold: true })]),
      legalPara([new TextRun("   Address: ________")]),
      legalPara([new TextRun("   Signature: ________")]),
      spacer,
      legalPara([new TextRun({ text: "2. Name: ________", bold: true })]),
      legalPara([new TextRun("   Address: ________")]),
      legalPara([new TextRun("   Signature: ________")]),
    ],
  }],
});
