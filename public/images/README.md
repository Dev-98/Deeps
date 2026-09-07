# Photos go here

Drop image files straight into this folder, then point a memory at them in
`src/data/memories.ts` — dropping the word `public` from the path:

    public/images/first-day.jpg   →   image: "/images/first-day.jpg"

Notes:

- `.jpg`, `.png` and `.webp` all work. `.webp` is much smaller — worth
  converting before the site goes live.
- Around 1200px on the long edge is plenty. Photos are displayed in a 4:3
  frame and cropped to fill, so anything roughly landscape looks best.
- Filenames: lowercase, dashes instead of spaces (`the-cafe.jpg`, not
  `The Cafe.JPG`). Spaces and capitals cause trouble once it's deployed.
- Until a memory has an `image`, a warm "Photo goes here" panel is drawn
  instead, so the site works fine while you're still collecting them.

Videos go in `public/video/`, audio in `public/audio/` — those are for the
later chapters.
