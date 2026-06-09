import { Helmet } from "react-helmet-async";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const AgriWiki = () => {
  return (
    <>
      <Helmet>
        <title>Agri-Wiki — Crop Knowledge Base | Bharat AI</title>
        <meta
          name="description"
          content="ICAR-aligned agricultural knowledge base — wheat yellow rust diagnostics, cotton whitefly IPM, and soil health & nitrogen deficiency management for Indian farmers."
        />
        <link rel="canonical" href="https://jaswant-spark.lovable.app/agri-wiki" />
        <meta property="og:title" content="Agri-Wiki — Crop Knowledge Base | Bharat AI" />
        <meta property="og:description" content="In-depth crop diagnostics and integrated pest management articles for Indian agriculture." />
        <meta property="og:url" content="https://jaswant-spark.lovable.app/agri-wiki" />
      </Helmet>
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-8 w-full">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-2 text-foreground">
            Agri-Wiki: Crop Knowledge Base
          </h1>
          <p className="text-muted-foreground mb-8">
            Long-form, ICAR-aligned agronomy articles curated by Bharat AI for
            Indian farmers, extension officers, and students.
          </p>

          <article className="mb-12">
            <h2 className="text-2xl font-heading font-semibold mb-3 text-saffron">
              1. Wheat Yellow Rust: Diagnostics & Management
            </h2>
            <p className="mb-3 leading-relaxed text-foreground/90">
              Wheat yellow rust, also known as stripe rust, is caused by the
              fungal pathogen <em>Puccinia striiformis f. sp. tritici</em>. The
              earliest visual symptom is the appearance of small, lemon-yellow
              pustules (uredinia) arranged in narrow stripes parallel to the
              leaf veins, most commonly on the upper leaf surface of seedlings
              and tillering-stage plants. As the disease progresses, the
              stripes coalesce, leaves turn chlorotic, and severely infected
              tillers fail to fill grain properly, leading to shrivelled
              kernels and a 20–70% yield penalty in susceptible varieties grown
              in the cool, humid wheat belt of Punjab, Haryana, Himachal
              Pradesh, and the Terai region of Uttar Pradesh.
            </p>
            <p className="mb-3 leading-relaxed text-foreground/90">
              The disease is driven by cool temperatures (10–18 °C), high
              relative humidity above 70%, and the presence of free moisture on
              the leaf for at least three hours. Urediniospores are dispersed
              by wind over hundreds of kilometres, so an outbreak in the hills
              during February typically signals risk for the plains within two
              to three weeks. Continuous cultivation of genetically uniform,
              susceptible varieties — historically PBW 343 and HD 2967 — and
              excessive nitrogen application that produces dense, succulent
              canopies dramatically accelerate epidemic build-up.
            </p>
            <p className="leading-relaxed text-foreground/90">
              Integrated management starts with sowing resistant varieties
              recommended by ICAR-IIWBR such as HD 3086, DBW 187, PBW 725, or
              HD 3226, and rotating them every two to three seasons to slow
              pathogen adaptation. Balanced fertilisation — 120:60:40 kg
              NPK/ha with split nitrogen doses — and timely sowing in the first
              fortnight of November help the crop escape peak infection
              windows. When pustules appear on more than 5% of the flag leaf
              area, a foliar spray of Propiconazole 25 EC at 0.1% (1 ml/litre)
              or Tebuconazole 25.9 EC at 0.1% should be applied, repeated after
              15 days if conditions remain favourable. Destroying volunteer
              wheat and self-sown plants between seasons removes the green
              bridge that allows the pathogen to oversummer in the hills.
            </p>
          </article>

          <article className="mb-12">
            <h2 className="text-2xl font-heading font-semibold mb-3 text-saffron">
              2. Cotton Whitefly: Integrated Pest Management
            </h2>
            <p className="mb-3 leading-relaxed text-foreground/90">
              The cotton whitefly, <em>Bemisia tabaci</em>, is a piercing-sucking
              insect that has emerged as the most damaging pest of cotton in
              north Indian states of Punjab, Haryana, and Rajasthan,
              particularly since the 2015 outbreak that wiped out over two-thirds
              of the regional crop. Adults are tiny, 1–1.5 mm long, with
              powdery white wings, while nymphs are scale-like, oval, and
              translucent, settling on the underside of leaves. Damage occurs
              both directly — through sap removal that causes leaf curling,
              yellowing, and sticky honeydew on which black sooty mould grows —
              and indirectly, as the whitefly is the sole vector of Cotton Leaf
              Curl Virus (CLCuV), a begomovirus that stunts plants and can
              cause total yield loss when infection occurs before flowering.
            </p>
            <p className="mb-3 leading-relaxed text-foreground/90">
              Whitefly populations explode under hot, dry conditions
              (28–35 °C), continuous Bt-cotton monoculture, and heavy use of
              synthetic pyrethroids and neonicotinoids that destroy natural
              enemies such as <em>Chrysoperla carnea</em>, <em>Encarsia
              formosa</em>, and predatory ladybird beetles. Excessive nitrogen,
              dense plant spacing, and irrigation scheduling that keeps the
              canopy lush further compound the problem. Early-season scouting
              is critical: farmers should inspect ten randomly selected plants
              per acre twice a week and count adults on three top leaves; an
              economic threshold of 6–8 adults per leaf or 20 nymphs per square
              inch on the underside warrants intervention.
            </p>
            <p className="leading-relaxed text-foreground/90">
              An integrated approach combines cultural, mechanical, biological,
              and chemical tactics. Sow recommended varieties or Bt hybrids
              with tolerance to leaf curl, maintain a 67.5 × 60 cm spacing, and
              intercrop with cowpea or moong to harbour natural enemies. Install
              yellow sticky traps at 40 per hectare from 30 days after sowing
              to monitor and mass-trap adults. Conserve natural predators by
              avoiding sprays during the first 60 days. When the threshold is
              crossed, rotate selective insecticides — Flonicamid 50 WG at
              80 g/acre, Pyriproxyfen 10 EC at 250 ml/acre (for nymphs), or
              Diafenthiuron 50 WP at 240 g/acre — and never repeat the same
              chemical group within a season. End-of-season stalk destruction
              and a strict cotton-free period of at least 60 days break the
              CLCuV transmission cycle.
            </p>
          </article>

          <article className="mb-12">
            <h2 className="text-2xl font-heading font-semibold mb-3 text-saffron">
              3. Soil Health and Nitrogen Deficiency
            </h2>
            <p className="mb-3 leading-relaxed text-foreground/90">
              Soil health refers to the continued capacity of a soil to
              function as a living ecosystem that sustains plants, animals, and
              humans. In India, decades of intensive rice-wheat and cotton-wheat
              cropping, combined with unbalanced fertiliser use heavily skewed
              toward urea, have led to widespread declines in soil organic
              carbon (often below 0.5%), micronutrient deficiencies (zinc,
              sulphur, boron, iron), and deterioration of physical structure.
              Nitrogen, the nutrient required in the largest quantity by most
              crops, is also the most leaky — readily lost through
              volatilisation as ammonia, leaching of nitrate into groundwater,
              and denitrification — making nitrogen management both an
              agronomic and an environmental priority.
            </p>
            <p className="mb-3 leading-relaxed text-foreground/90">
              Classic visual symptoms of nitrogen deficiency are a pale yellow
              to light green coloration that begins on the older, lower leaves
              and progresses upward as the plant remobilises nitrogen from
              senescing tissue to the growing point. In cereals, deficient
              plants are stunted, produce fewer tillers, and show V-shaped
              chlorosis starting at the leaf tip; in cotton and vegetables,
              overall growth is slow, leaves are small, and flowering and
              fruiting are delayed. A Leaf Colour Chart (LCC) reading below 4
              in rice or wheat, or a SPAD chlorophyll meter value below 37,
              confirms the need for top-dressing. Always pair visual diagnosis
              with a soil test through the Soil Health Card scheme to rule out
              confounding deficiencies of sulphur or iron, which also cause
              yellowing.
            </p>
            <p className="leading-relaxed text-foreground/90">
              Sustainable nitrogen management rests on the 4R framework — Right
              source, Right rate, Right time, Right place. Apply farmyard
              manure or compost at 5–10 t/ha before sowing to build soil
              organic carbon and feed the microbial nitrogen cycle. Include a
              legume — green-gram, cowpea, dhaincha — in the rotation to fix
              40–80 kg N/ha biologically. Split the recommended dose of urea
              into 2–3 applications timed to crop demand (basal, tillering,
              panicle initiation in rice; basal, crown-root initiation, and
              jointing in wheat) and place it 5–7 cm below the soil surface
              rather than broadcasting on dry ground. Use neem-coated urea or
              slow-release sources to cut volatilisation losses by 15–20%, and
              calibrate top-dressing to LCC or SPAD readings rather than
              calendar dates. These practices typically lift Nitrogen Use
              Efficiency from the prevailing 30–35% to over 50%, saving cost,
              raising yield, and protecting the soil for the next generation.
            </p>
          </article>
        </main>
        <SiteFooter />
      </div>
    </>
  );
};

export default AgriWiki;
