# Her Birthday — Interactive Story

Built from `Her_Birthday_Interactive_Story_Storyboard_v1.docx`.
This is **milestone 1**: the polished vertical slice.

```
START → SECRET DOOR → BEFORE YOU → OUR STORY → THE GAME
      → THE LETTER ROOM → MEMORY LANE
      → THE WISH → THE BIRTHDAY → ONE MORE THING → ONE MORE YEAR
```

All eleven chapters, plus THE SECRET HUNT hidden off to one side, and
the cassette drawer running underneath all of them.
Everything works; the words are what's left.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

Use `npm run build`, not a bare `next build` — `next` isn't on your PATH,
it lives in `node_modules/.bin`. (`npx next build` works too.)

To open it from your phone on the same wifi, use the Network URL the dev
server prints. Your machine's LAN address is listed in
`allowedDevOrigins` in `next.config.ts`; if your IP changes, update it
there or the dev server blocks the hot-reload connection.

Requires network on first run: the three Google fonts (Fraunces, Nunito
Sans, Caveat) are fetched and self-hosted at build time by `next/font`.

## Stack

Next.js App Router · TypeScript · Tailwind v4 · Motion for React · GSAP.
No backend. Progress lives in `localStorage`.

## Where the content lives

Everything she reads is in `src/data/` — edit these, not the components.

| File | What's in it |
| --- | --- |
| `src/data/door.ts` | The door question, the accepted answers, the teasing wrong-answer replies |
| `src/data/beforeYou.ts` | The four lines of the opening, and the line the world blooms into |
| `src/data/memories.ts` | The map: five places, their coordinates, captions and unlock order |
| `src/data/questions.ts` | The five quiz questions, their options, and the reply for every answer |
| `src/data/letters.ts` | The four envelopes and the notes inside them |
| `src/data/tapes.ts` | The cassettes in the drawer |
| `src/data/chapters.ts` | Which chapters exist — flip `built` as each one ships |
| `src/data/polaroids.ts` | Memory Lane: the photographs and their captions |
| `src/data/secrets.ts` | The five hidden things and the reward for finding them all |
| `src/data/people.ts` | **Her name** for chapter 09, plus the pet names the writing uses |
| `src/data/celebration.ts` | The words on The Wish and The Birthday, including the fake-out |
| `src/data/finale.ts` | The video settings and the last line of the whole site |

**Written already, in your voice** — rewrite the specifics, keep the shape:
`letters.ts` (all four envelopes, including the sincere one),
`celebration.ts`, `secrets.ts` (the hunt reward) and `finale.ts` (the last
line).

**Still placeholder, because only you can write them:** `memories.ts` (the
five places), `questions.ts` (the five quiz questions), `polaroids.ts`
(the photo captions) and `songs.ts` (which songs and why). These are the
ones that make it hers.

### Emphasis inside the copy

Any of those strings can carry emphasis without touching a component:

| You write | You get |
| --- | --- |
| `*genuinely*` | the word in caramel, a little heavier |
| `^you^` | ^YOU^ — bold, uppercase, wide tracking, for the loud beats |

Everything else is written as normal sentences with normal capital
letters. Use the two markers sparingly — one per line at most, or they
stop meaning anything.

### Photos

Drop the files into **`public/images/`**, then point a memory at them in
`src/data/memories.ts`, dropping the word `public` from the path:

    public/images/first-day.jpg   →   image: "/images/first-day.jpg"

`.jpg`, `.png` and `.webp` all work; `.webp` is much smaller and worth
converting to before this goes live. Around 1200px on the long edge is
plenty — they're shown in a 4:3 frame and cropped to fill, so roughly
landscape shots look best. Use lowercase filenames with dashes, no
spaces. Until a memory has an `image`, a warm "Photo goes here" panel is
drawn in its place, so nothing breaks while you're still collecting them.

Video goes in `public/video/`, audio in `public/audio/` — those are for
the later chapters. There's a copy of these notes in
`public/images/README.md` too.

## Routes

| Route | Chapters |
| --- | --- |
| `/` | START + THE SECRET DOOR |
| `/story` | BEFORE YOU, blooming continuously into OUR STORY |
| `/game` | 03 — THE GAME |
| `/letters` | 04 — THE LETTER ROOM |
| `/memories` | 05 — MEMORY LANE |
| `/hunt` | 06 — THE SECRET HUNT (only reachable with all five found) |
| `/wish` | 07 — THE WISH |
| `/birthday` | 08 — THE BIRTHDAY |
| `/video` | 09 — ONE MORE THING |
| `/final` | FINAL — ONE MORE YEAR |
| `/end`, `/soundtrack` | Retired. Redirect to `/final` and `/memories` |

The chain runs `/` → `/story` → `/game` → `/letters` → `/soundtrack` →
`/end`.

**What each chapter asks of her before it lets her move on** — deliberately
light, so the experience never becomes a chore:

| Chapter | Gate |
| --- | --- |
| Our Story | All five places (they unlock in order, so this *is* the chapter) |
| The Game | All five questions — it's five cards, that's the whole thing |
| The Letter Room | Opening **"Definitely do not open"**, and nothing else. The other three are hers to read or skip. `gateLetterId` in `letters.ts` |
| Memory Lane | Three photographs developed. `memoryCopy.needed` in `polaroids.ts` |
| The Wish | Blowing out the candle |
| The Birthday | Nothing — she taps through at her own pace |
| One More Thing | Nothing. The video ending reveals the last page, and so does a missing file |

Before You waits for a deliberate tap on **Show me** after the bloom
settles — it never cuts itself into the next chapter.

`/story` redirects back to `/` if the door was never opened.

## Progress state

`src/lib/progress.tsx` holds the one central store the storyboard asks
for, persisted to `localStorage` under `her-birthday-progress-v1`:

```ts
{ doorUnlocked, worldBloomed, unlockedMemories, quizScore,
  lettersOpened, secretsFound, finalUnlocked }
```

Fields for the unbuilt chapters are already there.

**Starting over.** There's a small ↺ button in the top-left of every
screen. It only appears once a run is underway, and it asks before it
throws the run away. That's the replay/reset the storyboard calls for —
and it's what to reach for when a half-finished state from development
drops you into the middle of the story.

The key is versioned (`...-v2`). Bump the version in `src/lib/progress.tsx`
whenever the shape of `Progress` changes, or whenever old saved runs would
land someone in the wrong place — every older run is then discarded.

## Production rules being followed

- Mobile-first; every interaction works on tap, none require hover.
- Entrance animations are CSS, not JavaScript. The server-rendered HTML is
  never left invisible: if scripts are slow, blocked, or the tab loads in
  the background, `animation-fill-mode: both` still leaves everything at
  its final visible state. Motion and GSAP drive interaction and the
  cinematic beats only.
- `prefers-reduced-motion` is respected — the door still opens, it just
  doesn't swing, and the bloom resolves instantly.
- No autoplaying audio.
- Pages are static; first load is ~175 kB JS.

## Structure

```
src/
  app/                  routes
  components/
    scenes/             one file per chapter
    transitions/        the signature transitions
    animations/         Motion presets + GSAP helpers
    ui/                 Scene shell, buttons, icons, chocolate motif
  data/                 ← all the words and photos
  lib/progress.tsx      the central unlock state
public/images|video|audio
```

## Transitions

`src/components/transitions/TransitionProvider.tsx` owns every chapter
change. The overlay lives in the root layout, so it covers the screen,
navigates underneath, and uncovers — nothing ever cuts on a blank frame.

Three variants, each chosen for what it's cutting between:

| Variant | Where | What it does |
| --- | --- | --- |
| `doorway` | `/` → `/story`, map → `/game` | A lit arch opens out of the scene and floods past you |
| `fold` | `/game` → `/letters` | The screen folds shut like paper and unfolds into the next room |
| `sweep` | `/letters` → `/soundtrack`, `/soundtrack` → `/memories`, `/wish` → `/birthday`, `/video` → `/final` | Staggered panels draw up and lift away, like a set change |
| `heart` | Before You → the map, `/memories` → `/wish`, `/birthday` → `/video` | A heart beats once, then opens out of the middle and swallows the screen |

`heart` is deliberately rationed to three cuts — the moment love arrives,
the moment the photographs give way to the candle, and the moment the
party gives way to the video. Spend it anywhere else and it stops meaning
anything.

**A hard-won rule for new variants:** never put a `filter` or a large
`box-shadow` on a shape you are scaling past ~10x. A drop-shadow on a
heart at 26x is a multi-thousand-pixel composited layer; the frame rate
collapses, the GSAP timeline stops advancing, and the overlay never
clears — which freezes the whole app behind it. Put the glow in a
separate, unscaled element. There's a 6-second watchdog in the provider
that tears the overlay down if a timeline ever stalls anyway, but don't
rely on it.

Use it from any chapter:

```ts
const { go, run } = useTransition();
go("/letters", "fold");        // change route behind the cover
run("sweep", () => setThing()); // change something in place behind it
```

Reduced motion skips the animation and just performs the action. Add new
variants inside the provider rather than hand-rolling one in a chapter —
that's how six rooms keep feeling like one film.

## The escalation

The palette is a dramatic arc, not a style guide. Breaking it is the
point, and *where* it breaks is the whole design:

| Chapters | Look | Why |
| --- | --- | --- |
| 00–05 | Cream, cocoa, one caramel accent | Restraint. This is the run-up, and it has to feel ordinary enough that the payoff isn't obvious |
| 01 (bloom) | Pink sky, blue hills, a field of hearts | Love arriving — the first break from cream and cocoa |
| 02 | Pink sky over a blue map, rose pins, hearts drifting | The romance runs through the middle of the story rather than waiting for the birthday |
| 06 | Plum darkroom, magenta accent | The next sign something is shifting |
| 08 | Near-black, one candle | The lights go out. Lowest point on purpose |
| 09 | Gold, magenta, violet, confetti, fireworks | Everything spent at once |
| 10 | Pure black, one video, no decoration | The contrast *is* the design here |
| 11 | Back to cream | Home, quieter than it started |

The finale tokens (`--color-gold`, `--color-magenta`, `--color-violet`,
`--color-champagne`, `--color-flame`) exist only from chapter 08 onward.
Using them earlier spends the surprise before it arrives — that's the one
rule in this project worth being strict about.

From The Wish onward all chrome hides itself: no reset button, no hunt
counter, nothing competing with the candle, the celebration or the video.

## Materials

`globals.css` carries the physical ingredients the chapters share:
`.mat-paper` (a card you could pick up), `.mat-paper-dim` (the same card
turned away from the light, for stacks), `.mat-desk` (a dark lit desk),
`.mat-shell` / `.mat-recess` (moulded plastic and a recess cut into it),
and `.mat-spotlight` (one warm lamp over a scene). Reuse these rather
than inventing new shadows per chapter — it's what keeps six very
different rooms feeling like one house.

## The heart pile

If she stops at the end of chapter 01 instead of tapping straight on, the
hearts lifting out of the field stop leaving. They fly up to the top of the
sky and stay there, stacking in offset rows, and the pile grows downward
for as long as she stands there. When it reaches the sun, the sun flares
and the whole lot is blown sideways off the screen — then it quietly starts
over. A full cycle is about 35 seconds.

`HeartPile.tsx`. Tune it with `columns`, `every` (ms between hearts) and
`sunTop` (how far down the sun sits, which sets the ceiling).

One implementation note worth keeping: the spawn timer runs off
`requestAnimationFrame`, **not** `setInterval`. Browsers throttle timers to
roughly one tick a minute in a tab that isn't in front, which left the sky
nearly empty. The frame loop pauses when the page isn't being drawn and
resumes exactly where it left off, which is the behaviour you actually
want here.

## The secret hunt — what actually happens

Five `<Secret />` components hidden in five places: the chocolate door
(pressed into a moulded square, low on the left of the bar), the map (up in
the hills), the game (down on the card table), the letter room (on the desk
under the envelopes) and the darkroom (up in the corner).

The fifth one used to live in the tape drawer, which was the wrong place
for it — the drawer is chrome you open to do a job, not a room you look
around, and it went unfound. It moved onto the very first screen, where
she is already standing still working out what to type.

1. They gate nothing. Every chapter is completable without finding any.
2. A counter appears top-right **only after she finds her first one** —
   before that there is no hint the hunt exists at all.
3. Each one she taps turns gold and stays found; the counter ticks up.
4. On the fifth the counter turns gold and starts pulsing **OPEN**.
5. Tapping it goes through a doorway transition into `/hunt` — chapter 07,
   a room that is unreachable any other way. It names all five hiding
   places back to her, then gives her the reward text, then returns her to
   where she was.

`secrets.ts` holds the list and the reward. The reward is written but it's
the one bit of finale copy most worth making specific to her.

Both the counter and `/hunt` count **against `secretDefs`**, not against
whatever `hunt:` ids happen to be in saved progress — otherwise an id left
behind by a retired chapter inflates the total and opens the room early.

To hide another one, drop `<Secret id="..." kind="star" style={{...}} />`
into any scene and add it to `secretDefs`.

## The cassette drawer

There is no soundtrack chapter. A room about songs only had music in it
while she was standing in that room, and the songs were never part of the
story anyway — so the music moved into the furniture instead.

`MusicDrawer.tsx` is mounted in the **root layout**, which is the whole
trick: the `<audio>` element never unmounts, so whatever she puts on keeps
playing as she moves from the door to the map to the cake. Client-side
navigation doesn't remount the layout; only a hard reload stops it.

- Closed, it's a tape peeking in from the right edge. It nudges three
  times per chapter and then settles — a tap target that never stops
  moving is irritating to hit on a phone.
- Open, it's a bottom sheet with a deck and a rack of cassettes.
- Picking one flies it out of the rack into the deck. That flight is a
  shared `layoutId` on the cassette in both places, so Motion tweens
  between the two positions itself and there are no coordinates to
  measure.
- Tapping the loaded tape ejects it. The reels turn on the peeking edge
  while something is playing, so she can tell at a glance.
- **It never autoplays** and it sits at 45% volume so it never fights the
  writing (`tapeCopy.volume`).
- It hides itself and pauses on `/video`. Nothing competes with the video.

Add tapes in `src/data/tapes.ts` — see the notes at the top of that file.
A tape whose file is missing is dimmed and labelled rather than crashing,
so you can list what you intend to add and fill it in later. Filenames are
case-sensitive once deployed: `Khat.mp3` and `khat.mp3` are the same file
on your Mac and different files on Vercel.

`/soundtrack` still exists as a redirect to `/memories`, so an open tab
doesn't hit a dead end. The retired chapter is in `_to_delete/`.

## Reaching the end

Once all five places on the map are open, a button appears — *Something
just opened* — and the camera moves through to `/end`, which lists all
twelve chapters and marks the three that exist. Flip `built: true` in
`src/data/chapters.ts` as each new chapter ships; when chapter 03 is real,
point that button at `/game` instead and `/end` can go away.

## Next up (storyboard §11)

7. Progress/unlock system — done, ready to extend
8. `/game` + `/letters`
9. `/soundtrack` + `/memories`
10. `/wish` → `/final` (cake → birthday → video)
