/* Dokuna – Google Consent Mode v2: Grundeinstellung.
   Wird im <head> vor allem anderen geladen. Solange niemand zugestimmt hat,
   ist alles außer dem technisch Notwendigen abgelehnt. */
window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', true);
