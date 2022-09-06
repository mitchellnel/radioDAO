interface Song {
  title: string;
  artist: string;
  imgSrc: string; // relative to the PlayerArt.tsx file's location (for now)
  src: string;
}

const songs: Song[] = [
  {
    title: "Campfire",
    artist: "extenz",
    imgSrc: "songs/imgs/Campfire.jpg",
    src: "audio/Campfire.mp3",
  },
  {
    title: "Summer Nights",
    artist: "LiQWYD",
    imgSrc: "./imgs/Summer-Nights.jpg",
    src: "./audio/Summer-Nights.mp3",
  },
];

export default songs;
