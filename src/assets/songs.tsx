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
    src: "songs/audio/Campfire.mp3",
  },
  {
    title: "Summer Nights",
    artist: "LiQWYD",
    imgSrc: "songs/imgs/Summer-Nights.jpg",
    src: "songs/audio/Summer-Nights.mp3",
  },
];

export default songs;
