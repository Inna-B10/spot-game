# 🕹️ Spot game

Simple games for kids - _find pair_, _find differences_, _find all_, _find the odd one out_

### 🧩 Tech Stack

- **Next.js 15** (App Router)
- **Prisma** + **PostgreSQL** (data layer)
- **Vercel Blob** (image storage)
- **UUID**, **clsx** (utilities)

```bash
npm i uuid
npm i clsx
npm i @prisma/client
npm i @vercel/blob
```

### ⚙️ Current Features

- Full transition from JSON seed system → Prisma DB with export/import workflow
- Image areas support (circle or rectangular)
- Stage editor with “save” button active only when changes are detected
- Game pages use ISR and optimized image loading

---

### 🚧 TODO:

#### Functional:

- [ ] Add `difficulty` and `stage_task` inputs when creating a new stage
- [ ] Add `groupId` in areas for par(s)/groups
- [ ] In Editor: ability to
  - [ ] edit `stage_task`
  - [ ] add a new game(category)
  - [ ] add/edit game description
  - [ ] Optional: delete game/stage
  - [ ] Optional: change image
- [ ] Drag & drop image upload
- [ ] Authorization (via Clerk)
- [ ] Admin access & protection for Editor
- [ ] Editor menu
- [ ] Optional: save user progress

#### Design/UI:

- [ ] Replace alerts with toast messages
- [ ] Toast when stage is completed (with “Next” and “Menu” buttons)
- [ ] Improve Editor and game menus
- [ ] Design

#### Miscellaneous

- [ ] Multi-language support
- [ ] Move `revalidate` to global config constant
- [ ] Add Readme notes on:
  - [ ] Base image naming convention (`image`)
  - [ ] Image resizing before upload

<details>
<summary>DONE:</summary>

- [x] Switch from .json to DB (~~? mongoDB~~ PostreSQL+Vercel Blob)
- [x] Add export/import scripts for Prisma data backups
- [x] Implement circle and rectangular click areas
- [x] Save button activates only when unsaved changes exist

</details>
