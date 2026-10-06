# StudyMate: design system

Direction: a notebook with a graph-paper lab bench. Paper pages, ballpoint-blue ink, and a highlighter that means "look here". The visualizer sits on a faint graph-paper stage like an engineer's pad.

## Tokens (client/src/styles/tokens.css, Tailwind v4 @theme)
```css
@theme {
  --color-paper: #F4F2EC;         /* page background */
  --color-surface: #FBFAF6;       /* panels, inputs, code panel */
  --color-ink: #1B1F2A;           /* primary text */
  --color-ink-2: #586070;         /* secondary text */
  --color-line: #DAD6CA;          /* borders, dividers, graph-paper lines */
  --color-pen: #2A44A6;           /* actions, links, focus, pointers */
  --color-pen-hover: #213787;
  --color-highlight: #FFE27A;     /* the marker: "look here" */
  --color-strong: #1F6B4A;
  --color-strong-tint: #DDEBE2;
  --color-developing: #8F5B00;
  --color-developing-tint: #F3E4C2;
  --color-weak: #AE2F1C;
  --color-weak-tint: #F2D9D3;

  --font-serif: "Literata", Georgia, serif;
  --font-sans: "Instrument Sans", system-ui, sans-serif;
  --font-code: ui-monospace, "SF Mono", Menlo, Consolas, monospace;

  --radius-control: 6px;
  --radius-panel: 8px;
}
```

Color means something: pen = interactive or a pointer. Highlighter = the one thing to look at right now (the current middle cell, the current code line, the weakest idea, the plan's focus). Band colors = mastery only. A band is never shown by color alone: always text plus an icon shape. Text contrast at least 4.5:1, including on tints. At most one highlighter mark per region of the screen.

## Type
- Serif (Literata): headings and all study material.
- Sans (Instrument Sans): UI, labels, numbers (tabular numerals).
- Code font: only inside code panels and array cells.
- Scale, size/line-height: page title 32/40 serif 600, section 22/30 serif 600, reading body 18/30 serif, max 68ch, UI body 15/22 sans, label 14/20 sans 500, caption 13/18 sans.
- Sentence case everywhere.

## Layout
- Top bar: wordmark on the left, two links on the right: "Ask" and "My progress". No side rail.
- Content column max 720px. The Learn page has a wide area (max 1040px) for the stage and code panel side by side at 900px and up, stacked below that.
- Journey bar below the top bar on Learn, Practice, Results and Plan.
- Spacing scale: 4, 8, 12, 16, 24, 40, 64. Panel padding 24. Section gap 40.
- Panels: 1px line border, surface fill, 8px radius, no shadow. Controls: 6px radius, 44px minimum height.
- Separate sections with lines and space, not nested cards. No grids of identical cards.
- Mobile: single column, sticky bottom bar for the primary action.
- Focus ring: 2px pen outline, 2px offset.

## Components (client/src/components/ui/)
Button (primary pen fill, secondary line, quiet text), Field, Panel, Stage (graph-paper panel: background grid from --color-line, 24px squares, 1px lines), Bar, BandBadge (icon + text), OptionRow, SegmentedControl, Tag (outlined label), Disclosure, Notice, Skeleton, PageHeader, JourneyBar, Highlight.
Highlight = marker effect: linear-gradient(transparent 55%, var(--color-highlight) 55%).

## Visualizer look (client/src/components/visual/)
- Array cells: 52px squares (40px under 480px), 1px ink border, code font, index number below in ink-2.
- Pointers are labelled with words under the cells: "low", "mid", "high". If two share a cell, stack the labels.
- Current middle cell: highlighter fill. Ruled-out cells: 35% opacity with a line through the value. Found cell: strong tint with a check icon and the text "Found at index N".
- Pointer and swap moves animate with a 300ms transform transition.
- Code panel: surface fill, line numbers, active line = highlighter band + 3px pen bar at the left.
- Circuit: single-stroke SVG in ink on the stage, resistors as zigzags with labels, an arrow for current, the active component outlined in pen.

## Motion
Meaningful motion only: pointer and swap transitions in the visualizer, 120ms color change on answer feedback, mastery bars grow once on Results (400ms). prefers-reduced-motion turns off the transitions and bar growth.

## Copy
- Plain verbs, active voice. Buttons say what happens: "Explain it", "Practice this topic", "Check answer", "Next question", "See results", "Start your 10-minute plan", "Retake practice".
- Loading text names the work: "Building your binary search walkthrough".
- Errors say what happened and what to do. No apologies, no exclamation marks.
- Never: "AI-powered", sparkle icons, "supercharge", emoji as icons.

## Never
Gradients, glass or blur, drop shadows, colored icon tiles, ALL CAPS labels, tracked eyebrow labels, middle-dot meta strings, arrows appended to buttons, one accented word inside a headline, rows of identical stat cards, donut or radar charts, streak or flame gamification, indigo or purple accents. Charts: horizontal bars only. One hue plus the band colors.

## Wireframe: Learn
Learn > Practice > Results > Plan (journey bar)
Binary search (serif 32)
Subject Computer science   Topic Binary search   Method Step-by-step with code (three Tags)
Binary search finds a value in a sorted list by throwing away half of it each step.

+------------------------------------+  +-------------------------+
| graph-paper stage                  |  | C++                     |
| [2][5][8][12][16][23][31]          |  | int low = 0;            |
|       mid                          |  | int high = ...          |
| Check the middle: 12. 23 is bigger.|  | ...                     |
| [Back] [Play] [Next] [Reset]       |  | Time O(log n) Space O(1)|
+------------------------------------+  +-------------------------+

How it works (numbered steps)
Common mistakes (short list)
Quick check (one question, instant feedback)
[Practice this topic] 6 questions, about 5 minutes
