// function updateStatusBadge(statusElement, statusText) {
//   statusElement.textContent = statusText;
//   statusElement.classList.remove(
//     "bg-green-200",
//     "text-green-800",
//     "bg-red-200",
//     "text-red-800",
//     "bg-yellow-200",
//     "text-yellow-800",
//     "bg-blue-200",
//     "text-blue-800",
//   );
//   if (statusText === "Paid") {
//     statusElement.classList.add("bg-green-200", "text-green-800");
//   } else if (statusText === "Overdue") {
//     statusElement.classList.add("bg-red-200", "text-red-800");
//   } else if (statusText === "Pending") {
//     statusElement.classList.add("bg-yellow-200", "text-yellow-800");
//   } else if (statusText === "Active") {
//     statusElement.classList.add("bg-blue-200", "text-blue-800");
//   }
// }

// Example of how you might dynamically set data (if you had a mechanism to pass the ID)
// For now, it's static as per the #L003 example.
document.querySelectorAll(".dropdown-menu .dropdown-item").forEach((item) => {
  item.addEventListener("click", function (e) {
    e.preventDefault();

    const filterText = this.textContent.trim().toLowerCase();
    const rows = document.querySelectorAll("table tbody tr");

    rows.forEach((row) => {
      const status = row.querySelector("td:nth-child(8) span").textContent.trim().toLowerCase();

      if (filterText === "all" || status === filterText) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });
});

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
