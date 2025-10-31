# 🕹️ Spot game

Simple games for kids - _find pair_, _find differences_, _find all_, _find the odd one out_

### 🧩 Tech Stack

- **Next.js 15** (App Router)
- **Prisma** + **PostgreSQL** (data layer)
- **Vercel Blob** (image storage)

```bash
npm i uuid
npm i clsx
npm i @prisma/client
npm i @vercel/blob
npm i axios
npm i @tanstack/react-query
npm install @radix-ui/react-alert-dialog #confirm dialog
npm install sonner next-themes #toast
npm install @radix-ui/react-slot
npm i lucide-react
```

### ⚙️ Current Features

- Full transition from JSON seed system → Prisma DB with export/import workflow
- Image areas support (circle or rectangular)
- Stage editor with “save” button active only when changes are detected
- Game pages use ISR and optimized image loading

---

### 🚧 TODO:

#### Functional:

- [ ] Add `groupId` in areas for par(s)/groups
- [ ] In Editor: ability to
  - [ ] Optional: check unique name when preview new game properties
  - [ ] Optional: change image
  - [ ] Add button Next when edit stage
  - [ ] Drag & drop image upload
- [ ] Authorization (via Clerk)
- [ ] Admin access & protection for Editor
- [ ] Editor menu
- [ ] Optional: save user progress

#### Design/UI:

- [ ] Toast when stage is completed (with “Next” and “Menu” buttons)
- [ ] Improve Editor and game menus
- [ ] Design
- [ ] Change icons (Lucide)
- [ ] Optional: Tooltip, Skeleton, Dialog

#### Miscellaneous

- [ ] Multi-language support
- [ ] Add Readme notes on:
  - [ ] Base image naming convention (`image`)
  - [ ] Image resizing before upload

<details>
<summary>DONE:</summary>

- [x] Switch from .json to DB (~~? mongoDB~~ PostreSQL+Vercel Blob)
- [x] Add export/import scripts for Prisma data backups
- [x] Implement circle and rectangular click areas
- [x] Save button activates only when unsaved changes exist
- [x] add game description
- [x] edit game description
- [x] add a new game(category)
- [x] switch from State to Tanstack Query
- [x] Organize the routes
- [x] Add `difficulty` and `stage_task` inputs when creating a new stage
- [x] add task description
- [x] edit task description
- [x] edit difficulty
- [x] delete stage
- [x] Replace alerts with toast messages
  - [x] delete game

</details>
