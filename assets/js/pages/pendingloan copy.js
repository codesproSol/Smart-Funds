document.getElementById("checkEligibilityBtn").addEventListener("click", function () {
  // Example Applicant Data
  let creditScore = 280;
  let monthlySalary = 300000;
  let loanRequested = 750000;
  let repaymentMonths = 12;

  let monthlyRepayment = loanRequested / repaymentMonths;
  let repaymentRatio = monthlyRepayment / monthlySalary;

  let loanOffered;

  // Loan amount calculation logic
  if (creditScore >= 700 && repaymentRatio <= 0.4) {
    loanOffered = loanRequested; // Full amount
  } else if (creditScore >= 650 && repaymentRatio <= 0.5) {
    loanOffered = loanRequested * 0.8; // Offer 80%
  } else {
    loanOffered = loanRequested * 0.5; // Offer 50%
  }

  // Update page
  document.getElementById("loanOffered").textContent = `₦${loanOffered.toLocaleString()}`;
  document.getElementById("eligibilityResult").innerHTML = `<div class="alert alert-info">
        Based on assessment, we can offer ₦${loanOffered.toLocaleString()} out of the ₦${loanRequested.toLocaleString()} requested.
    </div>`;
});

function calculateEligibleAmount({ creditScore, monthlySalary, loanRequested, repaymentMonths }) {
  const monthlyRepayment = loanRequested / repaymentMonths;
  const repaymentRatio = monthlyRepayment / monthlySalary;

  let loanOffered;
  if (creditScore >= 700 && repaymentRatio <= 0.4) {
    loanOffered = loanRequested; // full
  } else if (creditScore >= 650 && repaymentRatio <= 0.5) {
    loanOffered = Math.round(loanRequested * 0.8); // 80%
  } else {
    loanOffered = Math.round(loanRequested * 0.5); // 50%
  }
  return loanOffered;
}

/* ---------- Modal wiring ---------- */
const approveBtn = document.getElementById("approveBtn");
const modalEl = document.getElementById("exampleModalCenter");
const eligibleInput = document.getElementById("eligibleAmountInput");
const eligibleError = document.getElementById("eligibleError");
const loanRequestedDisplay = document.getElementById("loanRequestedDisplay");
const creditScoreEl = document.getElementById("creditScore");
const loanDateEl = document.getElementById("loanDate");
const commentEl = document.getElementById("approvalComment");
const confirmBtn = document.getElementById("confirmApproval");

let currentLoan = {}; // will hold the loan data used in the modal

approveBtn.addEventListener("click", function () {
  // In a real app, fetch loan data by ID from your API.
  // Here we use example/hardcoded data. Use approveBtn.dataset.loanId if provided.
  const loanId = this.dataset.loanId || "LN-20250708-001";

  // Example - replace by actual fetch to get applicant data
  // fetch(`/api/loans/${loanId}`).then(r=>r.json()).then(data => { ... })
  const exampleData = {
    loanId,
    loanRequested: 750000,
    applicationDate: "08 Jul 2025",
    creditScore: 680,
    monthlySalary: 300000,
    repaymentMonths: 12,
  };

  // store currentLoan for later use
  currentLoan = { ...exampleData };

  // compute default eligible amount
  const defaultEligible = calculateEligibleAmount(exampleData);

  // populate modal fields
  loanRequestedDisplay.textContent = `₦${exampleData.loanRequested.toLocaleString()}`;
  eligibleInput.value = defaultEligible; // editable input
  eligibleInput.max = exampleData.loanRequested; // set max to requested amount
  creditScoreEl.textContent = exampleData.creditScore;
  loanDateEl.textContent = exampleData.applicationDate || new Date().toLocaleDateString();
  eligibleError.style.display = "none";
  commentEl.value = "";

  // open modal
  const modal = new bootstrap.Modal(modalEl);
  modal.show();
});

/* ---------- Validation: ensure eligible <= requested and > 0 ---------- */
function validateEligibleInput() {
  const val = parseFloat(eligibleInput.value);
  const requested = parseFloat(currentLoan.loanRequested || 0);

  if (Number.isNaN(val) || val <= 0) {
    eligibleError.textContent = "Enter a valid amount greater than 0.";
    eligibleError.style.display = "block";
    confirmBtn.disabled = true;
    return false;
  }
  if (val > requested) {
    eligibleError.textContent = `Eligible amount cannot exceed requested amount (₦${requested.toLocaleString()}).`;
    eligibleError.style.display = "block";
    confirmBtn.disabled = true;
    return false;
  }

  eligibleError.style.display = "none";
  confirmBtn.disabled = false;
  return true;
}

eligibleInput.addEventListener("input", validateEligibleInput);

/* ---------- Confirm approval action ---------- */
confirmBtn.addEventListener("click", function () {
  if (!validateEligibleInput()) return;

  const eligibleAmount = parseFloat(eligibleInput.value);
  const comment = commentEl.value.trim();
  const payload = {
    loanId: currentLoan.loanId,
    eligibleAmount,
    comment,
    approverId: "approver-123", // set actual approver id in real app
  };

  // Disable button to prevent double submits
  confirmBtn.disabled = true;
  confirmBtn.textContent = "Processing...";

  // Example API call - replace URL and method according to your backend
  fetch("/api/loans/approve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then(async (res) => {
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Server error");
      }
      return res.json();
    })
    .then((data) => {
      // success - close modal and update UI accordingly
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      modalInstance.hide();

      // example: update badge and shown offered/disbursed amount on page (if you have elements)
      // document.getElementById('loanStatus').textContent = 'Pending Disbursement';
      // document.getElementById('loanStatus').className = 'badge bg-info';
      // document.getElementById('loanOffered').textContent = `₦${eligibleAmount.toLocaleString()}`;

      // show toast / message (use your own toast system)
      alert(`Loan approved for ₦${eligibleAmount.toLocaleString()}.`);
    })
    .catch((err) => {
      console.error(err);
      alert("Could not complete approval: " + (err.message || "Unknown error"));
    })
    .finally(() => {
      confirmBtn.disabled = false;
      confirmBtn.textContent = "Confirm Approval";
    });
});

// Deny
document.getElementById("denyBtn").addEventListener("click", function () {
  currentLoan.loanId = this.dataset.loanId;
  document.getElementById("denyComment").value = "";
  new bootstrap.Modal(document.getElementById("denyModal")).show();
});

document.getElementById("confirmDeny").addEventListener("click", function () {
  const comment = document.getElementById("denyComment").value.trim();
  if (!comment) {
    alert("Please provide a reason for denial.");
    return;
  }
  fetch("/api/loans/deny", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ loanId: currentLoan.loanId, comment }),
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then(() => {
      bootstrap.Modal.getInstance(document.getElementById("denyModal")).hide();
      alert("Loan request denied.");
    })
    .catch(() => alert("Failed to deny loan."));
});

// Flag
document.getElementById("flagBtn").addEventListener("click", function () {
  currentLoan.loanId = this.dataset.loanId;
  document.getElementById("flagReason").value = "";
  document.getElementById("flagComment").value = "";
  new bootstrap.Modal(document.getElementById("flagModal")).show();
});

document.getElementById("confirmFlag").addEventListener("click", function () {
  const reason = document.getElementById("flagReason").value;
  const comment = document.getElementById("flagComment").value.trim();
  if (!reason) {
    alert("Please select a reason for flagging.");
    return;
  }
  fetch("/api/loans/flag", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ loanId: currentLoan.loanId, reason, comment }),
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then(() => {
      bootstrap.Modal.getInstance(document.getElementById("flagModal")).hide();
      alert("Loan flagged for review.");
    })
    .catch(() => alert("Failed to flag loan."));
});

// Request More Info
document.getElementById("requestInfoBtn").addEventListener("click", function () {
  currentLoan.loanId = this.dataset.loanId;
  document.getElementById("infoRequired").value = "";
  document.getElementById("requestInfoComment").value = "";
  new bootstrap.Modal(document.getElementById("requestInfoModal")).show();
});

document.getElementById("confirmRequestInfo").addEventListener("click", function () {
  const requiredItems = Array.from(document.getElementById("infoRequired").selectedOptions).map(
    (opt) => opt.value,
  );
  const comment = document.getElementById("requestInfoComment").value.trim();

  if (requiredItems.length === 0) {
    alert("Please select at least one required document or info.");
    return;
  }

  fetch("/api/loans/request-info", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      loanId: currentLoan.loanId,
      requiredItems,
      comment,
    }),
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then(() => {
      bootstrap.Modal.getInstance(document.getElementById("requestInfoModal")).hide();
      alert("Request for more information sent to applicant.");
    })
    .catch(() => alert("Failed to send request."));
});

// Store original document names when DOM loads
document.querySelectorAll(".documents-card .document-item .doc-link").forEach((link) => {
  link.dataset.docName = link.innerText; // save original label
});

function editCard(cardId) {
  const card = document.getElementById(cardId);

  const photoAct = card.querySelector("#profile_act");
  if (photoAct) photoAct.classList.remove("d-none");

  // Special handling for profile card with picture
  if (card.classList.contains("profile-card")) {
    const imgContainer = card.querySelector(".profile-img-container");
    const img = imgContainer.querySelector(".profile-img");
    const fileInput = imgContainer.querySelector(".profile-input");
    const removeBtn = imgContainer.querySelector(".remove-photo");

    img.style.display = "none";
    fileInput.style.display = "block";
    removeBtn.style.display = "inline-block";
  }

  // Special handling for documents card
  if (card.classList.contains("documents-card")) {
    card.querySelectorAll(".document-item").forEach((item) => {
      const fileLink = item.querySelector(".doc-link");
      const fileInput = item.querySelector(".doc-input");

      fileLink.style.display = "none";
      fileInput.style.display = "block";
    });
  } else {
    // Default editable fields
    card.querySelectorAll(".field-value").forEach((span) => {
      const input = span.nextElementSibling;
      if (!input) return;

      if (input.type === "date") {
        if (span.dataset.value) {
          input.value = span.dataset.value;
        }
      } else {
        input.value = span.innerText;
      }

      span.style.display = "none";
      input.style.display = "block";
    });
  }

  card.querySelector("#editBtn").style.display = "none";
  card.querySelector("#updateBtn").style.display = "inline-block";
  card.querySelector("#cancelBtn").style.display = "inline-block";
}

function updateCard(cardId) {
  const card = document.getElementById(cardId);
  const updateBtn = card.querySelector("#updateBtn");

  updateBtn.innerHTML = `<div style="display: flex; align-items:center; gap: 5px;">
    <i class="la la-spinner text-white la-spin progress-icon-spin" style="font-size: 15px !important;"></i>Saving...
  </div>`;

  const photoAct = card.querySelector("#profile_act");
  if (photoAct) photoAct.classList.add("d-none");

  setTimeout(() => {
    // Handle profile card image
    if (card.classList.contains("profile-card")) {
      const imgContainer = card.querySelector(".profile-img-container");
      const img = imgContainer.querySelector(".profile-img");
      const fileInput = imgContainer.querySelector(".profile-input");
      const removeBtn = imgContainer.querySelector(".remove-photo");

      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const previewURL = URL.createObjectURL(file);
        img.src = previewURL;
      }

      img.style.display = "block";
      fileInput.style.display = "none";
      removeBtn.style.display = "none";
    }

    // Handle documents card
    if (card.classList.contains("documents-card")) {
      card.querySelectorAll(".document-item").forEach((item) => {
        const fileLink = item.querySelector(".doc-link");
        const fileInput = item.querySelector(".doc-input");

        if (fileInput.files.length > 0) {
          const file = fileInput.files[0];
          fileLink.innerText = fileLink.dataset.docName;
          const previewURL = URL.createObjectURL(file);
          fileLink.href = previewURL;
          fileLink.target = "_blank";
        }

        fileLink.style.display = "inline";
        fileInput.style.display = "none";
      });
    }

    // Handle text/date fields
    card.querySelectorAll(".field-value").forEach((span) => {
      const input = span.nextElementSibling;
      if (!input) return;

      if (input.type === "date") {
        span.dataset.value = input.value;
        span.innerText = new Date(input.value).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      } else {
        span.innerText = input.value;
      }
      span.style.display = "inline";
      input.style.display = "none";
    });

    // Success state
    updateBtn.innerHTML = `<div><i class="la la-check text-success" style="font-size: 15px !important;"></i> Updated</div>`;
    setTimeout(() => {
      updateBtn.innerHTML = `Update`;
      card.querySelector("#editBtn").style.display = "inline-block";
      card.querySelector("#updateBtn").style.display = "none";
      card.querySelector("#cancelBtn").style.display = "none";
    }, 1000);
  }, 1500);
}

function cancelCard(cardId) {
  const card = document.getElementById(cardId);
  const photoAct = card.querySelector("#profile_act");
  if (photoAct) photoAct.classList.add("d-none");

  if (card.classList.contains("profile-card")) {
    const imgContainer = card.querySelector(".profile-img-container");
    const img = imgContainer.querySelector(".profile-img");
    const fileInput = imgContainer.querySelector(".profile-input");
    const removeBtn = imgContainer.querySelector(".remove-photo");

    fileInput.value = ""; // clear selection
    img.style.display = "block";
    fileInput.style.display = "none";
    removeBtn.style.display = "none";
  }

  if (card.classList.contains("documents-card")) {
    card.querySelectorAll(".document-item").forEach((item) => {
      const fileLink = item.querySelector(".doc-link");
      const fileInput = item.querySelector(".doc-input");

      fileLink.style.display = "inline";
      fileInput.style.display = "none";
    });
  } else {
    card.querySelectorAll(".field-value").forEach((span) => {
      const input = span.nextElementSibling;
      if (!input) return;
      input.style.display = "none";
      span.style.display = "inline";
    });
  }

  card.querySelector("#editBtn").style.display = "inline-block";
  card.querySelector("#updateBtn").style.display = "none";
  card.querySelector("#cancelBtn").style.display = "none";
}

function removePhoto(cardId) {
  const card = document.getElementById(cardId);
  const imgContainer = card.querySelector(".profile-img-container");
  const img = imgContainer.querySelector(".profile-img");

  img.src = "https://via.placeholder.com/100"; // fallback default
}

const photoInput = document.getElementById("photoInput");
const applicantPhoto = document.getElementById("applicantPhoto");
const removePhotoBtn = document.getElementById("removePhotoBtn");

photoInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = function (e) {
      applicantPhoto.src = e.target.result; // show preview
    };
    reader.readAsDataURL(file);
  }
});

removePhotoBtn.addEventListener("click", function () {
  applicantPhoto.src = "https://via.placeholder.com/400x240?text=Applicant+Photo"; // reset to placeholder
  photoInput.value = ""; // clear file input
});

// // ===== Editable Phone & Email =====
// const phoneSpan = document.getElementById("phoneDisplay");
// const emailSpan = document.getElementById("emailDisplay");

// let isEditMode = false; // toggle state

// function makeEditable(span, type = "text") {
//   if (!isEditMode) return; // only allow when editing
//   if (span.querySelector("input")) return; // avoid duplicates

//   const currentValue = span.innerText;
//   const input = document.createElement("input");
//   input.type = type;
//   input.value = currentValue;
//   input.className = "form-control form-control-sm";
//   input.style.display = "inline-block";
//   input.style.width = "auto";

//   span.innerHTML = "";
//   span.appendChild(input);
//   input.focus();

//   // Save on blur or Enter
//   const saveValue = () => {
//     span.innerText = input.value.trim() || currentValue;
//   };

//   input.addEventListener("blur", saveValue);
//   input.addEventListener("keydown", (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       saveValue();
//     }
//   });
// }

// phoneSpan.addEventListener("click", () => makeEditable(phoneSpan, "tel"));
// emailSpan.addEventListener("click", () => makeEditable(emailSpan, "email"));

// // ===== Hook into your Edit / Cancel / Update buttons =====
// const editBtn = document.getElementById("editBtn");
// const updateBtn = document.getElementById("updateBtn");
// const cancelBtn = document.getElementById("cancelBtn");
// const photoActions = document.getElementById("photoActions");
// // const photoActions = document.getElementById("photoActions");

// editBtn.addEventListener("click", () => {
//   isEditMode = true;
//   editBtn.classList.add("d-none");
//   updateBtn.classList.remove("d-none");
//   cancelBtn.classList.remove("d-none");
//   photoActions.classList.remove("d-none"); // show
// });

// cancelBtn.addEventListener("click", () => {
//   isEditMode = false;
//   editBtn.classList.remove("d-none");
//   updateBtn.classList.add("d-none");
//   cancelBtn.classList.add("d-none");
//   photoActions.classList.add("d-none"); // hide
// });

// updateBtn.addEventListener("click", () => {
//   isEditMode = false;
//   editBtn.classList.remove("d-none");
//   updateBtn.classList.add("d-none");
//   cancelBtn.classList.add("d-none");
//   photoActions.classList.add("d-none"); // hide
// });

// const form = document.getElementById("profileForm");

// form.addEventListener("submit", function (e) {
//   e.preventDefault(); // prevent real page reload

//   // show loading spinner
//   document.getElementById("updateText").classList.add("d-none");
//   document.getElementById("updateSpinner").classList.remove("d-none");

//   // simulate async update (e.g. sending data to server)
//   setTimeout(() => {
//     // hide spinner, show text
//     document.getElementById("updateText").classList.remove("d-none");
//     document.getElementById("updateSpinner").classList.add("d-none");

//     // reset edit mode
//     isEditMode = false;
//     editBtn.classList.remove("d-none");
//     updateBtn.classList.add("d-none");
//     cancelBtn.classList.add("d-none");
//     photoActions.classList.add("d-none");

//     alert("Profile updated successfully ✅");
//   }, 2000); // simulate 2s delay
// });
