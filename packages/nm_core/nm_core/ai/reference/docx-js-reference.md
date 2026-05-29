# docx-js API Reference for Legal Document Generation

## Setup
```javascript
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
       Header, Footer, AlignmentType, PageOrientation, LevelFormat, ExternalHyperlink,
       InternalHyperlink, Bookmark, FootnoteReferenceRun, PositionalTab,
       PositionalTabAlignment, PositionalTabRelativeTo, PositionalTabLeader,
       TabStopType, TabStopPosition, Column, SectionType,
       TableOfContents, HeadingLevel, BorderStyle, WidthType, ShadingType,
       VerticalAlign, PageNumber, PageBreak } = require('docx');

// Export the Document object — the runner will pack it into DOCX
module.exports = new Document({ sections: [{ children: [/* content */] }] });
```

## Page Size
```javascript
// CRITICAL: docx-js defaults to A4, not US Letter
// Always set page size explicitly
sections: [{
  properties: {
    page: {
      size: {
        width: 12240,   // 8.5 inches in DXA (1440 DXA = 1 inch)
        height: 15840   // 11 inches in DXA
      },
      margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } // 1 inch margins
    }
  },
  children: [/* content */]
}]
```

Common page sizes (DXA units):
| Paper | Width | Height | Content Width (1" margins) |
|-------|-------|--------|---------------------------|
| US Letter | 12,240 | 15,840 | 9,360 |
| A4 (default) | 11,906 | 16,838 | 9,026 |

For Indian legal documents, use A4 with margins:
- Top: 1 inch (1440 DXA)
- Bottom: 1 inch (1440 DXA)
- Left: 1.25 inches (1800 DXA)
- Right: 1 inch (1440 DXA)

## Styles (Override Built-in Headings)
```javascript
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Times New Roman", size: 24 } } }, // 12pt default (size in half-points)
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Times New Roman" },
        paragraph: { spacing: { before: 240, after: 240 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Times New Roman" },
        paragraph: { spacing: { before: 180, after: 180 }, outlineLevel: 1 } },
    ]
  },
  sections: [{
    children: [
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Title")] }),
    ]
  }]
});
```

**Font size is in half-points:** size: 24 = 12pt, size: 28 = 14pt, size: 32 = 16pt

## Lists (NEVER use unicode bullets)
```javascript
// WRONG - never manually insert bullet characters
new Paragraph({ children: [new TextRun("• Item")] })  // BAD

// CORRECT - use numbering config
const doc = new Document({
  numbering: {
    config: [
      { reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "letters",
        levels: [{ level: 0, format: LevelFormat.LOWER_LETTER, text: "%1)", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    children: [
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Numbered item")] }),
      new Paragraph({ numbering: { reference: "letters", level: 0 },
        children: [new TextRun("Lettered item")] }),
    ]
  }]
});
```

Each reference creates INDEPENDENT numbering. Same reference continues (1,2,3 then 4,5,6). Different reference restarts.

## Tables
```javascript
// CRITICAL: Always set table width with DXA, never WidthType.PERCENTAGE
// CRITICAL: Use ShadingType.CLEAR (not SOLID) to prevent black backgrounds
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [4680, 4680], // Must sum to table width
  rows: [
    new TableRow({
      children: [
        new TableCell({
          borders,
          width: { size: 4680, type: WidthType.DXA },
          shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun("Cell")] })]
        })
      ]
    })
  ]
})
```

## Page Breaks
```javascript
// PageBreak must be inside a Paragraph
new Paragraph({ children: [new PageBreak()] })
// Or use pageBreakBefore
new Paragraph({ pageBreakBefore: true, children: [new TextRun("New page")] })
```

## Tab Stops (for signature blocks)
```javascript
// Right-align text on same line (e.g., Place/Date left, Party right)
new Paragraph({
  children: [
    new TextRun("Place: Delhi"),
    new TextRun("\tPETITIONER"),
  ],
  tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
})
```

## Headers/Footers
```javascript
sections: [{
  headers: {
    default: new Header({ children: [new Paragraph({ children: [new TextRun("Header")] })] })
  },
  footers: {
    default: new Footer({ children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun("Page "), new TextRun({ children: [PageNumber.CURRENT] })]
    })] })
  },
  children: [/* content */]
}]
```

## Paragraph Spacing
```javascript
new Paragraph({
  spacing: { before: 120, after: 120, line: 276 }, // line: 276 = 1.15 spacing
  children: [new TextRun("Text")]
})
```

## Critical Rules
1. **Set page size explicitly** — docx-js defaults to A4
2. **Never use \\n** — use separate Paragraph elements
3. **Never use unicode bullets** — use LevelFormat.BULLET with numbering config
4. **PageBreak must be in Paragraph** — standalone creates invalid XML
5. **Always set table width with DXA** — never use WidthType.PERCENTAGE
6. **Tables need dual widths** — columnWidths array AND cell width
7. **Use ShadingType.CLEAR** — never SOLID for table shading
8. **Font size is in half-points** — 24 = 12pt, 28 = 14pt
9. **Use Times New Roman** — standard for Indian courts
10. **Use tab stops for signature blocks** — not tables (tables have minimum height)

## Indian Court Document Pattern

Common helper functions and document skeleton used across all Indian legal documents:

```javascript
// ── Reusable helpers ──

/** Standard paragraph with Indian legal spacing (1.5 line, 6pt after) */
function legalPara(children, opts = {}) {
  return new Paragraph({
    spacing: { after: 120, line: 360 },
    alignment: AlignmentType.JUSTIFIED,
    ...opts,
    children,
  });
}

/** Bold + centered court-style heading */
function courtHeading(text, size = 24) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [new TextRun({ text, bold: true, size, font: "Times New Roman" })],
  });
}

/** Blank spacer line */
const spacer = new Paragraph({ spacing: { after: 120 }, children: [] });

// ── Document skeleton ──

module.exports = new Document({
  styles: {
    default: { document: { run: { font: "Times New Roman", size: 24 } } }, // 12pt
  },
  numbering: {
    config: [{
      reference: "body-paras",
      levels: [{
        level: 0, format: LevelFormat.DECIMAL, text: "%1.",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } },
      }],
    }],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },                    // A4
        margin: { top: 1440, bottom: 1440, left: 1800, right: 1440 }, // 1"/1.25"
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
      // Court header (centered, bold, caps)
      courtHeading("IN THE COURT OF ...", 26),
      // Case number
      courtHeading("SUIT NO. ________ OF 20__", 24),
      // Parties block: plaintiff details → "... PLAINTIFF" right → VERSUS → defendant → "... DEFENDANT" right
      // Document title (centered, bold)
      // "MOST RESPECTFULLY SHOWETH:" (centered, bold, underlined)
      // Numbered paragraphs starting "That..."
      // PRAYER heading + lettered sub-points
      // Signature block: Place/Date left, Party/Through/Advocate right (use TabStops)
      // VERIFICATION heading + standard text
    ],
  }],
});
```

Structure order for **court pleadings**: court header → case number → parties → title → body → prayer → signature → verification.

Structure order for **conveyancing deeds**: deed description → date/place → parties (BETWEEN/AND) → WHEREAS recitals → NOW THIS DEED WITNESSES → numbered clauses → schedule → IN WITNESS WHEREOF → signatures → witnesses.

## Available Templates

Use `read_docx_template(template_id)` to load the full example code for any template below.

| ID | Name | Category |
|----|------|----------|
| suit_permanent_injunction | Suit for Permanent Injunction | Civil Pleading |
| draft_affidavit | Draft Affidavit (Order XXXVII CPC) | Civil Pleading |
| writ_petition_article226 | Writ Petition (Art. 226) | Constitutional |
| agreement_for_sale | Agreement for Sale | Conveyancing |
| last_will_testament | Last Will and Testament | Conveyancing |
| anticipatory_bail | Anticipatory Bail Application | Criminal |
| complaint_sec138_NI_Act | Complaint u/s 138 NI Act | Criminal |
| consumer_complaint_CPA2019 | Consumer Complaint (CPA 2019) | Consumer |
| general_power_of_attorney | General Power of Attorney | Conveyancing |
| petition_grant_of_probate | Petition for Grant of Probate | Succession |
| divorce_mutual_consent_13B | Divorce by Mutual Consent (S.13B HMA) | Matrimonial |
| regular_bail_application | Regular Bail Application | Criminal |
| lease_deed | Lease Deed | Conveyancing |
| legal_notice_sec138_NI | Legal Notice u/s 138 NI Act | Notice |
| gift_deed | Gift Deed | Conveyancing |
| written_statement_defendant | Written Statement (Defendant) | Civil Pleading |
| suit_specific_performance | Suit for Specific Performance | Civil Pleading |
| caveat_section148A_CPC | Caveat (S.148-A CPC) | Civil Pleading |
| sale_deed | Sale Deed | Conveyancing |
| mortgage_deed | Mortgage Deed | Conveyancing |
| suit_recovery_orderXXXVII | Suit for Recovery (Order XXXVII CPC) | Civil Pleading |
| temporary_injunction_IA | Temporary Injunction IA (Order XXXIX) | Civil Pleading |
| special_leave_petition_civil | Special Leave Petition (Art. 136) | Constitutional |
| maintenance_section144_BNSS | Maintenance u/s 144 BNSS | Family Law |
| partnership_deed | Partnership Deed | Conveyancing |
| suit_ejectment_damages | Suit for Ejectment & Damages | Civil Pleading |
| restitution_conjugal_rights | Restitution of Conjugal Rights (S.9 HMA) | Matrimonial |
| contempt_petition | Contempt Petition (S.11-12 Contempt Act) | Quasi-Criminal |
| domestic_violence_petition | Domestic Violence Petition (DV Act 2005) | Social Welfare |
| relinquishment_deed | Relinquishment Deed | Conveyancing |
| letters_of_administration | Letters of Administration | Succession |
| special_leave_petition_criminal | SLP Criminal (Art. 136) | Constitutional |
| indigent_person_application | Indigent Person Application | Civil Procedure |
| notice_section80_CPC | Notice u/s 80 CPC | Notice |
| special_power_of_attorney | Special Power of Attorney | Conveyancing |
| execution_application | Execution Application | Civil Procedure |
| succession_certificate | Succession Certificate | Succession |
| notice_section106_TPA | Notice u/s 106 TPA | Notice |
| judicial_separation | Judicial Separation | Matrimonial |
| transfer_petition | Transfer Petition | Civil Procedure |
| vakalatnama | Vakalatnama (Advocate Authorization) | Authorization |
| memorandum_of_appeal | Memorandum of Appeal | Civil Appellate |
| maintenance_pendente_lite | Maintenance Pendente Lite (IA) | Matrimonial |
| divorce_section13_contested | Contested Divorce (S.13 HMA) | Matrimonial |
| habeas_corpus | Habeas Corpus Petition | Constitutional |
| quashing_FIR_section482 | Quashing FIR (S.482 CrPC/BNSS) | Criminal |
| amendment_of_pleadings | Amendment of Pleadings Application | Civil Procedure |
| condonation_of_delay | Condonation of Delay Application | Civil Procedure |
| arbitration_section11 | Arbitration Application (S.11) | ADR |
| special_marriage_act_divorce | Special Marriage Act Divorce | Matrimonial |
| arbitration_section9_interim | Interim Measures (S.9 Arbitration Act) | ADR |
| arbitration_section34_setting_aside | Setting Aside Award (S.34 Arbitration Act) | ADR |
| impleadment_order_I_rule_10 | Impleadment Application (Order I Rule 10) | Civil Procedure |
| review_order_XLVII | Review Application (Order XLVII) | Civil Procedure |
| compromise_decree_order_XXIII | Compromise Decree (Order XXIII) | Civil Procedure |
| memorandum_of_understanding | Memorandum of Understanding | Commercial |
| non_disclosure_agreement | Non-Disclosure Agreement | Commercial |
| employment_contract | Employment Contract | Commercial |
| shareholders_agreement | Shareholders Agreement | Commercial |
| service_agreement | Service Agreement | Commercial |
| section8_IBC_demand_notice | IBC Demand Notice (S.8) | Insolvency |
| section9_IBC_application | IBC Application by Creditor (S.9) | Insolvency |
| section7_IBC_application | IBC Application by Financial Creditor (S.7) | Insolvency |
| SARFAESI_section13_notice | SARFAESI Notice (S.13) | Banking |
| DRT_application_RDB_Act | DRT Application (RDB Act) | Banking |
| public_interest_litigation | Public Interest Litigation (PIL) | Constitutional |
| RTI_first_appeal | RTI First Appeal | Information Law |
| adoption_petition_HAMA | Adoption Petition (HAMA) | Family Law |
| income_tax_appeal_CITA | Income Tax Appeal (CITA) | Tax Law |
| NCLT_oppression_section241 | NCLT Oppression Petition (S.241) | Corporate Law |
| trademark_opposition | Trademark Opposition | IP Law |
| copyright_infringement_suit | Copyright Infringement Suit | IP Law |
| patent_pregrant_opposition | Patent Pre-grant Opposition | IP Law |
| trademark_license_agreement | Trademark License Agreement | IP Law |
| cease_and_desist_IP | Cease and Desist (IP) | IP Law |
| ITAT_appeal_section253 | ITAT Appeal (S.253 IT Act) | Tax Law |
| NCLAT_appeal_section421 | NCLAT Appeal (S.421 Companies Act) | Corporate Law |
| SAT_appeal_section15T | SAT Appeal (S.15T SEBI Act) | Securities Law |
| CCI_information_section19 | CCI Information (S.19 Competition Act) | Competition Law |
| NGT_application_section14 | NGT Application (S.14 NGT Act) | Environmental Law |
| guardianship_petition_GW_act | Guardianship Petition (GW Act) | Family Law |
| custody_petition_section26 | Custody Petition (S.26 HMA) | Family Law |
| christian_divorce_section10 | Christian Divorce (S.10 Divorce Act) | Personal Law |
| muslim_marriage_dissolution | Muslim Marriage Dissolution | Personal Law |
| change_of_name_petition | Change of Name Petition | Civil |
| RERA_complaint_section31 | RERA Complaint (S.31) | Real Estate |
| builder_buyer_agreement_RERA | Builder-Buyer Agreement (RERA) | Real Estate |
| joint_development_agreement | Joint Development Agreement | Real Estate |
| tripartite_agreement_home_loan | Tripartite Agreement (Home Loan) | Real Estate |
| construction_contract | Construction Contract | Real Estate |
| labour_court_statement_of_claim | Labour Court Statement of Claim | Labour Law |
| section_33C2_application_IDA | Recovery Application (S.33C(2) IDA) | Labour Law |
| PoSH_complaint_section9 | PoSH Complaint (S.9) | Labour Law |
| writ_petition_wrongful_termination | Writ Petition (Wrongful Termination) | Labour Law |
| employee_compensation_application | Employee Compensation Application | Labour Law |
| CAT_original_application | CAT Original Application | Service Law |
| TDSAT_petition | TDSAT Petition | Regulatory |
| DPDPA_complaint | DPDPA Complaint (Data Protection) | Data Privacy |
| RBI_ombudsman_complaint | RBI Ombudsman Complaint | Banking |
| election_petition_RP_act | Election Petition (RP Act) | Election Law |
