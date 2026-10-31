db = db.getSiblingDB("mcmasterful-books");
db.createCollection("books");

db.books.insertMany([
  {
    name: "Giant's Bread",
    author: "Agatha Christie",
    description:
      "'A satisfying novel.' New York Times 'When Miss Westmacott reaches the world of music, her book suddenly comes alive. The chapters in which Jane appears are worth the rest of the book put together.' New Statesman --This text refers to an out of print or unavailable edition of this title.",
    price: 21.86,
    image:
      "https://upload.wikimedia.org/wikipedia/en/4/45/Giant%27s_Bread_First_Edition_Cover.jpg",
  },
  {
    name: "Appointment with Death",
    author: "Agatha Christie",
    description:
      "In this exclusive authorized edition from the Queen of Mystery, the unstoppable Hercule Poirot finds himself in the Middle East with only one day to solve a murder..",
    price: 19.63,
    image:
      "https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Appointment_with_Death_First_Edition_Cover_1938.jpg/220px-Appointment_with_Death_First_Edition_Cover_1938.jpg",
  },
  {
    name: "Beowulf: The Monsters and the Critics",
    author: "J.R.R Tolkein",
    description:
      "J. R. R. Tolkien's essay 'Beowulf: The Monsters and the Critics', initially delivered as the Sir Israel Gollancz Memorial Lecture at the British Academy in 1936, and first published as a paper in the Proceedings of the British Academy that same year, is regarded as a formative work in modern Beowulf studies. In it, Tolkien speaks against critics who play down the monsters in the poem, namely Grendel, Grendel's mother, and the dragon, in favour of using Beowulf solely as a source for Anglo-Saxon history.",
    price: 19.95,
    image:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/51/Beowulf_The_Monsters_and_the_Critics_1936_title_page.jpg/220px-Beowulf_The_Monsters_and_the_Critics_1936_title_page.jpg",
  },
  {
    name: "The Complete Works of William Shakespeare",
    author: "William Shakespeare",
    description:
      "No library is complete without the classics! This leather-bound edition includes the complete works of the playwright and poet William Shakespeare, considered by many to be the English language's greatest writer.",
    price: 39.99,
    image: "https://m.media-amazon.com/images/I/71Bd39ofMAL._SL1500_.jpg",
  },
  {
    name: "Iliad & Odyssey ",
    author: "Homer",
    description:
      "No home library is complete without the classics! Iliad & Odyssey brings together the two essential Greek epics from the poet Homer in an elegant, leather-bound, omnibus edition-a keepsake to be read and treasured.",
    price: 33.99,
    image: "https://m.media-amazon.com/images/I/71ZWKmOIpVL._SL1500_.jpg",
  },
  {
    name: "Modern Software Engineering: Doing What Works to Build Better Software Faster",
    author: "David Farley",
    description:
      "In Modern Software Engineering, continuous delivery pioneer David Farley helps software professionals think about their work more effectively, manage it more successfully, and genuinely improve the quality of their applications, their lives, and the lives of their colleagues.",
    price: 51.56,
    image: "https://m.media-amazon.com/images/I/81sji+WquSL._SL1500_.jpg",
  },
  {
    name: "Domain-Driven Design: Tackling Complexity in the Heart of Software ",
    author: "Eric Evans",
    description:
      "Leading software designers have recognized domain modeling and design as critical topics for at least twenty years, yet surprisingly little has been written about what needs to be done or how to do it.",
    price: 91.99,
    image: "https://m.media-amazon.com/images/I/71Qde+ZerdL._SL1500_.jpg",
  },
  {
    name: "Carrie",
    author: "Stephen King",
    description:
      "A bullied teenager discovers she has telekinetic powers, and her prom night goes very wrong.",
    price: 11.99,
    image:
      "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1562580553l/51184262.jpg",
  },
  {
    name: "The Shining",
    author: "Stephen King",
    description:
      "A family winters alone in an isolated hotel that has a mind of its own.",
    price: 14.99,
    image: "https://example.com/images/the-shining.jpg",
  },
  {
    name: "The Stand",
    author: "Stephen King",
    description:
      "A plague wipes out most of humanity, and the survivors must choose a side.",
    price: 18.99,
    image: "https://m.media-amazon.com/images/I/91x78WWuiTL._SY466_.jpg",
  },
  {
    name: "It",
    author: "Stephen King",
    description:
      "Seven children in Derry face a shape-shifting evil that returns every twenty-seven years.",
    price: 16.99,
    image:
      "https://thumbs.peoplesgdarchive.org/static/media-items/image/22856/upto-1440x4032/642cb809/1/IT3.jpg?tgt=webp",
  },
  {
    name: "Misery",
    author: "Stephen King",
    description:
      "A novelist is rescued from a car crash by his number one fan, who will not let him leave.",
    price: 13.5,
    image:
      "https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781668094709/misery-9781668094709_lg.jpg",
  },
  {
    name: "A Game of Thrones",
    author: "George R.R. Martin",
    description:
      "Ned Stark is named Hand of the King, and the Seven Kingdoms begin to tear themselves apart.",
    price: 12.99,
    image: "https://i0.wp.com/ic.pics.livejournal.com/grrm/7059164/375508/375508_900.jpg",
  },
  {
    name: "A Clash of Kings",
    author: "George R.R. Martin",
    description:
      "Five kings claim the Iron Throne while a red comet burns over Westeros.",
    price: 13.99,
    image: "https://cdn.kobo.com/book-images/b17d1dea-b207-4ebe-b36b-da02a74d3289/353/569/90/False/a-clash-of-kings-a-song-of-ice-and-fire-book-two.webp",
  },
  {
    name: "A Storm of Swords",
    author: "George R.R. Martin",
    description:
      "The War of the Five Kings reaches its bloodiest turning point.",
    price: 14.99,
    image: "https://awoiaf.westeros.org/images/thumb/2/24/AStormOfSwords.jpg/200px-AStormOfSwords.jpg",
  },
  {
    name: "A Feast for Crows",
    author: "George R.R. Martin",
    description:
      "With the realm exhausted, the survivors scheme for power in the aftermath.",
    price: 13.49,
    image: "https://awoiaf.westeros.org/images/thumb/a/a3/AFeastForCrows.jpg/220px-AFeastForCrows.jpg",
  },
  {
    name: "A Dance with Dragons",
    author: "George R.R. Martin",
    description:
      "Daenerys rises in the east while the North faces what lies beyond the Wall.",
    price: 15.99,
    image: "https://georgerrmartin.com/gallery/art/dragons01.jpg",
  },  
  {
    name: "Mastering Linux Premium Edition",
    author: "Paul S. Wang",
    description:
      "A hands-on guide to the Linux command line, covering files, processes, networking and shell scripting.",
    price: 49.99,
    image: "https://m.media-amazon.com/images/I/71HP27TDS2L.gif",
  },
  {
    name: "Indiana Jones and the Last Crusade",
    author: "Rob MacGregor",
    description:
      "The novelization of the 1989 film: Indy races the Nazis to find the Holy Grail, with his father along for the ride.",
    price: 9.99,
    image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388196967i/1548325.jpg",
  },
  {
    name: "Macs For Dummies",
    author: "David Pogue",
    description:
      "The 1992 beginner guide to the Macintosh, covering the desktop, files, printing and the rest of System 7.",
    price: 19.99,
    image: "https://images.craigslist.org/00U0U_jsECelEMut4_0lM0t2_600x450.jpg",
  },
]);
