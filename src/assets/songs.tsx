interface Song {
  title: string;
  artist: string;
  imgSrc: string; // relative to public/
  src: string;
}

const songs: Song[] = [
  {
    title: "Campfire",
    artist: "extenz",
    imgSrc: "songs/imgs/Campfire.jpg",
    src: "songs/audio/Campfire.mp3",
  },
  {
    title: "Summer Nights",
    artist: "LiQWYD",
    imgSrc: "songs/imgs/Summer-Nights.jpg",
    src: "songs/audio/Summer-Nights.mp3",
  },
  {
    title: "Fly Away",
    artist: "SKIRK",
    imgSrc: "songs/imgs/Fly-Away.jpg",
    src: "songs/audio/Fly-Away.mp3",
  },
  {
    title: "swimming lessons",
    artist: "bail bonds",
    imgSrc: "songs/imgs/swimming-lessons.jpg",
    src: "songs/audio/swimming-lessons.mp3",
  },
  {
    title: "Need You",
    artist: "Tobjan",
    imgSrc: "songs/imgs/Need-You.jpg",
    src: "songs/audio/Need-You.mp3",
  },
  {
    title: "Sandcastle",
    artist: "Wonki",
    imgSrc: "songs/imgs/Sandcastle.jpg",
    src: "songs/audio/Sandcastle.mp3",
  },
  {
    title: "Clown",
    artist: "Sakura Girl",
    imgSrc: "songs/imgs/Clown.jpg",
    src: "songs/audio/Clown.mp3",
  },
  {
    title: "Sky",
    artist: "MBB & ASHUTOSH",
    imgSrc: "songs/imgs/Sky.jpg",
    src: "songs/audio/Sky.mp3",
  },
  {
    title: "No U No Me",
    artist: "Jay Someday",
    imgSrc: "songs/imgs/No-U-No-Me.jpg",
    src: "songs/audio/No-U-No-Me.mp3",
  },
  {
    title: "Third Night Of July [EDIT]",
    artist: "SUNDANCE",
    imgSrc: "songs/imgs/Third-Night-Of-July-EDIT.jpg",
    src: "songs/audio/Third-Night-Of-July-EDIT.mp3",
  },
  {
    title: "Dream World",
    artist: "Starfury",
    imgSrc: "songs/imgs/Dream-World.jpg",
    src: "songs/audio/Dream-World.mp3",
  },
  {
    title: "Vistas",
    artist: "tubebackr",
    imgSrc: "songs/imgs/Vistas.jpg",
    src: "songs/audio/Vistas.mp3",
  },
  {
    title: "Sunset",
    artist: "MusicbyAden",
    imgSrc: "songs/imgs/Sunset.jpg",
    src: "songs/audio/Sunset.mp3",
  },
  {
    title: "Jolly Way",
    artist: "Artegon",
    imgSrc: "songs/imgs/Jolly-Way.jpg",
    src: "songs/audio/Jolly-Way.mp3",
  },
  {
    title: "Life's Good",
    artist: "Bryo",
    imgSrc: "songs/imgs/Lifes-Good.jpg",
    src: "songs/audio/Lifes-Good.mp3",
  },
  {
    title: "Utopia",
    artist: "ASHUTOSH",
    imgSrc: "songs/imgs/Utopia.jpg",
    src: "songs/audio/Utopia.mp3",
  },
];

export type { Song };

export default songs;
