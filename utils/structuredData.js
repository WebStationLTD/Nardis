export const generateOrganizationSchema = (data) => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Example",
    url: "https://example.bg",
    logo: "https://example.bg/next-level-logo.png",
    description: "Lorem ipsum dolor sit amet",
    address: {
      "@type": "PostalAddress",
      streetAddress: "ул. София 1",
      addressLocality: "София",
      addressCountry: "BG",
      postalCode: "1000",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+359888123456",
      contactType: "customer service",
      email: "email@example.com",
    },
  };
};

export const generateProductSchema = (product) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images[0]?.src || "",
    brand: {
      "@type": "Brand",
      name: "Example",
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "BGN",
      availability: product.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `https://nardis.bg/product/${product.slug}`,
    },
  };
};

export const generateArticleSchema = (post) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title.rendered,
    image: post.yoast_head_json?.og_image?.[0]?.url || "",
    author: {
      "@type": "Organization",
      name: "Example",
    },
    publisher: {
      "@type": "Organization",
      name: "Example",
      logo: {
        "@type": "ImageObject",
        url: "https://example.bg/next-level-logo.png",
      },
    },
    datePublished: post.date,
    dateModified: post.modified || post.date,
    description: post.yoast_head_json?.description || "",
  };
};

export const generateBreadcrumbSchema = (items) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};
