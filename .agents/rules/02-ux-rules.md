# StudyMate: ease-of-use rules

The test: a first-time student goes from Ask to Plan without help and never wonders "what do I do now?"

1. One job per screen and one primary button. The primary button is always the next step and always in view (sticky bar on mobile). One line under it says what happens next.
2. Journey bar on Learn, Practice, Results and Plan (Learn > Practice > Results > Plan). Current step marked, earlier steps clickable.
3. Plain words. Show these labels, never the raw data names:
| Data value | Show as |
|---|---|
| strong / developing / weak | Solid / Getting there / Needs practice |
| recall / understanding / application | Remembering facts / Understanding why / Using it on new problems |
| mastery percent | "How well you know it" |
| concept | idea |
| plan | "Your 10-minute plan" |
4. Every state talks. Loading says what is being built. Errors say what happened and what to do next. Empty screens say what to do. No spinner-only states.
5. Show less at once: one visual per screen, one question at a time, lists of 7 or fewer.
6. Visualizer: one plain sentence for every step. Buttons use words (Back, Play, Next, Reset), never icon-only. Keys: left and right arrows step, space plays. Code line and picture always move together. Step text is announced with aria-live="polite".
7. Never lose work. Back keeps state. Refresh keeps the session.
8. Same word, same thing: "Practice" (never quiz or test), "plan" (never mission or revision), "Check answer".
9. Time to value: example chips return instantly from saved samples (labelled "Sample lesson"). Typed questions show a skeleton and progress text within 100 ms.
10. Mobile is first class: single column, cells shrink before they scroll, tap targets 44px.
11. Accessibility: full keyboard path, visible focus, never color alone, reduced motion respected.
12. Prediction and hints are optional. Nothing blocks the main path.
