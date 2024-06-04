# AltSchool Second Semester Exam -----> Blogging API

---

## Requirements

1. Users should have a first_name, last_name, email, password, (you can add other attributes you want to store about the user).
2. A user should be able to sign up and sign in into the blog app
3. Use JWT as authentication strategy and expire the token after 1 hour.
4. A blog can be in two states; draft and published.
5. Logged in and not logged in users should be able to get a list of published blogs created.
6. Logged in and not logged in users should be able to to get a published blog.
7. Logged in users should be able to create a blog.
8. When a blog is created, it is in draft state.
9. The owner of the blog should be able to update the state of the blog to published.
10. The owner of a blog should be able to edit the blog in draft or published state.
11. he owner of the blog should be able to delete the blog in draft or published state.
12. The owner of the blog should be able to get a list of their blogs.
    a. The endpoint should be paginated
    b. It should be filterable by state
13. Blogs created should have title, description, tags, author, timestamp, state, read_count, reading_time and body.
14. The list of blogs endpoint that can be accessed by both logged in and not logged in users should be paginated,
    a. default it to 20 blogs per page.
    b. It should also be searchable by author, title and tags.
    c. It should also be orderable by read_count, reading_time and timestamp.
15. When a single blog is requested, the api should return the user information(the author) with the blog. The read_count of the blog too should be updated by 1.
16. Come up with any algorithm for calculating the reading_time of the blog.
17. Write tests for all endpoints.
18.
19.

## Models

---

### User

| field     | data-type | constraints      |
| --------- | --------- | ---------------- |
| firstName | String    | required         |
| lastName  | String    | required         |
| email     | String    | required, unique |
| password  | String    | required         |

### Blog

| field       | data-type | constraints                                           |
| ----------- | --------- | ----------------------------------------------------- |
| title       | String    | required, unique                                      |
| description | String    | required                                              |
| body        | String    | required , unique                                     |
| author      | String    | required                                              |
| tags        | Array     | required                                              |
| state       | String    | required,default:"draft",enum: ["draft", "published"] |
| readingTime | Number    | default: NaN                                          |
| read_count  | Number    | default: 0                                            |
| timeStamp   | Date      | dafault: Date.now                                     |

### Sign-up

- route: /signup
- method: /POST

- use form-encode for body signup

```
|      key          |      vaule           |
| ----------------- |  ------------------- |
|     username      |    gloryedem         |
|     firstname     |    Glory             |
|     lastname      |    Edem              |
|     fullname      | Glory Okposin Edem   |
|     email         | glory@gmail.com      |
|     password      |    asdfghqw1         |
```

### Login User

- route: /login
- Method: POST
  -- use form-encode format for the body login
- Body:

````

|    key    |  data_type  |
|-------    | ----------- |
|  username |  gloryedem  |
|  password |  asdfghqw1  |

```

### Create Blog

- route: /authorblog
- method:   POST
- Headers: add "Authorization(query parameter)" : secret_token = {token}
- Blog author is updated based on the full name of the logged in use.
- Body : ......

````

{
"title": "Women without Empathy",
"description": "A society where some women doesn't want to see others thrive.",
"tags": ["Glory", "Women", "Society", "Edem"],
"body": "Our society, woven with threads of progress and empowerment, there exists a troubling seam. It is a narrative of contradiction, where the aspirations of some women are hindered by the reluctance of others to witness their triumphs. This societal dynamic, often veiled in whispers and subtle gestures, speaks volumes about the complexities of human nature and the challenges of true solidarity.In this narrative, the shadows of envy and insecurity loom large, casting a pall over the collective journey towards equality and empowerment. For some women, the success of their peers becomes a bitter pill to swallow, a reflection of their own unmet aspirations or perceived inadequacies. In their reluctance to celebrate the achievements of others, they unwittingly perpetuate a cycle of competition and division, sowing seeds of discord where unity should flourish."
}

### Get All Author Blog

- route: /authorblog
- method: GET
- Headers: Authorization (Query Parameters): secret_token = {token}

### Get Specific Blog by author

- route: /authorblog/:id
- method: GET
- Header: Authorization (Query Parameters): secret_token = {token}

### Update specific blog by author

- route: /authorblog/ :id
- method: PATCH
- Header: Authorization (Query Parameters): secret_token = {token}
- Body:{
  "state": "Published"
  }
