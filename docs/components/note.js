class Note extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["title", "content"];
  }

  attributeChangedCallback(_, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const title = this.getAttribute("title") || "Untitled";
    const content = this.getAttribute("content") || "";

    this.shadowRoot.innerHTML = `
              <style>
                  .note {
                      border: 1px solid #457b9d;
                      padding: 1rem;
                      border-radius: 5px;
                      margin: 0.5rem 0;
                      background-color: #a8dadc;
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                      transition: transform 0.2s;
                      display: flex;
                      flex-direction: column;
                      justify-content: space-between;
                      min-height: 200px; /* Set minimum height */
                  }
                  .note:hover {
                      transform: scale(1.05);
                  }
                  .note h2 {
                      margin: 0 0 0.25rem; /* Kurangi jarak bawah */
                      font-size: 1.25rem;
                      color: #1d3557;
                  }
                  .note p {
                      color: #333; /* Ubah warna font isi notes menjadi lebih mudah dibaca */
                  }
                  .note button {
                      background-color: #457b9d;
                      color: white;
                      border: none;
                      padding: 0.5rem;
                      border-radius: 5px;
                      cursor: pointer;
                      transition: background-color 0.2s;
                  }
                  .note button:hover {
                      background-color: #1d3557;
                  }
                  .options {
                      display: none; /* Hide options by default */
                      justify-content: space-between;
                      align-items: center;
                  }
                  .note.show-options .options {
                      display: flex; /* Show options when .show-options class is added */
                  }
                  .note .options button {
                      padding: 0.5rem;
                      border: none;
                      border-radius: 5px;
                      cursor: pointer;
                      transition: background-color 0.2s;
                  }

                  .note .options #delete-button {
                      background-color: #e74c3c; /* Red color for delete button */
                      color: white;
                  }

                  .note .options #edit-button {
                      background-color: #f1c40f; /* Yellow color for edit button */
                      color: #2c3e50;
                  }

                  .note .options #delete-button:hover {
                      background-color: #c0392b;
                  }

                  .note .options #edit-button:hover {
                      background-color: #f39c12;
                  }
              </style>
              <div class="note">
                  <h2>${title}</h2>
                  <p>${content}</p>
                  <button id="options-button">Options</button>
                  <div class="options">
                      <button id="delete-button">Delete</button>
                      <button id="edit-button">Edit</button>
                  </div>
              </div>
          `;

    this.shadowRoot
      .getElementById("options-button")
      .addEventListener("click", () => {
        this.shadowRoot.querySelector(".note").classList.toggle("show-options");
      });

    this.shadowRoot
      .getElementById("delete-button")
      .addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this note?")) {
          this.dispatchEvent(
            new CustomEvent("note-deleted", {
              detail: { id: this.getAttribute("id") },
              bubbles: true,
              composed: true,
            })
          );
        }
      });

    this.shadowRoot
      .getElementById("edit-button")
      .addEventListener("click", () => {
        const editEvent = new CustomEvent("note-edit", {
          detail: {
            id: this.getAttribute("id"),
            title: this.getAttribute("title"),
            content: this.getAttribute("content"),
          },
          bubbles: true,
          composed: true,
        });
        this.dispatchEvent(editEvent);
      });
  }
}

class AppBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
              <style>
                  header {
                      background-color: #1d3557;
                      color: white;
                      padding: 1rem;
                      text-align: center;
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  }
              </style>
              <header>
                  <h1>Notes App</h1>
              </header>
          `;
  }
}

class NoteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
              <style>
                  form {
                      display: flex;
                      flex-direction: column;
                      gap: 1rem;
                      background-color: #a8dadc;
                      padding: 1rem;
                      border-radius: 5px;
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  }
                  input, textarea, button {
                      padding: 1rem; /* Perbesar padding */
                      font-size: 1.25rem; /* Perbesar ukuran font */
                      border: 1px solid #457b9d;
                      border-radius: 5px;
                  }
                  textarea {
                      height: 200px; /* Perbesar tinggi textarea */
                  }
                  button {
                      background-color: #457b9d;
                      color: white;
                      border: none;
                      cursor: pointer;
                      transition: background-color 0.2s;
                  }
                  button:hover {
                      background-color: #1d3557;
                  }
                  .error {
                      color: #e63946;
                      font-size: 0.875rem;
                  }
              </style>
              <form id="note-form">
                  <input type="text" id="note-title" placeholder="Note Title" required>
                  <span id="title-error" class="error"></span>
                  <textarea id="note-content" placeholder="Note Content" required></textarea>
                  <span id="content-error" class="error"></span>
                  <button type="submit">Add Note</button>
              </form>
          `;
  }

  addEventListeners() {
    const form = this.shadowRoot.getElementById("note-form");
    const titleInput = this.shadowRoot.getElementById("note-title");
    const contentInput = this.shadowRoot.getElementById("note-content");
    const titleError = this.shadowRoot.getElementById("title-error");
    const contentError = this.shadowRoot.getElementById("content-error");

    titleInput.addEventListener("input", () => {
      if (titleInput.validity.valid) {
        titleError.textContent = "";
      } else {
        titleError.textContent = "Title is required.";
      }
    });

    contentInput.addEventListener("input", () => {
      if (contentInput.validity.valid) {
        contentError.textContent = "";
      } else {
        contentError.textContent = "Content is required.";
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (titleInput.validity.valid && contentInput.validity.valid) {
        const newNote = {
          title: titleInput.value,
          content: contentInput.value,
        };
        document.dispatchEvent(
          new CustomEvent("note-added", { detail: newNote })
        );
        form.reset();
      }
    });
  }
}

customElements.define("app-note", Note);
customElements.define("app-bar", AppBar);
customElements.define("note-form", NoteForm);
