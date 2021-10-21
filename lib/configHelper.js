class ConfigHelper {
  domainList() {
    const envCloudflare = JSON.parse(process.env.CLOUDFLARE_ZONES);
    let domains = [];
    envCloudflare.forEach((cd) => {
      cd.ZONES.forEach((zone) => {
        Object.keys(zone).forEach((domain) => domains.push(domain));
      });
    });
    return domains;
  }
  
  findDomain(domain) {
    const envCloudflare = JSON.parse(process.env.CLOUDFLARE_ZONES);
    const find = envCloudflare.find((cd) => cd.ZONES.find((zone) => zone[[domain]]));
    if (!find) return false;
    const findZone = find.ZONES.find((zone) => zone[domain]);
    if (!findZone) return false;
    return {
      CLOUDFLARE_TOKEN: find.CLOUDFLARE_TOKEN,
      ZONE_NAME: domain,
      ZONE_ID: findZone[domain]
    };
  }
}

module.exports = ConfigHelper;
