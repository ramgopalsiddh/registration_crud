const apiUrl = 'http://127.0.0.1:8000/register'; // Update with the correct backend API URL
const formSubmitButton = document.querySelector('form button[type="submit"]');
let isEditMode = false;

document.getElementById('registrationForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const id = document.getElementById('id').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const dob = document.getElementById('dob').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    const method = id ? 'PUT' : 'POST';
    const apiUrlWithId = id ? `${apiUrl}/${id}` : apiUrl;
    
    try {
        const response = await fetch(apiUrlWithId, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, dob, phone, address }),
        });

        if (!response.ok) throw new Error('Failed to submit data');

        fetchRegistrations();
        resetForm();
    } catch (error) {
        alert('Error submitting data: ' + error.message);
    }
});

async function fetchRegistrations() {
    try {
        const response = await fetch(apiUrl);
        const registrations = await response.json();

        let table = `<table>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Date of Birth</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
            </tr>`;
        
        registrations.forEach(reg => {
            table += `<tr>
                        <td>${reg.ID}</td>
                        <td>${reg.Name}</td>
                        <td>${reg.Email}</td>
                        <td>${reg.DateOfBirth}</td>
                        <td>${reg.PhoneNumber}</td>
                        <td>${reg.Address}</td>
                        <td>
                            <div class="button-group">
                                <button class="edit-btn" onclick="editRegistration(${reg.ID})">Edit</button>
                                <button class="delete-btn" onclick="deleteRegistration(${reg.ID})">Delete</button>
                            </div>
                        </td>
                      </tr>`;
        });

        table += '</table>';
        document.getElementById('output').innerHTML = table;
    } catch (error) {
        alert('Error fetching registrations: ' + error.message);
    }
}

async function editRegistration(id) {
    // Redirect to the edit page with the registration ID as a query parameter
    window.location.href = `edit.html?id=${id}`;
}

async function deleteRegistration(id) {
    if (confirm('Are you sure you want to delete this registration?')) {
        try {
            const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete registration');

            fetchRegistrations();
        } catch (error) {
            alert('Error deleting registration: ' + error.message);
        }
    }
}



// Initial fetch on page load
fetchRegistrations();
