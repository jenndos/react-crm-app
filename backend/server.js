import express from "express";
import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cors from "cors";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./database.db");

function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      surname TEXT,
      email TEXT UNIQUE,
      password TEXT
    )`);

    // Tasks table
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT,
      description TEXT,
      status TEXT,
      creator TEXT,
      curator TEXT,
      executor TEXT,
      participants TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      deadline DATETIME,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // Init some tasks
    db.get("SELECT COUNT(*) as count FROM tasks", (err, row) => {
      if (err) return;

      if (row.count === 0) {
        const sampleTasks = [
          {
            user_id: 1,
            title: "Первая таска",
            description: "Разработать логотип для компании",
            status: "Черновик",
            creator: "Jonas",
            curator: "Васькин Д.И.",
            executor: "Вова М.А.",
            participants: JSON.stringify(["Паша М.Т.", "Рома Н.К."]),
            deadline: "2025-10-05 14:30:00",
          },
          {
            user_id: 1,
            title: "Вторая Таска",
            description: "Разработать логотип для компании",
            status: "Тестирование",
            creator: "Galabonas",
            curator: "Васькин Д.И.",
            executor: "Вова М.А.",
            participants: JSON.stringify([
              "Паша М.Т.",
              "Рома Н.К.",
              "Иван С.П.",
            ]),
            deadline: "2025-11-05 12:30:00",
          },
          {
            user_id: 1,
            title: "Сделать сайдбар",
            description: "Сайдбар сделать",
            status: "В процессе",
            creator: "Toma",
            curator: "Васькин Д.И.",
            executor: "Вова М.А.",
            participants: JSON.stringify(["Паша М.Т."]),
            deadline: "2025-04-05 11:30:00",
          },
        ];

        const stmt = db.prepare(
          "INSERT INTO tasks (user_id, title, description, status, creator, curator, executor, participants, deadline) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );

        sampleTasks.forEach((task) => {
          stmt.run(
            task.user_id,
            task.title,
            task.description,
            task.status,
            task.creator,
            task.curator,
            task.executor,
            task.participants,
            task.deadline
          );
        });

        stmt.finalize();
        console.log("Sample tasks added successfully");
      }
    });

    // Projects table
    db.run(`CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT,
      description TEXT,
      status TEXT,
      curator TEXT,
      executor TEXT,
      creator TEXT,
      guest TEXT,
      deadline DATETIME,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // Init some projects
    db.get("SELECT COUNT(*) as count FROM projects", (err, row) => {
      if (err) return;

      if (row.count === 0) {
        // Add sample projects for user 1
        const sampleProjects = [
          {
            user_id: 1,
            name: "Разработать логотип",
            description: "Разработать логотип для компании",
            status: "Разработка",
            curator: "Васькин Д.И.",
            executor: "Вова М.А.",
            creator: "Паша М.Т.",
            guest: "Рома Н.К.",
            deadline: "2025-10-05 14:30:00",
          },
          {
            user_id: 1,
            name: "Разработать логотип",
            description: "Разработать логотип для компании",
            status: "Идея",
            curator: "Васькин Д.И.",
            executor: "Вова М.А.",
            creator: "Паша М.Т.",
            guest: "Рома Н.К.",
            deadline: "2025-11-05 12:30:00",
          },
          {
            user_id: 1,
            name: "Сделать сайдбар",
            description: "Сайдбар сделать",
            status: "Готово",
            curator: "Васькин Д.И.",
            executor: "Вова М.А.",
            creator: "Паша М.Т.",
            guest: "Рома Н.К.",
            deadline: "2025-04-05 11:30:00",
          },
        ];

        const stmt = db.prepare(
          "INSERT INTO projects (user_id, name, description, status, curator, executor, creator, guest, deadline) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );

        sampleProjects.forEach((project) => {
          stmt.run(
            project.user_id,
            project.name,
            project.description,
            project.status,
            project.curator,
            project.executor,
            project.creator,
            project.guest,
            project.deadline
          );
        });

        stmt.finalize();
      }
    });

    // Participants table
    db.run(`CREATE TABLE IF NOT EXISTS participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT,
      surname TEXT,
      position TEXT,
      email TEXT,
      phone TEXT,
      city TEXT,
      birth_date DATETIME
    )`);

    // Init some participants
    db.get("SELECT COUNT(*) as count FROM participants", (err, row) => {
      if (err) return;

      if (row.count === 0) {
        // Add sample projects for user 1
        const sampleParticipants = [
          {
            user_id: 1,
            name: "Иван",
            surname: "Петрович",
            position: "QA Engeneer",
            email: "ivan@mail.com",
            phone: "+73453463421",
            city: "Санкт-Петербург",
            birth_date: "2025-10-05 14:30:00",
          },
          {
            user_id: 1,
            name: "Михаил",
            surname: "Иванович",
            position: "Backend-developer",
            email: "miha@mail.com",
            phone: "+73423463421",
            city: "Москва",
            birth_date: "2025-11-05 11:30:00",
          },
          {
            user_id: 1,
            name: "Глеб",
            surname: "Никитин",
            position: "Аналитик",
            email: "ivan@mail.com",
            phone: "+73453463321",
            city: "Новосибирск",
            birth_date: "2025-09-11 15:30:00",
          },
        ];

        const stmt = db.prepare(
          "INSERT INTO participants (user_id, name, surname, position, email, phone, city, birth_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );

        sampleParticipants.forEach((participant) => {
          stmt.run(
            participant.user_id,
            participant.name,
            participant.surname,
            participant.position,
            participant.email,
            participant.phone,
            participant.city,
            participant.birth_date
          );
        });

        stmt.finalize();
      }
    });

    // Create mock participants table
    db.run(`CREATE TABLE IF NOT EXISTS mockParticipants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT,
      surname TEXT,
      position TEXT,
      email TEXT,
      phone TEXT,
      city TEXT,
      birth_date DATETIME
    )`);

    // Init some mock participants
    db.get("SELECT COUNT(*) as count FROM mockParticipants", (err, row) => {
      if (err) return;

      if (row.count === 0) {
        const sampleParticipants = [
          {
            user_id: 1,
            name: "Абоба",
            surname: "Квиндич",
            position: "Flyer",
            email: "aboba@mail.com",
            phone: "+76666666666",
            city: "Казань",
            birth_date: "2025-10-05 14:30:00",
          },
          {
            user_id: 1,
            name: "Джонас",
            surname: "Люкс",
            position: "Grounder",
            email: "jonas@mail.com",
            phone: "+76666666666",
            city: "Казань",
            birth_date: "2025-10-05 14:30:00",
          },
        ];

        const stmt = db.prepare(
          "INSERT INTO mockParticipants (user_id, name, surname, position, email, phone, city, birth_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );

        sampleParticipants.forEach((participant) => {
          stmt.run(
            participant.user_id,
            participant.name,
            participant.surname,
            participant.position,
            participant.email,
            participant.phone,
            participant.city,
            participant.birth_date
          );
        });

        stmt.finalize();
      }
    });
  });
}

// Register user
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;

    if (!name || !surname || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Все поля обязательны для заполнения",
      });
    }

    // Check if user exists
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, row) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          success: false,
          error: "Ошибка сервера",
        });
      }

      if (row) {
        return res.status(409).json({
          success: false,
          error: "Пользователь с таким email уже существует",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      db.run(
        "INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)",
        [name, surname, email, hashedPassword],
        function (err) {
          if (err) {
            console.error("Registration error:", err);
            return res.status(500).json({
              success: false,
              error: "Ошибка при создании пользователя",
            });
          }

          res.json({
            success: true,
            userId: this.lastID,
          });
        }
      );
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      success: false,
      error: "Ошибка сервера",
    });
  }
});

// Login by username
app.post("/api/auth/login", async (req, res) => {
  try {
    const { login, password } = req.body;

    console.log(login, password);

    // Validate input
    if (!login || !password) {
      return res.status(400).json({
        success: false,
        error: "Логин и пароль обязательны",
      });
    }

    console.log("Login attempt for:", login);

    db.get(
      "SELECT * FROM users WHERE email = ?",
      [login],
      async (err, user) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({
            success: false,
            error: "Ошибка сервера",
          });
        }

        if (!user) {
          console.log("User not found:", login);
          return res.status(401).json({
            success: false,
            error: "Неверный логин или пароль",
          });
        }

        // Compare hashed password
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
          console.log("Invalid password for:", user);
          return res.status(401).json({
            success: false,
            error: "Неверный логин или пароль",
          });
        }

        // Successful login
        console.log("Successful login for:", login);
        res.json({
          success: true,
          user: {
            id: user.id,
            email: user.email, // Changed from user.login
          },
        });
      }
    );
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      error: "Ошибка сервера",
    });
  }
});

// Get user data
app.get("/api/users/:userId", (req, res) => {
  const userId = req.params.userId;
  db.get(
    "SELECT id, name, surname, email FROM users WHERE id = ?",
    [userId],
    (err, user) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          success: false,
          error: "Server error",
        });
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          surname: user.surname,
          email: user.email,
        },
      });
    }
  );
});

// Get all projects for a user
app.get("/api/projects", (req, res) => {
  const userId = req.query.user_id;

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: "User ID is required",
    });
  }

  db.all(
    "SELECT * FROM projects WHERE user_id = ?",
    [userId],
    (err, projects) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          success: false,
          error: "Server error",
        });
      }

      res.json({
        success: true,
        projects: projects,
      });
    }
  );
});

// Get particular project
app.get("/api/projects/:projectId", (req, res) => {
  const projectId = req.params.projectId;

  db.get("SELECT * FROM projects WHERE id = ?", [projectId], (err, project) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        success: false,
        error: "Server error",
      });
    }

    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      });
    }

    res.json({
      success: true,
      project: project,
    });
  });
});

// Create new project
app.post("/api/projects", (req, res) => {
  const {
    user_id,
    name,
    description,
    status,
    curator,
    executor,
    creator,
    guest,
    deadline,
  } = req.body;

  if (
    !user_id ||
    !name ||
    !description ||
    !status ||
    !curator ||
    !executor ||
    !creator ||
    !deadline
  ) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields",
    });
  }

  db.run(
    "INSERT INTO projects (user_id, name, description, status, curator, executor, creator, guest, deadline) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      user_id,
      name,
      description,
      status,
      curator || "",
      executor || "",
      creator || "",
      guest || "",
      deadline || "",
    ],
    function (err) {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          success: false,
          error: "Failed to create project: " + err.message,
        });
      }

      db.get(
        "SELECT * FROM projects WHERE id = ?",
        [this.lastID],
        (err, newProject) => {
          if (err || !newProject) {
            return res.status(500).json({
              success: false,
              error: "Failed to fetch created project",
            });
          }
          res.json({
            success: true,
            project: newProject,
          });
        }
      );
    }
  );
});

// Update project
app.put("/api/projects/:projectId", (req, res) => {
  const projectId = req.params.projectId;
  const { name, description, status, curator, executor, guest, deadline } =
    req.body;

  db.run(
    "UPDATE projects SET name = ?, description = ?, status = ?, curator = ?, executor = ?, guest = ?, deadline = ? WHERE id = ?",
    [name, description, status, curator, executor, guest, deadline, projectId],
    function (err) {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          success: false,
          error: "Failed to update project",
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          error: "Project not found",
        });
      }

      // Fetch the updated project
      db.get(
        "SELECT * FROM projects WHERE id = ?",
        [projectId],
        (err, project) => {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).json({
              success: false,
              error: "Failed to fetch updated project",
            });
          }
          res.json({
            success: true,
            project: project,
          });
        }
      );
    }
  );
});

// Delete project
app.delete("/api/projects/:projectId", (req, res) => {
  const projectId = req.params.projectId;

  db.run("DELETE FROM projects WHERE id = ?", [projectId], function (err) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        success: false,
        error: "Failed to delete project",
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      });
    }

    res.json({
      success: true,
    });
  });
});

// Create new task
app.post("/api/tasks", (req, res) => {
  const {
    user_id,
    title,
    description,
    status,
    deadline,
    creator,
    curator,
    executor,
    participants = "",
  } = req.body;

  if (
    !user_id ||
    !title ||
    !description ||
    !status ||
    !deadline ||
    !creator ||
    !curator ||
    !executor
  ) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields",
    });
  }

  db.run(
    "INSERT INTO tasks (user_id, title, description, status, deadline, creator, curator, executor, participants) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      user_id,
      title,
      description,
      status,
      deadline,
      creator,
      curator,
      executor,
      participants || "",
    ],
    function (err) {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          success: false,
          error: "Failed to create project: " + err.message,
        });
      }

      // Return the newly created project
      db.get(
        "SELECT * FROM tasks WHERE id = ?",
        [this.lastID],
        (err, newTask) => {
          if (err || !newTask) {
            return res.status(500).json({
              success: false,
              error: "Failed to fetch created task",
            });
          }
          res.json({
            success: true,
            task: newTask,
          });
        }
      );
    }
  );
});

// Get tasks
app.get("/api/tasks", (req, res) => {
  const userId = req.query.user_id;

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: "User ID is required",
    });
  }

  db.all("SELECT * FROM tasks WHERE user_id = ?", [userId], (err, tasks) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        success: false,
        error: "Server error",
      });
    }

    res.json({
      success: true,
      tasks: tasks,
    });
  });
});

// Get particular task
app.get("/api/tasks/:taskId", (req, res) => {
  const taskId = req.params.taskId;

  db.get("SELECT * FROM tasks WHERE id = ?", [taskId], (err, task) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        success: false,
        error: "Server error",
      });
    }

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      });
    }

    res.json({
      success: true,
      task: task,
    });
  });
});

// Update task
app.put("/api/tasks/:taskId", (req, res) => {
  const taskId = req.params.taskId;
  const {
    title,
    description,
    status,
    deadline,
    creator,
    curator,
    executor,
    participants = "",
  } = req.body;

  db.run(
    "UPDATE tasks SET title = ?, description = ?, status = ?, deadline = ?, creator = ?, curator = ?, executor = ?, participants = ? WHERE id = ?",
    [
      title,
      description,
      status,
      deadline,
      creator,
      curator,
      executor,
      participants,
      taskId,
    ],
    function (err) {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          success: false,
          error: "Failed to update task",
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          error: "Task not found",
        });
      }

      // Fetch the updated task
      db.get("SELECT * FROM tasks WHERE id = ?", [taskId], (err, task) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({
            success: false,
            error: "Failed to fetch updated project",
          });
        }
        res.json({
          success: true,
          task: task,
        });
      });
    }
  );
});

// Delete task
app.delete("/api/tasks/:taskId", (req, res) => {
  const taskId = req.params.taskId;

  db.run("DELETE FROM tasks WHERE id = ?", [taskId], function (err) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        success: false,
        error: "Failed to delete task",
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    res.json({
      success: true,
    });
  });
});

// Get participants
app.get("/api/participants", (req, res) => {
  const userId = req.query.user_id;

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: "User ID is required",
    });
  }

  db.all(
    "SELECT * FROM participants WHERE user_id = ?",
    [userId],
    (err, participants) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          success: false,
          error: "Server error",
        });
      }

      res.json({
        success: true,
        participants: participants,
      });
    }
  );
});

// Add participant
app.post("/api/participants", (req, res) => {
  const {
    user_id,
    name,
    surname,
    position, 
    email,
    phone,
    city,
    birth_date,
  } = req.body;

  // Validate required fields
  if (!email) {
    return res.status(400).json({
      success: false,
      error: "Email is required",
    });
  }

  db.run(
    "INSERT INTO participants (user_id, name, surname, position, email, phone, city, birth_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      user_id || 1, // Default to user_id 1 if not provided
      name || "",
      surname || "",
      position || "",
      email,
      phone || "",
      city || "",
      birth_date || new Date().toISOString(),
    ],
    function (err) {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          success: false,
          error: "Failed to create participant: " + err.message,
        });
      }

      db.get(
        "SELECT * FROM participants WHERE id = ?",
        [this.lastID],
        (err, newParticipant) => {
          if (err || !newParticipant) {
            return res.status(500).json({
              success: false,
              error: "Failed to fetch created participant",
            });
          }
          res.json({
            success: true,
            participant: newParticipant,
          });
        }
      );
    }
  );
});

// Get mock participant
app.get("/api/mockParticipants", (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: "Email is required",
    });
  }

  db.get(
    "SELECT * FROM mockParticipants WHERE email = ? LIMIT 1",
    [email],
    (err, participant) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          success: false,
          error: "Server error",
        });
      }

      if (!participant) {
        return res.json({
          success: false,
          error: "Participant not found",
        });
      }

      res.json({
        success: true,
        participant: participant,
      });
    }
  );
});

// Check participant existence
app.get("/api/check-participant", (req, res) => {
  const { email, user_id } = req.query;

  if (!email || !user_id) {
    return res.status(400).json({
      success: false,
      error: "Email and User ID are required",
    });
  }

  // Check in participants table
  db.get(
    "SELECT * FROM participants WHERE email = ? AND user_id = ?",
    [email, user_id],
    (err, participant) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, error: "Database error" });

      if (participant) {
        return res.json({ exists: true, type: "participant" });
      }

      // Check in mockParticipants
      db.get(
        "SELECT * FROM mockParticipants WHERE email = ?",
        [email],
        (err, mockParticipant) => {
          if (err)
            return res
              .status(500)
              .json({ success: false, error: "Database error" });

          if (mockParticipant) {
            return res.json({ exists: true, type: "mock" });
          }

          return res.json({ exists: false });
        }
      );
    }
  );
});

initializeDatabase();

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
