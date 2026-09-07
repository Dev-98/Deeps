# Song clips go here

Optional. The soundtrack chapter works without any audio at all — the
cassette still turns and the note still appears.

To add sound, drop files in this folder and reference them in
`src/data/songs.ts` without the word `public`:

    public/audio/song-one.mp3   →   src: "/audio/song-one.mp3"

- `.mp3` is the safest format across phones and browsers.
- Use **short clips, 20–40 seconds** — the part of the song that actually
  means something. Nobody listens to a full track on a webpage, and a
  4-minute file is a slow load on mobile data.
- Nothing autoplays. She has to press play, which is both a browser rule
  and the right call for a surprise she might open in public.
