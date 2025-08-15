import "../style.scss";
import { sanitiseInput } from "./utils";
import { displayMessageOnSubmit } from "./utils";
// import { sleep } from "./utils";

//UTILS

const submitSongForm =
  document.querySelector<HTMLFormElement>("#submit-song-form");
const errorP = document.querySelector<HTMLParagraphElement>("#error-message");

if (!submitSongForm || !errorP) {
  throw new Error("Missing DOM elements on submit page");
}

submitSongForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("button has been pressed!");

  const form = e.target as HTMLFormElement;
  const formData = new FormData(form); //learnt this today

  const name = sanitiseInput(formData.get("name") as string);
  const artistNames: string = sanitiseInput(
    formData.get("artistNames") as string
  );
  const artists: string[] = artistNames.trim().split(",");
  let releaseYear: number = Number(
    sanitiseInput(formData.get("releaseYear") as string)
  );
  const genreNames = sanitiseInput(formData.get("genreNames") as string);
  const genres: string[] = genreNames.trim().split(",");
  const lyrics = sanitiseInput(formData.get("lyrics") as string);

  const json = JSON.stringify({
    name: name,
    lyrics: lyrics,
    releaseYear: releaseYear,
    artistNames: artists,
    genreNames: genres,
  });

  console.log(json);
  try {
    const response = await fetch("http://localhost:8080/api/songs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        artists: artists,
        releaseYear: releaseYear,
        genres: genres,
        lyrics: lyrics,
      }),
    });
    if (response.ok) {
      /*200*/ displayMessageOnSubmit(
        form,
        errorP,
        "Thanks for your contribution! We appreciate your support."
      );
    } else {
      displayMessageOnSubmit(
        form,
        errorP,
        "Oops, something went wrong there. Please make sure you've typed your addition correctly"
      );
    }
  } catch (error) {
    console.log("You're not connected properly yet - check your API.");
  }
});

// {
//   "name": "Bohemian Rhapsody",
//   "lyrics": "Is this the real life? Is this just fantasy?...",
//   "releaseYear": 1975,
//   "authorNames": ["Freddie Mercury", "Queen"],
//   "genreNames": ["Rock", "Progressive Rock"]
// }

// fix messages that appear to confirm found/not found/ record added
//fix spaces in the rock genres
