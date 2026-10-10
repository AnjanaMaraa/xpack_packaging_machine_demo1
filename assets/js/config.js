/* ==========================================================================
   DigiMaraa Packaging Machinery — Business configuration
   --------------------------------------------------------------------------
   SINGLE SOURCE OF TRUTH for all displayed business contact details.
   index.html must NOT hardcode phone numbers, email addresses or the address.
   Edit values here only, then reload the site.
   ========================================================================== */

const SITE_CONFIG = {
  brandName: "DigiMaraa Packaging Machinery",

  address: {
    line1: "#1, First Floor, Ambalam Street",
    line2: "Srivaikundam, Tuticorin-628 601",
    city: "Tamilnadu",
    country: "India"
  },

  contacts: {
    enquiries: "+91 72002 51560",
    official: "info@digimaraa.com",
    newBusiness: "maraa.care@gmail.com",
    career: "akash@digimaraa.com"
  },

  developer: {
    name: "DigiMaraa Technologies",
    website: "https://digimaraa.com"
  },

  seo: {
    siteUrl: "",
    defaultTitle: "DigiMaraa Packaging Machinery",
    defaultDescription:
      "Explore packaging machinery and packaging solutions for businesses. Contact DigiMaraa Packaging Machinery to discuss your requirements.",
    locale: "en_IN"
  }
};

/* --------------------------------------------------------------------------
   Derived helpers — keep WhatsApp formatting separate from display formatting.
   -------------------------------------------------------------------------- */

/** digits only, with country code, for wa.me links (e.g. "917200251560") */
SITE_CONFIG.waNumber = String(SITE_CONFIG.contacts.enquiries || "")
  .replace(/\D/g, "")
  .replace(/^0+/, "");

/** digits only with leading + for tel: links (e.g. "+917200251560") */
SITE_CONFIG.telNumber = String(SITE_CONFIG.contacts.enquiries || "").replace(
  /[^\d+]/g,
  ""
);

/**
 * Build a WhatsApp deep link.
 * @param {string} message pre-filled enquiry text
 * @returns {string} https://wa.me/<number>?text=<encoded message>
 */
function buildWhatsAppUrl(message) {
  const base = "https://wa.me/" + (SITE_CONFIG.waNumber || "");
  if (!message) return base;
  return base + "?text=" + encodeURIComponent(message);
}
