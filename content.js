/* =========================================================
   Institute of Credit Risk Professionals (ICRP) — content.js
   Curriculum, lesson HTML, SVG infographics and quiz/exam
   QUESTIONS ONLY. Correct answers live in the Answer_Key sheet
   (seeded by Code.gs) and are never sent to the browser.

   Question IDs are generated from position:
     topic quiz  -> W{week}-T{n}-Q{i}
     module exam -> W{week}-EXAM-Q{i}
     final exam  -> FINAL-Q{i}
   If you reorder questions here, update the Answer_Key sheet too.
   ========================================================= */
(function () {
  'use strict';

  const ARROW_DEFS = '<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor" style="fill:var(--muted)"/></marker></defs>';

  /* ---------------------------------------------------------
     WEEK 1, TOPIC 1.1
     --------------------------------------------------------- */
  const T1_1 = `
<p class="lede">Before you can judge a borrower, you need to know who else is lending to them, who sets the rules, and what each kind of lender is allowed to do. Nigeria's credit market has more layers than most people expect, and a loan that makes sense for a commercial bank can be the wrong product for a microfinance bank or a lending app.</p>

<h2>The regulator at the centre: CBN</h2>
<p>The Central Bank of Nigeria (CBN) licenses and supervises deposit-taking banks and most other financial institutions. Its powers come from the CBN Act 2007 and the Banks and Other Financial Institutions Act (BOFIA) 2020. BOFIA is the law you will hear quoted most often in credit work, because it covers lending limits, insider-related loans, the Global Standing Instruction framework and the CBN's power to step in when a bank's loan book goes bad.</p>
<p>For a credit analyst, the CBN matters in three practical ways:</p>
<ul>
  <li>It sets the <strong>prudential guidelines</strong> that decide how loans are classified and how much a lender must provision when repayments stop (you will cover this in Week 2).</li>
  <li>It sets the <strong>Monetary Policy Rate (MPR)</strong>, which moves the cost of funds for every lender and so moves the rate your borrower pays.</li>
  <li>It runs the <strong>Credit Risk Management System (CRMS)</strong>, a central register where banks report credit facilities. You will check it alongside the private credit bureaus before any approval.</li>
</ul>
<p>Deposits at banks and microfinance banks are insured by the Nigeria Deposit Insurance Corporation (NDIC). The NDIC does not approve loans, but it examines banks alongside the CBN and acts as liquidator when a bank fails, so a weak loan book is its problem too.</p>

<figure class="figure">
  <svg viewBox="0 0 760 360" role="img" aria-labelledby="f11t f11d">
    <title id="f11t">Structure of the Nigerian credit market</title>
    <desc id="f11d">The CBN sits at the top and supervises commercial, merchant and non-interest banks, microfinance banks, development finance institutions and finance companies. The FCCPC registers digital consumer lenders. Credit bureaus and the CRMS collect repayment data from all lenders.</desc>
    ${ARROW_DEFS}
    <rect x="270" y="14" width="220" height="54" rx="12" class="f-prim"/>
    <text x="380" y="38" text-anchor="middle" class="t-on t-h">CBN</text>
    <text x="380" y="56" text-anchor="middle" class="t-on" style="font-size:11px;font-weight:400">BOFIA 2020 · CBN Act 2007</text>
    <rect x="560" y="14" width="180" height="54" rx="12" class="f-acc-soft"/>
    <text x="650" y="38" text-anchor="middle" class="t-b">FCCPC</text>
    <text x="650" y="56" text-anchor="middle" class="t-muted">consumer protection</text>
    <rect x="20" y="14" width="180" height="54" rx="12" class="f-info-soft"/>
    <text x="110" y="38" text-anchor="middle" class="t-b">NDIC</text>
    <text x="110" y="56" text-anchor="middle" class="t-muted">deposit insurance</text>
    <path d="M380 68 V100 M95 100 H665" class="f-line"/>
    <path d="M95 100 V128 M285 100 V128 M475 100 V128" class="f-line"/>
    <path d="M650 68 V128" class="f-arrow" style="stroke-dasharray:5 4"/>
    <g>
      <rect x="20" y="130" width="150" height="104" rx="12" class="f-prim-soft"/>
      <text x="95" y="156" text-anchor="middle" class="t-b">Banks</text>
      <text x="95" y="178" text-anchor="middle" class="t-muted">Commercial</text>
      <text x="95" y="194" text-anchor="middle" class="t-muted">Merchant</text>
      <text x="95" y="210" text-anchor="middle" class="t-muted">Non-interest</text>
    </g>
    <g>
      <rect x="210" y="130" width="150" height="104" rx="12" class="f-prim-soft"/>
      <text x="285" y="156" text-anchor="middle" class="t-b">Microfinance</text>
      <text x="285" y="178" text-anchor="middle" class="t-muted">National</text>
      <text x="285" y="194" text-anchor="middle" class="t-muted">State</text>
      <text x="285" y="210" text-anchor="middle" class="t-muted">Unit (Tier 1 / 2)</text>
    </g>
    <g>
      <rect x="400" y="130" width="150" height="104" rx="12" class="f-prim-soft"/>
      <text x="475" y="156" text-anchor="middle" class="t-b">DFIs and OFIs</text>
      <text x="475" y="178" text-anchor="middle" class="t-muted">BOI · DBN · BOA</text>
      <text x="475" y="194" text-anchor="middle" class="t-muted">NEXIM · FMBN</text>
      <text x="475" y="210" text-anchor="middle" class="t-muted">Finance companies</text>
    </g>
    <g>
      <rect x="590" y="130" width="150" height="104" rx="12" class="f-acc-soft"/>
      <text x="665" y="156" text-anchor="middle" class="t-b">Digital lenders</text>
      <text x="665" y="178" text-anchor="middle" class="t-muted">Loan apps</text>
      <text x="665" y="194" text-anchor="middle" class="t-muted">BNPL</text>
      <text x="665" y="210" text-anchor="middle" class="t-muted">Embedded credit</text>
    </g>
    <path d="M95 234 V270 M285 234 V270 M475 234 V270 M665 234 V270 M95 270 H665 M380 270 V292" class="f-line"/>
    <rect x="200" y="294" width="360" height="52" rx="12" class="f-acc"/>
    <text x="380" y="317" text-anchor="middle" class="t-dark">Credit bureaus + CBN CRMS</text>
    <text x="380" y="335" text-anchor="middle" class="t-dark" style="font-size:11px;font-weight:400">CRC · FirstCentral · CreditRegistry</text>
  </svg>
  <figcaption>Figure 1.1: Who regulates whom. Every lender reports into the bureaus, which is how you see a borrower's full debt picture.</figcaption>
</figure>

<h2>Commercial, merchant and non-interest banks</h2>
<p>Commercial banks hold the largest share of the loan book. They are licensed with international, national or regional authorisation, and the 2024 recapitalisation programme (which ran to March 2026) raised the minimum capital for each category sharply: ₦500 billion for international banks, ₦200 billion for national banks and ₦50 billion for regional banks. More capital means bigger single obligor limits, because a commercial bank's lending to one borrower is capped at a percentage of its shareholders' funds.</p>
<p>Merchant banks focus on corporate and investment banking. They do large ticket working capital, trade finance and structured deals, and they do not run retail branch networks. Non-interest banks such as Jaiz, TAJBank and Lotus lend under Islamic finance structures (murabaha, ijarah, musharakah), so the "interest" in your analysis becomes a profit rate or rental, but the cash flow questions stay the same.</p>

<h2>Microfinance banks</h2>
<p>Microfinance banks (MFBs) lend to individuals, micro enterprises and small businesses that commercial banks often find too small or too informal. They are licensed as Unit, State or National MFBs, and the licence category limits where they can operate. MFBs also face tighter single obligor limits than commercial banks, so a ₦50 million request that is routine at a tier-one bank may be impossible for a unit MFB.</p>
<p>A growing number of fintechs now hold MFB licences. That matters because an MFB licence lets them take deposits, which gives them cheaper funding than a lender that borrows from investors at high rates.</p>

<h2>Development finance institutions</h2>
<p>DFIs are government-owned lenders with a policy mandate. The ones you will meet most often:</p>
<div class="table-wrap"><table>
  <thead><tr><th>Institution</th><th>Focus</th><th>How it lends</th></tr></thead>
  <tbody>
    <tr><td>Bank of Industry (BOI)</td><td>Manufacturing, agro-processing, SMEs, creative industry</td><td>Direct loans, plus intervention funds managed through banks</td></tr>
    <tr><td>Development Bank of Nigeria (DBN)</td><td>MSMEs</td><td>Wholesale only: lends to participating banks and MFBs, who on-lend</td></tr>
    <tr><td>Bank of Agriculture (BOA)</td><td>Farmers and agribusiness</td><td>Direct and through cooperatives</td></tr>
    <tr><td>NEXIM Bank</td><td>Non-oil exporters</td><td>Export finance, guarantees</td></tr>
    <tr><td>FMBN</td><td>Housing</td><td>National Housing Fund mortgages</td></tr>
    <tr><td>NIRSAL</td><td>Agriculture</td><td>Credit risk guarantees on bank loans to the agric value chain</td></tr>
  </tbody>
</table></div>
<p>When a bank on-lends DBN or BOI funds, the bank still carries the credit risk. Cheap money does not make a bad borrower good, and many intervention fund losses in Nigeria came from lenders treating the subsidised rate as a reason to relax underwriting.</p>

<h2>Finance companies and digital lenders</h2>
<p>Finance companies are CBN-licensed other financial institutions (OFIs). They cannot take deposits from the public, so they fund themselves through commercial paper, bank lines and investor notes. Their cost of funds is high, which shows up in what they charge.</p>
<p>Digital lenders (loan apps, buy-now-pay-later providers and embedded credit inside e-commerce or payment apps) are a different case. A digital lender that is not a bank or MFB must register with the Federal Competition and Consumer Protection Commission (FCCPC). The FCCPC's 2025 Digital, Electronic, Online, or Non-Traditional Consumer Lending Regulations replaced the earlier interim framework and set rules on disclosure, data use and debt collection conduct. Many operators also hold a state money lender's licence. You will study the recovery rules in detail in Week 8.</p>

<div class="callout callout--warn"><span class="callout__t">Why the licence matters to you</span><p>When you assess an applicant, ask who else is lending to them and under what rules. A trader with an MFB loan, two app loans and a cooperative facility has four claims on the same cash flow, and only some of them will show on the bureau report.</p></div>

<h2>The informal layer</h2>
<p>Much of Nigerian borrowing never touches a licensed lender. Ajo and esusu contribution groups, cooperative societies, market association loans and family support all carry repayment obligations. They rarely appear on a bureau report, but they come out of the same income. Ask about them directly. In markets like Alaba, Balogun or Onitsha Main Market, a good analyst also asks the association chairman about the applicant.</p>

<h2>Worked example: comparing the cost of two offers</h2>
<p>A Yaba fashion designer needs ₦500,000 for three months to buy fabric for a wedding season order. She has two offers.</p>
<div class="calc"><div class="calc__head">Offer A: commercial bank, 30% per annum on the outstanding balance, no fee (simplified as flat for comparison)</div>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Interest: ₦500,000 × 30% × 3 ÷ 12</td><td>₦37,500</td></tr>
<tr class="total"><td>Total cost of credit</td><td>₦37,500</td></tr></table></div>
<div class="calc"><div class="calc__head">Offer B: loan app, 5% flat per month plus 2% upfront fee</div>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Interest: ₦500,000 × 5% × 3</td><td>₦75,000</td></tr>
<tr><td>Fee: ₦500,000 × 2%</td><td>₦10,000</td></tr>
<tr class="total"><td>Total cost of credit</td><td>₦85,000</td></tr></table>
<div class="calc__note">Offer B costs more than twice as much. The app may still win the customer because it disburses in minutes with no collateral or statement. That speed premium is the business model of digital lending.</div></div>
<p>As an analyst you are not choosing for the customer, but you need to see that a borrower juggling several app loans at these prices can run out of cash fast, even with a healthy business underneath.</p>

<h2>What to take from this topic</h2>
<ul>
  <li>The CBN supervises banks, MFBs, DFIs and finance companies. The FCCPC registers non-bank digital consumer lenders.</li>
  <li>Each licence type has different funding costs, lending limits and customers.</li>
  <li>DFI money carries the same credit risk once a bank on-lends it.</li>
  <li>Bureaus and the CRMS show formal debt. Informal obligations need direct questions.</li>
</ul>
`;

  /* ---------------------------------------------------------
     WEEK 1, TOPIC 1.2
     --------------------------------------------------------- */
  const T1_2 = `
<p class="lede">The 5 Cs are the oldest checklist in lending, and every credit committee in Lagos still uses them. The trick is applying them to Nigerian borrowers, many of whom have strong businesses and weak paperwork.</p>

<figure class="figure">
  <svg viewBox="0 0 760 300" role="img" aria-labelledby="f12t f12d">
    <title id="f12t">The 5 Cs of credit</title>
    <desc id="f12d">Five circles labelled Character, Capacity, Capital, Collateral and Conditions surround a central circle reading Credit decision. Capacity is drawn largest because it is the primary source of repayment.</desc>
    <circle cx="380" cy="150" r="62" class="f-prim"/>
    <text x="380" y="146" text-anchor="middle" class="t-on t-h">Credit</text>
    <text x="380" y="165" text-anchor="middle" class="t-on">decision</text>
    <g><circle cx="140" cy="80" r="52" class="f-prim-soft"/><text x="140" y="76" text-anchor="middle" class="t-b">Character</text><text x="140" y="94" text-anchor="middle" class="t-muted">Will they pay?</text></g>
    <g><circle cx="380" cy="40" r="0"/></g>
    <g><circle cx="620" cy="80" r="62" class="f-acc-soft"/><text x="620" y="76" text-anchor="middle" class="t-b">Capacity</text><text x="620" y="94" text-anchor="middle" class="t-muted">Can they pay?</text></g>
    <g><circle cx="140" cy="230" r="52" class="f-prim-soft"/><text x="140" y="226" text-anchor="middle" class="t-b">Capital</text><text x="140" y="244" text-anchor="middle" class="t-muted">Their own stake</text></g>
    <g><circle cx="620" cy="230" r="52" class="f-prim-soft"/><text x="620" y="226" text-anchor="middle" class="t-b">Collateral</text><text x="620" y="244" text-anchor="middle" class="t-muted">Second way out</text></g>
    <g><circle cx="380" cy="268" r="0"/></g>
    <rect x="300" y="244" width="160" height="46" rx="23" class="f-info-soft"/>
    <text x="380" y="264" text-anchor="middle" class="t-b">Conditions</text>
    <text x="380" y="281" text-anchor="middle" class="t-muted">Economy, sector, purpose</text>
    <path d="M190 95 L322 132 M560 95 L440 132 M190 215 L322 170 M570 215 L440 170 M380 212 V244" class="f-line"/>
  </svg>
  <figcaption>Figure 1.2: The 5 Cs. Capacity is drawn largest on purpose: cash flow repays loans, collateral only covers the shortfall.</figcaption>
</figure>

<h2>Character: will they pay?</h2>
<p>Character is the borrower's track record and attitude to debt. In Nigeria you build that picture from several sources, because no single one is complete:</p>
<ul>
  <li><strong>Credit bureau reports</strong> from CRC, FirstCentral and CreditRegistry, plus the CBN CRMS. Look for past delinquencies, written-off loans and how many lenders they owe now.</li>
  <li><strong>BVN and NIN</strong> to confirm identity and to link accounts across banks.</li>
  <li><strong>Bank statement behaviour</strong>: returned cheques, frequent overdrafts past their limit, gambling or betting platform debits.</li>
  <li><strong>References</strong>: a market association executive, suppliers who give the trader credit, the landlord, an employer's HR desk.</li>
  <li><strong>Time in business and at address</strong>: a trader who has held the same shop for nine years is easier to find than one who moved twice last year.</li>
</ul>
<p>A thin bureau file is not bad character. Many good informal sector borrowers have never had a formal loan. Treat a thin file as missing information and look harder at the other sources.</p>

<h2>Capacity: can they pay?</h2>
<p>Capacity is the borrower's ability to meet instalments from their normal cash flow. It is the most important C, because the first way out of any loan is the borrower's income.</p>
<p>For businesses, you measure capacity with the Debt Service Coverage Ratio (DSCR):</p>
<div class="callout"><span class="callout__t">Formula</span><p><strong>DSCR = Net cash available for debt service ÷ Total debt service due</strong> (for the same period, usually monthly). Most Nigerian lenders want at least 1.25x for SMEs, and higher where cash flow is seasonal or volatile.</p></div>
<p>For salaried borrowers, lenders use a debt-to-income cap. Many Nigerian banks and payroll lenders cap total monthly loan deductions at about one third of net pay. The cap exists because the borrower still has rent, school fees, transport and family obligations.</p>

<div class="calc"><div class="calc__head">Capacity check: salaried applicant</div>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Net monthly salary (from 6 months of statements)</td><td>₦850,000</td></tr>
<tr><td>Maximum total deductions at 33%</td><td>₦280,500</td></tr>
<tr class="neg"><td>Less: existing loan app repayment found on the statement</td><td>(₦40,000)</td></tr>
<tr class="total"><td>Headroom for the new loan</td><td>₦240,500</td></tr></table>
<div class="calc__note">At 30% per annum over 12 months, ₦240,500 a month supports a loan of about ₦2.46 million. A ₦3 million request would need ₦292,461 a month, which breaks the cap.</div></div>

<h2>Capital: what have they put in?</h2>
<p>Capital is the borrower's own money in the business or the asset. A trader who built ₦25 million of stock from profits over ten years has something to lose. A start-up asking the bank to fund 100% of a new shop has nothing to lose, and the bank carries all the risk.</p>
<p>For SMEs, look at the owner's equity on the balance sheet and test it. Unaudited accounts often show "capital" that is really a director's loan, or stock valued at selling price instead of cost. For asset finance, capital is the equity contribution, often 20% to 30% of the asset price paid upfront by the borrower.</p>

<h2>Collateral: the second way out</h2>
<p>Collateral protects the lender if capacity fails. It should never be the reason to approve a loan. A lender that says yes "because the property is worth twice the loan" has usually not looked hard at the cash flow, and enforcing on property in Nigeria is slow and expensive.</p>
<p>Common collateral types in Nigerian lending:</p>
<ul>
  <li>Legal mortgage over land and buildings (needs Governor's Consent to be fully perfected, covered in Week 6)</li>
  <li>Charges over movable assets such as vehicles, equipment and stock, registered on the National Collateral Registry (NCR)</li>
  <li>All-assets debenture over a company, registered at the Corporate Affairs Commission</li>
  <li>Cash collateral, treasury bills or fixed deposits under lien</li>
  <li>Personal guarantees from directors or a credible third party</li>
  <li>Post-dated cheques and domiciliation of sales proceeds (not true security, but they create repayment discipline and legal options)</li>
</ul>

<h2>Conditions: the world around the loan</h2>
<p>Conditions are everything outside the borrower's control that affects repayment. For Nigerian lending in recent years that list is long:</p>
<ul>
  <li><strong>Exchange rate</strong>: importers who buy in dollars and sell in naira took heavy losses after the 2023 and 2024 devaluations.</li>
  <li><strong>Inflation and interest rates</strong>: high inflation squeezes customers' spending, and a high MPR raises loan costs.</li>
  <li><strong>Energy costs</strong>: diesel and petrol prices after fuel subsidy removal hit manufacturers, cold rooms and logistics firms.</li>
  <li><strong>Sector and regulatory risk</strong>: import bans, FX restrictions, state levies, a new tax regime.</li>
  <li><strong>Purpose of the loan</strong>: funding stock for a season you can see is lower risk than "general business expansion".</li>
</ul>

<h2>Worked example: putting the Cs together</h2>
<p>An Alaba electronics trader shows ₦3.62 million of net monthly cash after business costs and drawings. He asks for ₦15 million over 6 months at 30% per annum.</p>
<div class="calc"><div class="calc__head">DSCR on the request</div>
<table><tr><th>Item</th><th>Amount</th></tr>
<tr><td>Net cash available per month</td><td>₦3,620,000</td></tr>
<tr><td>Monthly instalment, ₦15m over 6 months at 30% (reducing balance)</td><td>₦2,723,250</td></tr>
<tr class="total"><td>DSCR = 3,620,000 ÷ 2,723,250</td><td>1.33x</td></tr></table>
<div class="calc__note">1.33x passes a 1.25x minimum, but only just, and only if there is no other debt. Case Study 1 shows what happens when the bureau report turns up an MFB loan he did not mention.</div></div>

<div class="callout callout--info"><span class="callout__t">Analyst habit</span><p>Write one line for each C before you write a recommendation. If you cannot write the Capacity line with a number in it, you are not ready to recommend.</p></div>
`;

  /* ---------------------------------------------------------
     WEEK 1, TOPIC 1.3
     --------------------------------------------------------- */
  const T1_3 = `
<p class="lede">A loan is not one decision. It moves through five stages, and a mistake at any of them can lose the lender money. Credit analysts work mostly in underwriting, but you need to understand the whole cycle because the problems you catch at underwriting show up later in monitoring and recovery.</p>

<figure class="figure">
  <svg viewBox="0 0 760 210" role="img" aria-labelledby="f13t f13d">
    <title id="f13t">The credit lifecycle</title>
    <desc id="f13d">Five stages in sequence: Origination, Underwriting, Disbursement, Monitoring and Recovery. A return arrow from Monitoring back to Origination shows repeat lending to good customers.</desc>
    ${ARROW_DEFS}
    <g>
      <rect x="10" y="50" width="130" height="80" rx="14" class="f-prim-soft"/><text x="75" y="84" text-anchor="middle" class="t-b">1. Origination</text><text x="75" y="104" text-anchor="middle" class="t-muted">Lead + pre-screen</text>
      <rect x="160" y="50" width="130" height="80" rx="14" class="f-prim"/><text x="225" y="84" text-anchor="middle" class="t-on">2. Underwriting</text><text x="225" y="104" text-anchor="middle" class="t-on" style="font-size:11px;font-weight:400">Analysis + approval</text>
      <rect x="310" y="50" width="130" height="80" rx="14" class="f-prim-soft"/><text x="375" y="84" text-anchor="middle" class="t-b">3. Disbursement</text><text x="375" y="104" text-anchor="middle" class="t-muted">Docs + security</text>
      <rect x="460" y="50" width="130" height="80" rx="14" class="f-info-soft"/><text x="525" y="84" text-anchor="middle" class="t-b">4. Monitoring</text><text x="525" y="104" text-anchor="middle" class="t-muted">Repayment + EWS</text>
      <rect x="610" y="50" width="140" height="80" rx="14" class="f-warn-soft"/><text x="680" y="84" text-anchor="middle" class="t-b">5. Recovery</text><text x="680" y="104" text-anchor="middle" class="t-muted">Collect or restructure</text>
    </g>
    <path d="M140 90 H158 M290 90 H308 M440 90 H458 M590 90 H608" class="f-arrow"/>
    <path d="M525 130 V170 H75 V132" class="f-arrow" style="stroke-dasharray:5 4"/>
    <text x="300" y="190" text-anchor="middle" class="t-muted">Good payers return for repeat facilities</text>
  </svg>
  <figcaption>Figure 1.3: The credit lifecycle. Analysts own stage 2 but feed and learn from every other stage.</figcaption>
</figure>

<h2>1. Origination</h2>
<p>Origination is how the loan request arrives: a relationship manager visiting a market, a branch walk-in, a referral, or an application inside a lending app. The originator collects the request, the basic KYC documents and the first set of financial information.</p>
<p>Good origination includes a <strong>pre-screen</strong>. Is the applicant inside the lender's target market? Is the sector on the restricted list? Does the bureau already show a written-off loan? Killing an unsuitable request early saves days of analyst time. In digital lending the pre-screen is automated: BVN validation, device checks and a bureau pull happen before a human sees anything.</p>
<p>One rule to remember: the person who brings in a loan is paid to grow the book, so they are not the right person to approve it. That separation of duties is why analysts exist.</p>

<h2>2. Underwriting</h2>
<p>Underwriting is where you work. You take the request and decide whether the lender should take the risk, how much, for how long, at what price and with what protections. The usual steps are:</p>
<ol>
  <li>Verify identity and the business: BVN, NIN, CAC records, a site visit or video call.</li>
  <li>Pull and read bureau reports and the CRMS.</li>
  <li>Analyse 6 to 12 months of bank statements and any financial statements.</li>
  <li>Assess the 5 Cs and calculate capacity (DSCR or debt-to-income).</li>
  <li>Structure the facility: type, amount, tenor, repayment pattern, security, covenants.</li>
  <li>Write the credit memo (the Credit Appraisal Memorandum, or CAM) and recommend.</li>
  <li>Present to the approving authority.</li>
</ol>
<p>Approval authority depends on size. A small MFB loan may be approved by a branch manager and a credit officer together. A ₦50 million facility at a commercial bank may need the Management Credit Committee (MCC), and very large exposures go to the Board Credit Committee. You will practise writing and defending a CAM in Week 7.</p>

<h2>3. Documentation and disbursement</h2>
<p>An approval is not money in the account. Before disbursement the lender must document the deal and satisfy every <strong>condition precedent</strong> in the approval. Typical conditions precedent:</p>
<ul>
  <li>Signed offer letter accepted by the borrower (and a board resolution for a company)</li>
  <li>Security documents signed and, where possible, perfected or filed (NCR registration, deed of legal mortgage, CAC charge registration)</li>
  <li>Guarantor forms signed and the guarantor's identity verified</li>
  <li>Post-dated cheques or a GSI mandate collected</li>
  <li>Insurance on the asset noted in the lender's favour</li>
  <li>Domiciliation letter acknowledged by the paying party, where sales proceeds are to pass through the lender</li>
</ul>
<p>A separate credit administration or operations team usually checks these, not the analyst. Disbursing before conditions are met is one of the most common causes of losses that should never have happened, because a lender with unsigned or unperfected security has nothing to enforce when things go wrong.</p>

<h2>4. Monitoring</h2>
<p>Once the money is out, the lender watches the loan. Monitoring covers:</p>
<ul>
  <li>Repayment tracking and days past due</li>
  <li>Covenant checks: is turnover still passing through the domiciled account? Has the borrower taken new debt above an agreed cap?</li>
  <li>Periodic site visits and stock checks for trade and working capital loans</li>
  <li>Annual reviews of renewable facilities such as overdrafts</li>
  <li>Bureau re-checks to spot new borrowing elsewhere</li>
</ul>
<p>The goal is to spot <strong>early warning signals</strong> before the borrower actually misses a payment. A drop in account turnover, cheques returned to suppliers, unexplained stock shortages or the owner suddenly hard to reach are all signals. Acting early (a conversation, a tighter limit, a restructure) usually recovers far more than waiting for default.</p>

<h2>5. Recovery</h2>
<p>When repayments stop, the loan moves to collections and recovery. The tools, from softest to hardest, include reminders and calls, field visits, restructuring, calling on the guarantor, presenting cheques, activating the Global Standing Instruction (GSI) to debit the borrower's accounts in other banks, enforcing on security and finally legal action or receivership.</p>
<p>Recovery in Nigeria has strict conduct rules. The FCCPC and CBN have both sanctioned lenders for harassment, contacting a borrower's phone contacts and publishing debtors' names. Week 8 covers what is allowed.</p>

<h2>Expected loss: one number that links the stages</h2>
<p>Lenders summarise the risk of a loan with a simple formula. You will see it again when you study provisioning and scorecards.</p>
<div class="callout"><span class="callout__t">Formula</span><p><strong>Expected Loss (EL) = PD × LGD × EAD</strong>. PD is the probability of default, LGD is the share of the exposure you lose if default happens (after recoveries), and EAD is the exposure at default.</p></div>
<div class="calc"><div class="calc__head">Expected loss on a ₦10 million SME loan</div>
<table><tr><th>Input</th><th>Value</th></tr>
<tr><td>Exposure at default (EAD)</td><td>₦10,000,000</td></tr>
<tr><td>Probability of default (PD), from the scorecard</td><td>4%</td></tr>
<tr><td>Loss given default (LGD), unsecured trade loan</td><td>55%</td></tr>
<tr class="total"><td>EL = 10,000,000 × 0.04 × 0.55</td><td>₦220,000</td></tr></table>
<div class="calc__note">Good underwriting lowers PD. Good documentation and security lower LGD. Good monitoring catches problems while EAD is still falling. Each stage of the lifecycle pulls on one part of the formula.</div></div>

<div class="table-wrap"><table>
  <thead><tr><th>Stage</th><th>Usual owner</th><th>What goes wrong if it is weak</th></tr></thead>
  <tbody>
    <tr><td>Origination</td><td>Relationship manager, sales agent, app funnel</td><td>Wrong customers enter the pipeline; fraud slips in</td></tr>
    <tr><td>Underwriting</td><td>Credit analyst, credit committee</td><td>Loans too big for the cash flow; hidden debt missed</td></tr>
    <tr><td>Disbursement</td><td>Credit administration, legal, operations</td><td>Unperfected security; missing guarantor signatures</td></tr>
    <tr><td>Monitoring</td><td>Relationship manager, portfolio or risk team</td><td>Distress spotted too late to fix</td></tr>
    <tr><td>Recovery</td><td>Collections, recovery, legal</td><td>Low recoveries; regulatory sanctions for bad conduct</td></tr>
  </tbody>
</table></div>
`;

  /* ---------------------------------------------------------
     WEEK 1 CASE STUDIES
     --------------------------------------------------------- */
  const C1_1 = `
<p class="lede">Chinedu Okafor (not his real name) has run an electronics shop in Alaba International Market, Ojo, for eleven years. He sells televisions, sound systems and home appliances to retailers from across the South-West and to walk-in customers. He has asked your MFB for ₦15 million working capital, repayable over 6 months, to stock up ahead of the December season.</p>

<div class="img-ph"><img src="assets/images/case-alaba-market.jpg" alt="Busy aisle in Alaba International Market, Lagos, with electronics shops stacked with television boxes and sound systems" onerror="this.remove()"/><br/>Image placeholder: <code>assets/images/case-alaba-market.jpg</code></div>

<h2>What the file contains</h2>
<ul>
  <li>CAC Business Name registration (BN), in his name</li>
  <li>12 months of statements from his business current account at a tier-one bank</li>
  <li>A handwritten stock list valued at ₦31 million</li>
  <li>Letter from his line association confirming membership since 2014</li>
  <li>Shop tenancy receipt: ₦6 million per year, paid annually</li>
  <li>CRC and FirstCentral reports</li>
</ul>

<h2>What the statements show</h2>
<div class="calc"><div class="calc__head">Monthly averages from 12 months of statements</div>
<table><tr><th>Item</th><th>Monthly</th></tr>
<tr><td>Average credit turnover</td><td>₦41,500,000</td></tr>
<tr><td>Less: transfers from his own savings account and POS cash-ins he redeposits</td><td>(₦3,500,000)</td></tr>
<tr><td>Adjusted sales</td><td>₦38,000,000</td></tr>
<tr><td>Gross margin (from supplier invoices sampled)</td><td>14%</td></tr>
<tr><td>Gross profit</td><td>₦5,320,000</td></tr>
<tr class="neg"><td>Shop rent (₦6m ÷ 12)</td><td>(₦500,000)</td></tr>
<tr class="neg"><td>Four sales boys at ₦80,000</td><td>(₦320,000)</td></tr>
<tr class="neg"><td>Transport, loading, levies, generator</td><td>(₦280,000)</td></tr>
<tr class="neg"><td>Personal drawings (school fees, household)</td><td>(₦600,000)</td></tr>
<tr class="total"><td>Net cash available</td><td>₦3,620,000</td></tr></table></div>

<p>On the request alone, the instalment of ₦2,723,250 gives a DSCR of 1.33x. That looks acceptable.</p>

<h2>What the bureau shows</h2>
<p>CRC is clean. FirstCentral shows a ₦3 million facility from another MFB, taken four months ago, with a monthly repayment of about ₦580,000. Chinedu did not mention it on his application. When you ask, he says it is "small, just for my brother's shop".</p>
<p>The statements also show December and January sales about 45% above his average, and February to April about 25% below.</p>

<h2>Questions for you</h2>
<ol>
  <li>Recalculate DSCR including the undisclosed loan. Does the request still work?</li>
  <li>How should the undisclosed loan affect your view of Character?</li>
  <li>What is the risk of a 6-month tenor that runs from November to April?</li>
  <li>What security can you realistically take, given that he rents the shop?</li>
  <li>Write your recommendation in three sentences.</li>
</ol>

<h2>Suggested answer</h2>
<div class="calc"><div class="calc__head">DSCR with all known debt</div>
<table><tr><th>Item</th><th>Monthly</th></tr>
<tr><td>Net cash available</td><td>₦3,620,000</td></tr>
<tr class="neg"><td>Existing MFB repayment</td><td>(₦580,000)</td></tr>
<tr><td>Cash left for the new loan</td><td>₦3,040,000</td></tr>
<tr><td>New instalment at ₦15m</td><td>₦2,723,250</td></tr>
<tr class="total"><td>DSCR at ₦15m</td><td>1.12x</td></tr>
<tr><td>New instalment at ₦10m</td><td>₦1,815,500</td></tr>
<tr class="total"><td>DSCR at ₦10m</td><td>1.67x</td></tr></table></div>
<p><strong>Capacity.</strong> At ₦15 million the DSCR falls to 1.12x, below a 1.25x floor, and that is before the February to April slowdown. At ₦10 million it is 1.67x, which leaves room for the slow months.</p>
<p><strong>Character.</strong> Not mentioning the loan is a concern but not a deal breaker. His eleven years in the market, the association letter and a clean repayment record on that same MFB loan count in his favour. Record the non-disclosure in the memo, make a full debt declaration a condition, and add a covenant that he takes no new debt without your consent.</p>
<p><strong>Tenor.</strong> A loan that runs into the slow months should not have flat instalments. Better options are a 4-month facility with larger repayments in December and January, or a 6-month facility with a stepped schedule.</p>
<p><strong>Security.</strong> He does not own the shop, so there is no property to mortgage. Realistic security is a charge over his stock registered on the National Collateral Registry, a personal guarantee from a credible person (ideally someone with a salary or property), post-dated cheques and a GSI mandate. Ask for the association's written support too. In Alaba that carries real weight.</p>
<p><strong>Recommendation.</strong> Approve ₦10 million over 4 months with a stepped repayment weighted to December and January. Conditions: NCR-registered charge over stock, one acceptable guarantor, post-dated cheques, GSI mandate and a signed declaration of all existing debts. Decline the ₦15 million request because capacity is too thin once the existing MFB loan is included.</p>
`;

  const C1_2 = `
<p class="lede">Two applicants walk into the same Lagos MFB branch on the same morning. Both want a personal loan. One has a payslip and a corporate email address. The other has two POS terminals and a stall under a bridge in Mushin. The obvious answer is not always the right one.</p>

<div class="img-ph"><img src="assets/images/case-pos-agent.jpg" alt="POS agent stand under an umbrella on a Lagos street with two card terminals and a cash box" onerror="this.remove()"/><br/>Image placeholder: <code>assets/images/case-pos-agent.jpg</code></div>

<h2>Applicant A: Tolu, software engineer</h2>
<ul>
  <li>Works for a Lagos fintech, 2 years in the role, confirmed staff</li>
  <li>Net salary ₦850,000, paid on the 25th into a tier-one bank account</li>
  <li>Requests ₦3 million over 12 months to pay rent and furnish a new flat in Lekki</li>
  <li>Statements show a ₦40,000 monthly loan app repayment and regular transfers to a crypto exchange</li>
  <li>Bureau: one loan app facility, current. No defaults.</li>
</ul>

<h2>Applicant B: Ibrahim, POS agent</h2>
<ul>
  <li>Runs two terminals (one Moniepoint, one OPay) for 3 years at the same spot</li>
  <li>Monthly transaction value across both terminals: about ₦45 million</li>
  <li>Requests ₦1 million over 3 months to increase his float, because he turns customers away on busy days</li>
  <li>Has a rented room nearby and supports a wife and two children</li>
  <li>Bureau: no record. Thin file.</li>
</ul>

<h2>The trap in Applicant B's numbers</h2>
<p>₦45 million a month looks like a big business. It is not income. A POS agent's turnover is mostly the customer's own money passing through: the customer transfers ₦10,000 to the agent's wallet, the agent hands over ₦10,000 cash. The agent earns the charge on top.</p>
<div class="calc"><div class="calc__head">Ibrahim's real income</div>
<table><tr><th>Item</th><th>Monthly</th></tr>
<tr><td>Transaction value</td><td>₦45,000,000</td></tr>
<tr><td>Net margin after platform charges (about ₦150 per ₦10,000)</td><td>1.5%</td></tr>
<tr><td>Gross commission income</td><td>₦675,000</td></tr>
<tr class="neg"><td>Stall rent, levies, one assistant, transport to the bank</td><td>(₦220,000)</td></tr>
<tr class="neg"><td>Household spending</td><td>(₦200,000)</td></tr>
<tr class="total"><td>Cash available for debt service</td><td>₦255,000</td></tr></table></div>

<h2>Questions for you</h2>
<ol>
  <li>Calculate Tolu's maximum loan under a 33% debt-to-income cap at 30% per annum over 12 months.</li>
  <li>What is the risk in Tolu's profile that a payslip does not show?</li>
  <li>Can Ibrahim afford ₦1 million over 3 months at 36% per annum? What can he afford?</li>
  <li>Which applicant is the riskier credit, and why?</li>
</ol>

<h2>Suggested answer</h2>
<p><strong>Tolu.</strong> ₦850,000 × 33% = ₦280,500, less the ₦40,000 app loan, leaves ₦240,500. That supports about ₦2.46 million over 12 months. The ₦3 million request needs ₦292,461 a month and fails. Two fixes work: lend ₦2.4 million over 12 months (₦233,969 a month), or ₦3 million over 18 months (₦209,010 a month).</p>
<p>His bigger risk is that a private sector salary is not deducted at source. Unlike a civil servant on Remita, nothing stops his employer paying him somewhere else, and fintech jobs can disappear quickly when a company cuts staff. The crypto transfers are not a reason to decline, but they show money leaving that could be needed for repayment. Mitigate with a salary domiciliation letter acknowledged by HR, a GSI mandate and a direct debit on payday.</p>
<p><strong>Ibrahim.</strong> ₦1 million over 3 months at 36% needs ₦353,530 a month against ₦255,000 available: DSCR 0.72x. He cannot afford it. ₦500,000 over 3 months needs ₦176,765 a month: DSCR 1.44x, which works. Because the extra float earns him more commission, his income should rise during the loan, which adds comfort. Start small, collect daily or weekly from his wallet, and offer a bigger repeat loan once he repays.</p>
<p><strong>Which is riskier?</strong> Neither profile is clearly safer. Tolu has a larger, documented income but a larger request and job risk. Ibrahim has a small, steady income from a business he has run in one place for three years, and a loan purpose that directly earns money. The lesson: the payslip makes Tolu easier to process, not automatically a better credit. Size each loan to the cash flow you can verify, and use the right structure for each income type.</p>
`;

  /* ---------------------------------------------------------
     Placeholder for weeks still being written
     --------------------------------------------------------- */
  const soon = (title) => `<div class="callout callout--info"><span class="callout__t">Coming next</span><p>The full lesson for <strong>${title}</strong>, with worked Naira calculations and Nigerian examples, is being written and will be published before this module opens.</p></div>`;
  const topics = (list) => list.map((t, i) => ({ id: 'T' + (i + 1), title: t, minutes: 15, ready: false, html: soon(t), quiz: [] }));
  const cases = (list) => list.map((t, i) => ({ id: 'C' + (i + 1), title: t, ready: false, html: soon(t) }));

  /* =========================================================
     CURRICULUM
     ========================================================= */
  window.CURRICULUM = {
    weeks: [
      {
        week: 1,
        short: 'Foundations of credit',
        title: 'Foundations of Credit and the Nigerian Financial Ecosystem',
        summary: 'Who lends in Nigeria and under what rules, how to apply the 5 Cs to formal and informal borrowers, and how a loan moves from origination to recovery.',
        topics: [
          {
            id: 'T1', minutes: 16, title: 'Structure of the Nigerian credit market', html: T1_1,
            quiz: [
              { q: 'Which body licenses and supervises commercial banks and microfinance banks in Nigeria?', options: ['Securities and Exchange Commission (SEC)', 'Central Bank of Nigeria (CBN)', 'Nigeria Deposit Insurance Corporation (NDIC)', 'Federal Competition and Consumer Protection Commission (FCCPC)'] },
              { q: 'A digital lender that is not a bank or MFB wants to give loans to consumers through an app. Which regulator must it register with?', options: ['CBN only', 'NAICOM', 'FCCPC', 'Corporate Affairs Commission only'] },
              { q: 'How does the Development Bank of Nigeria (DBN) mainly get funds to MSMEs?', options: ['Through its own branches in every LGA', 'Through a mobile lending app', 'By taking deposits from MSMEs', 'Wholesale lending through participating banks and MFBs, who on-lend'] },
              { q: 'A customer borrows ₦500,000 for 3 months at 5% flat per month plus a 2% upfront fee. What is the total cost of credit?', options: ['₦75,000', '₦37,500', '₦85,000', '₦100,000'] },
              { q: 'Which institution\'s main role is guaranteeing part of bank loans to the agricultural value chain?', options: ['NIRSAL', 'FMBN', 'NEXIM Bank', 'NDIC'] }
            ]
          },
          {
            id: 'T2', minutes: 15, title: 'The 5 Cs of credit applied to Nigerian borrowers', html: T1_2,
            quiz: [
              { q: 'A trader has ₦3,620,000 of net monthly cash and a proposed instalment of ₦2,723,250. What is the DSCR?', options: ['0.75x', '1.33x', '2.72x', '3.62x'] },
              { q: 'A clean CRC report and a reference letter from the trader\'s market association are evidence of which C?', options: ['Capacity', 'Collateral', 'Character', 'Conditions'] },
              { q: 'Net salary is ₦850,000, the lender caps total deductions at 33%, and an existing loan takes ₦40,000 a month. What is the maximum new monthly instalment?', options: ['₦240,500', '₦280,500', '₦320,500', '₦850,000'] },
              { q: 'An importer\'s costs rise sharply after a naira devaluation. Which C does this fall under?', options: ['Capital', 'Character', 'Conditions', 'Collateral'] },
              { q: 'Why is collateral described as the "second way out"?', options: ['Because it is valued twice before approval', 'Because the CBN requires two forms of collateral', 'Because it is sold in the second month of default', 'Because repayment should come from cash flow first, and collateral only covers a shortfall'] }
            ]
          },
          {
            id: 'T3', minutes: 15, title: 'The credit lifecycle: origination to recovery', html: T1_3,
            quiz: [
              { q: 'What is the correct order of the credit lifecycle?', options: ['Origination, underwriting, disbursement, monitoring, recovery', 'Underwriting, origination, disbursement, recovery, monitoring', 'Origination, disbursement, underwriting, monitoring, recovery', 'Disbursement, origination, underwriting, monitoring, recovery'] },
              { q: 'When must conditions precedent be satisfied?', options: ['After the loan is fully repaid', 'Before disbursement', 'During recovery', 'Only for overdraft facilities'] },
              { q: 'A loan has EAD of ₦10 million, PD of 4% and LGD of 55%. What is the expected loss?', options: ['₦400,000', '₦550,000', '₦220,000', '₦5,500,000'] },
              { q: 'Which of these is an early warning signal?', options: ['The customer pays two days early', 'The customer opens a savings account', 'The customer asks for a statement', 'Turnover through the domiciled account falls 40% for two months running'] },
              { q: 'The rule that the person who brings in a loan should not be the one who approves it is called:', options: ['Segregation of duties', 'Single obligor limit', 'Know your customer', 'Domiciliation'] }
            ]
          }
        ],
        cases: [
          { id: 'C1', title: 'Evaluating an Alaba International Market electronics trader', html: C1_1 },
          { id: 'C2', title: 'Salaried Lagos tech worker vs. informal POS agent', html: C1_2 }
        ],
        exam: {
          durationMin: 30,
          questions: [
            { q: 'Which law sets the main rules for banks and other financial institutions in Nigeria, including lending limits and the GSI framework?', options: ['Companies and Allied Matters Act 2020', 'Banks and Other Financial Institutions Act (BOFIA) 2020', 'Federal Competition and Consumer Protection Act 2018', 'Investment and Securities Act'] },
            { q: 'What should be the primary source of repayment for a working capital loan to a market trader?', options: ['Sale of the collateral', 'The guarantor\'s salary', 'Cash flow from trading', 'Insurance proceeds'] },
            { q: 'A POS agent processes ₦45 million a month across two terminals. How should you treat this figure?', options: ['As monthly income', 'As net profit', 'Mostly as pass-through float; income is the commission margin', 'As the agent\'s capital'] },
            { q: 'Using a 1.5% net margin, what is the commission income on ₦45 million of POS transactions?', options: ['₦675,000', '₦450,000', '₦6,750,000', '₦67,500'] },
            { q: 'A lender requires that a borrower\'s sales proceeds pass through an account with the lender. What is this called?', options: ['Domiciliation', 'Syndication', 'Securitisation', 'Refinancing'] },
            { q: 'An applicant\'s DSCR on the requested loan is 0.9x. What is the best response?', options: ['Approve as requested because collateral is strong', 'Increase the loan so the business can grow', 'Ignore DSCR for repeat customers', 'Treat capacity as insufficient: reduce the amount, extend the tenor or decline'] },
            { q: 'Which of these is NOT a licensed private credit bureau in Nigeria?', options: ['CRC Credit Bureau', 'FirstCentral Credit Bureau', 'CreditRegistry', 'NIBSS'] },
            { q: 'What does the Global Standing Instruction (GSI) let a lender do?', options: ['Debit a defaulting borrower\'s accounts in other banks', 'Freeze the borrower\'s BVN permanently', 'Publish the borrower\'s name in newspapers', 'Seize property without a court order'] },
            { q: 'Compared with a civil servant paid through Remita, what extra risk does a private sector salaried borrower carry?', options: ['No extra risk', 'Only foreign exchange risk', 'Salary is not deducted at source and the job may end, so payments can be diverted or stop', 'Only collateral risk'] },
            { q: 'In the 5 Cs, what does "Capital" refer to?', options: ['The borrower\'s own money invested in the business', 'The size of the loan requested', 'The lender\'s shareholders\' funds', 'The CBN cash reserve requirement'] },
            { q: 'A ₦10 million loan over 6 months at 30% has a monthly instalment of ₦1,815,500. Free cash is ₦3,040,000. What is the DSCR?', options: ['1.67x', '0.60x', '1.12x', '3.04x'] },
            { q: 'On a monitoring visit you find the borrower\'s stock is far lower than reported. What should you do?', options: ['Nothing, stock levels change daily', 'Treat it as an early warning signal, investigate and consider tightening the facility', 'Increase the limit so the borrower can restock', 'Close the account immediately without discussion'] },
            { q: 'What do merchant banks mainly focus on?', options: ['Retail microloans', 'Mortgages only', 'Cooperative savings', 'Corporate and investment banking with large ticket transactions'] },
            { q: 'What is the formula for expected loss?', options: ['PD + LGD + EAD', 'EAD ÷ PD', 'PD × LGD × EAD', 'LGD − PD'] },
            { q: 'An Alaba trader rents his shop and owns no land. What is the most practical way to take security over his stock?', options: ['A legal mortgage over the shop', 'Hold his landlord\'s C of O', 'Nothing can be done without property', 'Register a charge over the stock on the National Collateral Registry'] }
          ]
        }
      },
      {
        week: 2, short: 'Regulation, KYC and bureaus',
        title: 'Regulatory Framework, KYC and Credit Bureaus in Nigeria',
        summary: 'CBN prudential guidelines and loan classification, KYC and AML checks (BVN, NIN, CAC, SCUML, PEP), and reading CRC, FirstCentral and CreditRegistry reports with GSI mandates.',
        topics: topics(['CBN prudential guidelines, loan classification and provisioning', 'KYC/AML compliance: BVN, NIN, CAC (RC vs BN), SCUML and PEP screening', 'Reading Nigerian credit bureau reports and GSI mandates']),
        cases: cases(['Spotting loan stacking and hidden defaults across CRC and FirstCentral', 'A borrower with multiple BVN-linked accounts and active GSI triggers']),
        exam: { durationMin: 30, questions: [] }
      },
      {
        week: 3, short: 'Financial statement analysis',
        title: 'Financial Statement Analysis for Nigerian Businesses',
        summary: 'Audited vs management accounts, ratio analysis and why operating cash flow tells a different story from net profit.',
        topics: topics(['Audited vs management accounts: window-dressing and tax distortions', 'Core ratio analysis: liquidity, leverage, efficiency and profitability', 'Cash flow statement analysis: operating cash flow vs net profit']),
        cases: cases(['A Kano agro-processor with high revenue and negative operating cash flow', 'Adjusting management accounts for a Port Harcourt oilfield logistics vendor']),
        exam: { durationMin: 30, questions: [] }
      },
      {
        week: 4, short: 'Bank statement forensics',
        title: 'Bank Statement Forensics and Cash Flow Underwriting',
        summary: 'Reading 6 to 12 months of GTBank, Zenith, Access, UBA, OPay and Moniepoint statements, sizing limits from cash flow and catching round-tripping and kite-flying.',
        topics: topics(['6 to 12 month Nigerian bank statement analysis', 'Average monthly turnover, net cash surplus, sweep ratio and DSCR', 'Red flags: round-tripping, kite-flying, POS cash recycling and hidden loan repayments']),
        cases: cases(['Circular transactions between related-party accounts', 'Sizing a limit for a seasonal Ibadan distributor with volatility haircuts']),
        exam: { durationMin: 30, questions: [] }
      },
      {
        week: 5, short: 'Digital underwriting',
        title: 'Fintech Digital Underwriting and Alternative Data',
        summary: 'Open banking through Mono, Okra and Stitch, alternative data from telcos, electricity tokens and Remita, and building scorecards for nano and micro loans.',
        topics: topics(['Open banking in Nigeria and automated statement parsing', 'Alternative data: telco CDRs, electricity tokens, Remita and POS merchant data', 'Scorecards, risk-based pricing and automated decision engines']),
        cases: cases(['A BNPL scorecard for civil servants on IPPIS/Remita', 'Stopping synthetic identity and device-farm fraud in a lending app']),
        exam: { durationMin: 30, questions: [] }
      },
      {
        week: 6, short: 'Structuring and collateral',
        title: 'Loan Structuring, Pricing and Collateral Valuation',
        summary: 'Matching facility type to need, pricing loans in a high MPR environment, and perfecting security: Governor\'s Consent, C of O, debentures and NCR filings.',
        topics: topics(['Matching facility types to needs: OD, term loans, LPO, invoice discounting, asset finance', 'Loan pricing: MPR, cost of funds, risk premium, fees and APR disclosure', 'Collateral perfection: legal mortgages, Governor\'s Consent, C of O, debentures and the NCR']),
        cases: cases(['Structuring LPO finance for an FMCG supplier in Ogun State', 'Rejecting defective property collateral and pivoting to an NCR equipment charge']),
        exam: { durationMin: 30, questions: [] }
      },
      {
        week: 7, short: 'Credit memos and MCC',
        title: 'Writing Credit Memos and Defending at Credit Committee',
        summary: 'Writing a full Credit Appraisal Memorandum, drafting covenants that protect the lender, and defending a deal before the Management Credit Committee.',
        topics: topics(['Anatomy of a Credit Appraisal Memorandum (CAM)', 'Affirmative and negative covenants', 'Presenting and defending deals before the MCC']),
        cases: cases(['A full CAM for a ₦50M facility to a Lagos pharmaceutical distributor', 'Restructuring a declined deal after MCC pushback']),
        exam: { durationMin: 30, questions: [] }
      },
      {
        week: 8, short: 'Monitoring and recovery',
        title: 'Portfolio Monitoring, Early Warning Signals and Loan Recovery',
        summary: 'Spotting distress early, restructuring and write-offs, and recovering debt within FCCPC and CBN conduct rules.',
        topics: topics(['Post-disbursement monitoring and early warning signals', 'Restructuring, tenor extension, moratoriums and write-off accounting', 'Ethical and legal debt recovery: FCCPC, CBN consumer protection, GSI and receivership']),
        cases: cases(['A distressed FX-exposed importer after naira devaluation', 'Recovering overdue fintech loans within FCCPC rules']),
        exam: { durationMin: 30, questions: [] }
      }
    ],

    final: {
      durationMin: 90,
      // Draft final exam built on Week 1. Extend it as Weeks 2 to 8 are published,
      // and keep the FINAL answer string in Code.gs in the same order.
      questions: [
        { q: 'Under the 2024 recapitalisation programme, what was the minimum capital for a commercial bank with national authorisation?', options: ['₦50 billion', '₦500 billion', '₦200 billion', '₦25 billion'] },
        { q: 'A non-interest bank earns its return through structures such as:', options: ['Murabaha and ijarah', 'Repurchase agreements', 'Commercial paper', 'Interest rate swaps'] },
        { q: 'Why does an MFB licence usually lower a fintech lender\'s cost of funds?', options: ['It removes the need for KYC checks', 'It exempts the lender from CBN supervision', 'It allows unlimited lending to one borrower', 'It allows the lender to take deposits'] },
        { q: 'A bank on-lends Development Bank of Nigeria funds to an SME. Who carries the credit risk if the SME defaults?', options: ['DBN', 'The participating bank', 'The CBN', 'NIRSAL'] },
        { q: 'An informal sector applicant has no record at any credit bureau. How should you treat this?', options: ['As evidence of bad character', 'As missing information to fill from other sources', 'As an automatic decline', 'As proof of good character'] },
        { q: 'In asset finance, the borrower\'s capital contribution is usually:', options: ['Nothing, the lender funds 100%', 'The full asset price, paid later', 'Half the interest, paid upfront', '20% to 30% of the asset price, paid upfront'] },
        { q: 'Tolu has ₦240,500 of monthly headroom and asks for ₦3 million at 30%. Which change brings the loan within his headroom?', options: ['Extending the tenor to 18 months (about ₦209,010 a month)', 'Shortening the tenor to 6 months', 'Raising the rate to 40%', 'Adding a guarantor but keeping 12 months'] },
        { q: 'Ibrahim has ₦255,000 a month for debt service. A ₦1 million loan over 3 months at 36% costs ₦353,530 a month. What is his DSCR?', options: ['1.44x', '1.29x', '0.72x', '2.55x'] },
        { q: 'An Alaba trader sells far more in December and January than from February to April. What repayment structure suits a November loan best?', options: ['Flat instalments over 12 months', 'One bullet repayment in March', 'Interest-only payments with no end date', 'Stepped repayments weighted to December and January'] },
        { q: 'Which team usually checks that conditions precedent are met before disbursement?', options: ['The relationship manager who sourced the loan', 'Credit administration or operations', 'The borrower', 'The credit bureau'] },
        { q: 'A loan is disbursed before its security is perfected. Which part of expected loss does this mainly increase?', options: ['PD', 'EAD', 'LGD', 'MPR'] },
        { q: 'At a commercial bank, who would typically approve a ₦50 million working capital facility?', options: ['The Management Credit Committee', 'A branch teller', 'The relationship manager alone', 'The borrower\'s market association'] },
        { q: 'Which of these is NOT an acceptable recovery practice in Nigeria?', options: ['Calling on the guarantor', 'Activating the GSI mandate', 'Offering a restructure', 'Messaging the borrower\'s phone contacts to shame them'] },
        { q: 'A trader has adjusted monthly sales of ₦38 million and a 14% gross margin. What is the monthly gross profit?', options: ['₦3,800,000', '₦5,320,000', '₦5,000,000', '₦14,000,000'] },
        { q: 'FirstCentral shows an MFB loan the applicant did not declare, but it is being repaid on time. What is the best response?', options: ['Record it in the memo, require a full debt declaration and add a no-new-debt covenant', 'Ignore it because it is current', 'Decline and blacklist the applicant', 'Report the applicant to the police'] },
        { q: 'Why do analysts pull reports from more than one credit bureau?', options: ['The CBN requires exactly three reports', 'It is cheaper than pulling one', 'Lenders may report to different bureaus, so one report can miss debt', 'The bureaus share a single database'] },
        { q: 'Higher diesel prices after fuel subsidy removal squeeze a cold room operator\'s margins. Which C is this?', options: ['Character', 'Conditions', 'Capital', 'Collateral'] },
        { q: 'A ₦20 million loan has a PD of 5% and an LGD of 40%. What is the expected loss?', options: ['₦1,000,000', '₦8,000,000', '₦200,000', '₦400,000'] },
        { q: 'Why should you ask about ajo, esusu and cooperative obligations?', options: ['They are regulated by the CBN', 'They always appear on bureau reports', 'They are paid from the same income but rarely show on bureau reports', 'They can be used as collateral'] },
        { q: 'A loan app lends ₦200,000 for 2 months at 4% flat per month plus a 1% upfront fee. What is the total cost of credit?', options: ['₦18,000', '₦16,000', '₦8,000', '₦10,000'] }
      ]
    }
  };
})();
