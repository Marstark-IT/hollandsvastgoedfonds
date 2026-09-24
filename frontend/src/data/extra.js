// Additional section copy (both languages): seller situations, the comparison
// with a sale through an agent, audiences, values, next steps, grouped FAQ and
// per-segment FAQ. Article slugs point into data/articles.js (Dutch only).

const nl = {
  situations: {
    title: "Situaties waarin wij vaak kopen",
    items: [
      { icon: "house", title: "Verhuurde woning", text: "U wilt verkopen, maar de huurder blijft wonen.", article: "verhuurde-woning-verkopen" },
      { icon: "buildings", title: "Portefeuille afbouwen", text: "Meerdere objecten in één keer verkopen, aan één partij.", article: "woningportefeuille-verkopen" },
      { icon: "scroll", title: "Erfenis", text: "Vastgoed geërfd en samen met andere erfgenamen snel duidelijkheid nodig.", article: "geerfd-vastgoed-verkopen" },
      { icon: "key", title: "Stoppen als verhuurder", text: "Nieuwe regels en belastingdruk maken verhuren minder aantrekkelijk.", article: "stoppen-als-verhuurder" },
      { icon: "warehouse", title: "Bedrijfspand", text: "Een eigen of verhuurd bedrijfspand verkopen aan een belegger.", article: "bedrijfspand-verkopen" },
      { icon: "wrench", title: "Leegstand of onderhoud", text: "Een pand dat leeg staat of veel onderhoud nodig heeft.", article: "leegstaand-pand-verkopen" },
    ],
    more: "Lees meer",
  },
  compare: {
    title: "Direct verkopen of via een makelaar?",
    colUs: "Hollands Vastgoedfonds",
    colAgent: "Via een makelaar",
    rows: [
      ["Makelaarscourtage", "Geen", "Doorgaans een percentage van de prijs"],
      ["Bezichtigingen", "Eén gesprek en één bezichtiging", "Vaak meerdere, met onbekenden"],
      ["Financieringsvoorbehoud", "Geen voorbehoud van een bank", "Koper heeft vaak een voorbehoud"],
      ["Verhuurd verkopen", "Normaal onderdeel van onze aankopen", "Beperkt aantal geïnteresseerde kopers"],
      ["Openbaarheid", "Discreet, geen advertenties", "Openbaar op woningsites"],
      ["Overdrachtsdatum", "In overleg met u", "Afhankelijk van de koper"],
    ],
    note: "Een openbare verkoop kan soms meer opleveren. Wij leggen u eerlijk uit wanneer dat het geval kan zijn.",
  },
  regionsTeaser: {
    title: "Wij kopen in heel Nederland",
    text: "Per periode investeren wij gericht in een aantal regio's. Bekijk wat wij kopen in uw stad.",
    all: "Alle regio's",
  },
  articlesTeaser: { title: "Kennisbank", all: "Alle artikelen", read: "min lezen" },
  audiences: {
    title: "Voor wie wij kopen",
    items: [
      { title: "Particuliere eigenaren", text: "Eén woning of pand, verhuurd of leeg." },
      { title: "Particuliere beleggers", text: "Verhuurders die hun portefeuille willen afbouwen of herschikken." },
      { title: "Erfgenamen", text: "Samen een geërfd object verkopen, zonder gedoe." },
      { title: "Ondernemers", text: "Eigen bedrijfspand verkopen, eventueel met terughuur." },
      { title: "Institutionele partijen", text: "Portefeuilles en complexen, met een professionele due diligence." },
    ],
  },
  values: {
    title: "Waar wij voor staan",
    items: [
      { title: "Eerlijk", text: "Een helder voorstel en een onderbouwing die u kunt volgen." },
      { title: "Discreet", text: "Uw gegevens en uw object blijven vertrouwelijk." },
      { title: "Zeker", text: "Wat wij afspreken, voeren wij uit. Zonder voorbehoud van een bank." },
      { title: "Persoonlijk", text: "U heeft één vast aanspreekpunt, van eerste gesprek tot notaris." },
    ],
  },
  nextSteps: {
    title: "Wat gebeurt er na uw aanvraag?",
    items: [
      { title: "Bevestiging", text: "U ontvangt direct een bevestiging per e-mail." },
      { title: "Persoonlijk contact", text: "Een acquisitiemanager belt of mailt u om uw situatie te bespreken." },
      { title: "Beoordeling", text: "Wij bekijken het object en vragen eventueel aanvullende stukken op." },
      { title: "Voorstel", text: "U ontvangt een voorstel. U beslist in alle rust." },
    ],
  },
  expectations: {
    title: "Wat u van ons mag verwachten",
    items: [
      "Eén vast aanspreekpunt",
      "Een schriftelijk en onderbouwd voorstel",
      "Geen druk om te beslissen",
      "Vertrouwelijke omgang met uw gegevens",
      "Afwikkeling via een onafhankelijke notaris",
      "Een overdrachtsdatum in overleg",
    ],
  },
  faqGroups: [
    {
      title: "Algemeen",
      items: [
        { q: "Bent u een makelaar?", a: "Nee. Hollands Vastgoedfonds koopt vastgoed voor eigen rekening en risico. Wij treden zelf op als kopende partij en brengen u niet in contact met andere kopers." },
        { q: "Welk vastgoed kopen jullie?", a: "Woningen, appartementencomplexen, verhuurde woningportefeuilles, kantoren, winkels, mixed-use panden, bedrijfshallen, light-industrial en logistiek vastgoed. Ook objecten met herontwikkelingspotentieel." },
        { q: "Kopen jullie in heel Nederland?", a: "Wij investeren in Nederland en daarbuiten, per periode in vooraf gekozen regio's. Ligt uw object buiten een actieve regio, dan registreren wij het en nemen wij contact op zodra dat verandert." },
        { q: "Kopen jullie ook complete portefeuilles?", a: "Ja. Wij kopen zowel losse objecten als omvangrijke portefeuilles. Bij een portefeuille beoordelen wij elk object en de samenhang als geheel." },
      ],
    },
    {
      title: "Het verkoopproces",
      items: [
        { q: "Hoe snel heb ik duidelijkheid?", a: "Na uw aanvraag neemt een van onze acquisitiemanagers persoonlijk contact met u op. Past het object binnen een actief mandaat, dan krijgt u op korte termijn duidelijkheid over prijs, voorwaarden en overdracht." },
        { q: "Moet het object bezichtigd worden?", a: "Ja, voordat wij een definitief voorstel doen, bekijken wij het object. Bij verhuurde woningen stemmen wij dit zorgvuldig af, zodat uw huurders zo weinig mogelijk last hebben." },
        { q: "Welke stukken heb ik nodig?", a: "Denk aan de eigendomsakte, huurcontracten en een huurlijst, energielabels, en bij appartementen de stukken van de VvE. Wij helpen u om alles compleet te krijgen." },
        { q: "Wie regelt de notaris?", a: "De levering gaat via een onafhankelijke notaris. De keuze en planning stemmen wij met u af." },
        { q: "Kan ik zelf de overdrachtsdatum kiezen?", a: "In de meeste gevallen wel. Wij plannen de overdracht in overleg, snel als het moet en later als dat beter uitkomt." },
      ],
    },
    {
      title: "Verhuurd vastgoed",
      items: [
        { q: "Kopen jullie ook verhuurd vastgoed?", a: "Ja. Verhuurd vastgoed is een belangrijk deel van onze portefeuille. Bestaande huurovereenkomsten blijven gewoon gelden en uw huurders houden al hun rechten." },
        { q: "Moet ik mijn huurders informeren?", a: "Wettelijk hoeft een huurder geen toestemming te geven voor de verkoop. Wel is het netjes om huurders tijdig te informeren. Wij denken graag mee over het moment en de manier." },
        { q: "Wat gebeurt er met de waarborgsom?", a: "De waarborgsom gaat bij de levering over naar de nieuwe eigenaar, die de huurder later terugbetaalt volgens het huurcontract. De notaris verrekent dit." },
      ],
    },
    {
      title: "Kosten en voorwaarden",
      items: [
        { q: "Wat kost het mij om te verkopen?", a: "U betaalt aan ons geen courtage of bemiddelingskosten. Er zit geen makelaar tussen u en de koper." },
        { q: "Is er een financieringsvoorbehoud?", a: "Wij kopen met eigen kapitaal binnen een vastgesteld mandaat. U heeft daardoor niet te maken met het voorbehoud van een bank." },
        { q: "Is mijn aanvraag vrijblijvend?", a: "Ja. Een aanvraag verplicht u tot niets. Pas na het tekenen van een koopovereenkomst ligt er een afspraak vast." },
      ],
    },
    {
      title: "Privacy",
      items: [
        { q: "Wat doen jullie met mijn gegevens?", a: "Wij gebruiken uw gegevens alleen om contact op te nemen over uw aanvraag en het object te beoordelen. Wij delen ze niet met andere kopers of makelaars." },
        { q: "Hoe lang bewaren jullie mijn gegevens?", a: "Leidt uw aanvraag niet tot een transactie, dan verwijderen wij uw gegevens uiterlijk 24 maanden na het laatste contact, of eerder als u daarom vraagt." },
      ],
    },
  ],
  segmentFaq: {
    residential: [
      { q: "Kopen jullie ook één losse woning?", a: "Ja. Wij kopen zowel losse woningen als complexen en portefeuilles, verhuurd of leeg." },
      { q: "Maakt de staat van de woning uit?", a: "Nee. Wij kopen ook woningen met achterstallig onderhoud. De staat nemen wij mee in ons voorstel." },
      { q: "Wat als de huur onder de markthuur ligt?", a: "Dat nemen wij mee in de beoordeling. Bestaande huurcontracten blijven gewoon gelden." },
    ],
    commercial: [
      { q: "Kopen jullie ook gedeeltelijk leegstaande kantoren?", a: "Ja. Leegstand is voor ons geen belemmering. Wij kijken naar locatie, huurders en de mogelijkheden van het gebouw." },
      { q: "Kopen jullie winkels met een huurder erin?", a: "Ja. Verhuurde winkels en winkelstrips horen bij onze aankopen. Lopende huurovereenkomsten blijven van kracht." },
      { q: "Kopen jullie ook panden met wonen boven winkels?", a: "Ja. Mixed-use panden met winkels en woningen passen goed binnen onze strategie." },
    ],
    industrial: [
      { q: "Kunnen wij het pand na verkoop blijven huren?", a: "Dat is vaak mogelijk. Bij een sale-and-leaseback verkoopt u het pand en huurt u het daarna van ons terug." },
      { q: "Kopen jullie ook bedrijfsverzamelgebouwen?", a: "Ja. Light-industrial en bedrijfsverzamelgebouwen met meerdere huurders passen binnen onze focus." },
      { q: "Wat als er milieu- of bodemvragen zijn?", a: "Die nemen wij mee in de due diligence. Een bodemrapport of asbestinventarisatie helpt, maar is geen voorwaarde om het gesprek te starten." },
    ],
    special: [
      { q: "Kopen jullie ook panden zonder vergunning voor ontwikkeling?", a: "Ja. Het herontwikkelingspotentieel beoordelen wij zelf, ook als er nog geen vergunning is." },
      { q: "Kunnen jullie snel handelen bij tijdsdruk?", a: "Ja. Bij een passend object kunnen wij snel duidelijkheid geven en de overdracht versnellen." },
      { q: "Is een afwijkende transactiestructuur mogelijk?", a: "Ja. Denk aan gefaseerde levering, terughuur of de aankoop van aandelen in een vastgoed-BV. Wij bespreken wat past." },
    ],
  },
  segmentFaqTitle: "Vragen over dit type vastgoed",
};

const en = {
  situations: {
    title: "Situations in which we often buy",
    items: [
      { icon: "house", title: "Let home", text: "You want to sell, but the tenant stays.", article: "verhuurde-woning-verkopen" },
      { icon: "buildings", title: "Reducing a portfolio", text: "Selling several assets at once, to one party.", article: "woningportefeuille-verkopen" },
      { icon: "scroll", title: "Inheritance", text: "Inherited property and clarity needed together with other heirs.", article: "geerfd-vastgoed-verkopen" },
      { icon: "key", title: "Stopping as a landlord", text: "New rules and tax pressure make letting less attractive.", article: "stoppen-als-verhuurder" },
      { icon: "warehouse", title: "Business premises", text: "Selling an owner-occupied or let business property to an investor.", article: "bedrijfspand-verkopen" },
      { icon: "wrench", title: "Vacancy or maintenance", text: "A building that is vacant or needs a lot of work.", article: "leegstaand-pand-verkopen" },
    ],
    more: "Read more (Dutch)",
  },
  compare: {
    title: "Sell directly or through an agent?",
    colUs: "Hollands Vastgoedfonds",
    colAgent: "Through an agent",
    rows: [
      ["Agent commission", "None", "Usually a percentage of the price"],
      ["Viewings", "One conversation and one viewing", "Often several, with strangers"],
      ["Financing condition", "No bank condition", "Buyers often have one"],
      ["Selling with tenants", "A normal part of our acquisitions", "Few interested buyers"],
      ["Publicity", "Discreet, no advertising", "Public on property portals"],
      ["Transfer date", "Agreed with you", "Depends on the buyer"],
    ],
    note: "A public sale can sometimes achieve more. We will tell you honestly when that may be the case.",
  },
  regionsTeaser: {
    title: "We buy throughout the Netherlands",
    text: "Each period we invest with focus in a number of regions. See what we buy in your city.",
    all: "All regions",
  },
  articlesTeaser: { title: "Knowledge base (Dutch)", all: "All articles", read: "min read" },
  audiences: {
    title: "Who we buy from",
    items: [
      { title: "Private owners", text: "One home or building, let or vacant." },
      { title: "Private investors", text: "Landlords reducing or reshaping their portfolio." },
      { title: "Heirs", text: "Selling an inherited asset together, without hassle." },
      { title: "Business owners", text: "Selling your own business premises, with leaseback if needed." },
      { title: "Institutional parties", text: "Portfolios and complexes, with professional due diligence." },
    ],
  },
  values: {
    title: "What we stand for",
    items: [
      { title: "Honest", text: "A clear proposal with reasoning you can follow." },
      { title: "Discreet", text: "Your details and your property remain confidential." },
      { title: "Certain", text: "What we agree, we deliver. Without a bank condition." },
      { title: "Personal", text: "One point of contact, from first conversation to notary." },
    ],
  },
  nextSteps: {
    title: "What happens after your request?",
    items: [
      { title: "Confirmation", text: "You immediately receive a confirmation by email." },
      { title: "Personal contact", text: "An acquisition manager calls or emails you to discuss your situation." },
      { title: "Assessment", text: "We look at the property and may ask for additional documents." },
      { title: "Proposal", text: "You receive a proposal. You decide in your own time." },
    ],
  },
  expectations: {
    title: "What you can expect from us",
    items: [
      "One fixed point of contact",
      "A written, reasoned proposal",
      "No pressure to decide",
      "Confidential handling of your details",
      "Completion through an independent notary",
      "A transfer date agreed with you",
    ],
  },
  faqGroups: [
    {
      title: "General",
      items: [
        { q: "Are you an estate agent?", a: "No. Hollands Vastgoedfonds buys property for its own account and risk. We act as the buyer ourselves and do not pass you on to other buyers." },
        { q: "What property do you buy?", a: "Homes, apartment buildings, let residential portfolios, offices, shops, mixed-use buildings, business units, light-industrial and logistics property. Also assets with redevelopment potential." },
        { q: "Do you buy throughout the Netherlands?", a: "We invest in the Netherlands and beyond, in regions selected per period. If your property is outside an active region, we register it and contact you as soon as that changes." },
        { q: "Do you buy complete portfolios?", a: "Yes. We buy single assets as well as large portfolios. For a portfolio we assess each asset and the whole." },
      ],
    },
    {
      title: "The sales process",
      items: [
        { q: "How soon will I have clarity?", a: "After your request, one of our acquisition managers contacts you personally. If the property fits an active mandate, you get clarity on price, terms and transfer at short notice." },
        { q: "Does the property need a viewing?", a: "Yes, before we make a final proposal we view the property. With let homes we plan this carefully so your tenants are disturbed as little as possible." },
        { q: "Which documents do I need?", a: "Think of the title deed, leases and a rent roll, energy labels, and for apartments the owners' association documents. We help you complete everything." },
        { q: "Who arranges the notary?", a: "Transfer takes place through an independent notary. We agree the choice and timing with you." },
        { q: "Can I choose the transfer date?", a: "In most cases, yes. We plan the transfer with you: quickly if needed, later if that suits you better." },
      ],
    },
    {
      title: "Let property",
      items: [
        { q: "Do you buy let property?", a: "Yes. Let property is an important part of our portfolio. Existing leases remain in force and your tenants keep all their rights." },
        { q: "Do I need to inform my tenants?", a: "Legally a tenant does not need to consent to the sale. It is good practice to inform tenants in time. We are happy to advise on timing and approach." },
        { q: "What happens to the deposit?", a: "The deposit passes to the new owner at completion, who later repays the tenant under the lease. The notary settles this." },
      ],
    },
    {
      title: "Costs and terms",
      items: [
        { q: "What does selling cost me?", a: "You pay us no commission or brokerage fees. There is no agent between you and the buyer." },
        { q: "Is there a financing condition?", a: "We buy with our own capital within a defined mandate. You are therefore not dependent on a bank condition." },
        { q: "Is my request free of obligation?", a: "Yes. A request commits you to nothing. Only a signed purchase agreement is binding." },
      ],
    },
    {
      title: "Privacy",
      items: [
        { q: "What do you do with my details?", a: "We only use your details to contact you about your request and assess the property. We do not share them with other buyers or agents." },
        { q: "How long do you keep my details?", a: "If your request does not lead to a transaction, we delete your details no later than 24 months after the last contact, or sooner if you ask." },
      ],
    },
  ],
  segmentFaq: {
    residential: [
      { q: "Do you buy a single home?", a: "Yes. We buy single homes as well as complexes and portfolios, let or vacant." },
      { q: "Does the condition matter?", a: "No. We also buy homes with deferred maintenance. We reflect the condition in our proposal." },
      { q: "What if the rent is below market rent?", a: "We take that into account in our assessment. Existing leases simply remain in force." },
    ],
    commercial: [
      { q: "Do you buy partly vacant offices?", a: "Yes. Vacancy is no obstacle. We look at location, tenants and the building's possibilities." },
      { q: "Do you buy shops with a tenant?", a: "Yes. Let shops and retail parades are part of our acquisitions. Existing leases remain in force." },
      { q: "Do you buy buildings with homes above shops?", a: "Yes. Mixed-use buildings with shops and homes fit our strategy well." },
    ],
    industrial: [
      { q: "Can we keep renting the building after the sale?", a: "Often, yes. With a sale-and-leaseback you sell the building and then rent it back from us." },
      { q: "Do you buy multi-let business estates?", a: "Yes. Light-industrial and multi-let estates with several tenants fit our focus." },
      { q: "What about environmental or soil questions?", a: "We cover them in due diligence. A soil report or asbestos survey helps, but is not required to start the conversation." },
    ],
    special: [
      { q: "Do you buy buildings without planning consent?", a: "Yes. We assess redevelopment potential ourselves, even if there is no permit yet." },
      { q: "Can you act fast under time pressure?", a: "Yes. For a suitable asset we can give clarity quickly and speed up the transfer." },
      { q: "Is a non-standard deal structure possible?", a: "Yes. Think of phased transfer, leaseback or buying shares in a property company. We discuss what fits." },
    ],
  },
  segmentFaqTitle: "Questions about this type of property",
};

export const EXTRA = { nl, en };
export const x = (locale) => EXTRA[locale];
