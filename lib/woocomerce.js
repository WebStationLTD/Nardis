import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const WooCommerce = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL,
  consumerKey: process.env.WC_CONSUMER_KEY,
  consumerSecret: process.env.WC_CONSUMER_SECRET,
  version: "wc/v3",
});

// Разширяване на оригиналния метод get, за да предотвратим кеширане
const originalGet = WooCommerce.get;
WooCommerce.get = function (endpoint, params) {
  // Добавяме timestamp към всяка заявка, за да избегнем кеширане
  const newParams = {
    ...params,
    _timestamp: Date.now(), // Добавяме уникален timestamp към всяка заявка
  };
  return originalGet.call(this, endpoint, newParams);
};

export default WooCommerce;
