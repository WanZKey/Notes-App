document.addEventListener("DOMContentLoaded", () => {
  const notesContainer = document.getElementById("notes-container");

  // Daftar catatan awal yang merupakan kriteria wajib
  const initialNotesData = [
    {
      id: "notes-jT-jjsyz61J8XKiI",
      title: "Welcome to Notes, Dimas!",
      content:
        "Welcome to Notes! This is your first note. You can archive it, delete it, or create new ones.",
      createdAt: "2022-07-28T10:03:12.594Z",
      archived: false,
    },
    {
      id: "notes-aB-cdefg12345",
      title: "Meeting Agenda",
      content:
        "Discuss project updates and assign tasks for the upcoming week.",
      createdAt: "2022-08-05T15:30:00.000Z",
      archived: false,
    },
    {
      id: "notes-XyZ-789012345",
      title: "Shopping List",
      content: "Milk, eggs, bread, fruits, and vegetables.",
      createdAt: "2022-08-10T08:45:23.120Z",
      archived: false,
    },
    {
      id: "notes-1a-2b3c4d5e6f",
      title: "Personal Goals",
      content:
        "Read two books per month, exercise three times a week, learn a new language.",
      createdAt: "2022-08-15T18:12:55.789Z",
      archived: false,
    },
    {
      id: "notes-LMN-456789",
      title: "Recipe: Spaghetti Bolognese",
      content:
        "Ingredients: ground beef, tomatoes, onions, garlic, pasta. Steps:...",
      createdAt: "2022-08-20T12:30:40.200Z",
      archived: false,
    },
    {
      id: "notes-QwErTyUiOp",
      title: "Workout Routine",
      content:
        "Monday: Cardio, Tuesday: Upper body, Wednesday: Rest, Thursday: Lower body, Friday: Cardio.",
      createdAt: "2022-08-25T09:15:17.890Z",
      archived: false,
    },
    {
      id: "notes-abcdef-987654",
      title: "Book Recommendations",
      content:
        "1. 'The Alchemist' by Paulo Coelho\n2. '1984' by George Orwell\n3. 'To Kill a Mockingbird' by Harper Lee",
      createdAt: "2022-09-01T14:20:05.321Z",
      archived: false,
    },
    {
      id: "notes-zyxwv-54321",
      title: "Daily Reflections",
      content:
        "Write down three positive things that happened today and one thing to improve tomorrow.",
      createdAt: "2022-09-07T20:40:30.150Z",
      archived: false,
    },
    {
      id: "notes-poiuyt-987654",
      title: "Travel Bucket List",
      content:
        "1. Paris, France\n2. Kyoto, Japan\n3. Santorini, Greece\n4. New York City, USA",
      createdAt: "2022-09-15T11:55:44.678Z",
      archived: false,
    },
    {
      id: "notes-asdfgh-123456",
      title: "Coding Projects",
      content:
        "1. Build a personal website\n2. Create a mobile app\n3. Contribute to an open-source project",
      createdAt: "2022-09-20T17:10:12.987Z",
      archived: false,
    },
    {
      id: "notes-5678-abcd-efgh",
      title: "Project Deadline",
      content: "Complete project tasks by the deadline on October 1st.",
      createdAt: "2022-09-28T14:00:00.000Z",
      archived: false,
    },
    {
      id: "notes-9876-wxyz-1234",
      title: "Health Checkup",
      content: "Schedule a routine health checkup with the doctor.",
      createdAt: "2022-10-05T09:30:45.600Z",
      archived: false,
    },
    {
      id: "notes-qwerty-8765-4321",
      title: "Financial Goals",
      content:
        "1. Create a monthly budget\n2. Save 20% of income\n3. Invest in a retirement fund.",
      createdAt: "2022-10-12T12:15:30.890Z",
      archived: false,
    },
    {
      id: "notes-98765-54321-12345",
      title: "Holiday Plans",
      content: "Research and plan for the upcoming holiday destination.",
      createdAt: "2022-10-20T16:45:00.000Z",
      archived: false,
    },
    {
      id: "notes-1234-abcd-5678",
      title: "Language Learning",
      content: "Practice Spanish vocabulary for 30 minutes every day.",
      createdAt: "2022-10-28T08:00:20.120Z",
      archived: false,
    },
  ];

  // Fungsi untuk mengambil data dari localStorage
  function getNotesFromLocalStorage() {
    const notes = localStorage.getItem("notesData");
    return notes ? JSON.parse(notes) : [];
  }

  // Fungsi untuk menyimpan data ke localStorage
  function saveNotesToLocalStorage(notes) {
    localStorage.setItem("notesData", JSON.stringify(notes));
  }

  // Ambil data notes dari localStorage dan gabungkan dengan initialNotesData
  const storedNotesData = getNotesFromLocalStorage();
  const notesData = [...initialNotesData, ...storedNotesData];

  // Filter out duplicates by ID
  const uniqueNotesData = Array.from(
    new Map(notesData.map((note) => [note.id, note])).values()
  );

  function renderNotes(notes) {
    notesContainer.innerHTML = "";
    notes.forEach((note) => {
      const noteElement = document.createElement("app-note");
      noteElement.setAttribute("id", note.id);
      noteElement.setAttribute("title", note.title);
      noteElement.setAttribute("content", note.content);
      notesContainer.appendChild(noteElement);

      noteElement.addEventListener("note-deleted", (event) => {
        const noteId = event.detail.id;
        const noteIndex = uniqueNotesData.findIndex(
          (note) => note.id === noteId
        );
        if (noteIndex !== -1) {
          uniqueNotesData.splice(noteIndex, 1);
          saveNotesToLocalStorage(uniqueNotesData);
          renderNotes(uniqueNotesData.filter((note) => !note.archived));
        }
      });

      noteElement.addEventListener("note-edit", (event) => {
        const { id, title, content } = event.detail;
        const editForm = document.createElement("form");
        editForm.classList.add("edit-form");
        editForm.innerHTML = `
          <input type="text" id="edit-title" value="${title}" required>
          <textarea id="edit-content" required>${content}</textarea>
          <button type="submit">Save Changes</button>
        `;
        notesContainer.innerHTML = "";
        notesContainer.appendChild(editForm);

        editForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const updatedTitle = editForm.querySelector("#edit-title").value;
          const updatedContent = editForm.querySelector("#edit-content").value;
          const noteIndex = uniqueNotesData.findIndex((note) => note.id === id);
          if (noteIndex !== -1) {
            uniqueNotesData[noteIndex].title = updatedTitle;
            uniqueNotesData[noteIndex].content = updatedContent;
            saveNotesToLocalStorage(uniqueNotesData);
            renderNotes(uniqueNotesData.filter((note) => !note.archived));
          }
        });
      });
    });
  }

  renderNotes(uniqueNotesData.filter((note) => !note.archived));

  const searchInput = document.getElementById("search-input");

  searchInput.addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase();
    const filteredNotes = uniqueNotesData.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    );
    renderNotes(filteredNotes.filter((note) => !note.archived));
  });

  document.addEventListener("note-added", (event) => {
    const newNote = {
      id: `notes-${Date.now()}`, // Generate a unique ID for the new note
      title: event.detail.title,
      content: event.detail.content,
      createdAt: new Date().toISOString(),
      archived: false,
    };
    uniqueNotesData.push(newNote);
    saveNotesToLocalStorage(uniqueNotesData);
    renderNotes(uniqueNotesData.filter((note) => !note.archived));
  });
});
