document.addEventListener('DOMContentLoaded', () => {
    // Fetch and render dogs on page load
    fetch('http://localhost:3001/dogs')
      .then((response) => response.json())
      .then((dogs) => {
        const tableBody = document.getElementById('table-body');
        dogs.forEach((dog) => {
          tableBody.appendChild(createDogRow(dog));
        });
      });
  
    // Function to create a table row for a dog
    function createDogRow(dog) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${dog.name}</td>
        <td>${dog.breed}</td>
        <td>${dog.sex}</td>
        <td><button class="edit-button" data-id="${dog.id}">Edit</button></td>
      `;
      tr.querySelector('.edit-button').addEventListener('click', () => {
        populateFormWithDogInfo(dog);
      });
      return tr;
    }
  
    // Function to populate the form with a selected dog's information
    function populateFormWithDogInfo(dog) {
      document.getElementById('dog-form').setAttribute('data-id', dog.id);
      document.querySelector('input[name="name"]').value = dog.name;
      document.querySelector('input[name="breed"]').value = dog.breed;
      document.querySelector('input[name="sex"]').value = dog.sex;
    }
  
    // Form submission event listener
    document.getElementById('dog-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('dog-form').getAttribute('data-id');
      const updatedDog = {
        name: document.querySelector('input[name="name"]').value,
        breed: document.querySelector('input[name="breed"]').value,
        sex: document.querySelector('input[name="sex"]').value,
      };
  
      // Make a PATCH request to update the dog's information
      fetch(`http://localhost:3001/dogs/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDog),
      })
        .then((response) => response.json())
        .then(() => {
          // Clear the table and re-render it with updated data
          tableBody.innerHTML = '';
          fetch('http://localhost:3001/dogs')
            .then((response) => response.json())
            .then((dogs) => {
              dogs.forEach((dog) => {
                tableBody.appendChild(createDogRow(dog));
              });
            });
        });
    });
  });
  