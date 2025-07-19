unction updateStatusBadge(statusElement, statusText) {
            statusElement.textContent = statusText;
            statusElement.classList.remove('bg-green-200', 'text-green-800', 'bg-red-200', 'text-red-800', 'bg-yellow-200', 'text-yellow-800', 'bg-blue-200', 'text-blue-800');
            if (statusText === 'Paid') {
                statusElement.classList.add('bg-green-200', 'text-green-800');
            } else if (statusText === 'Overdue') {
                statusElement.classList.add('bg-red-200', 'text-red-800');
            } else if (statusText === 'Pending') {
                statusElement.classList.add('bg-yellow-200', 'text-yellow-800');
            } else if (statusText === 'Active') {
                statusElement.classList.add('bg-blue-200', 'text-blue-800');
            }
        }

        // Example of how you might dynamically set data (if you had a mechanism to pass the ID)
        // For now, it's static as per the #L003 example.
        document.addEventListener('DOMContentLoaded', () => {
            const loanStatusElement = document.getElementById('loanStatus');
            updateStatusBadge(loanStatusElement, 'Active'); // Set initial status based on the example
        });