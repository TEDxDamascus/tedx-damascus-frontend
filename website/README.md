
```
website
├─ .playwright-mcp
│  ├─ console-2026-05-25T10-44-11-929Z.log
│  └─ page-2026-05-25T10-44-20-422Z.yml
├─ app
│  ├─ about
│  │  └─ page.tsx
│  ├─ answers
│  │  └─ page.tsx
│  ├─ apple-icon.jpg
│  ├─ attendee
│  │  └─ page.tsx
│  ├─ blog
│  │  └─ page.tsx
│  ├─ coming-soon
│  │  └─ page.tsx
│  ├─ contact
│  │  └─ page.tsx
│  ├─ events
│  │  └─ page.tsx
│  ├─ forms
│  │  └─ page.tsx
│  ├─ home
│  │  └─ page.tsx
│  ├─ icon.jpg
│  ├─ not-found.tsx
│  ├─ page.tsx
│  ├─ speaker
│  │  └─ page.tsx
│  ├─ speakers
│  │  └─ page.tsx
│  ├─ volunteer
│  │  └─ page.tsx
│  └─ [locale]
│     ├─ answers
│     │  └─ page.tsx
│     ├─ attendee
│     │  └─ page.tsx
│     ├─ blog
│     │  └─ page.tsx
│     ├─ coming-soon
│     │  ├─ ComingSoonClient.tsx
│     │  └─ page.tsx
│     ├─ error.tsx
│     ├─ events
│     │  └─ page.tsx
│     ├─ forms
│     │  └─ [slug]
│     │     └─ page.tsx
│     ├─ home
│     │  └─ page.tsx
│     ├─ layout.tsx
│     ├─ loading.tsx
│     ├─ not-found.tsx
│     ├─ page.tsx
│     ├─ speaker
│     │  └─ page.tsx
│     ├─ speakers
│     │  └─ page.tsx
│     └─ volunteer
│        └─ page.tsx
├─ components
│  ├─ answers
│  │  ├─ AnswersHero.tsx
│  │  ├─ AnswersPageClient.tsx
│  │  ├─ AnswersPaginationList.tsx
│  │  ├─ index.ts
│  │  └─ QuestionHistory.tsx
│  ├─ events
│  │  ├─ CallForVoicesSection.tsx
│  │  ├─ EventCard.tsx
│  │  ├─ EventsPageClient.tsx
│  │  └─ index.ts
│  ├─ forms
│  │  ├─ AttendeeForm.tsx
│  │  ├─ DynamicFormRenderer.tsx
│  │  ├─ form-role-map.ts
│  │  ├─ FormErrorPopup.tsx
│  │  ├─ FormHero.tsx
│  │  ├─ GenericApiForm.tsx
│  │  ├─ LeaveGuardDialog.tsx
│  │  ├─ SpeakerForm.tsx
│  │  ├─ StepIndicator.tsx
│  │  ├─ VolunteerForm.tsx
│  │  └─ _form-engine.tsx
│  ├─ home
│  │  ├─ about-tedx
│  │  │  ├─ AboutTEDx.tsx
│  │  │  ├─ index.ts
│  │  │  └─ MotionReveal.tsx
│  │  ├─ add-your-line
│  │  │  ├─ AddYourLine.tsx
│  │  │  └─ index.ts
│  │  ├─ call-for-voices
│  │  │  ├─ BlurText.tsx
│  │  │  ├─ CallForVoices.tsx
│  │  │  └─ index.ts
│  │  ├─ hero
│  │  │  ├─ CircularText.tsx
│  │  │  ├─ HeroSection.tsx
│  │  │  ├─ index.ts
│  │  │  └─ SplitText.tsx
│  │  ├─ latest-events
│  │  │  └─ LatestEvents.tsx
│  │  └─ us-section
│  │     ├─ index.ts
│  │     └─ UsSection.tsx
│  ├─ layout
│  │  ├─ Footer.tsx
│  │  ├─ index.ts
│  │  └─ Navbar.tsx
│  └─ shared
│     ├─ DatePicker.tsx
│     ├─ FileUpload.tsx
│     ├─ index.ts
│     ├─ MultipleChoice.tsx
│     ├─ Select.tsx
│     ├─ StarRating.tsx
│     └─ TextInput.tsx
├─ eslint.config.mjs
├─ i18n.ts
├─ lib
│  ├─ api
│  │  ├─ client.ts
│  │  ├─ forms-schema.ts
│  │  ├─ generic-api-service.ts
│  │  ├─ speakers-service.ts
│  │  └─ wall-cards.ts
│  ├─ components
│  │  └─ coming-soon
│  │     ├─ EmailSubscription.tsx
│  │     ├─ FinalReveal.tsx
│  │     ├─ ImageGrid.tsx
│  │     ├─ index.ts
│  │     ├─ SocialIcons.tsx
│  │     └─ TypewriterText.tsx
│  └─ utils.ts
├─ messages
│  ├─ ar.json
│  └─ en.json
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ favicon.ico
│  └─ images
│     ├─ about
│     │  └─ pattern.svg
│     ├─ add-your-line
│     │  ├─ arrow-left.svg
│     │  ├─ arrow-right.svg
│     │  ├─ Chevron Down.svg
│     │  ├─ Comments.svg
│     │  ├─ double-quotes.svg
│     │  ├─ rectangle.svg
│     │  └─ triangle.svg
│     ├─ call-for-voices
│     │  ├─ arrow-right.png
│     │  ├─ group-left.png
│     │  ├─ group-right.png
│     │  ├─ podcast.svg
│     │  └─ user.svg
│     ├─ events
│     │  ├─ calendar-03.svg
│     │  ├─ calendar.png
│     │  ├─ event-b.png
│     │  └─ event-card.png
│     ├─ footer
│     │  ├─ city-silhouette.png
│     │  ├─ damascus skyline.png
│     │  ├─ Damascus.svg
│     │  ├─ Facebook.svg
│     │  ├─ Instagram.svg
│     │  ├─ Linkedin.svg
│     │  ├─ Rectangle (1).png
│     │  ├─ skyline-preview.png
│     │  ├─ Vector 1.png
│     │  ├─ Vector 2.png
│     │  ├─ Vector 25.png
│     │  ├─ Vector 26.png
│     │  ├─ Vector 27.png
│     │  ├─ Vector 28.png
│     │  ├─ Vector 29.png
│     │  ├─ Vector 3.png
│     │  ├─ Vector 30.png
│     │  ├─ Vector 31.png
│     │  ├─ Vector 32.png
│     │  ├─ Vector 4.png
│     │  ├─ Vector 5.png
│     │  └─ Vector 6.png
│     ├─ forms
│     │  ├─ cloud-upload.png
│     │  ├─ deco-line-2.png
│     │  ├─ deco-line.png
│     │  ├─ group-icon.png
│     │  ├─ hero-attendee.png
│     │  ├─ hero-speaker.jpg
│     │  └─ hero-volunteer.png
│     ├─ gallery
│     │  ├─ IMG_20260126_221432_639-01.jpeg
│     │  ├─ IMG_20260126_221435_535-01.jpeg
│     │  ├─ IMG_20260126_221439_032-01.jpeg
│     │  ├─ IMG_20260126_221441_542-01.jpeg
│     │  ├─ IMG_20260126_221444_934-01.jpeg
│     │  ├─ IMG_20260126_221448_784-01.jpeg
│     │  ├─ IMG_20260126_221451_894-01.jpeg
│     │  ├─ IMG_20260126_221529_118-01.jpeg
│     │  ├─ IMG_20260126_221543_169-01.jpeg
│     │  ├─ IMG_20260126_221545_201-01.jpeg
│     │  ├─ Screenshot_20260126-221502_Gallery-01.jpeg
│     │  └─ Screenshot_20260126-221513_Gallery-01.jpeg
│     ├─ hero
│     │  ├─ indicator.png
│     │  ├─ pattern-mobile.png
│     │  ├─ pattern.svg
│     │  ├─ slides
│     │  │  ├─ img1.png
│     │  │  ├─ img2.png
│     │  │  ├─ img3.png
│     │  │  ├─ img4.png
│     │  │  └─ img5.png
│     │  └─ tedx-hero.png
│     ├─ icons
│     │  ├─ file-icon.png
│     │  ├─ flag-ar.png
│     │  ├─ ted-mobile-logo.png
│     │  ├─ tedx-logo.png
│     │  └─ upload-icon.png
│     └─ teams-partners
│        ├─ Group.png
│        ├─ organizers-card.png
│        ├─ organizers-color.jpg
│        ├─ partners-card.png
│        ├─ partners-color.jpg
│        ├─ speakers-card.png
│        ├─ speakers-color.jpg
│        ├─ team-card.png
│        ├─ team-color.jpg
│        └─ Vector (3).png
├─ README.md
├─ routing.ts
├─ styles
│  └─ globals.css
├─ tailwind.config.ts
├─ tsconfig.json
├─ types
│  ├─ form-schema.ts
│  └─ index.ts
└─ vercel.json

```