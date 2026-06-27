export const continents = [
  "Afrique",
  "Asie",
  "Europe",
  "Amérique du Nord",
  "Amérique du Sud",
  "Océanie",
  "Antarctique"
];

export const countries = [
  { name: "Cameroun", code: "CM", dial_code: "+237", continent: "Afrique" },
  { name: "Nigéria", code: "NG", dial_code: "+234", continent: "Afrique" },
  { name: "Sénégal", code: "SN", dial_code: "+221", continent: "Afrique" },
  { name: "Côte d'Ivoire", code: "CI", dial_code: "+225", continent: "Afrique" },
  { name: "Afrique du Sud", code: "ZA", dial_code: "+27", continent: "Afrique" },
  { name: "Maroc", code: "MA", dial_code: "+212", continent: "Afrique" },
  { name: "France", code: "FR", dial_code: "+33", continent: "Europe" },
  { name: "Belgique", code: "BE", dial_code: "+32", continent: "Europe" },
  { name: "Suisse", code: "CH", dial_code: "+41", continent: "Europe" },
  { name: "Allemagne", code: "DE", dial_code: "+49", continent: "Europe" },
  { name: "Royaume-Uni", code: "GB", dial_code: "+44", continent: "Europe" },
  { name: "Italie", code: "IT", dial_code: "+39", continent: "Europe" },
  { name: "États-Unis", code: "US", dial_code: "+1", continent: "Amérique du Nord" },
  { name: "Canada", code: "CA", dial_code: "+1", continent: "Amérique du Nord" },
  { name: "Mexique", code: "MX", dial_code: "+52", continent: "Amérique du Nord" },
  { name: "Brésil", code: "BR", dial_code: "+55", continent: "Amérique du Sud" },
  { name: "Argentine", code: "AR", dial_code: "+54", continent: "Amérique du Sud" },
  { name: "Chine", code: "CN", dial_code: "+86", continent: "Asie" },
  { name: "Japon", code: "JP", dial_code: "+81", continent: "Asie" },
  { name: "Inde", code: "IN", dial_code: "+91", continent: "Asie" },
  { name: "Émirats Arabes Unis", code: "AE", dial_code: "+971", continent: "Asie" },
  { name: "Australie", code: "AU", dial_code: "+61", continent: "Océanie" },
  { name: "Nouvelle-Zélande", code: "NZ", dial_code: "+64", continent: "Océanie" }
];

export const citiesByCountry = {
  "Cameroun": ["Douala", "Yaoundé", "Garoua", "Bamenda", "Maroua", "Bafoussam", "Ngaoundéré", "Bertoua", "Loum", "Kumba", "Edéa", "Kribi", "Sangmélima", "Foumbot"],
  "France": ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier", "Bordeaux", "Lille"],
  "Nigéria": ["Lagos", "Abuja", "Kano", "Ibadan", "Port Harcourt"],
  "Sénégal": ["Dakar", "Thiès", "Saint-Louis", "Ziguinchor"],
  "Côte d'Ivoire": ["Abidjan", "Bouaké", "Yamoussoukro", "San-Pédro"],
  "États-Unis": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Miami", "San Francisco"],
  "Canada": ["Toronto", "Montréal", "Vancouver", "Calgary", "Ottawa"],
  "Chine": ["Pékin", "Shanghai", "Shenzhen", "Guangzhou"],
  "Japon": ["Tokyo", "Yokohama", "Osaka", "Kyoto"],
  "Émirats Arabes Unis": ["Dubaï", "Abu Dhabi", "Sharjah"]
};

// Fonction de secours pour obtenir des villes génériques si le pays n'est pas détaillé
export function getCitiesForCountry(countryName) {
  if (citiesByCountry[countryName]) {
    return citiesByCountry[countryName];
  }
  return ["Capitale", "Ville Principale 1", "Ville Principale 2"];
}
