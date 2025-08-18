import "../style.scss";
import { sanitiseInput } from "./utils";
import { sleep } from "./utils";

//Query Selectors

const searchLyricSubmit =
  document.querySelector<HTMLButtonElement>("#searchLyricSubmit");
const displayArea = document.querySelector<HTMLDivElement>(".display-area");
const responseDisplay =
  document.querySelector<HTMLParagraphElement>("#display-response");
const quickMessage = document.querySelector<HTMLParagraphElement>(
  ".display-area--quick-message"
);

if (
  !searchLyricSubmit ||
  !responseDisplay ||
  !responseDisplay ||
  !quickMessage ||
  !displayArea
) {
  throw new Error("Missing DOM elements on home page");
}

interface SongDetails {
  id: number;
  name: string;
  artists: any[];
  releaseYear: number;
  lyrics: string;
  genres: any[];
}

const searchSong = async (input: string): Promise<SongDetails[]> => {
  const lyric: string = sanitiseInput(input);
  const words = lyric.split(",").map((w) => w.trim());

  const url = new URL(
    "https://railwaytest-v1-production.up.railway.app/api/songs"
  );

  words.forEach((word) => url.searchParams.append("words", word));

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("we have an error - cannot find the database");
  }

  const songDetails: SongDetails[] = await response.json();
  return songDetails;
};

searchLyricSubmit.addEventListener("click", async (e) => {
  e.preventDefault();
  responseDisplay.innerHTML = "";
  const lyricForm = document.querySelector(
    "#input-field"
  ) as HTMLTextAreaElement;

  try {
    const song = await searchSong(lyricForm.value);

    if (song.length <= 0) {
      quickMessage.textContent =
        "We found...nothing this time! Try something new.";
      displayArea.style.opacity = "1";
      quickMessage.style.opacity = "1";
      await sleep(5000);
      displayArea.style.opacity = "0";
      quickMessage.style.opacity = "0";
      return;
    }

    song.forEach(async (s, i) => {
      const formattedLyrics = s.lyrics.replace(/\\n/g, "\n");

      let card = document.createElement("p");
      card.classList.add("display-area--text__card");
      const artistNames = s.artists.map((a) => a.name).join(", ");
      card.innerHTML = `▶ ${artistNames}:<br> ${s.name} `;
      let cardExpand = false;
      responseDisplay.appendChild(card);

      await sleep((i + 1) * 200);
      card.style.opacity = "1";

      card.addEventListener("click", () => {
        const youtube: string = `https://www.youtube.com/results?search_query=${s.name}+${artistNames}`;

        if (!cardExpand) {
          const link: HTMLAnchorElement = document.createElement("a");
          link.setAttribute("href", youtube);
          link.setAttribute("target", "_blank");
          link.textContent = "Find on Youtube";

          const genreNames = s.genres.map((g) => g.name).join(", ");
          card.innerHTML = `▼ <strong>${artistNames}:<br> ${s.name}</strong><br><br>
            Release Year: ${s.releaseYear}<br><br>
            Genre(s): ${genreNames}<br><br>
            Lyrics:<br> ${formattedLyrics}<br><br>
            `;
          card.appendChild(link);
          cardExpand = true;
        } else {
          card.innerHTML = `▶ ${artistNames}:<br> ${s.name} `;
          cardExpand = false;
        }
      });
    });

    displayArea.style.opacity = "1";
    quickMessage.textContent = "We found...";
    quickMessage.style.opacity = "1";
    await sleep(300);
    responseDisplay.style.opacity = "1";
  } catch (error) {
    return "No luck this time";
  }
});
