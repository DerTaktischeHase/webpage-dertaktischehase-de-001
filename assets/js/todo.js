const list = document.querySelector('.todo-list');
const dlg  = document.querySelector('.todo-dialog');
const form = document.getElementById('todo-form');

const fieldTitle   = document.getElementById('field-title');
const fieldContent = document.getElementById('field-content');

const btnSave   = document.getElementById('btn-save');
const btnDelete = document.getElementById('btn-delete');
const btnCancel = document.getElementById('btn-cancel');

let lastFocusedCard = null;
let currentCard = null;

const ENABLE_PERSISTENCE = true; // auf false stellen, wenn du keine localStorage-Persistenz willst
const STORAGE_KEY = 'todo-list-v1';

// Hilfen
function makeSnippet(text, maxChars = 140) {
    const s = text.replace(/\s+/g, ' ').trim();
    return s.length > maxChars ? s.slice(0, maxChars - 1) + '…' : s;
}
function cardToModel(card) {
    return {
        title: card.dataset.title || card.querySelector('.todo-title')?.textContent?.trim() || '',
        content: card.dataset.content || card.querySelector('.todo-snippet')?.textContent?.trim() || ''
    };
}
function applyModelToCard(card, model) {
    card.dataset.title = model.title;
    card.dataset.content = model.content;
    card.querySelector('.todo-title').textContent = model.title;
    card.querySelector('.todo-snippet').textContent = model.content;
}

// Persistenz
function saveAllToStorage() {
    if (!ENABLE_PERSISTENCE) return;
    const items = [...document.querySelectorAll('.todo-card')].map(cardToModel);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
function loadFromStorage() {
    if (!ENABLE_PERSISTENCE) return;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const items = JSON.parse(raw);
        if (!Array.isArray(items)) return;
        // Liste leeren & neu aufbauen
        list.innerHTML = '';
        for (const it of items) {
            const li = document.createElement('li');
            li.innerHTML = `
        <button class="todo-card" type="button"
                data-title="${escapeHtml(it.title)}"
                data-content="${escapeHtml(it.content)}">
          <h3 class="todo-title">${escapeHtml(it.title)}</h3>
          <p class="todo-snippet">${escapeHtml(it.content)}</p>
        </button>`;
            list.appendChild(li);
        }
    } catch {}
}
function escapeHtml(s='') {
    return s
        .replaceAll('&','&amp;')
        .replaceAll('<','&lt;')
        .replaceAll('>','&gt;')
        .replaceAll('"','&quot;')
        .replaceAll("'",'&#39;');
}

// Öffnen/Schließen
function openDialogFromCard(card) {
    lastFocusedCard = card;
    currentCard = card;

    const model = cardToModel(card);
    fieldTitle.value = model.title;
    fieldContent.value = model.content;

    if (typeof dlg.showModal === 'function') {
        dlg.showModal();
        fieldTitle.focus();
        fieldTitle.select();
    } else {
        dlg.setAttribute('open', '');
    }
}
function closeDialog() {
    if (dlg.open) dlg.close();
    currentCard = null;
    if (lastFocusedCard) { lastFocusedCard.focus(); lastFocusedCard = null; }
}

// Events – Karten öffnen
list?.addEventListener('click', (e) => {
    const card = e.target.closest('.todo-card');
    if (card) openDialogFromCard(card);
});
list?.addEventListener('keydown', (e) => {
    const card = e.target.closest('.todo-card');
    if (!card) return;
    if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
        e.preventDefault();
        openDialogFromCard(card);
    }
});

// Speichern
form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentCard) return;
    const title = fieldTitle.value.trim() || 'Ohne Titel';
    const content = fieldContent.value.trim();

    // DOM updaten
    applyModelToCard(currentCard, { title, content });

    // Snippet bleibt in CSS gekürzt (line-clamp). Wenn du zusätzlich auf 140 Zeichen cutten willst:
    const snippetEl = currentCard.querySelector('.todo-snippet');
    snippetEl.textContent = content; // oder: makeSnippet(content)

    saveAllToStorage();
    closeDialog();
});

// Löschen
btnDelete?.addEventListener('click', () => {
    if (!currentCard) return;
    const li = currentCard.closest('li');
    li?.remove();
    saveAllToStorage();
    closeDialog();
});

// Abbrechen
btnCancel?.addEventListener('click', () => closeDialog());

// Klick auf Backdrop schließt
dlg?.addEventListener('click', (e) => {
    const frame = dlg.querySelector('.todo-dialog-frame');
    const r = frame?.getBoundingClientRect();
    if (!r) return;
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside) closeDialog();
});

// Optional: Add-Button fügt neue Karte hinzu (editierbar)
document.querySelector('.todo-add')?.addEventListener('click', () => {
    const li = document.createElement('li');
    li.innerHTML = `
    <button class="todo-card" type="button" data-title="Neues To-Do" data-content="">
      <h3 class="todo-title">Neues To-Do</h3>
      <p class="todo-snippet"></p>
    </button>`;
    list?.prepend(li);
    const card = li.querySelector('.todo-card');
    openDialogFromCard(card);
});

// Persistenz beim Laden
loadFromStorage();
