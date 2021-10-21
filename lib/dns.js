require('dotenv').config();
const cf = require('cloudflare');
const isReachable = require('is-reachable');
const ConfigHelper = require('./configHelper');

class DNS extends ConfigHelper {
  constructor() {
    super();
    this.zoneId = null;
    this.proxied = true;
    this.cf = null;
  }
  
  getZone(domain) {
    const findZoneId = this.findDomain(domain);
    if (!findZoneId) throw new Error('Zone with this domain not found');
    const zoneId = findZoneId.ZONE_ID;
    if (!zoneId) return null;
    this.zoneId = zoneId;
    this.cf = cf({
      token: findZoneId.CLOUDFLARE_TOKEN
    });
    return this;
  }

  validDomainStatus(domain) {
    return isReachable(domain);
  }

  findRecord(name, type = 'CNAME') {
    const field = (type === 'CNAME') ? 'name' : 'content';
    return this.cf.dnsRecords.browse(this.zoneId).then(({result}) => {
      return result.find((record) => record.type === type && record[field] === name);
    });
  }

  async registerOrUpdate(cname, targetDomain) {
    this.cname = cname;
    this.targetDomain = targetDomain;
    const record = {
      'type': 'CNAME',
      'name': this.cname,
      'content': this.targetDomain,
      'ttl': 0,
      'proxied': this.proxied
    };
    const readZone = await this.cf.zones.read(this.zoneId);
    if (readZone.result.status === 'active') {
      const findRecord = await this.findRecord(this.cname, 'CNAME');
      if (findRecord && findRecord.id) {
        return this.cf.dnsRecords.edit(this.zoneId, findRecord.id, record);
      } else {
        return this.cf.dnsRecords.add(this.zoneId, record);
      }
    }
  }
}

module.exports = DNS;
