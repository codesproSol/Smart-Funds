// 1) Uppy setup
var uppy = new Uppy.Uppy({
  restrictions: {
    maxNumberOfFiles: 10,
    allowedFileTypes: [".csv", ".xls", ".xlsx"],
  },
  autoProceed: false,
})
  .use(Uppy.Dashboard, {
    inline: true,
    target: "#drag-drop-area",
    showProgressDetails: true,
  })
  .use(Uppy.Tus, { endpoint: "https://tusd.tusdemo.net/files/" }); // optional

const previewBox = document.querySelector(".preview-box");

// 2) Render table helper (responsive container already wraps it)
function renderTable(rows) {
  let html = '<table class="table table-bordered table-striped table-hover mb-0">';
  rows.forEach((row, rIdx) => {
    html += "<tr>";
    row.forEach((cell) => {
      const safe = cell === undefined || cell === null ? "" : String(cell);
      html += rIdx === 0 ? `<th>${safe}</th>` : `<td>${safe}</td>`;
    });
    html += "</tr>";
  });
  html += "</table>";
  previewBox.innerHTML = html;
}

// 3) Read + parse with SheetJS (CSV or Excel)
function previewFile(file) {
  if (!file || !file.data) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const wb = XLSX.read(data, { type: "array" });
      const sheet = wb.SheetNames[0];
      const ws = wb.Sheets[sheet];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1 }); // array of arrays
      // (Optional) cap preview rows if huge:
      // const limited = rows.slice(0, 200);
      renderTable(rows);
    } catch (err) {
      previewBox.innerHTML = `<div class="text-danger">Preview error: ${err.message}</div>`;
    }
  };
  reader.readAsArrayBuffer(file.data); // file.data is a Blob
}

// 4) Auto-preview the first file added
let firstPreviewed = false;
uppy.on("file-added", (file) => {
  if (!firstPreviewed) {
    firstPreviewed = true;
    previewFile(file);
  }
});

// 5) Click Uppy tiles to switch preview (event delegation on the dashboard root)
document.getElementById("drag-drop-area").addEventListener("click", (evt) => {
  const item = evt.target.closest(".uppy-Dashboard-Item[data-uppy-file-id]");
  if (!item) return;
  const id = item.getAttribute("data-uppy-file-id");
  const file = uppy.getFile(id);
  if (file) previewFile(file);
});

// 6) Clear preview if no files remain
uppy.on("file-removed", () => {
  if (uppy.getFiles().length === 0) previewBox.innerHTML = "";
});
