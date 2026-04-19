const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';
mongoose.connect(dbUrl)
.then(() => {
    console.log('Mongo Connection Open');
  })
  .catch((err) => {
    console.log('Oh No Mongo error');
    console.log(err);
  });

const sample = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const seedImages = [
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754676367/YelpCamp/uyhalx6nygcq86lq9i2g.jpg',
    filename: 'YelpCamp/uyhalx6nygcq86lq9i2g'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754624003/YelpCamp/begmejxd52exnpqllwhs.jpg',
    filename: 'YelpCamp/begmejxd52exnpqllwhs'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754623915/YelpCamp/kw6o5ppwkpr2g3pnnxpt.jpg',
    filename: 'YelpCamp/kw6o5ppwkpr2g3pnnxpt'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754623914/YelpCamp/f38zzf5hkvnvlppf7w6g.jpg',
    filename: 'YelpCamp/f38zzf5hkvnvlppf7w6g'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754623853/YelpCamp/o86qizoj5xvolf8ohnom.jpg',
    filename: 'YelpCamp/o86qizoj5xvolf8ohnom'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754623853/YelpCamp/sjzqispl2tskk8bpiqmd.jpg',
    filename: 'YelpCamp/sjzqispl2tskk8bpiqmd'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754623764/YelpCamp/bt61m98gjn4ueeuvenib.jpg',
    filename: 'YelpCamp/bt61m98gjn4ueeuvenib'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754623764/YelpCamp/ivp6sq63fgjofe84iacb.jpg',
    filename: 'YelpCamp/ivp6sq63fgjofe84iacb'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754623700/YelpCamp/yuitca2nrcfcite0zk0r.jpg',
    filename: 'YelpCamp/yuitca2nrcfcite0zk0r'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754623699/YelpCamp/guordztde4zv20yuaern.jpg',
    filename: 'YelpCamp/guordztde4zv20yuaern'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754623632/YelpCamp/kfnem0jugja1qbdoziws.jpg',
    filename: 'YelpCamp/kfnem0jugja1qbdoziws'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754623632/YelpCamp/xeki0xb26kandwaazgr6.jpg',
    filename: 'YelpCamp/xeki0xb26kandwaazgr6'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754623546/YelpCamp/pvpzpsc7iqbzqgpceoj7.jpg',
    filename: 'YelpCamp/pvpzpsc7iqbzqgpceoj7'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754623546/YelpCamp/btnnzwjjrcglyvmquzc8.jpg',
    filename: 'YelpCamp/btnnzwjjrcglyvmquzc8'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754623481/YelpCamp/wbd8gb73zrxk8vnmbphz.jpg',
    filename: 'YelpCamp/wbd8gb73zrxk8vnmbphz'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754623481/YelpCamp/jmzp0n4lujviozevyzbm.jpg',
    filename: 'YelpCamp/jmzp0n4lujviozevyzbm'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754623414/YelpCamp/gludlnvypiftphjpyfow.jpg',
    filename: 'YelpCamp/gludlnvypiftphjpyfow'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754623414/YelpCamp/hr9qbogaj9bhm3qqwvsm.jpg',
    filename: 'YelpCamp/hr9qbogaj9bhm3qqwvsm'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754623339/YelpCamp/lmucp4ar4tdtuekwhlcr.jpg',
    filename: 'YelpCamp/lmucp4ar4tdtuekwhlcr'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754623339/YelpCamp/dpycqflrdg16jn8krsxd.jpg',
    filename: 'YelpCamp/dpycqflrdg16jn8krsxd'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754623278/YelpCamp/exgdad583paelx7sqbka.jpg',
    filename: 'YelpCamp/exgdad583paelx7sqbka'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754623278/YelpCamp/jjy8lwl8jnw3fpolsbuw.jpg',
    filename: 'YelpCamp/jjy8lwl8jnw3fpolsbuw'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754623202/YelpCamp/hsjoac7ly1chd7rnpbck.jpg',
    filename: 'YelpCamp/hsjoac7ly1chd7rnpbck'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754623202/YelpCamp/ag6o224eul0icokypu40.jpg',
    filename: 'YelpCamp/ag6o224eul0icokypu40'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754623201/YelpCamp/zvr8ajvfucqzeekgum4c.jpg',
    filename: 'YelpCamp/zvr8ajvfucqzeekgum4c'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754623129/YelpCamp/bnmtqba9wfvpy4jcg9xu.jpg',
    filename: 'YelpCamp/bnmtqba9wfvpy4jcg9xu'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754623129/YelpCamp/yc0qiqcavba8g7s7uo5l.jpg',
    filename: 'YelpCamp/yc0qiqcavba8g7s7uo5l'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754623066/YelpCamp/sxrfw5v4k1jfp17k4mrv.jpg',
    filename: 'YelpCamp/sxrfw5v4k1jfp17k4mrv'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754623066/YelpCamp/key1yvyh5h7kkl2mamdv.jpg',
    filename: 'YelpCamp/key1yvyh5h7kkl2mamdv'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754623001/YelpCamp/z7ocz0fgd7yxwt9a79gx.jpg',
    filename: 'YelpCamp/z7ocz0fgd7yxwt9a79gx'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754623001/YelpCamp/f43nyw101hq90leibca2.jpg',
    filename: 'YelpCamp/f43nyw101hq90leibca2'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754622932/YelpCamp/q96ka3k3xyznzocnlinu.jpg',
    filename: 'YelpCamp/q96ka3k3xyznzocnlinu'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754622932/YelpCamp/ikjyjzkqrhvzvabiqxxt.jpg',
    filename: 'YelpCamp/ikjyjzkqrhvzvabiqxxt'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754617036/YelpCamp/ad4oj1cqta14t9szdkod.jpg',
    filename: 'YelpCamp/ad4oj1cqta14t9szdkod'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754617036/YelpCamp/daui4pxqhvivvfeqqpks.jpg',
    filename: 'YelpCamp/daui4pxqhvivvfeqqpks'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754592542/YelpCamp/gghmlmdjr9ssnwvsd9a6.jpg',
    filename: 'YelpCamp/gghmlmdjr9ssnwvsd9a6'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754592539/YelpCamp/uyumbpg6snauweccjxpf.jpg',
    filename: 'YelpCamp/uyumbpg6snauweccjxpf'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754591981/YelpCamp/hbpuauhll4d5nfduianj.jpg',
    filename: 'YelpCamp/hbpuauhll4d5nfduianj'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754591813/YelpCamp/r98z68x8ligogiuiwdep.jpg',
    filename: 'YelpCamp/r98z68x8ligogiuiwdep'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754591640/YelpCamp/zzqbr1sgqixd5s75a462.jpg',
    filename: 'YelpCamp/zzqbr1sgqixd5s75a462'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754591565/YelpCamp/xcz9rsvf2gblb8sky3rd.jpg',
    filename: 'YelpCamp/xcz9rsvf2gblb8sky3rd'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754591205/YelpCamp/peeevrr6gq2qu8hny2bo.jpg',
    filename: 'YelpCamp/peeevrr6gq2qu8hny2bo'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754591205/YelpCamp/k2tvagtcpdxe8nszc108.jpg',
    filename: 'YelpCamp/k2tvagtcpdxe8nszc108'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754591279/YelpCamp/n0drqu7crm5rwvblcznp.jpg',
    filename: 'YelpCamp/n0drqu7crm5rwvblcznp'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754499866/YelpCamp/j51zko5gqpuqfworrrd9.jpg',
    filename: 'YelpCamp/j51zko5gqpuqfworrrd9'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754456481/YelpCamp/zqoaopk0vrtjkmdlejek.jpg',
    filename: 'YelpCamp/zqoaopk0vrtjkmdlejek'
  },
  {
    url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754456481/YelpCamp/ufogluq6478xavl4mihr.jpg',
    filename: 'YelpCamp/ufogluq6478xavl4mihr'
  }
];

const getRandomImages = (images, count = 3) => {
  const shuffled = [...images].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const seedDB = async () => {
  await Campground.deleteMany({});

  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 40) + 10;

    const camp = new Campground({
      author: '6895623ff65871c97bdd37d2',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude
        ]
      },
      image:getRandomImages(seedImages, 3),
      price: price,
      description:
        "Pitch your tent or park your RV at this tranquil riverside campground, where the gentle rush of the water provides a soothing soundtrack to your outdoor adventure. Enjoy direct access to fishing and kayaking, with well-maintained, spacious sites that offer a blend of shade and sun. Fire rings and picnic tables are provided for enjoying meals outdoors, and you'll find composting toilets and potable water within easy walking distance. The camp store provides necessities and firewood, and you'll be close enough to enjoy nearby hiking trails."
    });

    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});