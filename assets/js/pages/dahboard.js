const allLoansData = [
  {
    id: "#L001",
    amount: "₦10,000",
    purpose: "Home Renovation",
    status: "Paid",
    appDate: "2023-01-15",
    dueDate: "2024-01-15",
  },
  {
    id: "#L002",
    amount: "₦5,000",
    purpose: "Education",
    status: "Pending",
    appDate: "2023-03-20",
    dueDate: "2024-03-20",
  },
  {
    id: "#L003",
    amount: "₦25,000",
    purpose: "Business Investment",
    status: "Active",
    appDate: "2023-06-10",
    dueDate: "2025-06-10",
  },
  {
    id: "#L004",
    amount: "₦7,500",
    purpose: "Debt Consolidation",
    status: "Overdue",
    appDate: "2023-09-01",
    dueDate: "2024-09-01",
  },
  {
    id: "#L005",
    amount: "₦12,000",
    purpose: "Medical Expenses",
    status: "Paid",
    appDate: "2023-11-05",
    dueDate: "2024-11-05",
  },
  {
    id: "#L006",
    amount: "₦8,000",
    purpose: "Vehicle Purchase",
    status: "Active",
    appDate: "2024-02-18",
    dueDate: "2025-02-18",
  },
  {
    id: "#L007",
    amount: "₦15,000",
    purpose: "Wedding",
    status: "Paid",
    appDate: "2023-04-01",
    dueDate: "2024-04-01",
  },
  {
    id: "#L008",
    amount: "₦3,000",
    purpose: "Travel",
    status: "Active",
    appDate: "2024-01-22",
    dueDate: "2024-12-22",
  },
  {
    id: "#L009",
    amount: "₦20,000",
    purpose: "Home Purchase",
    status: "Pending",
    appDate: "2024-03-10",
    dueDate: "2026-03-10",
  },
  {
    id: "#L010",
    amount: "₦6,000",
    purpose: "Emergency",
    status: "Overdue",
    appDate: "2023-10-05",
    dueDate: "2024-04-05",
  },
  {
    id: "#L011",
    amount: "₦11,000",
    purpose: "Renovation",
    status: "Active",
    appDate: "2024-05-01",
    dueDate: "2025-05-01",
  },
  {
    id: "#L012",
    amount: "₦9,000",
    purpose: "Education",
    status: "Paid",
    appDate: "2023-07-25",
    dueDate: "2024-07-25",
  },
];

const outstandingLoansData = allLoansData.filter(
  (loan) => loan.status === "Active" || loan.status === "Overdue" || loan.status === "Pending",
);
const activeLoanCountData = allLoansData.filter((loan) => loan.status === "Active");

const totalCustomersData = [
  {
    id: "#C001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "08012345678",
    status: "Active",
  },
  {
    id: "#C002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "08087654321",
    status: "Active",
  },
  {
    id: "#C003",
    name: "Peter Jones",
    email: "peter.jones@example.com",
    phone: "07011223344",
    status: "Inactive",
  },
  {
    id: "#C004",
    name: "Alice Brown",
    email: "alice.brown@example.com",
    phone: "09055667788",
    status: "Active",
  },
  {
    id: "#C005",
    name: "Bob White",
    email: "bob.white@example.com",
    phone: "08122334455",
    status: "Inactive",
  },
  {
    id: "#C006",
    name: "Charlie Green",
    email: "charlie.green@example.com",
    phone: "08099887766",
    status: "Active",
  },
];

const activeBorrowersData = totalCustomersData.filter((customer) => customer.status === "Active");

// Function to get status badge HTML
function getStatusBadgeHtml(statusText) {
  let bgColorClass = "";
  let textColorClass = "";
  if (statusText === "Paid") {
    bgColorClass = "bg-green-200";
    textColorClass = "text-green-800";
  } else if (statusText === "Overdue") {
    bgColorClass = "bg-red-200";
    textColorClass = "text-red-800";
  } else if (statusText === "Pending") {
    bgColorClass = "bg-yellow-200";
    textColorClass = "text-yellow-800";
  } else if (statusText === "Active") {
    bgColorClass = "bg-blue-200";
    textColorClass = "text-blue-800";
  } else if (statusText === "Inactive") {
    bgColorClass = "bg-gray-200";
    textColorClass = "text-gray-800";
  }
  return `<span class="badge ${bgColorClass} ${textColorClass}">${statusText}</span>`;
}

// Function to generate action buttons HTML
function getActionButtonsHtml() {
  return `
                <td class="flex space-x-2">
                    <button class="action-btn edit" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14.25v4.5m-6.75-6.75h.008v.008H11.25v-.008Z" />
                        </svg>
                    </button>
                    <button class="action-btn delete" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.92c-.75 0-1.46-.384-1.844-1.077L4.74 5.79m14.426 0H13.5m-10.5 0H5.25m5.625 0h.008v.008H10.875V5.79ZM3.75 6.75h16.5" />
                        </svg>
                    </button>
                </td>
            `;
}

// Function to render table content
function renderTable(type, data) {
  const tableHead = document.querySelector("#detailTable thead");
  const tableBody = document.querySelector("#detailTable tbody");
  const tableTitle = document.getElementById("tableTitle");

  tableHead.innerHTML = "";
  tableBody.innerHTML = "";

  let headers = [];
  let rowsHtml = "";

  if (type === "total-loans" || type === "outstanding-loans" || type === "active-loan-count") {
    headers = ["Loan ID", "Amount", "Purpose", "Status", "Application Date", "Due Date", "Actions"];
    tableTitle.textContent =
      type === "total-loans"
        ? "All Loans"
        : type === "outstanding-loans"
        ? "Outstanding Loans"
        : "Active Loans";
    data.forEach((loan, index) => {
      rowsHtml += `
                        <tr>
                            <td>${loan.id}</td>
                            <td>${loan.amount}</td>
                            <td>${loan.purpose}</td>
                            <td>${getStatusBadgeHtml(loan.status)}</td>
                            <td>${loan.appDate}</td>
                            <td>${loan.dueDate}</td>
                            ${getActionButtonsHtml()}
                        </tr>
                    `;
    });
  } else if (type === "total-customers" || type === "active-borrowers") {
    headers = ["Customer ID", "Name", "Email", "Phone", "Status", "Actions"];
    tableTitle.textContent = type === "total-customers" ? "All Customers" : "Active Borrowers";
    data.forEach((customer, index) => {
      rowsHtml += `
                        <tr>
                            <td>${customer.id}</td>
                            <td>${customer.name}</td>
                            <td>${customer.email}</td>
                            <td>${customer.phone}</td>
                            <td>${getStatusBadgeHtml(customer.status)}</td>
                            ${getActionButtonsHtml()}
                        </tr>
                    `;
    });
  }

  // Populate table headers
  let headerRowHtml = "<tr>";
  headers.forEach((header, index) => {
    headerRowHtml += `<th data-column="${index}">${header}</th>`;
  });
  headerRowHtml += "</tr>";
  tableHead.innerHTML = headerRowHtml;

  // Populate table body
  tableBody.innerHTML = rowsHtml;

  // Re-initialize sortable table after new content is rendered
  makeTableSortable("detailTable");
}

// Function to make the table sortable
function makeTableSortable(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;

  const headers = table.querySelectorAll("th");
  const tbody = table.querySelector("tbody");

  headers.forEach((header) => {
    // Remove existing listeners to prevent multiple bindings
    const oldClickHandler = header._clickHandler;
    if (oldClickHandler) {
      header.removeEventListener("click", oldClickHandler);
    }

    const newClickHandler = () => {
      const column = header.dataset.column;
      if (column === undefined) return; // Skip 'Actions' column

      const currentIsAscending = header.classList.contains("asc");

      headers.forEach((h) => {
        h.classList.remove("asc", "desc");
      });

      const direction = currentIsAscending ? "desc" : "asc";
      header.classList.add(direction);

      const rows = Array.from(tbody.querySelectorAll("tr"));

      rows.sort((rowA, rowB) => {
        const cellA = rowA.children[column].textContent.trim();
        const cellB = rowB.children[column].textContent.trim();

        let comparison = 0;
        // Handle currency values
        if (cellA.includes("₦") && cellB.includes("₦")) {
          const numA = parseFloat(cellA.replace("₦", "").replace(/,/g, ""));
          const numB = parseFloat(cellB.replace("₦", "").replace(/,/g, ""));
          comparison = numA - numB;
        } else if (Date.parse(cellA) && Date.parse(cellB)) {
          // Date comparison
          const dateA = new Date(cellA);
          const dateB = new Date(cellB);
          comparison = dateA - dateB;
        } else if (!isNaN(parseFloat(cellA)) && !isNaN(parseFloat(cellB))) {
          // General numeric comparison
          comparison = parseFloat(cellA) - parseFloat(cellB);
        } else {
          // String comparison
          comparison = cellA.localeCompare(cellB);
        }

        return direction === "asc" ? comparison : -comparison;
      });

      rows.forEach((row) => tbody.appendChild(row));
    };

    header.addEventListener("click", newClickHandler);
    header._clickHandler = newClickHandler; // Store handler for removal
  });
}

// Function to reset the dashboard view
function resetDashboardView() {
  const cardContainers = document.querySelectorAll(".card-container");
  const dynamicTableSection = document.getElementById("dynamicTableSection");

  cardContainers.forEach((c) => {
    c.classList.remove("active-card", "faded");
  });
  dynamicTableSection.classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  const cardContainers = document.querySelectorAll(".card-container");
  const dynamicTableSection = document.getElementById("dynamicTableSection");
  const clearSelectionBtn = document.getElementById("clearSelectionBtn");

  cardContainers.forEach((cardContainer) => {
    cardContainer.addEventListener("click", () => {
      // Only proceed if this card is not already active
      if (!cardContainer.classList.contains("active-card")) {
        // Remove active and fade classes from all cards
        cardContainers.forEach((c) => {
          c.classList.remove("active-card");
          c.classList.add("faded");
        });

        // Add active class to the clicked card and remove faded
        cardContainer.classList.add("active-card");
        cardContainer.classList.remove("faded");

        // Show the dynamic table section
        dynamicTableSection.classList.remove("hidden");

        const cardType = cardContainer.dataset.cardType;
        let dataToRender = [];

        switch (cardType) {
          case "total-loans":
            dataToRender = allLoansData;
            break;
          case "outstanding-loans":
            dataToRender = outstandingLoansData;
            break;
          case "active-loan-count":
            dataToRender = activeLoanCountData;
            break;
          case "total-customers":
            dataToRender = totalCustomersData;
            break;
          case "active-borrowers":
            dataToRender = activeBorrowersData;
            break;
          default:
            dataToRender = [];
            break;
        }
        renderTable(cardType, dataToRender);
      }
    });
  });

  // Add event listener for the Clear Selection button
  if (clearSelectionBtn) {
    clearSelectionBtn.addEventListener("click", resetDashboardView);
  }

  // Initial state: ensure no card is active and table is hidden
  resetDashboardView();
});
