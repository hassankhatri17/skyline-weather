// components/searchbar.js
export function SearchBar() {
  return `
    <form class="controls container" id="search-form">
      <div class="search-field">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" id="search-input" placeholder="Search a city…" aria-label="Search city" autocomplete="off" />
      </div>
      <button type="submit" class="btn btn-search">Search</button>
      <div class="unit-toggle" role="group" aria-label="Temperature unit">
        <button type="button" class="unit-btn active" data-unit="C">°C</button>
        <button type="button" class="unit-btn" data-unit="F">°F</button>
      </div>
    </form>
  `;
}

export function mountSearchBar({ onSearch, onUnitChange }) {
  const form = document.getElementById('search-form');
  const input = document.getElementById('search-input');
  const unitBtns = document.querySelectorAll('.unit-btn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (value) onSearch(value);
  });

  unitBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      unitBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      onUnitChange(btn.dataset.unit);
    });
  });
}
