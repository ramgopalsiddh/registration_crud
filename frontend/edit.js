const apiUrl = 'http://127.0.0.1:8000/register'; // Update with the correct backend API URL

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id'); // Get the ID from the URL parameters

    if (id) {
        try {
            const response = await fetch(`${apiUrl}/${id}`);
            const reg = await response.json();

            document.getElementById('id').value = reg.ID;
            document.getElementById('name').value = reg.Name;
            document.getElementById('email').value = reg.Email;
            document.getElementById('dob').value = reg.DateOfBirth;
            document.getElementById('phone').value = reg.PhoneNumber;
            document.getElementById('address').value = reg.Address;
        } catch (error) {
            alert('Error fetching registration data: ' + error.message);
        }
    }
});

document.getElementById('editRegistrationForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const id = document.getElementById('id').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const dob = document.getElementById('dob').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, dob, phone, address }),
        });

        if (!response.ok) throw new Error('Failed to save changes');

        // Redirect to home page after saving
        window.location.href = 'index.html';
    } catch (error) {
        alert('Error saving changes: ' + error.message);
    }
});
