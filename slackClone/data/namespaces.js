const Namespace = require('../classes/Namespace');
const Room = require('../classes/Room');

const wikiNs = new Namespace(
  0,
  'Wikipedia',
  'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/103px-Wikipedia-logo-v2.svg.png',
  '/wiki'
);
const mozillaNs = new Namespace(
  1,
  'Mozilla',
  'https://www.mozilla.org/media/img/logos/firefox/logo-quantum.9c5e96634f92.png',
  '/mozilla'
);
const linuxNs = new Namespace(
  2,
  'Linux',
  'https://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png',
  '/linux'
);

wikiNs.addRoom(new Room(0, 'New Article', 0));
wikiNs.addRoom(new Room(1, 'Editors', 0, true));
wikiNs.addRoom(new Room(2, 'Other', 0));

mozillaNs.addRoom(new Room(0, 'Firefox', 1));
mozillaNs.addRoom(new Room(1, 'SeaMonkey', 1));
mozillaNs.addRoom(new Room(2, 'SpiderMonkey', 1));
mozillaNs.addRoom(new Room(3, 'Rust', 1));

linuxNs.addRoom(new Room(0, 'Debian', 2));
linuxNs.addRoom(new Room(1, 'Red Hat', 2));
linuxNs.addRoom(new Room(2, 'Ubuntu', 2));
linuxNs.addRoom(new Room(3, 'Mac OS', 2));

const namespaces = [wikiNs, mozillaNs, linuxNs];

module.exports = namespaces;
