fetch("https://jsonplaceholder.typicode.com/posts")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    data.map((d) => {
      const html = `
                <tr>
                    <td>${d.userId}</td>
                    <td>${d.id}</td>
                    <td>${d.title}</td>
                    <td>${d.body}</td>

                </tr>
            `;
      document.querySelector("tbody").insertAdjacentHTML("beforeend", html);
    });
  });

// сортировка по столбцам

function getCellIndex(cell) {
  const row = cell.parentNode;
  const rowIndex = Array.from(row.parentNode.children).indexOf(row);
  let columnIndex = 0;

  for (let i = 0; i < row.cells.length; i++) {
    const colSpan = row.cells[i].colSpan;
    columnIndex += colSpan;

    if (rowIndex === 0) {
      if (i === cell.cellIndex) {
        return columnIndex - 1;
      }
    } else {
      if (!isNaN(parseInt(cell.dataset.sortCol)))
        return parseInt(cell.dataset.sortCol);
    }
  }

  return columnIndex - 1;
}

let is_sorting_process_on = false;
let delay = 100;

Node.prototype.tsortable = function () {
  var ths = this.querySelectorAll("thead th[data-sort], thead td[data-sort]");
  ths.forEach((th) => (th.onclick = tablesort));
};

function tablesort(e) {
  if (is_sorting_process_on) return false;
  is_sorting_process_on = true;

  var table = e.currentTarget.closest("table");

  var J = getCellIndex(e.currentTarget);

  var datatype = e.currentTarget.dataset.sort;

  var olderTH = table.querySelector("th[data-dir]");
  if (olderTH && olderTH !== e.currentTarget) delete olderTH.dataset.dir;

  var dir = e.currentTarget.dataset.dir
    ? e.currentTarget.dataset.dir === "asc"
      ? "desc"
      : "asc"
    : e.currentTarget.dataset.sortDefault
    ? e.currentTarget.dataset.sortDefault
    : "asc";
  e.currentTarget.dataset.dir = dir;

  var itable = [];

  var trs = table.querySelectorAll("tbody tr");
  let tr, td, tds, value, itab;
  for (j = 0, jj = trs.length; j < jj; j++) {
    tr = trs[j];
    itable.push({ tr: tr, values: [] });
    itab = itable[j];
    tds = tr.querySelectorAll("th, td");
    for (i = 0, ii = tds.length; i < ii; i++) {
      td = tds[i];
      value = td.dataset.sortValue ? td.dataset.sortValue : td.innerText;
      if (datatype === "int") value = parseInt(value);
      else if (datatype === "float") value = parseFloat(value);
      else if (datatype === "date") value = new Date(value);
      itab.values.push(value);
    }
  }

  if (datatype === "string") {
    if (dir === "asc") {
      itable.sort((a, b) => {
        return ("" + a.values[J]).localeCompare(b.values[J]);
      });
    } else {
      itable.sort((a, b) => {
        return -("" + a.values[J]).localeCompare(b.values[J]);
      });
    }
  } else {
    if (dir === "asc") {
      itable.sort((a, b) => {
        if (!isNaN(a.values[J]) && !isNaN(b.values[J])) {
          return a.values[J] < b.values[J]
            ? -1
            : a.values[J] > b.values[J]
            ? 1
            : 0;
        } else if (!isNaN(a.values[J])) {
          return 1;
        } else if (!isNaN(b.values[J])) {
          return -1;
        } else {
          return 0;
        }
      });
    } else {
      itable.sort((a, b) => {
        if (!isNaN(a.values[J]) && !isNaN(b.values[J])) {
          return a.values[J] < b.values[J]
            ? 1
            : a.values[J] > b.values[J]
            ? -1
            : 0;
        } else if (!isNaN(a.values[J])) {
          return -1;
        } else if (!isNaN(b.values[J])) {
          return 1;
        } else {
          return 0;
        }
      });
    }
  }

  const fragment = document.createDocumentFragment();
  itable.forEach((row) => fragment.appendChild(row.tr));
  table.querySelector("tbody").replaceChildren(fragment);

  setTimeout(() => (is_sorting_process_on = false), delay);
  return true;
}
document.querySelector(".table-sortable").tsortable();
function filterTable(value) {
  const phrase = value.toLowerCase();
  const table = document.querySelector("#table");
  const row = table.querySelectorAll(".row-body");

  row.forEach((item, rowIndex) => {
    const cells = row[rowIndex].querySelectorAll("td");
    let matches = false;

    for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
      if (cells[cellIndex]) {
        const content = cells[cellIndex].textContent;
        if (content.toLowerCase().includes(phrase)) {
          matches = true;
          break;
        }
      }
    }
    if (matches) {
      row[rowIndex].classList.remove("hide");
    } else {
      row[rowIndex].classList.add("hide");
    }
  });
}

//фильтрация

function regexFilterTable() {
  let search = document.getElementById("searchInput").value.trim();
  let searchRegex = new RegExp(search, "i");

  let rows = document.getElementById("table").getElementsByTagName("tr");
  for (let i = 1; i < rows.length; i++) {
    rows[i].style.display = searchRegex.test(rows[i].textContent) ? "" : "none";
  }
}

function regexFilterTable2() {
  let search = document.getElementById("searchInput").value.trim();
  let searchRegex = new RegExp(search, "i");

  let rows = document.getElementById("table").getElementsByTagName("tr");
  for (let i = 0; i < rows.length; i++) {
    rows[i].style.display = searchRegex.test(rows[i].textContent) ? "" : "";
  }
}

document.getElementById("searchInput").addEventListener("input", function (e) {
  const value = e.target.value;
  const { length } = [...value];
  if (length >= 3) {
    regexFilterTable();
  } else {
    regexFilterTable2();
  }
});
