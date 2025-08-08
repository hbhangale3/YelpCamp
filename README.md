# YelpCamp

YelpCamp is a full-stack web application that allows users to discover, create, review, and manage campgrounds. It features secure user authentication, dynamic image uploads with Cloudinary, and interactive maps with MapTiler. Deployed on Heroku with a MongoDB Atlas backend.

---

## Live Demo

[https://yelpofcamp-7a9b83777101.herokuapp.com](https://yelpofcamp-7a9b83777101.herokuapp.com)

---

## Screenshots

### Register / Login / Logout

#### Register
![Register Screenshot](<img width="798" height="378" alt="image" src="https://github.com/user-attachments/assets/1e5bd802-5745-4a52-bc9c-da887f8781b4" />

)
**Step 2: Successful Registration**
![Register Success](<img width="798" height="378" alt="image" src="https://github.com/user-attachments/assets/5b420a6a-fada-437f-a115-f050a4967df6" />
)

#### Login

**Step 1: Login Form**
![Login Form](<img width="1438" height="749" alt="image" src="https://github.com/user-attachments/assets/1e8f334a-4fb5-4730-84b7-11eeda87fc5b" />
)

**Step 2: Login Failure Example**
![Login Error](<img width="798" height="378" alt="image" src="https://github.com/user-attachments/assets/2878ce95-40a1-45ea-9fa7-df9ef40283d7" />
)

**Step 3: Successful Login**
![Login Success](<img width="798" height="378" alt="image" src="https://github.com/user-attachments/assets/479c9586-ceb2-4a84-9f26-ffd8193121bd" />
)

#### Logout
![Logout Screenshot](<img width="798" height="378" alt="image" src="https://github.com/user-attachments/assets/2aa0f251-9a69-405c-b272-e33c68300627" />
)

---

## Features

### 1. User Authentication

- Register, login, and logout securely using **Passport.js** (LocalStrategy).
- Session management is handled using `express-session`, with session data stored in **MongoDB** via `connect-mongo` — ensuring persistent and scalable session storage across server restarts and deployments.
  
---

### 2. Campground CRUD (Create, Read, Update, Delete)

- Logged-in users can:
  - **Create** a new campground (title, location, price, images, description)
  - **View** all campgrounds
  - **Edit or Delete** only their own campgrounds

#### Create Campground
![Create Campground Screenshot](<img width="798" height="378" alt="image" src="https://github.com/user-attachments/assets/d204add8-90c1-4410-b3c2-33654c4fbaff" />
)

#### Campground Detail
![Campground Detail Screenshot](<img width="798" height="378" alt="image" src="https://github.com/user-attachments/assets/54c6f79d-6200-4347-8772-19cce4c6a3de" />
)

---

### 3. Review System

- Users can:
  - **Add reviews** with comments and ratings
  - **Delete only their own reviews**

#### Add Review
![Add Review Screenshot](<img width="798" height="378" alt="image" src="https://github.com/user-attachments/assets/73dfcf7e-9da3-4929-95a3-e94c3c1eab11" />
)

#### Delete Review
Only review owners can delete:
![Delete Review Screenshot](<img width="798" height="378" alt="image" src="https://github.com/user-attachments/assets/987dd486-d3e7-4bae-8bc1-e4d59eb18038" />
)

---

### 4. Update Campground Information & Images

- Owners can:
  - **Edit campground details**
  - **Upload new images** (via Multer + Cloudinary)
  - **Delete old images** (from both Cloudinary and DB)

#### Edit Form to Add New Images, Delete Existing Images and update campground information
![Edit Campground Screenshot](<img width="798" height="378" alt="image" src="https://github.com/user-attachments/assets/eeb7c0af-b535-4499-b5ab-3472f90777af" />
)

---

### Access Control

| Action                      | Requires Login | Must Be Owner |
|-----------------------------|----------------|---------------|
| Create campground           | ✅              | ❌            |
| Edit/Delete campground      | ✅              | ✅            |
| Add review                  | ✅              | ❌            |
| Delete review               | ✅              | ✅            |
| Upload/Delete images        | ✅              | ✅            |

Middleware like `isLoggedIn`, `isAuthor`, and `isReviewAuthor` enforce these rules.

---

## Tech Stack

| Tool/Service     | Purpose                                |
|------------------|----------------------------------------|
| Node.js          | Backend runtime                        |
| Express.js       | Web framework                          |
| MongoDB Atlas    | NoSQL cloud database                   |
| Mongoose         | ODM for MongoDB                        |
| EJS              | Templating engine                      |
| Bootstrap        | Frontend styling                       |
| Cloudinary       | Image storage and deletion             |
| Multer           | File upload middleware                 |
| MapTiler         | Interactive campground maps            |
| Passport.js      | Authentication                         |
| dotenv           | Environment variable management        |
| Heroku           | Deployment                             |

---

## Hosting and Integrations

- **Heroku** hosts the backend and serves the frontend.
- **MongoDB Atlas** stores user data, reviews, and campground info.
- **Cloudinary** handles all campground image uploads and deletions.
- **MapTiler** renders maps based on campground location.

---

## Environment Variables

Set in a `.env` file (not committed to version control):

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_secret
MAPTILER_KEY=your_maptiler_api_key
DB_URL=your_mongo_atlas_uri
SECRET=your_session_secret
