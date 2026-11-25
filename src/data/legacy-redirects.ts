export type LegacyRedirect = {
  source: string;
  destination: string;
  permanent: true;
};

const permanent = (source: string, destination: string): LegacyRedirect => ({source, destination, permanent: true});

export const legacyRedirects: LegacyRedirect[] = [
  permanent("/safaris", "/trips"),
  permanent("/tours-packages", "/trips"),
  permanent("/group-tours", "/trips"),
  permanent("/tanzania-safaris", "/trips"),
  permanent("/tanzania-safari-packages", "/trips"),
  permanent("/safari-packages", "/trips"),
  permanent("/private-tanzania-safaris", "/trips?category=private-safari"),
  permanent("/joining-group-safari", "/trips?category=joining-safari"),
  permanent("/great-migration-safaris", "/trips?category=great-migration-north"),
  permanent("/calving-season-safaris", "/trips?category=ndutu-calving-safari"),
  permanent("/day-trips", "/trips?category=day-trips"),
  permanent("/mount-meru-tanzania", "/trips?category=mount-meru"),
  permanent("/mount-meru-trekking", "/trips?category=mount-meru"),
  permanent("/zanzibar", "/trips?category=zanzibar"),
  permanent("/kilimanjaro-trekking", "/kilimanjaro"),
  permanent("/kilimanjaro-climbing-packages", "/kilimanjaro"),
  permanent("/kilimanjaro-packages", "/kilimanjaro"),
  permanent("/about-us", "/about"),
  permanent("/contact-us", "/contact"),
  permanent("/request-a-quote", "/contact#quote"),
  permanent("/faq", "/contact#faq"),
  permanent("/what-to-expect", "/#included"),
  permanent("/climate", "/contact#faq"),
  permanent("/12-day-beach-beasts-group-tour", "/trips?category=zanzibar"),

  permanent("/kilimanjaro-packages/:slug", "/trips/:slug"),
  permanent("/private-tanzania-safaris/:slug", "/trips/:slug"),
  permanent("/mount-meru-climbing/:slug", "/trips/:slug"),
  permanent("/zanzibar/:slug", "/trips/:slug"),
  permanent("/day-trips/:slug", "/trips/:slug"),

  permanent("/5-days-marangu-route-kilimanjaro", "/trips/5-days-marangu-route"),
  permanent("/6-days-machame-route-kilimanjaro", "/trips/6-days-machame-route"),
  permanent("/6-days-marangu-route-kilimanjaro", "/trips/6-days-marangu-route"),
  permanent("/6-days-rongai-route-kilimanjaro", "/trips/6-days-rongai-route"),
  permanent("/6-days-umbwe-route-kilimanjaro", "/trips/6-days-umbwe-route"),
  permanent("/7-days-lemosho-route-kilimanjaro", "/trips/7-days-lemosho-route"),
  permanent("/7-days-machame-route-kilimanjaro", "/trips/7-days-machame-route"),
  permanent("/7-days-rongai-route-kilimanjaro", "/trips/7-days-rongai-route"),
  permanent("/7-days-umbwe-route-kilimanjaro", "/trips/7-days-umbwe-route"),
  permanent("/8-days-lemosho-route-kilimanjaro", "/trips/8-days-lemosho-route"),
  permanent("/8-days-northern-circuit-route-kilimanjaro", "/trips/8-days-northern-circuit-route"),
  permanent("/9-days-northern-circuit-route-kilimanjaro", "/trips/9-days-northern-circuit-route"),

  permanent("/3-days-serengeti-ngorongoro-joining-safari", "/trips/3-days-serengeti-ngorongoro-joining-safari"),
  permanent("/4-days-northern-tanzania-joining-safari", "/trips/4-days-northern-tanzania-joining-safari"),
  permanent("/5-days-northern-tanzania-joining-safari", "/trips/5-days-northern-tanzania-joining-safari"),
  permanent("/5-days-northern-serengeti-river-crossing-safari", "/trips/5-days-northern-serengeti-river-crossing-safari"),
  permanent("/7-days-northern-serengeti-river-crossing-safari", "/trips/7-days-northern-serengeti-river-crossing-safari"),
  permanent("/9-days-northern-serengeti-river-crossing-safari", "/trips/9-days-northern-serengeti-river-crossing-safari"),
  permanent("/4-days-ndutu-calving-safari", "/trips/4-days-ndutu-calving-safari"),
  permanent("/5-days-ndutu-calving-safari", "/trips/5-days-ndutu-calving-safari"),
  permanent("/7-days-ndutu-calving-safari", "/trips/7-days-ndutu-calving-safari"),
];
