// Local landing pages (Dutch only). Each city has its own market notes so the
// pages are useful on their own, not copies with a swapped name.

export const REGIONS = [
  {
    slug: "amsterdam",
    name: "Amsterdam",
    province: "Noord-Holland",
    image: "hero",
    intro:
      "Wij kopen woningen, verhuurde panden, bedrijfsruimte en portefeuilles in Amsterdam en omgeving. Direct, voor eigen rekening en zonder makelaar.",
    market: [
      "De Amsterdamse markt kent veel oudere panden, van grachtenpanden in het centrum tot vooroorlogse bouw in Oud-West en Oost. Veel woningen zijn verhuurd of gesplitst in appartementsrechten.",
      "Een groot deel van de grond in Amsterdam is erfpacht. De erfpachtsituatie (voortdurend of eeuwigdurend afgekocht) weegt mee in de waarde. Wij beoordelen dat voor u als onderdeel van ons voorstel.",
    ],
    focus: ["Verhuurde appartementen en boven- en benedenwoningen", "Grachtenpanden en monumenten", "Winkel- en woonpanden", "Kleine portefeuilles in de stad en de regio"],
    faq: [
      { q: "Kopen jullie ook woningen op erfpachtgrond?", a: "Ja. Wij kopen ook op erfpachtgrond en nemen de erfpachtvoorwaarden mee in ons voorstel." },
      { q: "Kopen jullie monumentale panden?", a: "Ja. Rijks- en gemeentelijke monumenten horen erbij. Onderhoud en regels rond monumenten nemen wij mee in de beoordeling." },
    ],
  },
  {
    slug: "rotterdam",
    name: "Rotterdam",
    province: "Zuid-Holland",
    image: "commercial",
    intro:
      "Wij kopen vastgoed in Rotterdam en de regio Rijnmond: woningen, portefeuilles, winkels, kantoren en bedrijfsruimte. Direct en voor eigen rekening.",
    market: [
      "Rotterdam combineert vooroorlogse wijken, zoals in Noord, West en Zuid, met wederopbouwarchitectuur en moderne hoogbouw. Veel woningen zijn portiekwoningen of boven- en benedenwoningen, vaak verhuurd.",
      "Door de haven en de bedrijvigheid in de regio is er ook veel bedrijfsruimte en logistiek vastgoed. Wij kopen zowel in de stad als op bedrijventerreinen in de regio.",
    ],
    focus: ["Verhuurde portiek- en etagewoningen", "Woningportefeuilles in Rotterdamse wijken", "Winkel- en woonpanden", "Bedrijfsruimte en logistiek in de regio"],
    faq: [
      { q: "Kopen jullie ook in Rotterdam-Zuid?", a: "Ja. Wij beoordelen objecten in alle Rotterdamse wijken en de omliggende gemeenten." },
      { q: "Kopen jullie ook panden met achterstallig onderhoud?", a: "Ja. De staat van het pand nemen wij mee in ons voorstel. U hoeft niet eerst zelf te renoveren." },
    ],
  },
  {
    slug: "den-haag",
    name: "Den Haag",
    province: "Zuid-Holland",
    image: "street",
    intro:
      "Wij kopen woningen, verhuurde panden, kantoren en bedrijfsruimte in Den Haag en omgeving. Discreet, direct en zonder courtage.",
    market: [
      "Den Haag heeft veel vooroorlogse bouw, met boven- en benedenwoningen in wijken als Duinoord, het Regentessekwartier en Transvaal. Een groot deel daarvan is verhuurd.",
      "In gebieden als de Binckhorst worden kantoren en bedrijfsgebouwen getransformeerd naar wonen en werken. Ook zulke transformatieposities hebben onze interesse.",
    ],
    focus: ["Verhuurde boven- en benedenwoningen", "Herenhuizen en appartementen", "Kantoren met transformatiepotentieel", "Kleine en middelgrote portefeuilles"],
    faq: [
      { q: "Kopen jullie ook in Scheveningen en de randgemeenten?", a: "Ja. Wij kopen in heel Den Haag en in omliggende gemeenten zoals Rijswijk, Voorburg en Delft." },
      { q: "Kopen jullie ook kantoorpanden?", a: "Ja. Verhuurde en leegstaande kantoren, ook als herbestemming een optie is." },
    ],
  },
  {
    slug: "utrecht",
    name: "Utrecht",
    province: "Utrecht",
    image: "residential",
    intro:
      "Wij kopen vastgoed in de stad en provincie Utrecht: woningen, portefeuilles, kantoren en bedrijfsruimte. Direct en voor eigen rekening.",
    market: [
      "Utrecht is een van de snelst groeiende steden van Nederland, met een sterke vraag naar woningen. Naast de historische binnenstad zijn er vooroorlogse wijken en grote nieuwbouwgebieden zoals Leidsche Rijn.",
      "Door de centrale ligging is Utrecht ook een belangrijke kantorenstad. Wij kopen verhuurde woningen, studentenhuisvesting en commercieel vastgoed in de stad en de regio.",
    ],
    focus: ["Verhuurde woningen en appartementen", "Studentenhuisvesting", "Kantoren en mixed-use", "Portefeuilles in de provincie Utrecht"],
    faq: [
      { q: "Kopen jullie ook studentenpanden?", a: "Ja. Verhuurde kamerpanden en studentenhuisvesting beoordelen wij graag, inclusief de vergunningen die daarbij horen." },
      { q: "Kopen jullie ook buiten de stad Utrecht?", a: "Ja. Ook in bijvoorbeeld Amersfoort, Zeist, Nieuwegein en omgeving." },
    ],
  },
  {
    slug: "eindhoven",
    name: "Eindhoven",
    province: "Noord-Brabant",
    image: "industrial",
    intro:
      "Wij kopen woningen, bedrijfsruimte en logistiek vastgoed in Eindhoven en de Brainport-regio. Direct, discreet en zonder makelaar.",
    market: [
      "Eindhoven is het hart van de Brainport-regio, met veel technologische bedrijvigheid. Dat zorgt voor vraag naar woningen, bedrijfsruimte en light-industrial vastgoed.",
      "Voormalige industrieterreinen zoals Strijp-S laten zien hoe oud bedrijfsvastgoed nieuwe waarde krijgt. Ook oudere bedrijfspanden met transformatiepotentieel hebben onze interesse.",
    ],
    focus: ["Bedrijfshallen en light-industrial", "Verhuurde woningen", "Bedrijfsverzamelgebouwen", "Transformatieposities"],
    faq: [
      { q: "Kopen jullie ook bedrijfspanden met terughuur?", a: "Ja. Bij een sale-and-leaseback verkoopt u het pand en huurt u het daarna van ons terug." },
      { q: "Kopen jullie in de hele Brainport-regio?", a: "Ja. Ook in bijvoorbeeld Veldhoven, Best, Helmond en omliggende gemeenten." },
    ],
  },
  {
    slug: "groningen",
    name: "Groningen",
    province: "Groningen",
    image: "region",
    intro:
      "Wij kopen vastgoed in de stad en provincie Groningen: woningen, studentenhuisvesting, winkels en bedrijfsruimte. Direct en voor eigen rekening.",
    market: [
      "Groningen is een echte studentenstad, met een grote vraag naar kamers en kleine woningen. Veel panden in en rond de binnenstad zijn verhuurd.",
      "In de provincie speelt bij sommige objecten mijnbouwschade of versterking. Wij nemen de schadehistorie en lopende regelingen mee in onze beoordeling.",
    ],
    focus: ["Verhuurde woningen en kamerpanden", "Winkel- en woonpanden in de binnenstad", "Kleine portefeuilles", "Bedrijfsruimte in de regio"],
    faq: [
      { q: "Kopen jullie panden met mijnbouwschade?", a: "Wij beoordelen ook panden met schade of een lopend versterkingstraject. De stand van zaken nemen wij mee in ons voorstel." },
      { q: "Kopen jullie kamerpanden?", a: "Ja, inclusief de benodigde omzettings- of kamerverhuurvergunningen." },
    ],
  },
  {
    slug: "tilburg",
    name: "Tilburg",
    province: "Noord-Brabant",
    image: "industrial",
    intro:
      "Wij kopen logistiek vastgoed, bedrijfsruimte en woningen in Tilburg en Midden-Brabant. Direct en zonder courtage.",
    market: [
      "Tilburg en omgeving vormen een van de belangrijkste logistieke regio's van Nederland, dankzij de ligging tussen Rotterdam, Antwerpen en het Ruhrgebied.",
      "Naast logistiek vastgoed kent de stad veel verhuurde woningen en een groeiende studentenpopulatie. Wij kopen zowel bedrijfsmatig als residentieel vastgoed.",
    ],
    focus: ["Logistieke objecten en distributiecentra", "Bedrijfshallen en light-industrial", "Verhuurde woningen", "Bedrijfslocaties langs de snelwegen"],
    faq: [
      { q: "Kopen jullie ook grote logistieke objecten?", a: "Ja. Van kleinere bedrijfsunits tot grotere logistieke objecten, verhuurd of met terughuur." },
      { q: "Kopen jullie ook in Waalwijk en Oosterhout?", a: "Ja. Wij kopen in heel Midden- en West-Brabant." },
    ],
  },
  {
    slug: "nijmegen",
    name: "Nijmegen en Arnhem",
    short: "Nijmegen en Arnhem",
    province: "Gelderland",
    image: "special",
    intro:
      "Wij kopen woningen, portefeuilles, winkels en bedrijfsruimte in Nijmegen, Arnhem en de regio. Direct en voor eigen rekening.",
    market: [
      "Nijmegen en Arnhem vormen samen een groot stedelijk gebied met twee universiteiten en hogescholen. Er is veel vraag naar huurwoningen en studentenhuisvesting.",
      "Beide steden hebben karakteristieke vooroorlogse wijken en een binnenstad met winkel- en woonpanden. Ook oudere gebouwen met herbestemmingsmogelijkheden hebben onze interesse.",
    ],
    focus: ["Verhuurde woningen en studentenhuisvesting", "Winkel- en woonpanden", "Karakteristieke panden voor herbestemming", "Bedrijfsruimte in de regio"],
    faq: [
      { q: "Kopen jullie in heel Gelderland?", a: "Wij kopen in de regio Arnhem-Nijmegen en beoordelen objecten elders in Gelderland per mandaatperiode." },
      { q: "Kopen jullie ook voormalige maatschappelijke gebouwen?", a: "Ja. Scholen, kantoren en andere gebouwen met herbestemmingspotentieel beoordelen wij graag." },
    ],
  },
];

export const regionBySlug = (slug) => REGIONS.find((r) => r.slug === slug);
export const regionPath = (slug) => `/regios/${slug}/`;

// Intro copy for the /regios/ hub.
export const REGIONS_INTRO = [
  "Hollands Vastgoedfonds investeert per periode gericht in een aantal regio's. Binnen die regio's stellen wij kapitaal beschikbaar voor nieuwe aankopen en bouwen wij een actieve pijplijn op van woningen, portefeuilles en bedrijfsmatig vastgoed.",
  "Ligt uw object in een van de steden hieronder, of in de omgeving daarvan? Dan kunt u het direct aanbieden. Ligt het ergens anders in Nederland, bied het dan ook gerust aan: wij registreren elk object en nemen contact op zodra er in uw regio kapitaal beschikbaar is.",
  "Per stad leest u wat wij daar vooral kopen en welke kenmerken van de lokale markt wij meenemen in ons voorstel, zoals erfpacht in Amsterdam, mijnbouwschade in Groningen of de logistieke functie van Tilburg.",
];
